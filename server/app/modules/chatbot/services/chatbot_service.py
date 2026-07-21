import os
from typing import List
from groq import AsyncGroq
from groq.types.chat import ChatCompletionMessageParam
from google import genai
from google.genai import types
from fastapi import status
from app.core.exceptions import AppException
from app.core.config import config
from app.modules.chatbot.schemas.chatbot_schema import ChatbotRequest
from app.modules.package.services.package_service import PackageService
from app.modules.branch.services.branch_service import BranchService
from app.modules.sim.services.sim_service import SimService

class ChatbotService:
    def __init__(self):
        # Ưu tiên khởi tạo Groq AI nếu có GROQ_API_KEY
        if config.GROQ_API_KEY and config.GROQ_API_KEY.strip() and not config.GROQ_API_KEY.startswith("gsk_your_"):
            self.provider = "groq"
            self.groq_client = AsyncGroq(api_key=config.GROQ_API_KEY.strip())
        elif config.GEMINI_API_KEY and config.GEMINI_API_KEY.strip():
            self.provider = "gemini"
            self.gemini_client = genai.Client(api_key=config.GEMINI_API_KEY.strip())
        elif config.GEMINI_PROJECT_ID and config.GEMINI_LOCATION:
            self.provider = "gemini"
            self.gemini_client = genai.Client(
                enterprise=True,
                project=config.GEMINI_PROJECT_ID,
                location=config.GEMINI_LOCATION
            )
        else:
            self.provider = "groq"
            self.groq_client = AsyncGroq(api_key=config.GROQ_API_KEY or "")

    def _get_system_instruction(self) -> str:
        prompt_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "prompts", "viettel_store_prompt.txt")
        )
        if not os.path.exists(prompt_path):
            prompt_path = "prompts/viettel_store_prompt.txt"
        
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            print(f"[ChatbotService] Lỗi khi đọc file prompt {prompt_path}: {e}")
            return "Bạn là trợ lý ảo CSKH chính thức của hệ thống Viettel Store."

    async def generate_response(self, body: ChatbotRequest):
        system_instruction = self._get_system_instruction()

        # 1. Lấy dữ liệu gói cước, chi nhánh và SIM thật từ Database thông qua Services
        packages_context = ""
        branches_context = ""
        sims_context = ""
        
        try:
            pkg_service = PackageService()
            branch_service = BranchService()
            sim_service = SimService()
            
            pkgs_res = await pkg_service.get_all_packages()
            branches_res = await branch_service.get_all_branches()
            sims_res = await sim_service.get_all_sims()
            
            if isinstance(pkgs_res, dict) and pkgs_res.get("success") and isinstance(pkgs_res.get("data"), list):
                packages_context = "\n".join([
                    f"- Gói {p.get('ten_goi')}: Giá {p.get('gia_cuoc')} VNĐ, Thời hạn {p.get('thoi_han_ngay')} ngày, Dung lượng {p.get('dung_luong_gb')} GB. Trạng thái: {p.get('trang_thai')}."
                    for p in pkgs_res["data"]
                ])
                
            if isinstance(branches_res, dict) and branches_res.get("success") and isinstance(branches_res.get("data"), list):
                branches_context = "\n".join([
                    f"- Chi nhánh {b.get('ten_chi_nhanh')}: Địa chỉ {b.get('dia_chi')}, Hotline {b.get('so_hotline')}, Trạng thái: {b.get('trang_thai')}."
                    for b in branches_res["data"]
                ])

            if isinstance(sims_res, dict) and sims_res.get("success") and isinstance(sims_res.get("data"), list):
                all_sims = sims_res["data"]
                available_sims = [s for s in all_sims if s.get("trang_thai") == "ConHang"]
                total_available = len(available_sims)
                latest_5_sims = available_sims[:5]
                
                sim_lines = []
                for s in latest_5_sims:
                    ten_loai = s.get("loai_sim", {}).get("ten_loai_sim") if isinstance(s.get("loai_sim"), dict) else None
                    ten_cn = s.get("chi_nhanh", {}).get("ten_chi_nhanh") if isinstance(s.get("chi_nhanh"), dict) else None
                    sim_lines.append(
                        f"- Số SIM: {s.get('so_sim')}, Giá bán: {s.get('gia_ban'):,.0f} VNĐ, Loại: {ten_loai or 'Thường'}, Chi nhánh có sẵn: {ten_cn or 'Hệ thống'}"
                    )
                
                sims_context = f"TỔNG SỐ LƯỢNG SIM ĐANG CÓ SẴN TRONG HỆ THỐNG: {total_available} SIM.\nDANH SÁCH 5 SIM SỐ ĐẸP MỚI NHẤT:\n" + "\n".join(sim_lines)
        except Exception as err:
            print(f"Lỗi khi fetch context database cho Chatbot: {err}")

        # 2. Ghép context dữ liệu thật vào system instruction
        full_instruction = f"{system_instruction}\n\n"
        if packages_context:
            full_instruction += f"DANH SÁCH GÓI CƯỚC THỰC TẾ TRONG HỆ THỐNG:\n{packages_context}\n\n"
        if branches_context:
            full_instruction += f"DANH SÁCH CHI NHÁNH CỬA HÀNG THỰC TẾ TRONG HỆ THỐNG:\n{branches_context}\n\n"
        if sims_context:
            full_instruction += f"THÔNG TIN VỀ KHO SIM THỰC TẾ TRONG HỆ THỐNG:\n{sims_context}\n\n"

        message = body.message.strip()
        if not message:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Tin nhắn không được để trống."
            )

        # Trực thi theo Provider
        if self.provider == "groq":
            return await self._generate_groq_response(body, message, full_instruction)
        else:
            return await self._generate_gemini_response(body, message, full_instruction)

    async def _generate_groq_response(self, body: ChatbotRequest, message: str, full_instruction: str):
        messages: List[ChatCompletionMessageParam] = [
            {"role": "system", "content": full_instruction}
        ]

        if body.history:
            for msg in body.history:
                role = getattr(msg, "role", "user")
                parts = getattr(msg, "parts", None)
                if not parts:
                    continue
                if isinstance(parts, list):
                    content_str = " ".join([str(p).strip() for p in parts if str(p).strip()])
                else:
                    content_str = str(parts).strip()

                if content_str:
                    if role == "model":
                        messages.append({"role": "assistant", "content": content_str})
                    else:
                        messages.append({"role": "user", "content": content_str})

        messages.append({"role": "user", "content": message})

        # Danh sách các model Groq ưu tiên
        primary_model = config.GROQ_MODEL or "llama-3.3-70b-versatile"
        candidate_models = [primary_model]
        for fallback in ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama3-70b-8192"]:
            if fallback not in candidate_models:
                candidate_models.append(fallback)

        last_error = None
        for model_name in candidate_models:
            try:
                print(f"[ChatbotService - Groq] Đang thử model: {model_name}")
                completion = await self.groq_client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    temperature=0.6,
                    max_tokens=2048
                )
                response_text = completion.choices[0].message.content
                if response_text:
                    print(f"[ChatbotService - Groq] Thành công với model: {model_name}")
                    return {
                        "success": True,
                        "data": {
                            "response": response_text
                        }
                    }
            except Exception as e:
                last_error = e
                err = str(e)
                print(f"[ChatbotService - Groq] Model {model_name} lỗi: {err}")
                if "401" in err or "403" in err or "invalid_api_key" in err or "API key" in err:
                    break
                if "429" in err or "rate_limit_exceeded" in err:
                    continue
                continue

        err_str = str(last_error) if last_error else "Không thể kết nối đến Groq AI."
        if "401" in err_str or "403" in err_str or "invalid_api_key" in err_str or "API key" in err_str:
            return {
                "success": True,
                "data": {
                    "response": (
                        "Khóa Groq API Key hiện tại chưa đúng hoặc chưa được cấu hình. "
                        "Vui lòng dán GROQ_API_KEY hợp lệ từ https://console.groq.com vào file .env.development của Server."
                    )
                }
            }
        elif "429" in err_str or "rate_limit_exceeded" in err_str:
            return {
                "success": True,
                "data": {
                    "response": (
                        "Hệ thống Groq AI tạm thời quá tải hoặc hết hạn mức. "
                        "Quý khách vui lòng thử lại sau ít phút hoặc gọi tổng đài miễn phí 1800 8098."
                    )
                }
            }

        raise AppException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Lỗi dịch vụ Groq AI: {err_str}"
        )

    async def _generate_gemini_response(self, body: ChatbotRequest, message: str, full_instruction: str):
        gemini_history = []
        if body.history:
            for msg in body.history:
                role = getattr(msg, "role", None)
                parts = getattr(msg, "parts", None)
                if not role or parts is None:
                    continue
                if isinstance(parts, list):
                    normalized_parts = [
                        types.Part.from_text(text=str(part).strip())
                        for part in parts if part is not None and str(part).strip()
                    ]
                else:
                    part_text = str(parts).strip()
                    normalized_parts = [types.Part.from_text(text=part_text)] if part_text else []
                if not normalized_parts:
                    continue
                if role not in ("user", "model"):
                    role = "user"
                gemini_history.append(types.Content(role=role, parts=normalized_parts))

        primary_model = config.GEMINI_AI_MODEL or "gemini-2.0-flash"
        candidate_models = [primary_model]
        for fallback in ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-lite"]:
            if fallback not in candidate_models:
                candidate_models.append(fallback)

        last_error = None
        for model_name in candidate_models:
            try:
                chat = self.gemini_client.aio.chats.create(
                    model=model_name,
                    history=gemini_history,
                    config=types.GenerateContentConfig(system_instruction=full_instruction)
                )
                response = await chat.send_message(message)
                if getattr(response, "text", None):
                    return {
                        "success": True,
                        "data": {"response": response.text}
                    }
            except Exception as e:
                last_error = e
                continue

        err_str = str(last_error) if last_error else "Không thể kết nối đến Gemini AI."
        raise AppException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=f"Lỗi dịch vụ Gemini AI: {err_str}"
        )
