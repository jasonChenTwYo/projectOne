from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, EmailStr, validator
from fastapi import UploadFile, Form, Path, Query
from typing import Annotated, Optional
from dataclasses import dataclass
from uuid import UUID


class RegisterRequest(BaseModel):
    user_name: Annotated[str, Field(description="使用者名稱")]
    password_hash: str = Field(description="密碼", alias="password")
    email: EmailStr = Field(description="信箱，需唯一值")


@dataclass
class PlayVideoRequest:
    video_name: Annotated[str, Path(min_length=1, pattern=r"^\S.*$")]
    group_id: Annotated[str, Query(min_length=1, pattern=r"^\S.*$")]


@dataclass
class UploadVideoForm:
    title: Annotated[
        str,
        Form(),
    ]
    video_file: UploadFile
    thumbnail_file: UploadFile
    categories: Annotated[
        str,
        Form(),
    ]
    description: Annotated[
        Optional[str],
        Form(),
    ] = None

    def __post_init__(self):
        if self.video_file.content_type != "video/mp4":
            raise RequestValidationError("upload_file must be an MP4 file")

        if self.thumbnail_file.content_type not in ["image/jpeg", "image/png"]:
            raise RequestValidationError("thumbnail must be an image (JPEG or PNG)")
