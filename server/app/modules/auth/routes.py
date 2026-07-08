from fastapi import APIRouter
from fastapi import Response

from auth.schemas import LoginRequest
from auth.service import AuthService

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)


@router.post("/login")
def login(
    request: LoginRequest,
    response: Response
):

    data = AuthService.login(
        request.email,
        request.password
    )

    response.set_cookie(
        key="refresh_token",
        value=data["refresh_token"],
        httponly=True,
        secure=False,  # localhost
        samesite="lax",
        max_age=60 * 60 * 24 * 30
    )

    return {
        "access_token": data["access_token"]
    }

@router.post("/logout")
def logout(
    response: Response,
    refresh_token: str = Cookie(None)
):

    AuthService.logout(
        refresh_token
    )

    response.delete_cookie(
        key="refresh_token"
    )

    return {
        "message": "Logout success"
    }