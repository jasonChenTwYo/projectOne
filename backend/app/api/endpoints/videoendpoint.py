from fastapi import (
    APIRouter,
    Request,
    Response,
    HTTPException,
    Query,
    Path,
    Form,
    UploadFile,
)
from fastapi.responses import FileResponse, StreamingResponse
from typing import Annotated
import logging, os
from app.api.service.video_service import play_video_service
from uuid import uuid4, UUID
from datetime import datetime

from app.api.deps import CurrentToken
from app.config.config import settings

router = APIRouter()


@router.get("/play-video/{video_name}")
def play_video(
    request: Request,
    video_name: Annotated[str, Path(min_length=1, pattern=r"^\S.*$")],
    group_id: Annotated[str, Query(min_length=1, pattern=r"^\S.*$")],
) -> StreamingResponse:

    # 檢查請求頭中是否包含 Range 字段
    range_header = request.headers.get("Range")
    return play_video_service.play_video(range_header, video_name, group_id)


@router.post("/upload-video")
def upload_video(upload_file: UploadFile, current_token: CurrentToken):
    if upload_file.content_type != "video/mp4":
        raise HTTPException(
            status_code=400,
            detail="File format not supported. Please upload an MP4 file.",
        )
    with open(
        f"{settings.VIDEO_BASE_PATH}/{current_token.user_id}/{str(uuid4())}_{datetime.now().strftime("%Y%m%d%H%M%S")}.mp4",
        "wb+",
    ) as file_object:
        file_object.write(upload_file.file.read())
    return {"message": "success"}
