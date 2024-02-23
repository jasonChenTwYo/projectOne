from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.api.router import api_router
import logging
import traceback
from sqlalchemy.exc import NoResultFound
from fastapi.staticfiles import StaticFiles

logging.basicConfig(
    format="[%(asctime)s] %(levelname)s in %(module)s:%(lineno)d: %(message)s",
    level=logging.INFO,
)

app = FastAPI()

# app.include_router(api_router,prefix="/")
app.include_router(api_router, prefix="/api")
app.mount("/api/img", StaticFiles(directory="static/img"), name="static")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.exception_handler(500)
async def exception_handler(request: Request, exc: Exception):
    logging.error(f"Unexpected {exc=}, {type(exc)=}")
    logging.error(f"Unexpected {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"message": (f"Failed method {request.method} at URL {request.url}.")},
    )


@app.exception_handler(NoResultFound)
async def exception_handler(request: Request, exc: Exception):
    logging.error(f"Unexpected {exc=}, {type(exc)=}")
    logging.error(f"Unexpected {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"message": (f"Failed method {request.method} at URL {request.url}.")},
    )
