from fastapi import APIRouter

from app.api.endpoints import userendpoint

api_router = APIRouter()
api_router.include_router(userendpoint.router, tags=["login"])
