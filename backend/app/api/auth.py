from typing import Annotated
from fastapi import Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.models import User
import logging



oauth2_token  = OAuth2PasswordBearer(
    tokenUrl="/login/access-token"
)

TokenDep = Annotated[str, Depends(oauth2_token)]

def get_current_user(token: TokenDep) -> User:
    logging.info("token:"+token)
    user = User(id=1,hashed_password="SSS")
    if not token:
       user = User(id=1,hashed_password="")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]