from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr
    password: str
    