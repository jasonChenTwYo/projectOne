from fastapi import APIRouter
from app.api.auth import CurrentUser
from app.models import Token
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
router = APIRouter()

@router.get("/users/me")
def read_users_me(current_user: CurrentUser):
    return current_user

@router.post("/login/access-token")
def login_access_token(
   form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    
    return Token(
        access_token="test"
    )
 