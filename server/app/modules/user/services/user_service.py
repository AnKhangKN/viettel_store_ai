from fastapi import status
from app.core.exceptions import AppException
from app.common.utils.uuid import generate_uuid7
from app.core.security import hash_password, verify_password
from app.modules.user.repositories.user_repository import UserRepository
from app.modules.user.schemas.user_schema import EmployeeCreateRequest, EmployeeApproveRequest, AccountRoleUpdateRequest, StaffProfileUpdateRequest, ChangePasswordRequest
from app.common.enums.role_enum import RoleEnum
from app.modules.branch.repositories.branch_repository import BranchRepository

class UserService:

    def __init__(self):
        self.repository = UserRepository()
        self.branch_repository = BranchRepository()

    async def create_employee(self, body: EmployeeCreateRequest):
        # 1. Kiểm tra email hoặc sđt đã tồn tại chưa
        existing = await self.repository.find_by_email_or_phone(body.email, body.so_dien_thoai)
        if existing:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                message="Email hoặc Số điện thoại đã tồn tại trong hệ thống"
            )

        # 2. Kiểm tra chi nhánh có tồn tại không
        branch = await self.branch_repository.get_by_id(body.id_chi_nhanh)
        if not branch:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message=f"Chi nhánh có ID {body.id_chi_nhanh} không tồn tại"
            )

        # 2.5. Kiểm tra chi nhánh đã có quầy giao dịch do Admin tạo chưa
        if body.vai_tro == "staff":
            booth_count = await self.repository.count_active_booths_by_branch(body.id_chi_nhanh)
            if booth_count == 0:
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message=f"Chi nhánh '{branch['ten_chi_nhanh']}' chưa có quầy giao dịch nào do Admin khởi tạo. Vui lòng tạo quầy giao dịch trước khi khởi tạo tài khoản Nhân viên!"
                )

        # 3. Mã hóa mật khẩu và tạo ID
        hashed_password = hash_password(body.mat_khau)
        id_khach_hang = generate_uuid7()

        # 4. Lưu thông tin vào database
        res = await self.repository.create_employee(
            id_khach_hang=id_khach_hang,
            ten_dang_nhap=body.email,
            mat_khau=hashed_password,
            ho_ten=body.ho_ten,
            email=body.email,
            so_dien_thoai=body.so_dien_thoai,
            id_chi_nhanh=body.id_chi_nhanh,
            vai_tro=body.vai_tro,
            trang_thai=body.trang_thai or "HoatDong"
        )

        return {
            "success": True,
            "data": {
                "id_khach_hang": str(res["id_khach_hang"]),
                "ho_ten": res["ho_ten"],
                "email": res["email"],
                "so_dien_thoai": res["so_dien_thoai"],
                "id_chi_nhanh": str(res["id_chi_nhanh"]),
                "vai_tro": res["vai_tro"],
                "trang_thai": res["trang_thai"]
            }
        }

    async def get_all_employees(self):
        rows = await self.repository.get_all_employees()

        employees = []
        for r in rows:
            employees.append({
                "id_khach_hang": str(r["id_khach_hang"]),
                "ho_ten": r["ho_ten"],
                "email": r["email"],
                "so_dien_thoai": r["so_dien_thoai"],
                "chi_nhanh": {
                    "id_chi_nhanh": str(r["id_chi_nhanh"]) if r["id_chi_nhanh"] else None,
                    "ten_chi_nhanh": r["ten_chi_nhanh"] if r["ten_chi_nhanh"] else None
                },
                "vai_tro": r["vai_tro"],
                "trang_thai": r["trang_thai"]
            })

        return {
            "success": True,
            "data": employees
        }

    async def get_employee_details(self, id_khach_hang: str):
        r = await self.repository.get_employee_by_id(id_khach_hang)
        if not r:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Nhân viên không tồn tại hoặc đã bị xóa"
            )

        return {
            "success": True,
            "data": {
                "id_khach_hang": str(r["id_khach_hang"]),
                "ho_ten": r["ho_ten"],
                "email": r["email"],
                "so_dien_thoai": r["so_dien_thoai"],
                "chi_nhanh": {
                    "id_chi_nhanh": str(r["id_chi_nhanh"]) if r["id_chi_nhanh"] else None,
                    "ten_chi_nhanh": r["ten_chi_nhanh"] if r["ten_chi_nhanh"] else None
                },
                "vai_tro": r["vai_tro"],
                "trang_thai": r["trang_thai"]
            }
        }

    async def approve_employee(self, id_khach_hang: str, body: EmployeeApproveRequest):
        valid_statuses = {"HoatDong", "Khoa", "ChoXacThuc"}
        if body.trang_thai not in valid_statuses:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message=f"Trạng thái '{body.trang_thai}' không hợp lệ. Phải thuộc: {', '.join(valid_statuses)}"
            )

        res = await self.repository.update_employee_status(id_khach_hang, body.trang_thai)
        if not res:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Nhân viên không tồn tại hoặc đã bị xóa"
            )

        return {
            "success": True,
            "message": "Duyệt trạng thái nhân viên thành công",
            "data": {
                "id_khach_hang": str(res["id_khach_hang"]),
                "ho_ten": res["ho_ten"],
                "email": res["email"],
                "vai_tro": res["vai_tro"],
                "trang_thai": res["trang_thai"]
            }
        }

    async def get_all_customers(self):
        rows = await self.repository.get_all_customers()

        customers = []
        for r in rows:
            customers.append({
                "id_khach_hang": str(r["id_khach_hang"]),
                "ho_ten": r["ho_ten"],
                "so_dien_thoai": r["so_dien_thoai"],
                "email": r["email"],
                "cccd": r["cccd"],
                "gioi_tinh": r["gioi_tinh"],
                "ngay_sinh": str(r["ngay_sinh"]) if r["ngay_sinh"] else None,
                "dia_chi": r["dia_chi"],
                "trang_thai": r["trang_thai"],
                "ngay_tao": str(r["ngay_tao"]) if r["ngay_tao"] else None
            })

        return {
            "success": True,
            "data": customers
        }


    async def get_customer_details(self, id_khach_hang: str):
        r = await self.repository.get_customer_by_id(id_khach_hang)
        if not r:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Khách hàng không tồn tại hoặc đã bị xóa"
            )

        return {
            "success": True,
            "data": {
                "id_khach_hang": str(r["id_khach_hang"]),
                "ho_ten": r["ho_ten"],
                "gioi_tinh": r["gioi_tinh"],
                "ngay_sinh": str(r["ngay_sinh"]) if r["ngay_sinh"] else None,
                "cccd": r["cccd"],
                "so_dien_thoai": r["so_dien_thoai"],
                "email": r["email"],
                "dia_chi": r["dia_chi"],
                "trang_thai": r["trang_thai"]
            }
        }

    async def get_all_accounts(self):
        rows = await self.repository.get_all_accounts()
        accounts = []
        for r in rows:
            accounts.append({
                "id_khach_hang": str(r["id_khach_hang"]),
                "ho_ten": r["ho_ten"],
                "email": r["email"],
                "vai_tro": r["vai_tro"],
                "trang_thai": r["trang_thai"],
                "id_chi_nhanh": str(r["id_chi_nhanh"]) if r["id_chi_nhanh"] else None
            })
        return {
            "success": True,
            "data": accounts
        }


    async def update_account_role(self, id_khach_hang: str, body: AccountRoleUpdateRequest):
        valid_roles = {role.value for role in RoleEnum}
        role_lower = body.vai_tro.lower()
        if role_lower not in valid_roles:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message=f"Vai trò '{body.vai_tro}' không hợp lệ. Phải thuộc: {', '.join(valid_roles)}"
            )

        if role_lower == "staff":
            if not body.id_chi_nhanh:
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message="Bắt buộc phải chọn chi nhánh làm việc khi đổi sang vai trò Nhân viên"
                )
            booth_count = await self.repository.count_active_booths_by_branch(body.id_chi_nhanh)
            if booth_count == 0:
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message="Chi nhánh này chưa có quầy giao dịch nào do Admin khởi tạo. Vui lòng tạo quầy giao dịch cho chi nhánh trước khi đổi vai trò thành Nhân viên!"
                )

        res = await self.repository.update_account_role(id_khach_hang, role_lower, body.id_chi_nhanh)
        if not res:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Tài khoản không tồn tại hoặc đã bị xóa"
            )

        return {
            "success": True,
            "message": "Cập nhật quyền tài khoản thành công",
            "data": {
                "id_khach_hang": str(res["id_khach_hang"]),
                "ho_ten": res["ho_ten"],
                "email": res["email"],
                "vai_tro": res["vai_tro"],
                "trang_thai": res["trang_thai"]
            }
        }


    async def get_user_role(self, id_khach_hang: str) -> str | None:
        return await self.repository.get_user_role(id_khach_hang)

    async def update_profile(self, payload: dict, body):
        id_khach_hang = payload.get("id_khach_hang")
        if not id_khach_hang:
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Không xác định được người dùng"
            )

        if body.email:
            existing = await self.repository.find_by_email_or_phone(body.email, "")
            if existing and str(existing["id_khach_hang"]) != str(id_khach_hang):
                raise AppException(
                    status_code=status.HTTP_409_CONFLICT,
                    message="Email này đã được sử dụng bởi tài khoản khác"
                )

        res = await self.repository.update_profile(
            id_khach_hang=id_khach_hang,
            ho_ten=body.ho_ten,
            so_dien_thoai=body.so_dien_thoai,
            cccd=body.cccd or "",
            dia_chi=body.dia_chi or "",
            email=body.email
        )

        if not res:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Người dùng không tồn tại"
            )

        return {
            "success": True,
            "message": "Cập nhật thông tin thành công",
            "data": {
                "id_khach_hang": str(res["id_khach_hang"]),
                "ho_ten": res["ho_ten"],
                "so_dien_thoai": res["so_dien_thoai"],
                "cccd": res["cccd"],
                "dia_chi": res["dia_chi"],
                "email": res["email"]
            }
        }

    async def get_staff_profile(self, payload: dict):
        id_khach_hang = payload.get("id_khach_hang")
        if not id_khach_hang:
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Không xác định được danh tính nhân viên"
            )

        r = await self.repository.get_staff_profile(id_khach_hang)
        if not r:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy thông tin nhân viên"
            )

        return {
            "success": True,
            "data": {
                "id_khach_hang": str(r["id_khach_hang"]),
                "ten_dang_nhap": r["ten_dang_nhap"],
                "ho_ten": r["ho_ten"],
                "email": r["email"],
                "so_dien_thoai": r["so_dien_thoai"],
                "cccd": r["cccd"],
                "gioi_tinh": r["gioi_tinh"],
                "ngay_sinh": str(r["ngay_sinh"]) if r["ngay_sinh"] else None,
                "dia_chi": r["dia_chi"],
                "anh_dai_dien": r["anh_dai_dien"],
                "vai_tro": r["vai_tro"],
                "trang_thai": r["trang_thai"],
                "lan_dang_nhap_cuoi": str(r["lan_dang_nhap_cuoi"]) if r["lan_dang_nhap_cuoi"] else None,
                "ngay_tao": str(r["ngay_tao"]) if r["ngay_tao"] else None,
                "chi_nhanh": {
                    "id_chi_nhanh": str(r["id_chi_nhanh"]) if r["id_chi_nhanh"] else None,
                    "ten_chi_nhanh": r["ten_chi_nhanh"],
                    "dia_chi_chi_nhanh": r["dia_chi_chi_nhanh"],
                    "hotline_chi_nhanh": r["hotline_chi_nhanh"],
                    "gio_lam_viec_chi_nhanh": r["gio_lam_viec_chi_nhanh"]
                } if r["id_chi_nhanh"] else None
            }
        }

    async def update_staff_profile(self, payload: dict, body: StaffProfileUpdateRequest):
        id_khach_hang = payload.get("id_khach_hang")
        if not id_khach_hang:
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Không xác định được danh tính nhân viên"
            )

        res = await self.repository.update_staff_profile(
            id_khach_hang=id_khach_hang,
            ho_ten=body.ho_ten,
            so_dien_thoai=body.so_dien_thoai,
            cccd=body.cccd,
            dia_chi=body.dia_chi,
            gioi_tinh=body.gioi_tinh,
            ngay_sinh=body.ngay_sinh
        )

        if not res:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Nhân viên không tồn tại"
            )

        return {
            "success": True,
            "message": "Cập nhật hồ sơ nhân viên thành công",
            "data": {
                "id_khach_hang": str(res["id_khach_hang"]),
                "ho_ten": res["ho_ten"],
                "so_dien_thoai": res["so_dien_thoai"],
                "cccd": res["cccd"],
                "dia_chi": res["dia_chi"],
                "gioi_tinh": res["gioi_tinh"],
                "ngay_sinh": str(res["ngay_sinh"]) if res["ngay_sinh"] else None,
                "email": res["email"]
            }
        }

    async def change_password(self, payload: dict, body: ChangePasswordRequest):
        id_khach_hang = payload.get("id_khach_hang")
        if not id_khach_hang:
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Không xác định được danh tính người dùng"
            )

        current_hash = await self.repository.get_password_hash_by_id(id_khach_hang)
        if not current_hash:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Người dùng không tồn tại"
            )

        if not verify_password(body.mat_khau_cu, current_hash):
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Mật khẩu hiện tại không chính xác"
            )

        new_hash = hash_password(body.mat_khau_moi)
        await self.repository.update_password(id_khach_hang, new_hash)

        return {
            "success": True,
            "message": "Đổi mật khẩu thành công"
        }


