from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from app.core.jwt import jwt_handler
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

bearer = HTTPBearer()

async def get_current_user(credentials=Depends(bearer)):
    try:
        payload = jwt_handler.verify_access_token(
            credentials.credentials
        )
        return payload
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token đã hết hạn, vui lòng làm mới token"
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ"
        )