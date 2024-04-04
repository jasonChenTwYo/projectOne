import aiofiles
from app.api.request import UploadVideoForm
from app.api.deps import CurrentToken
from app.config.config import settings
from uuid import uuid4
from datetime import datetime
from pathlib import Path
from fastapi import UploadFile
import os
import logging


async def upload_video(formdata: UploadVideoForm, current_token: CurrentToken):
    if not os.path.exists(Path(settings.IMG_TEMP_BASE_PATH)):
        os.makedirs(Path(settings.IMG_TEMP_BASE_PATH))
    if not os.path.exists(Path(settings.VIDEO_TEMP_BASE_PATH)):
        os.makedirs(Path(settings.VIDEO_TEMP_BASE_PATH))

    video_name = f"{str(uuid4())}_{datetime.now().strftime("%Y%m%d%H%M%S")}"
    thumbnail_name = f"{str(uuid4())}_{datetime.now().strftime("%Y%m%d%H%M%S")}.{get_file_extension(formdata.thumbnail_file)}"

    await write_video_and_thumbnail(
        video_name, thumbnail_name, formdata.video_file, formdata.thumbnail_file
    )

    return {
        "user_id": current_token.user_id,
        "title": formdata.title,
        "description": formdata.description,
        "video_path": video_name,
        "thumbnail_path": thumbnail_name,
        "categories": formdata.categories,
    }


def get_file_extension(file: UploadFile) -> str:
    filename = file.filename

    extension = filename.split(".")[-1] if "." in filename else ""

    return extension


async def write_video_and_thumbnail(
    video_name: str,
    thumbnail_name: str,
    video_file: UploadFile,
    thumbnail_file: UploadFile,
):
    video_name = f"{video_name}.mp4"
    video_path = Path(settings.VIDEO_TEMP_BASE_PATH) / video_name
    thumbnail_path = Path(settings.IMG_TEMP_BASE_PATH) / thumbnail_name

    try:
        async with aiofiles.open(thumbnail_path, "wb") as file_object:
            while True:
                content = await thumbnail_file.read(1024 * 1024)  # 以 1MB 讀取
                if not content:
                    break
                await file_object.write(content)

        async with aiofiles.open(video_path, "wb") as file_object:
            while True:
                content = await video_file.read(1024 * 1024)  # 以 1MB 讀取
                if not content:
                    break
                await file_object.write(content)

    except Exception as e:
        logging.exception("create error")
        if thumbnail_path.exists():
            os.remove(thumbnail_path)
        if video_path.exists():
            os.remove(video_path)
        raise e
