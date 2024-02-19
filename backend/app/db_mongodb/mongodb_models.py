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
