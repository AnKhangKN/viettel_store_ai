from datetime import datetime, timedelta, UTC
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError


class Jwt:
    def __init__(
        self,
        access_secret: str,
        refresh_secret: str,
        algorithm: str = "HS256",
    ):
        self.access_secret = access_secret
        self.refresh_secret = refresh_secret
        self.algorithm = algorithm

    # Tạo access token {#e68,16}
    def create_access_token(
        self,
        payload: dict,
        expires_minutes: int = 15,
    ) -> str:

        data = payload.copy()

        data["exp"] = datetime.now(UTC) + timedelta(minutes=expires_minutes)
        data["type"] = "access"

        return jwt.encode(
            data,
            self.access_secret,
            algorithm=self.algorithm,
        )

    # Tạo refresh token {#e68,16}
    def create_refresh_token(
        self,
        payload: dict,
        expires_days: int = 7,
    ) -> str:

        data = payload.copy()

        data["exp"] = datetime.now(UTC) + timedelta(days=expires_days)
        data["type"] = "refresh"

        return jwt.encode(
            data,
            self.refresh_secret,
            algorithm=self.algorithm,
        )

    # Xác minh access token
    def verify_access_token(self, token: str) -> dict:

        return jwt.decode(
            token,
            self.access_secret,
            algorithms=[self.algorithm],
        )

    # Xác minh refresh token 
    def verify_refresh_token(self, token: str) -> dict:

        return jwt.decode(
            token,
            self.refresh_secret,
            algorithms=[self.algorithm],
        )

    def handle_refresh_token(self, refresh_token: str):

        try:
            payload = self.verify_refresh_token(refresh_token)

            payload.pop("exp", None)
            payload.pop("type", None)

            access_token = self.create_access_token(payload)

            return {
                "success": True,
                "accessToken": access_token,
            }

        except ExpiredSignatureError:
            return {
                "success": False,
                "message": "Refresh token expired",
            }

        except InvalidTokenError:
            return {
                "success": False,
                "message": "Invalid refresh token",
            }