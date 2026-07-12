from fastapi import Depends
from fastapi.security import HTTPBearer
from app.core.jwt import jwt_handler

bearer = HTTPBearer()

async def get_current_user(credentials=Depends(bearer)):

    payload = jwt_handler.verify_access_token(
        credentials.credentials
    )

    return payload