from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Column, String
from datetime import datetime
from pydantic import ConfigDict, EmailStr


class UserTable(SQLModel, table=True):
    __tablename__ = "users"
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID = Field(default_factory=lambda: uuid4(), primary_key=True)
    user_name: str  # = Field(sa_column=Column(name="user_name"))
    email: EmailStr = Field(sa_column=Column(String))
    password_hash: str
    create_time: datetime = Field(default_factory=lambda: datetime.today())


class CategoryTable(SQLModel, table=True):
    __tablename__ = "categories"
    model_config = ConfigDict(from_attributes=True)

    category_id: UUID = Field(default_factory=lambda: uuid4(), primary_key=True)
    category_name: str


class VideoTable(SQLModel, table=True):
    __tablename__ = "videos"
    model_config = ConfigDict(from_attributes=True)

    video_id: UUID = Field(default_factory=lambda: uuid4(), primary_key=True)
    user_id: UUID
    category_id: UUID
    title: str
    description: Optional[str] = None
    upload_time: Optional[str] = Field(default_factory=lambda: datetime.today())
    video_path: str
    thumbnail_path: str


# class Comment(SQLModel, table=True):
#     id: UUID = Field(default_factory=lambda: uuid4(), primary_key=True)
#     video_id: UUID = Field(foreign_key="video.id")
#     user_id: UUID = Field(foreign_key="user.id")
#     comment_text: str
#     comment_time: Optional[str] = Field(default=None)

# class WatchHistory(SQLModel, table=True):
#     id: UUID = Field(default_factory=lambda: uuid4(), primary_key=True)
#     user_id: UUID = Field(foreign_key="user.id")
#     video_id: UUID = Field(foreign_key="video.id")
#     watch_time: Optional[str] = Field(default=None)
