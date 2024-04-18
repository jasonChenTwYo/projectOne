from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    TOKEN_URL: str = "/login/access-token"

    MYSQL_DATABASE: str = "projectOne"
    MYSQL_HOST: str = "localhost"
    MYSQL_USER: str = "appuser"
    MYSQL_PASSWORD_FILE: str = "../mysql/mysql_password.txt"

    MONGO_INITDB_DATABASE: str = "projectOne"
    MONGODB_HOST: str = "localhost"
    MONGO_USER: str = "appuser"
    MONGO_PASSWORD: str = "1234567"

    VIDEO_BASE_PATH: str = "static/video"
    VIDEO_TEMP_BASE_PATH: str = "static/temp/video"
    IMG_BASE_PATH: str = "static/img"
    IMG_TEMP_BASE_PATH: str = "static/temp/img"

    RABBITMQ_HOST: str = "localhost"
    RABBITMQ_DEFAULT_USER: str = "user"
    RABBITMQ_DEFAULT_PASS: str = "password"


settings = Settings()
