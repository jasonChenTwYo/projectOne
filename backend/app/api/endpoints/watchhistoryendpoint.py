from datetime import date, datetime
from typing import Annotated
from fastapi import APIRouter, Depends, Path
from sqlalchemy import desc
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from app.api.deps import CurrentToken
from app.db_mysql.mysql_engine import get_session
from app.db_mysql.mysql_models import (
    CategoryTable,
    UserTable,
    VideoCategoryAssociationTable,
    VideoTable,
    WatchHistoryTable,
)


router = APIRouter()


@router.get("/history/{page_number}")
def get_watch_history(
    *,
    session: Session = Depends(get_session),
    current_token: CurrentToken,
    page_number: Annotated[int, Path()],
):

    offset_value = (page_number - 1) * 5

    watch_history_subquery = (
        select(WatchHistoryTable.video_id, WatchHistoryTable.watch_time)
        .where(
            WatchHistoryTable.user_id == current_token.user_id,
        )
        .offset(offset_value)
        .order_by(desc(WatchHistoryTable.watch_time))
        .limit(5)
        .subquery()
    )
    statement = (
        select(VideoTable, watch_history_subquery.c.watch_time)
        .join(
            watch_history_subquery,
            watch_history_subquery.c.video_id == VideoTable.video_id,
        )
        .join(UserTable, VideoTable.user_id == UserTable.user_id, isouter=True)
        .join(VideoCategoryAssociationTable, isouter=True)
        .join(CategoryTable, isouter=True)
        .order_by(desc(watch_history_subquery.c.watch_time))
        .options(selectinload(VideoTable.categories))
        .distinct()
    )
    video_list = []
    results = session.exec(statement)
    for video_info, watch_time in results:
        categories = []
        for category in video_info.categories:
            categories.append(category.model_dump())
        data = video_info.model_dump()
        data["watch_time"] = watch_time
        data["categories"] = categories
        video_list.append(data)
    return {"message": "success", "video_list": video_list}


@router.post("/add-history/{video_id}")
def add_watch_history(
    *,
    session: Session = Depends(get_session),
    current_token: CurrentToken,
    video_id: Annotated[str, Path()],
):
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())
    statement = select(WatchHistoryTable).where(
        WatchHistoryTable.user_id == current_token.user_id,
        WatchHistoryTable.video_id == video_id,
        WatchHistoryTable.watch_time >= today_start,
        WatchHistoryTable.watch_time <= today_end,
    )

    results = session.exec(statement).all()

    if results:
        for index, watch_history in enumerate(results):
            if index == 0:
                watch_history.watch_time = datetime.now()
                session.add(watch_history)
            else:
                session.delete(watch_history)
    else:
        new_watch_history = WatchHistoryTable(
            user_id=current_token.user_id,
            video_id=video_id,
        )
        session.add(new_watch_history)

    session.commit()
    return {"message": "success"}
