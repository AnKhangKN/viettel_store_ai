from fastapi import status
from app.core.exceptions import AppException
from app.common.utils.uuid import generate_uuid7
from app.core.security import hash_password
from app.modules.user.repositories.user_repository import UserRepository
from app.modules.user.schemas.user_schema import EmployeeCreateRequest, EmployeeApproveRequest, AccountRoleUpdateRequest
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
                "trang_thai": r["trang_thai"]
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

        if role_lower == "staff" and not body.id_chi_nhanh:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Bắt buộc phải chọn chi nhánh làm việc khi đổi sang vai trò Nhân viên"
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

        res = await self.repository.update_profile(
            id_khach_hang=id_khach_hang,
            ho_ten=body.ho_ten,
            so_dien_thoai=body.so_dien_thoai,
            cccd=body.cccd or "",
            dia_chi=body.dia_chi or ""
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

