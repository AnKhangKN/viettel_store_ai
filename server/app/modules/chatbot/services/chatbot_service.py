import os
from google import genai
from google.genai import types
from fastapi import status
from app.core.exceptions import AppException
from app.core.config import config
from app.modules.chatbot.schemas.chatbot_schema import ChatbotRequest
from app.modules.package.services.package_service import PackageService
from app.modules.branch.services.branch_service import BranchService

class ChatbotService:
    def __init__(self):
        # 1. Khởi tạo Client linh hoạt dựa trên cấu hình môi trường (.env)
        # Ưu tiên sử dụng GEMINI_API_KEY để tránh yêu cầu xác thực ADC khi phát triển local
        if config.GEMINI_API_KEY:
            self.client = genai.Client(api_key=config.GEMINI_API_KEY)
        elif config.GEMINI_PROJECT_ID and config.GEMINI_LOCATION:
            self.client = genai.Client(
                enterprise=True,
                project=config.GEMINI_PROJECT_ID,
                location=config.GEMINI_LOCATION
            )
        else:
            raise AppException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="GEMINI_API_KEY hoặc GEMINI_PROJECT_ID/GEMINI_LOCATION chưa được cấu hình trong file .env"
            )
        
        # 3. Đọc System Prompt từ file prompts/viettel_store_prompt.txt
        prompt_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "prompts", "viettel_store_prompt.txt")
        )
        
        # Fallback nếu đường dẫn tương đối có vấn đề
        if not os.path.exists(prompt_path):
            prompt_path = "prompts/viettel_store_prompt.txt"
        
        # Kiểm tra xem đã đọc file này để hướng dẫn ai chưa
        print("Đọc file này để ai biết nó là trợ lý Viettel Store")    
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                self.system_instruction = f.read()
        except Exception as e:
            self.system_instruction = "Bạn là trợ lý ảo CSKH chính thức của hệ thống Viettel Store."

    async def generate_response(self, body: ChatbotRequest):
        # 4. Lấy dữ liệu gói cước và chi nhánh thật từ Database thông qua Services
        packages_context = ""
        branches_context = ""
        
        try:
            pkg_service = PackageService()
            branch_service = BranchService()
            
            # Gọi API lấy toàn bộ gói cước và chi nhánh
            pkgs_res = await pkg_service.get_all_packages()
            branches_res = await branch_service.get_all_branches()
            
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
        except Exception as err:
            # Ghi log lỗi nhưng không làm sập luồng chat
            print("Lỗi khi fetch context database cho Chatbot:", err)

        # 5. Ghép context dữ liệu thật vào system instruction
        full_instruction = f"{self.system_instruction}\n\n"
        
        if packages_context:
            full_instruction += f"DANH SÁCH GÓI CƯỚC THỰC TẾ TRONG HỆ THỐNG:\n{packages_context}\n\n"
        if branches_context:
            full_instruction += f"DANH SÁCH CHI NHÁNH CỬA HÀNG THỰC TẾ TRONG HỆ THỐNG:\n{branches_context}\n\n"

        try:
            # 6. Map lịch sử chat từ Request Schema sang định dạng types.Content của SDK mới
            gemini_history = []
            if body.history:
                for msg in body.history:
                    role = getattr(msg, "role", None)
                    parts = getattr(msg, "parts", None)

                    if not role or parts is None:
                        continue

                    if isinstance(parts, list):
                        normalized_parts = [types.Part.from_text(text=str(part)) for part in parts if part is not None]
                    else:
                        normalized_parts = [types.Part.from_text(text=str(parts))]

                    if role not in ("user", "model"):
                        role = "user"

                    gemini_history.append(
                        types.Content(
                            role=role,
                            parts=normalized_parts
                        )
                    )
            
            # Chọn model, mặc định dùng gemini-1.5-flash
            model_name = config.GEMINI_AI_MODEL or "gemini-1.5-flash"
            
            # Tạo session chat sử dụng async API của SDK mới
            # create() trả về AsyncChat object ngay lập tức, không cần await
            chat = self.client.aio.chats.create(
                model=model_name,
                history=gemini_history,
                config=types.GenerateContentConfig(
                    system_instruction=full_instruction
                )
            )
            
            # 7. Gửi tin nhắn mới
            message = str(body.message).strip()
            if not message:
                raise ValueError("Tin nhắn không được để trống.")

            response = await chat.send_message(message)
            
            response_text = getattr(response, "text", None)
            if not response_text:
                raise ValueError("Gemini không trả về nội dung phản hồi hợp lệ.")
            
            return {
                "success": True,
                "data": {
                    "response": response_text
                }
            }
        except Exception as e:
            raise AppException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message=f"Lỗi khi xử lý thông tin từ AI Chatbot: {str(e)}"
            )
