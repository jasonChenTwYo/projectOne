from fastapi import APIRouter

from app.api.endpoints import (
    userendpoint,
    videoendpoint,
    categoryendpoint,
    watchhistoryendpoint,
)

api_router = APIRouter()
api_router.include_router(userendpoint.router)
api_router.include_router(videoendpoint.router)
api_router.include_router(categoryendpoint.router)
api_router.include_router(watchhistoryendpoint.router)
