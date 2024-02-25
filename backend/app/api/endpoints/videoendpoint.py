from fastapi import APIRouter, Request, HTTPException, Query, Path, Depends
from fastapi.responses import FileResponse, StreamingResponse
from typing import Annotated
import logging

from sqlmodel import Session
from app.api.service.video_service import play_video_service, upload_video_service
from app.api.deps import CurrentToken
from app.api.request import PlayVideoRequest, UploadVideoForm
from app.db_mysql.mysql_engine import get_session

router = APIRouter()


@router.get("/play-video/{video_name}")
def play_video(
    request: Request,
    play_video_request: Annotated[PlayVideoRequest, Depends()],
) -> StreamingResponse:

    # 檢查請求頭中是否包含 Range 字段
    range_header = request.headers.get("Range")
    return play_video_service.play_video(range_header, play_video_request)


@router.post("/upload-video")
def upload_video(
    *,
    session: Session = Depends(get_session),
    formdata: Annotated[UploadVideoForm, Depends()],
    current_token: CurrentToken,
):

    return upload_video_service.upload_video(formdata, current_token, session)
