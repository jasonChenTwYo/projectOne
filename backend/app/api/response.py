from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


@dataclass
class VideoInfo:
    video_id: UUID
    video_path: str
    user_id: UUID
    user_name: str
    title: str
    description: Optional[str]
    upload_time: datetime
    thumbnail_path: str
    categories: list["Category"]


@dataclass
class Category:
    category_name: str


class BaseResponse(BaseModel):
    message: str = "success"


class UserInfoResponse(BaseResponse):
    account: str
    email: str
    user_name: str


class GetHomeVideoResponse(BaseResponse):
    video_list: list[VideoInfo]


class GetVideoListByTagResponse(BaseResponse):
    video_list: list[VideoInfo]


class GetVideoInfoResponse(BaseResponse):
    video_info: VideoInfo


class GetAllCategoryResponse(BaseResponse):
    categories: list["CategoryForGetAllCategoryResponse"]


@dataclass
class CategoryForGetAllCategoryResponse:
    category_name: str
    category_id: UUID
