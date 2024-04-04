from fastapi import APIRouter, Request, Query, Path, Depends
from fastapi.responses import StreamingResponse
from typing import Annotated
import logging

from sqlalchemy import update
from sqlmodel import Session
from app.api.service.video_service import (
    get_home_videos_service,
    get_videos_by_tag_service,
    play_video_service,
    upload_video_service,
    get_video_service,
    get_videos_by_user_service,
)
from app.api.deps import CurrentToken
from app.api.request import (
    AddReplyRequest,
    DeleteReplyRequest,
    AddVideoCommentRequest,
    DeleteVideoCommentRequest,
    DeleteVideoRequest,
    PlayVideoRequest,
    UploadVideoForm,
)
from app.db_mongodb.mongodb_models import VideoComment
from app.db_mysql.mysql_engine import get_session
from app.api.response import (
    BaseResponse,
    GetHomeVideoResponse,
    GetVideoInfoResponse,
    GetVideoListByTagResponse,
)
from fastapi import BackgroundTasks

from app.db_mysql.mysql_models import VideoTable
from app.rabbitmq import publish_message_to_rabbitmq
from app.db_mongodb import mongodb_async_dao


router = APIRouter()


@router.get("/play-video/{video_name}")
def play_video(
    request: Request,
    play_video_request: Annotated[PlayVideoRequest, Depends()],
) -> StreamingResponse:
    # 檢查請求頭中是否包含 Range 字段
    range_header = request.headers.get("Range")
    return play_video_service.play_video(range_header, play_video_request)


@router.post("/upload-video", response_model=BaseResponse)
async def upload_video(
    formdata: Annotated[UploadVideoForm, Depends()],
    current_token: CurrentToken,
    background_tasks: BackgroundTasks,
):
    rabbitmq_message = await upload_video_service.upload_video(formdata, current_token)
    background_tasks.add_task(publish_message_to_rabbitmq, rabbitmq_message)
    return {"message": "success"}


@router.get("/home/get-video", response_model=GetHomeVideoResponse)
def get_home_video(*, session: Session = Depends(get_session)):
    return get_home_videos_service.get_home_video(session)


@router.get("/tag/{category_name}", response_model=GetVideoListByTagResponse)
def get_video_by_tag(
    *,
    session: Session = Depends(get_session),
    category_name: Annotated[str, Path()],
):
    return get_videos_by_tag_service.get_videos_by_tag(session, category_name)


@router.get("/get-video/channel/{account}", response_model=GetVideoListByTagResponse)
def get_video_by_user(
    *,
    session: Session = Depends(get_session),
    account: Annotated[str, Path()],
):
    return get_videos_by_user_service.get_videos_by_user_account(session, account)


@router.get("/get-video/{video_id}", response_model=GetVideoInfoResponse)
def get_video_by_id(
    *,
    session: Session = Depends(get_session),
    video_id: Annotated[str, Path()],
):
    return get_video_service.get_video_info(session, video_id)


@router.post("/delete/video", response_model=BaseResponse)
def delete_video_by_id(
    *,
    session: Session = Depends(get_session),
    delete_video_request: DeleteVideoRequest,
    current_token: CurrentToken,
):
    statement_second = (
        update(VideoTable)
        .where(
            VideoTable.video_id == delete_video_request.video_id,
            VideoTable.user_id == current_token.user_id,
        )
        .values(title="delete")
    )

    session.exec(statement_second)
    session.commit()

    return {"message": "success"}


@router.post("/add/comment", response_model=BaseResponse)
async def add_comment(
    current_token: CurrentToken,
    request: AddVideoCommentRequest,
):
    await mongodb_async_dao.save_video_comment(
        video_id=request.video_id,
        account=current_token.account,
        comment_message=request.comment_message,
    )
    return {"message": "success"}


@router.post("/delete/comment", response_model=BaseResponse)
async def delete_comment(
    current_token: CurrentToken,
    request: DeleteVideoCommentRequest,
):
    number = await mongodb_async_dao.delete_video_comment(
        video_comment_id=request.video_comment_id,
        account=current_token.account,
    )
    logging.info(f"delete {number=}")
    return {"message": "success"}


@router.post("/add/reply", response_model=VideoComment)
async def add_reply(
    current_token: CurrentToken,
    request: AddReplyRequest,
):
    result = await mongodb_async_dao.add_reply_to_video_comment(
        video_comment_id=request.comment_id,
        account=current_token.account,
        comment_message=request.comment_message,
    )
    logging.info(f"{result=}")
    return result


@router.post("/delete/reply", response_model=VideoComment)
async def delete_reply(
    current_token: CurrentToken,
    request: DeleteReplyRequest,
):
    result = await mongodb_async_dao.delete_reply_to_video_comment(
        video_comment_id=request.video_comment_id,
        account=current_token.account,
        reply_id=request.reply_id,
    )
    logging.info(f"{result=}")
    return result


@router.get("/get-video-comment/{video_id}")
async def get_video_comment(
    video_id: Annotated[str, Path()],
    page: Annotated[int, Query()],
):
    comments = await mongodb_async_dao.find_video_comment(video_id, page)
    return {"comments": comments[0], "total": comments[1]}
