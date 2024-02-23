from fastapi import APIRouter

from app.api.endpoints import userendpoint, videoendpoint

api_router = APIRouter()
api_router.include_router(userendpoint.router)
api_router.include_router(videoendpoint.router)
