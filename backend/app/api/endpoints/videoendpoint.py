from uuid import UUID
from fastapi import APIRouter, Request, Query, Path, Depends
from fastapi.responses import FileResponse, StreamingResponse
from typing import Annotated
import logging

from sqlmodel import Session
from app.api.service.video_service import (
    get_videos_by_tag_service,
    play_video_service,
    upload_video_service,
    get_home_video_service,
    get_video_service,
)
from app.api.deps import CurrentToken
from app.api.request import (
    AddRepliesRequest,
    AddVideoCommentRequest,
    PlayVideoRequest,
    UploadVideoForm,
)
from app.db_mysql.mysql_engine import get_session
from app.api.response import (
    BaseResponse,
    GetHomeVideoResponse,
    GetVideoInfoResponse,
    GetVideoListByTagResponse,
)
from fastapi import BackgroundTasks

from app.api.rabbitmq import publish_message_to_rabbitmq
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

    return get_home_video_service.get_home_video(session)


@router.get("/tag/{category_name}", response_model=GetVideoListByTagResponse)
def get_video_by_tag(
    *,
    session: Session = Depends(get_session),
    category_name: Annotated[str, Path()],
):

    return get_videos_by_tag_service.get_videos_by_tag(session, category_name)


@router.get("/get-video/{video_id}", response_model=GetVideoInfoResponse)
def get_video_by_id(
    *,
    session: Session = Depends(get_session),
    video_id: Annotated[UUID, Path()],
):

    return get_video_service.get_video_info(session, video_id)


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


@router.post("/add/replies", response_model=BaseResponse)
async def add_replies(
    current_token: CurrentToken,
    request: AddRepliesRequest,
):
    result = await mongodb_async_dao.add_reply_to_video_comment(
        video_comment_id=request.comment_id,
        account=current_token.account,
        comment_message=request.comment_message,
    )
    return result


@router.get("/get-video-comment/{video_id}")
async def get_video_comment(
    video_id: Annotated[UUID, Path()],
):
    comments = await mongodb_async_dao.find_video_comment(str(video_id))
    return {"comments": comments}
