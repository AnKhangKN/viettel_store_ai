from pydantic import BaseModel, Field

class GoogleLoginRequest(BaseModel):
    id_token: str | None = Field(None, description="Google JWT ID Token từ Frontend")
    access_token: str | None = Field(None, description="Google OAuth Access Token từ Frontend")
