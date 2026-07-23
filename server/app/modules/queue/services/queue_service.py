import uuid
from datetime import datetime, timedelta
from fastapi import status
from app.core.exceptions import AppException
from app.common.utils.uuid import generate_uuid7
from app.modules.queue.repositories.queue_repository import QueueRepository
from app.modules.queue.schemas.queue_schema import ServiceCreateRequest, ServiceUpdateRequest, QueueTicketCreateRequest
from app.modules.queue.schemas.booth_schema import BoothAdminCreateRequest, BoothAdminUpdateRequest
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

        # 5. Thuật toán phân bổ quầy thông minh (Smart Dispatching) dựa trên số lượng khách & thời gian chờ
        active_booths = await self.repository.get_booths_by_branch(body.id_chi_nhanh)
        num_active_booths = len(active_booths) if active_booths else 1

        waiting_count = await self.repository.count_waiting_tickets_before(body.id_chi_nhanh, ticket["ngay_tao"])
        thoi_gian_tb = service["thoi_gian_xu_ly_trung_binh"] or 10

        # Lựa chọn quầy có thời gian chờ & lượng khách ít nhất
        booth_index = waiting_count % num_active_booths
        if active_booths:
            selected_booth = active_booths[booth_index]
            quay_du_kien = selected_booth["ten_quay"]
        else:
            quay_du_kien = f"Quầy {booth_index + 1}"

        # Số lượt chờ tại quầy được phân bổ
        booth_queue_length = waiting_count // num_active_booths

        # Thời gian chờ ước tính được tối ưu hóa theo số quầy đang hoạt động
        if waiting_count == 0:
            so_phut_cho = 3
        else:
            so_phut_cho = max(3, booth_queue_length * thoi_gian_tb)

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
                "quay_du_kien": quay_du_kien,
                "tong_khach_dang_cho": waiting_count,
                "so_quay_hoat_dong": num_active_booths,
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

    # --- BOOTH OCCUPANCY & RESERVATION MANAGEMENT ---
    async def get_booths_status(self, staff_user_id: str):
        # 1. Tìm chi nhánh của nhân viên
        branch_row = await self.repository.get_staff_branch(staff_user_id)
        if not branch_row:
            role = await self.user_service.get_user_role(staff_user_id)
            if role == "admin":
                all_branches = await self.branch_repository.get_all()
                if all_branches:
                    id_chi_nhanh = str(all_branches[0]["id_chi_nhanh"])
                else:
                    raise AppException(status_code=status.HTTP_404_NOT_FOUND, message="Không có chi nhánh trong hệ thống")
            else:
                raise AppException(status_code=status.HTTP_404_NOT_FOUND, message="Nhân viên chưa được gán chi nhánh")
        else:
            id_chi_nhanh = str(branch_row["id_chi_nhanh"])

        # Lấy thông tin chi nhánh
        branch = await self.branch_repository.get_by_id(id_chi_nhanh)
        ten_chi_nhanh = branch["ten_chi_nhanh"] if branch else "Viettel Store"

        # 2. Lấy danh sách quầy thực tế của chi nhánh từ DB (Không dùng mock data)
        db_booths = await self.repository.get_booths_by_branch(id_chi_nhanh)
        branch_booths_list = [b["ten_quay"] for b in db_booths] if db_booths else []

        branch_booths = booth_occupancy_manager.get(id_chi_nhanh, {})

        # Kiểm tra nếu nhân viên đang có giao dịch phục vụ
        tickets_today = await self.repository.get_tickets_by_branch_today(id_chi_nhanh)
        serving_list = [t for t in tickets_today if t["trang_thai"] == "DangPhucVu"]
        is_serving_customer = len(serving_list) > 0
        serving_ticket_no = serving_list[0]["so_thu_tu"] if is_serving_customer else None

        result = []
        my_active_booth = None

        for b_name in branch_booths_list:
            if b_name in branch_booths:
                occ = branch_booths[b_name]
                is_my = (occ["staff_id"] == staff_user_id)
                if is_my:
                    my_active_booth = b_name

                result.append({
                    "ten_quay": b_name,
                    "trang_thai": "DangSuDung",
                    "nhan_vien": occ["staff_name"],
                    "id_nhan_vien": occ["staff_id"],
                    "is_my_booth": is_my
                })
            else:
                result.append({
                    "ten_quay": b_name,
                    "trang_thai": "SanSang",
                    "nhan_vien": None,
                    "id_nhan_vien": None,
                    "is_my_booth": False
                })

        return {
            "success": True,
            "id_chi_nhanh": id_chi_nhanh,
            "ten_chi_nhanh": ten_chi_nhanh,
            "my_active_booth": my_active_booth,
            "is_serving_customer": is_serving_customer,
            "serving_ticket_no": serving_ticket_no,
            "data": result
        }

    async def select_booth(self, staff_user_id: str, ten_quay: str):
        # 1. Tìm chi nhánh & thông tin nhân viên
        branch_row = await self.repository.get_staff_branch(staff_user_id)
        if not branch_row:
            role = await self.user_service.get_user_role(staff_user_id)
            if role == "admin":
                all_branches = await self.branch_repository.get_all()
                if all_branches:
                    id_chi_nhanh = str(all_branches[0]["id_chi_nhanh"])
                else:
                    raise AppException(status_code=status.HTTP_404_NOT_FOUND, message="Không có chi nhánh")
            else:
                raise AppException(status_code=status.HTTP_404_NOT_FOUND, message="Nhân viên chưa được gán chi nhánh")
        else:
            id_chi_nhanh = str(branch_row["id_chi_nhanh"])

        db_booths = await self.repository.get_booths_by_branch(id_chi_nhanh)
        valid_booths = [b["ten_quay"] for b in db_booths] if db_booths else []

        if ten_quay not in valid_booths:
            raise AppException(status_code=status.HTTP_400_BAD_REQUEST, message=f"Quầy '{ten_quay}' chưa được Admin khởi tạo cho chi nhánh này")

        # RÀNG BUỘC: Kiểm tra nếu nhân viên đang có khách DangPhucVu -> Không cho phép đổi quầy!
        tickets_today = await self.repository.get_tickets_by_branch_today(id_chi_nhanh)
        serving_list = [t for t in tickets_today if t["trang_thai"] == "DangPhucVu"]
        if serving_list:
            serving_no = serving_list[0]["so_thu_tu"]
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message=f"Bạn đang có giao dịch phục vụ khách '{serving_no}' tại quầy. Vui lòng nhấn 'Hoàn thành' hoặc 'Hủy' giao dịch trước khi đổi quầy!"
            )

        # Lấy tên nhân viên
        try:
            emp_res = await self.user_service.get_employee_details(staff_user_id)
            staff_name = emp_res.get("data", {}).get("ho_ten", "Nhân viên")
        except Exception:
            staff_name = "Nhân viên"

        if id_chi_nhanh not in booth_occupancy_manager:
            booth_occupancy_manager[id_chi_nhanh] = {}

        branch_booths = booth_occupancy_manager[id_chi_nhanh]

        # 2. Kiểm tra nếu quầy này đang bị chiếm bởi người khác
        if ten_quay in branch_booths:
            existing = branch_booths[ten_quay]
            if existing["staff_id"] != staff_user_id:
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message=f"'{ten_quay}' đang được sử dụng bởi nhân viên {existing['staff_name']}. Vui lòng chọn quầy khác!"
                )


        # 3. Giải phóng bất kỳ quầy cũ nào nhân viên này từng đứng trước đó
        to_remove = [k for k, v in branch_booths.items() if v["staff_id"] == staff_user_id]
        for k in to_remove:
            del branch_booths[k]

        # 4. Gán quầy mới cho nhân viên này
        branch_booths[ten_quay] = {
            "staff_id": staff_user_id,
            "staff_name": staff_name,
            "login_time": datetime.now().isoformat()
        }

        # 5. Broadcast sự kiện cập nhật quầy qua WebSocket cho tất cả nhân viên khác tại chi nhánh
        import asyncio
        asyncio.create_task(websocket_manager.broadcast(f"queue:{id_chi_nhanh}", {"event": "booth_updated"}))

        return {
            "success": True,
            "message": f"Đã chọn thành công {ten_quay}",
            "data": {
                "ten_quay": ten_quay,
                "nhan_vien": staff_name
            }
        }

    async def release_booth(self, staff_user_id: str, ten_quay: str | None = None):
        branch_row = await self.repository.get_staff_branch(staff_user_id)
        if not branch_row:
            role = await self.user_service.get_user_role(staff_user_id)
            if role == "admin":
                all_branches = await self.branch_repository.get_all()
                id_chi_nhanh = str(all_branches[0]["id_chi_nhanh"]) if all_branches else None
            else:
                id_chi_nhanh = None
        else:
            id_chi_nhanh = str(branch_row["id_chi_nhanh"])

        if id_chi_nhanh and id_chi_nhanh in booth_occupancy_manager:
            branch_booths = booth_occupancy_manager[id_chi_nhanh]
            if ten_quay:
                if ten_quay in branch_booths and branch_booths[ten_quay]["staff_id"] == staff_user_id:
                    del branch_booths[ten_quay]
            else:
                to_remove = [k for k, v in branch_booths.items() if v["staff_id"] == staff_user_id]
                for k in to_remove:
                    del branch_booths[k]

            import asyncio
            asyncio.create_task(websocket_manager.broadcast(f"queue:{id_chi_nhanh}", {"event": "booth_updated"}))

        return {
            "success": True,
            "message": "Đã giải phóng quầy thành công"
        }

    # --- ADMIN BOOTHS CRUD ---
    async def get_all_booths_admin(self):
        rows = await self.repository.get_all_booths_admin()
        data = []
        for r in rows:
            data.append({
                "id_quay": str(r["id_quay"]),
                "id_chi_nhanh": str(r["id_chi_nhanh"]),
                "ten_chi_nhanh": r["ten_chi_nhanh"],
                "so_quay": r["so_quay"],
                "ten_quay": r["ten_quay"],
                "mo_ta": r["mo_ta"],
                "trang_thai": r["trang_thai"],
                "ngay_tao": str(r["ngay_tao"]) if r["ngay_tao"] else None
            })
        return {
            "success": True,
            "data": data
        }

    async def create_booth_admin(self, body: BoothAdminCreateRequest):
        # 1. Kiểm tra chi nhánh có tồn tại không
        branch = await self.branch_repository.get_by_id(body.id_chi_nhanh)
        if not branch:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message=f"Chi nhánh có ID '{body.id_chi_nhanh}' không tồn tại"
            )

        # 2. Kiểm tra trùng số quầy hoặc tên quầy trong cùng chi nhánh
        duplicate = await self.repository.check_duplicate_booth(body.id_chi_nhanh, body.so_quay, body.ten_quay)
        if duplicate:
            if duplicate["so_quay"] == body.so_quay:
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message=f"Chi nhánh '{branch['ten_chi_nhanh']}' đã có 'Quầy số {body.so_quay}'!"
                )
            else:
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message=f"Chi nhánh '{branch['ten_chi_nhanh']}' đã có quầy trùng tên '{body.ten_quay}'!"
                )

        id_quay = generate_uuid7()
        res = await self.repository.create_booth_admin(
            id_quay=id_quay,
            id_chi_nhanh=body.id_chi_nhanh,
            so_quay=body.so_quay,
            ten_quay=body.ten_quay,
            mo_ta=body.mo_ta or "",
            trang_thai=body.trang_thai or "HoatDong"
        )

        import asyncio
        asyncio.create_task(websocket_manager.broadcast(f"queue:{body.id_chi_nhanh}", {"event": "booth_updated"}))

        return {
            "success": True,
            "message": f"Tạo '{body.ten_quay}' thành công",
            "data": {
                "id_quay": str(res["id_quay"]),
                "id_chi_nhanh": str(res["id_chi_nhanh"]),
                "so_quay": res["so_quay"],
                "ten_quay": res["ten_quay"],
                "mo_ta": res["mo_ta"],
                "trang_thai": res["trang_thai"]
            }
        }

    async def update_booth_admin(self, id_quay: str, body: BoothAdminUpdateRequest):
        existing = await self.repository.get_booth_by_id(id_quay)
        if not existing:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quầy giao dịch không tồn tại hoặc đã bị xóa"
            )

        id_chi_nhanh = body.id_chi_nhanh or str(existing["id_chi_nhanh"])
        so_quay = body.so_quay if body.so_quay is not None else existing["so_quay"]
        ten_quay = body.ten_quay or existing["ten_quay"]
        mo_ta = body.mo_ta if body.mo_ta is not None else existing["mo_ta"]
        trang_thai = body.trang_thai or existing["trang_thai"]

        # Kiểm tra trùng lập với quầy khác
        duplicate = await self.repository.check_duplicate_booth(id_chi_nhanh, so_quay, ten_quay, exclude_id_quay=id_quay)
        if duplicate:
            if duplicate["so_quay"] == so_quay:
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message=f"Đã có 'Quầy số {so_quay}' tại chi nhánh này!"
                )
            else:
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message=f"Đã có quầy tên '{ten_quay}' tại chi nhánh này!"
                )

        res = await self.repository.update_booth_admin(
            id_quay=id_quay,
            id_chi_nhanh=id_chi_nhanh,
            so_quay=so_quay,
            ten_quay=ten_quay,
            mo_ta=mo_ta,
            trang_thai=trang_thai
        )

        import asyncio
        asyncio.create_task(websocket_manager.broadcast(f"queue:{id_chi_nhanh}", {"event": "booth_updated"}))

        return {
            "success": True,
            "message": "Cập nhật quầy giao dịch thành công",
            "data": {
                "id_quay": str(res["id_quay"]),
                "id_chi_nhanh": str(res["id_chi_nhanh"]),
                "so_quay": res["so_quay"],
                "ten_quay": res["ten_quay"],
                "mo_ta": res["mo_ta"],
                "trang_thai": res["trang_thai"]
            }
        }

    async def delete_booth_admin(self, id_quay: str):
        existing = await self.repository.get_booth_by_id(id_quay)
        if not existing:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Quầy giao dịch không tồn tại"
            )

        res = await self.repository.delete_booth_admin(id_quay)
        id_chi_nhanh = str(existing["id_chi_nhanh"])

        import asyncio
        asyncio.create_task(websocket_manager.broadcast(f"queue:{id_chi_nhanh}", {"event": "booth_updated"}))

        return {
            "success": True,
            "message": "Xóa quầy giao dịch thành công"
        }

# Global Memory Storage for Booth Occupancies per branch
booth_occupancy_manager = {}


