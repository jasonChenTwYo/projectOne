from sqlmodel import create_engine


from app.config.config import settings

database = settings.MYSQL_DATABASE
host = settings.MYSQL_HOST
user = settings.MYSQL_USER
with open(settings.MYSQL_PASSWORD_FILE, "r") as file:
    mysql_password = file.read().strip()
# https://docs.sqlalchemy.org/en/14/core/engines.html#database-urls
# dialect+driver://username:password@host:port/database
# https://docs.sqlalchemy.org/en/14/core/engines.html#mysql
# https://docs.sqlalchemy.org/en/14/dialects/mysql.html#module-sqlalchemy.dialects.mysql.mysqlconnector
# PyMySQL
DATABASE_URL = f"mysql+pymysql://{user}:{mysql_password}@{host}/{database}"

engine = create_engine(DATABASE_URL, echo=True)
