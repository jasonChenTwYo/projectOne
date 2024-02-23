from fastapi import APIRouter, HTTPException, status, Depends
from app.api.deps import CurrentToken
from app.models import Token
from app.db_mysql.mysql_models import UserTable
from app.api.request import RegisterRequest
from app.api.response import RegisterResponse
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
import logging
from uuid import uuid4
from app.api.utils import get_password_hash, verify_password
from app.db_mysql.mysql_userdao import create_user, find_user_by_email
from app.db_mongodb import mongodb_sync_dao, mongodb_async_dao
import os
from pathlib import Path

from app.config.config import settings

router = APIRouter()


@router.post("/login/access-token")
def login_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    user = find_user_by_email(form_data.username)

    if not verify_password(form_data.password, user.password_hash):
        logging.error("驗證失敗")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    if mongodb_sync_dao.find_login_token(user.user_id):
        mongodb_sync_dao.delete_login_token(user.user_id)
    access_token = uuid4()
    refresh_token = uuid4()
    return mongodb_sync_dao.save_login_token(user.user_id, access_token, refresh_token)


@router.post("/logout")
async def logout(current_token: CurrentToken):
    await mongodb_async_dao.delete_login_token(current_token.user_id)
    return {"message": "logoutSuccess"}


@router.post("/register", response_model=RegisterResponse)
def register(request: RegisterRequest):

    request.password_hash = get_password_hash(request.password_hash)
    user = UserTable.model_validate(request)

    user = create_user(user)

    os.makedirs(Path(settings.VIDEO_BASE_PATH) / str(user.user_id))

    return {"message": "success"}
