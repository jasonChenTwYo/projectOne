from pydantic import BaseModel, Field


class RegisterResponse(BaseModel):
    message: str
