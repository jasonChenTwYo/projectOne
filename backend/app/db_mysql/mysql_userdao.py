from sqlmodel import Session, select
from app.db_mysql.mysql_models import UserTable


def find_user_by_email(email: str, session: Session) -> UserTable:
    statement = select(UserTable).where(UserTable.email == email)
    results = session.exec(statement)
    user = results.one()
    return user


def create_user(user: UserTable, session: Session):
    # https://docs.pydantic.dev/latest/concepts/models/#helper-functions
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
