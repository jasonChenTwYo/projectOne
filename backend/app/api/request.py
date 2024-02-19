from pydantic import BaseModel, Field, EmailStr


class RegisterRequest(BaseModel):
    user_name: str = Field(description="使用者名稱")
    password_hash: str = Field(description="密碼")
    email: EmailStr = Field(description="信箱，需唯一值")
