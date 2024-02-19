from sqlmodel import create_engine
import os

database = os.getenv("MYSQL_DATABASE", "projectOne")
host = os.getenv("MYSQL_HOST", "localhost")
user = os.getenv("MYSQL_USER", "appuser")
with open(os.getenv("MYSQL_PASSWORD_FILE", "../mysql/mysql_password.txt"), "r") as file:
    mysql_password = file.read().strip()
# https://docs.sqlalchemy.org/en/14/core/engines.html#database-urls
# dialect+driver://username:password@host:port/database
# https://docs.sqlalchemy.org/en/14/core/engines.html#mysql
# https://docs.sqlalchemy.org/en/14/dialects/mysql.html#module-sqlalchemy.dialects.mysql.mysqlconnector
# PyMySQL
DATABASE_URL = f"mysql+pymysql://{user}:{mysql_password}@{host}/{database}"

engine = create_engine(DATABASE_URL, echo=True)
