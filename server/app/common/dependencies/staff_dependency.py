from fastapi import Depends, status
from app.core.exceptions import AppException
from app.common.dependencies.user_dependency import get_current_user
from app.common.enums.role_enum import RoleEnum

async def get_current_staff(current_user: dict = Depends(get_current_user)) -> dict:
    quyen = current_user.get("quyen")
    if isinstance(quyen, str):
        quyen = quyen.lower()
    if quyen not in (RoleEnum.STAFF, RoleEnum.ADMIN):
        raise AppException(
            status_code=status.HTTP_403_FORBIDDEN,
            message="Bạn không có quyền truy cập chức năng này (Yêu cầu Nhân viên hoặc Admin)"
        )
    return current_user
