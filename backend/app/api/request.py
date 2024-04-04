from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, EmailStr, validator
from fastapi import UploadFile, Form, Path, Query
from typing import Annotated, Optional
from dataclasses import dataclass


class AddCommentRequest(BaseModel):
    account: str = Field(description="帳號")
    user_name: Annotated[str, Field(description="使用者名稱")]
    password_hash: str = Field(description="密碼", alias="password")
    email: EmailStr = Field(description="信箱，需唯一值")


class AddVideoCommentRequest(BaseModel):
    video_id: str
    comment_message: str


class DeleteVideoRequest(BaseModel):
    video_id: str


@dataclass
class GetUserInfoRequest:
    account: Annotated[
        Optional[str], Query(description="使用者帳號,跟使用者id只能二選一")
    ] = None
    user_id: Annotated[
        Optional[str], Query(description="使用者id,跟使用者帳號只能二選一")
    ] = None

    # __post_init__ 方法會在自動生成的 __init__ 方法完成實例屬性設置之後自動調用。
    def __post_init__(self):
        if (self.account is None) & (self.user_id is None):
            raise RequestValidationError("account 跟 user_id 需有一個有值")
        if (self.account is not None) & (self.user_id is not None):
            raise RequestValidationError("account 跟 user_id 只能擇一")


class DeleteVideoCommentRequest(BaseModel):
    video_comment_id: str


class AddReplyRequest(BaseModel):
    comment_id: str
    comment_message: str


class DeleteReplyRequest(BaseModel):
    video_comment_id: str
    reply_id: str


class RegisterRequest(BaseModel):
    account: str = Field(description="帳號")
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
