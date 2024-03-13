from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db_mysql.mysql_engine import get_session
from app.db_mysql.mysql_models import CategoryTable
from app.api.response import GetAllCategoryResponse


router = APIRouter()


@router.get("/get-category/all", response_model=GetAllCategoryResponse)
def get_all_category(
    *,
    session: Session = Depends(get_session),
):
    result = session.exec(select(CategoryTable))
    categories = []
    for category in result:
        categories.append(category.model_dump())

    return GetAllCategoryResponse(categories=categories, message="success")
