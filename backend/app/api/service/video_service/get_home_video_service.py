from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
import logging
from app.db_mysql.mysql_models import UserTable, VideoTable


def get_home_video(session: Session):
    video_list = []
    statement = (
        select(VideoTable, UserTable.user_name)
        .join(UserTable, isouter=True)
        .limit(10)
        .options(selectinload(VideoTable.categories))
    )
    results = session.exec(statement)
    for video, user_name in results:
        categories = []
        for category in video.categories:
            categories.append(category.model_dump())

        result_data = video.model_dump()
        result_data.update({"user_name": user_name})
        result_data.update({"categories": categories})
        video_list.append(result_data)
        logging.info(f"{result_data=}")
    return {"video_list": video_list, "message": "success"}
