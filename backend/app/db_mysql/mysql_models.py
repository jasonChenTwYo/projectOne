from typing import Optional, List
from uuid import UUID, uuid4
from sqlmodel import Relationship, SQLModel, Field, Column, String
from datetime import datetime
from pydantic import ConfigDict, EmailStr


class UserTable(SQLModel, table=True):
    __tablename__ = "user"
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID = Field(default_factory=lambda: uuid4(), primary_key=True)
    account: str
    user_name: str  # = Field(sa_column=Column(name="user_name"))
    email: EmailStr = Field(sa_column=Column(String))
    password_hash: str
    create_time: datetime = Field(default_factory=lambda: datetime.today())


class VideoCategoryAssociationTable(SQLModel, table=True):
    __tablename__ = "video_category_association"
    model_config = ConfigDict(from_attributes=True)

    video_id: UUID = Field(foreign_key="video.video_id", primary_key=True)
    category_id: UUID = Field(foreign_key="category.category_id", primary_key=True)


class CategoryTable(SQLModel, table=True):
    __tablename__ = "category"
    model_config = ConfigDict(from_attributes=True)

    category_id: UUID = Field(default_factory=lambda: uuid4(), primary_key=True)
    category_name: str


class VideoTable(SQLModel, table=True):
    __tablename__ = "video"
    model_config = ConfigDict(from_attributes=True)

    video_id: UUID = Field(default_factory=lambda: uuid4(), primary_key=True)
    user_id: UUID = Field(foreign_key="user.user_id")
    title: str
    description: Optional[str]
    upload_time: datetime = Field(default_factory=lambda: datetime.today())
    video_path: str
    thumbnail_path: str

    categories: List[CategoryTable] = Relationship(
        link_model=VideoCategoryAssociationTable
    )


# class WatchHistory(SQLModel, table=True):
#     id: UUID = Field(default_factory=lambda: uuid4(), primary_key=True)
#     user_id: UUID = Field(foreign_key="user.id")
#     video_id: UUID = Field(foreign_key="video.id")
#     watch_time: Optional[str] = Field(default=None)
