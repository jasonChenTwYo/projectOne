from sqlmodel import create_engine
import os

environment = os.getenv("ENVIRONMENT", "dev")

database = "projectOne"
host = "localhost"
user = "appuser"
# pf = open('/run/secrets/mysql_password', 'r')
pf = "1234567"
# https://docs.sqlalchemy.org/en/14/core/engines.html#database-urls
# dialect+driver://username:password@host:port/database
# https://docs.sqlalchemy.org/en/14/core/engines.html#mysql
# https://docs.sqlalchemy.org/en/14/dialects/mysql.html#module-sqlalchemy.dialects.mysql.mysqlconnector
# PyMySQL
DATABASE_URL = f"mysql+pymysql://{user}:{pf}@{host}/{database}"

engine = create_engine(DATABASE_URL, echo=True)
