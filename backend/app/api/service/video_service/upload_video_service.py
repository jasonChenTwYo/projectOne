from app.api.request import UploadVideoForm
from app.api.deps import CurrentToken
from app.config.config import settings
from uuid import uuid4
from datetime import datetime
from pathlib import Path
from fastapi import UploadFile
from app.db_mysql.mysql_models import VideoTable
from sqlmodel import Session
from app.db_mysql.mysql_engine import engine

def upload_video(formdata:UploadVideoForm,current_token: CurrentToken):

    video_name = f"{str(uuid4())}_{datetime.now().strftime("%Y%m%d%H%M%S")}"
    thumbnail_name = f"{str(uuid4())}_{datetime.now().strftime("%Y%m%d%H%M%S")}.{get_file_extension(formdata.thumbnail_file)}"

    video_talbe=VideoTable.model_validate({"user_id":current_token.user_id,
                                           "title": formdata.title,
                                           "description" : formdata.description,
                                           "category_id" : formdata.category_id,
                                           "video_path" : video_name,
                                           "thumbnail_path" : thumbnail_name,
                                           })
    with Session(engine) as session:
        session.begin()
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
    thumbnail_name = f"{thumbnail_name}.{get_file_extension(thumbnail_file)}"
    with open(
        Path(settings.IMG_BASE_PATH) /user_id/thumbnail_name,
        "wb+",
    ) as file_object:
        file_object.write(thumbnail_file.file.read())

    with open(
        Path(settings.VIDEO_BASE_PATH) /user_id/video_name,
        "wb+",
    ) as file_object:
        file_object.write(video_file.file.read())
