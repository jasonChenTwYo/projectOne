from dataclasses import dataclass
from pydantic import BaseModel

class User(BaseModel):
    id: int
    hashed_password: str
  
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"