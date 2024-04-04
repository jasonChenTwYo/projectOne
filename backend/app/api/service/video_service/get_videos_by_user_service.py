from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from app.db_mysql.mysql_models import (
    CategoryTable,
    UserTable,
    VideoCategoryAssociationTable,
    VideoTable,
)


def get_videos_by_user_account(session: Session, account: str):
    video_list = []
    statement = (
        select(VideoTable, UserTable.user_name)
        .join(UserTable, VideoTable.user_id == UserTable.user_id, isouter=True)
        .join(VideoCategoryAssociationTable, isouter=True)
        .join(CategoryTable, isouter=True)
        .where(UserTable.account == account, VideoTable.title != "delete")
        .distinct()
        .options(selectinload(VideoTable.categories))
    )
    result = session.exec(statement)
    for video, user_name in result:
        categories = []
        for category in video.categories:
            categories.append(category.model_dump())

        result_data = video.model_dump()
        result_data.update({"user_name": user_name})
        result_data.update({"categories": categories})
        video_list.append(result_data)
    return {"video_list": video_list, "message": "success"}
