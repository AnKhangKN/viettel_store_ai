import uuid
from datetime import datetime, timedelta
from fastapi import status
from app.core.exceptions import AppException
from app.common.utils.uuid import generate_uuid7
from app.modules.queue.repositories.queue_repository import QueueRepository
from app.modules.queue.schemas.queue_schema import ServiceCreateRequest, ServiceUpdateRequest, QueueTicketCreateRequest
from app.modules.branch.repositories.branch_repository import BranchRepository
from app.core.websocket import websocket_manager
from app.modules.user.services.user_service import UserService

class QueueService:

    def __init__(self):
        self.repository = QueueRepository()
        self.branch_repository = BranchRepository()
        self.user_service = UserService()


    # --- SERVICES CRUD (ADMIN) ---
    async def get_all_services(self):
        rows = await self.repository.get_all_services()
        services = []
        for r in rows:
            services.append({
                "id_loai_giao_dich": str(r["id_loai_giao_dich"]),
                "ten_giao_dich": r["ten_giao_dich"],
                "mo_ta": r["mo_ta"],
                "thoi_gian_xu_ly_trung_binh": r["thoi_gian_xu_ly_trung_binh"],
                "trang_thai": r["trang_thai"]
            })
        return {
            "success": True,
            "data": services
        }

    async def create_service(self, body: ServiceCreateRequest):
        # Kiểm tra trùng tên giao dịch
        existing = await self.repository.get_service_by_name(body.ten_giao_dich)
        if existing:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message=f"Tên dịch vụ '{body.ten_giao_dich}' đã tồn tại"
            )

        service_id = generate_uuid7()
        res = await self.repository.create_service(
            id_loai_giao_dich=service_id,
            ten_giao_dich=body.ten_giao_dich,
            mo_ta=body.mo_ta or "",
            thoi_gian_xu_ly_trung_binh=body.thoi_gian_xu_ly_trung_binh,
            trang_thai=body.trang_thai or "HoatDong"
        )

        return {
            "success": True,
            "message": "Tạo dịch vụ tại quầy thành công",
            "data": {
                "id_loai_giao_dich": str(res["id_loai_giao_dich"]),
                "ten_giao_dich": res["ten_giao_dich"],
                "mo_ta": res["mo_ta"],
                "thoi_gian_xu_ly_trung_binh": res["thoi_gian_xu_ly_trung_binh"],
                "trang_thai": res["trang_thai"]
            }
        }

    async def update_service(self, id_loai_giao_dich: str, body: ServiceUpdateRequest):
        existing = await self.repository.get_service_by_id(id_loai_giao_dich)
        if not existing:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Loại dịch vụ không tồn tại hoặc đã bị xóa"
            )

        # Kiểm tra trùng tên (nếu thay đổi tên)
        ten_giao_dich = body.ten_giao_dich or existing["ten_giao_dich"]
        if ten_giao_dich != existing["ten_giao_dich"]:
            name_check = await self.repository.get_service_by_name(ten_giao_dich)
            if name_check:
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message=f"Tên dịch vụ '{ten_giao_dich}' đã được sử dụng"
                )

        mo_ta = body.mo_ta if body.mo_ta is not None else existing["mo_ta"]
        thoi_gian = body.thoi_gian_xu_ly_trung_binh if body.thoi_gian_xu_ly_trung_binh is not None else existing["thoi_gian_xu_ly_trung_binh"]
        trang_thai = body.trang_thai or existing["trang_thai"]

        res = await self.repository.update_service(
            id_loai_giao_dich=id_loai_giao_dich,
            ten_giao_dich=ten_giao_dich,
            mo_ta=mo_ta,
            thoi_gian_xu_ly_trung_binh=thoi_gian,
            trang_thai=trang_thai
        )

        return {
            "success": True,
            "message": "Cập nhật dịch vụ thành công",
            "data": {
                "id_loai_giao_dich": str(res["id_loai_giao_dich"]),
                "ten_giao_dich": res["ten_giao_dich"],
                "mo_ta": res["mo_ta"],
                "thoi_gian_xu_ly_trung_binh": res["thoi_gian_xu_ly_trung_binh"],
                "trang_thai": res["trang_thai"]
            }
        }

    async def delete_service(self, id_loai_giao_dich: str):
        existing = await self.repository.get_service_by_id(id_loai_giao_dich)
        if not existing:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Loại dịch vụ không tồn tại hoặc đã bị xóa"
            )

        await self.repository.delete_service(id_loai_giao_dich)
        return {
            "success": True,
            "message": "Xóa dịch vụ thành công"
        }


    # --- TICKET & QUEUE (CLIENT) ---
    async def create_queue_ticket(self, body: QueueTicketCreateRequest):
        # 1. Kiểm tra tồn tại chi nhánh và loại giao dịch
        branch = await self.branch_repository.get_by_id(body.id_chi_nhanh)
        if not branch:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Chi nhánh không tồn tại"
            )

        service = await self.repository.get_service_by_id(body.id_loai_giao_dich)
        if not service:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Dịch vụ tại quầy không tồn tại"
            )

        if service["trang_thai"] != "HoatDong":
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Dịch vụ hiện đang ngừng áp dụng"
            )

        # 2. Xử lý thông tin khách hàng (tìm hoặc tự tạo mới)
        customer = await self.repository.get_customer_by_phone(body.so_dien_thoai)
        if customer:
            id_khach_hang = customer["id_khach_hang"]
        else:
            id_khach_hang = generate_uuid7()
            await self.repository.create_customer(
                id_khach_hang=id_khach_hang,
                ho_ten=body.ho_ten,
                so_dien_thoai=body.so_dien_thoai
            )

        # 3. Sinh số thứ tự tuần tự trong ngày
        count_today = await self.repository.count_tickets_today_by_branch(body.id_chi_nhanh)
        # Sinh dạng A001, A002...
        so_thu_tu = f"A{str(count_today + 1).zfill(3)}"

        # 4. Tạo phiếu xếp hàng
        ticket_id = generate_uuid7()
        ticket = await self.repository.create_ticket(
            id_phieu=ticket_id,
            id_khach_hang=id_khach_hang,
            id_chi_nhanh=body.id_chi_nhanh,
            id_loai_giao_dich=body.id_loai_giao_dich,
            so_thu_tu=so_thu_tu
        )

        # 5. Tính toán thời gian dự kiến và số phút chờ
        waiting_count = await self.repository.count_waiting_tickets_before(body.id_chi_nhanh, ticket["ngay_tao"])
        thoi_gian_tb = service["thoi_gian_xu_ly_trung_binh"]
        
        # Nếu chưa có ai chờ, cho mặc định chờ 5 phút để nhân viên chuẩn bị, nếu có người chờ thì nhân số người với tgian tb
        so_phut_cho = max(5, waiting_count * thoi_gian_tb)
        thoi_gian_du_kien = ticket["ngay_tao"] + timedelta(minutes=so_phut_cho)

        # Lưu thông tin dự đoán
        prediction_id = generate_uuid7()
        await self.repository.create_time_prediction(
            id_du_doan=prediction_id,
            id_phieu=ticket_id,
            thoi_gian_du_kien=thoi_gian_du_kien,
            so_phut_cho=so_phut_cho
        )

        # Broadcast sự kiện real-time qua websocket cho nhân viên quầy biết
        import asyncio
        asyncio.create_task(websocket_manager.broadcast(f"queue:{body.id_chi_nhanh}", {"event": "queue_updated"}))

        return {
            "success": True,
            "message": "Đăng ký xếp hàng thành công",
            "data": {
                "id_phieu": str(ticket["id_phieu"]),
                "so_thu_tu": ticket["so_thu_tu"],
                "trang_thai": ticket["trang_thai"],
                "ngay_tao": ticket["ngay_tao"].isoformat(),
                "so_phut_cho": so_phut_cho,
                "thoi_gian_du_kien": thoi_gian_du_kien.isoformat(),
                "khach_hang": {
                    "ho_ten": body.ho_ten,
                    "so_dien_thoai": body.so_dien_thoai
                },
                "chi_nhanh": {
                    "ten_chi_nhanh": branch["ten_chi_nhanh"],
                    "dia_chi": branch["dia_chi"]
                },
                "dich_vu": {
                    "ten_giao_dich": service["ten_giao_dich"]
                }
            }
        }

    # --- STAFF SERVICES ---
    async def get_staff_queue_tickets(self, id_khach_hang: str):
        # 1. Tìm chi nhánh của nhân viên
        branch_row = await self.repository.get_staff_branch(id_khach_hang)
        if not branch_row:
            # Fallback cho Admin nếu chưa được gán chi nhánh trong bảng nhanvien
            role = await self.user_service.get_user_role(id_khach_hang)
            if role == "admin":
                all_branches = await self.branch_repository.get_all()
                if all_branches:
                    id_chi_nhanh = all_branches[0]["id_chi_nhanh"]
                else:
                    raise AppException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        message="Không tìm thấy chi nhánh nào trong hệ thống"
                    )
            else:
                raise AppException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    message="Nhân viên chưa được gán làm việc tại chi nhánh nào"
                )
        else:
            id_chi_nhanh = branch_row["id_chi_nhanh"]

        # 2. Lấy danh sách phiếu xếp hàng hôm nay
        rows = await self.repository.get_tickets_by_branch_today(id_chi_nhanh)
        
        tickets = []
        for r in rows:
            tickets.append({
                "id_phieu": str(r["id_phieu"]),
                "so_thu_tu": r["so_thu_tu"],
                "trang_thai": r["trang_thai"],
                "ngay_tao": r["ngay_tao"].isoformat(),
                "ho_ten": r["ho_ten"],
                "so_dien_thoai": r["so_dien_thoai"],
                "ten_giao_dich": r["ten_giao_dich"],
                "thoi_gian_xu_ly_trung_binh": r["thoi_gian_xu_ly_trung_binh"]
            })
            
        return {
            "success": True,
            "id_chi_nhanh": str(id_chi_nhanh),
            "data": tickets
        }

    async def update_ticket_status(self, id_phieu: str, trang_thai: str, staff_user_id: str):
        # Validate trạng thái hợp lệ
        valid_statuses = ["ChoXuLy", "DangPhucVu", "HoanThanh", "DaHuy"]
        if trang_thai not in valid_statuses:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Trạng thái phiếu không hợp lệ"
            )

        # 1. Kiểm tra tồn tại phiếu
        ticket = await self.repository.get_ticket_by_id(id_phieu)
        if not ticket:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Phiếu xếp hàng không tồn tại hoặc đã bị xóa"
            )

        # 2. Lấy chi nhánh của nhân viên để bảo mật (chỉ cho phép cập nhật phiếu tại chi nhánh mình)
        branch_row = await self.repository.get_staff_branch(staff_user_id)
        if not branch_row:
            # Fallback cho Admin: Cho phép thao tác trên chi nhánh của phiếu
            role = await self.user_service.get_user_role(staff_user_id)
            if role == "admin":
                id_chi_nhanh = ticket["id_chi_nhanh"]
            else:
                raise AppException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    message="Nhân viên không có quyền thao tác (chưa được gán chi nhánh)"
                )
        else:
            id_chi_nhanh = branch_row["id_chi_nhanh"]
            if ticket["id_chi_nhanh"] != id_chi_nhanh:
                raise AppException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    message="Bạn không có quyền thao tác trên phiếu của chi nhánh khác"
                )

        # 3. Cập nhật trạng thái
        res = await self.repository.update_ticket_status(id_phieu, trang_thai)
        
        # Broadcast sự kiện cập nhật real-time
        import asyncio
        asyncio.create_task(websocket_manager.broadcast(f"queue:{id_chi_nhanh}", {"event": "queue_updated"}))

        return {
            "success": True,
            "message": f"Đã cập nhật trạng thái phiếu thành công",
            "data": {
                "id_phieu": str(res["id_phieu"]),
                "so_thu_tu": res["so_thu_tu"],
                "trang_thai": res["trang_thai"]
            }
        }

