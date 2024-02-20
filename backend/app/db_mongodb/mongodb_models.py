from odmantic import Model, Field
from datetime import datetime, timedelta


class LoginToken(Model):
    __collection__ = "login_token"
    user_id: str
    access_token: str
    access_token_expires_at: datetime = Field(
        default_factory=lambda: datetime.now() + timedelta(minutes=15)
    )
    refresh_token: str
    refresh_token_expires_at: datetime = Field(
        default_factory=lambda: datetime.now() + timedelta(days=7)
    )
    # 這是給mongodb TTL用的，因為它預設是UTC，但是台灣是UTC+8 如果用access_token_expires_at TTL 會失效
    # 但是如果 access_token_expires_at 改成UTC會不太直觀，在查看時不方便，所以就再多記這個
    expires_at: datetime = Field(
        default_factory=lambda: datetime.utcnow() + timedelta(minutes=15)
    )
