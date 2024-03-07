from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

from app.db_mysql.mysql_models import CategoryTable


class RegisterResponse(BaseModel):
    message: str


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


class GetHomeVideoResponse(BaseModel):
    video_list: list[VideoInfo]


class GetVideoInfoResponse(BaseModel):
    video_info: VideoInfo


class GetAllCategoryResponse(BaseModel):
    categories: list["CategoryForGetAllCategoryResponse"]


@dataclass
class CategoryForGetAllCategoryResponse:
    category_name: str
    category_id: UUID
