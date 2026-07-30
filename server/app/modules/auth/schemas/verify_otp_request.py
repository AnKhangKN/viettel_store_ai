from pydantic import BaseModel

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str
    loai_otp: str = "REGISTER"
