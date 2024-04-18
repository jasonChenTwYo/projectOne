from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.db_mongodb.mongodb_models import LoginToken
from app.db_mongodb import mongodb_async_dao
from app.config.config import settings
from datetime import datetime
import logging

oauth2_token = OAuth2PasswordBearer(tokenUrl=settings.TOKEN_URL)

TokenDep = Annotated[str, Depends(oauth2_token)]


async def get_login_token(token: TokenDep) -> LoginToken:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="UNAUTHORIZED",
        )
    login_token = await mongodb_async_dao.find_login_token_by_access_token(token)
    if not login_token:
        logging.error(f"沒找到 {token=}")
        raise HTTPException(status_code=404, detail="token not found")
    if login_token.access_token_expires_at < datetime.now():
        logging.error(f"過期 {token=} {login_token.access_token_expires_at=}")
        raise HTTPException(status_code=404, detail="token not found")
    return login_token


CurrentToken = Annotated[LoginToken, Depends(get_login_token)]
