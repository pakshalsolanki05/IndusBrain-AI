from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):

    full_name: str

    email: EmailStr

    password: str


class LoginRequest(BaseModel):

    email: EmailStr

    password: str

class UpdateProfileRequest(BaseModel):
    full_name: str
    email: EmailStr


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str