from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db_mysql.mysql_engine import get_session
from app.db_mysql.mysql_models import CategoryTable
from app.api.response import GetAllCategoryResponse


router = APIRouter()


@router.get("/get-category/all")
def get_all_category(
    *,
    session: Session = Depends(get_session),
) -> GetAllCategoryResponse:
    result = session.exec(select(CategoryTable))
    categories = []
    for category in result:
        categories.append(category.model_dump())

    return GetAllCategoryResponse(categories=categories)
