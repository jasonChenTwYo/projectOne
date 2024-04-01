from app.db_mongodb.mongodb_engine import sync_engine
from app.db_mongodb.mongodb_models import LoginToken
from uuid import UUID
import logging


def save_login_token(
    account: str, user_id: str, access_token: UUID, refresh_token: UUID
) -> LoginToken:
    login_token = LoginToken(
        account=account,
        user_id=user_id,
        access_token=str(access_token),
        refresh_token=str(refresh_token),
    )
    sync_engine.save(login_token)
    return login_token


def find_login_token(user_id: UUID):
    login_token = sync_engine.find_one(LoginToken, LoginToken.user_id == str(user_id))
    return login_token


def delete_login_token(user_id: UUID):
    sync_engine.remove(LoginToken, LoginToken.user_id == str(user_id), just_one=True)
