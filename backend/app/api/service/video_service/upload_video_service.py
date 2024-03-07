from app.api.request import UploadVideoForm
from app.api.deps import CurrentToken
from app.config.config import settings
from uuid import uuid4
from datetime import datetime
from pathlib import Path
from fastapi import UploadFile
from app.db_mysql.mysql_models import VideoTable,CategoryTable
from sqlmodel import Session, col,select
import os,logging

def upload_video(formdata:UploadVideoForm,current_token: CurrentToken,session:Session):

    categories=session.exec(select(CategoryTable).where(col(CategoryTable.category_id).in_([str(item) for item in formdata.categories.split(',')]))).all()
    
    if not os.path.exists(Path(settings.VIDEO_BASE_PATH) / current_token.user_id):
        os.makedirs(Path(settings.VIDEO_BASE_PATH) / current_token.user_id)
    if not os.path.exists(Path(settings.IMG_BASE_PATH) / current_token.user_id):
        os.makedirs(Path(settings.IMG_BASE_PATH) / current_token.user_id)

    video_name = f"{str(uuid4())}_{datetime.now().strftime("%Y%m%d%H%M%S")}"
    thumbnail_name = f"{str(uuid4())}_{datetime.now().strftime("%Y%m%d%H%M%S")}.{get_file_extension(formdata.thumbnail_file)}"
   
    video_talbe=VideoTable.model_validate({"user_id":current_token.user_id,
                                           "title": formdata.title,
                                           "description" : formdata.description,
                                           "video_path" : video_name,
                                           "thumbnail_path" : thumbnail_name,
                                           })
    video_talbe.categories= categories
    logging.info(f"{video_talbe=}")
    session.add(video_talbe)
    write_video_and_thumbnail(current_token.user_id,video_name,thumbnail_name,
                                  formdata.video_file,formdata.thumbnail_file)
    session.commit()

    return {"message": "success", "video_name": video_name}


def get_file_extension(file: UploadFile) -> str:
   
    filename = file.filename

    extension = filename.split('.')[-1] if '.' in filename else ''
    
    return extension

def write_video_and_thumbnail(user_id:str,video_name:str,thumbnail_name:str,video_file:UploadFile,thumbnail_file:UploadFile):
    video_name = f"{video_name}.mp4"
    video_path = Path(settings.VIDEO_BASE_PATH) /user_id/video_name
    thumbnail_name = f"{thumbnail_name}"
    thumbnail_path =  Path(settings.IMG_BASE_PATH) /user_id/thumbnail_name

    try:
        with open(
            thumbnail_path,
            "wb+",
        ) as file_object:
            file_object.write(thumbnail_file.file.read())

        with open(
            video_path,
            "wb+",
        ) as file_object:
            file_object.write(video_file.file.read())
    except Exception as e:
        logging.exception("create error")
        if thumbnail_path.exists():
            os.remove(thumbnail_path)
        if video_path.exists():
            os.remove(video_path)
        raise e

