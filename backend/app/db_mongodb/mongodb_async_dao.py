from app.db_mongodb.mongodb_engine import async_engine
from app.db_mongodb.mongodb_models import LoginToken


async def find_login_token_by_access_token(access_token: str) -> LoginToken:
    login_token = await async_engine.find_one(
        LoginToken, LoginToken.access_token == access_token
    )
    return login_token


async def delete_login_token(user_id: str):
    await async_engine.remove(
        LoginToken, LoginToken.user_id == str(user_id), just_one=True
    )
