from uuid import UUID
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
import logging
from app.db_mysql.mysql_models import UserTable, VideoTable


def get_video_info(session: Session, vide_id: UUID):

    statement = (
        select(VideoTable, UserTable.user_name)
        .join(UserTable, isouter=True)
        .where(VideoTable.video_id == vide_id)
        .options(selectinload(VideoTable.categories))
    )
    result = session.exec(statement).one()
    video_info = result[0].model_dump()
    video_info.update({"user_name": result[1]})

    categories = []
    for category in result[0].categories:
        categories.append(category.model_dump())

    video_info.update({"categories": categories})

    return {"video_info": video_info}
