from sqlmodel import Session, select
from app.db_mysql.mysql_engine import engine
from app.db_mysql.mysql_models import VideoTable


def create_video(video: VideoTable) -> VideoTable:
    with Session(engine) as session:
        session.add(video)
        session.commit()
        session.refresh(video)
        return video
