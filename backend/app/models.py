from pydantic import BaseModel, Field, EmailStr
from uuid import UUID
from datetime import datetime


class User(BaseModel):
    user_name: str
    email: EmailStr


class Token(BaseModel):
    account: str
    access_token: UUID
    access_token_expires_at: datetime
    refresh_token: UUID
    refresh_token_expires_at: datetime
    token_type: str = "bearer"
