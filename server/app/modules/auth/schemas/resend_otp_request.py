from pydantic import BaseModel

class ResendOtpRequest(BaseModel):
    email: str
    loai_otp: str = "REGISTER"
