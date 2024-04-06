from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app import rabbitmq
from app.api.router import api_router
import logging
import traceback
from fastapi.staticfiles import StaticFiles

logging.basicConfig(
    format="[%(asctime)s] %(levelname)s in %(module)s:%(lineno)d: %(message)s",
    level=logging.INFO,
)

app = FastAPI(
    servers=[
        {"url": "/", "description": "local environment"},
        {"url": "/api", "description": "dev environment"},
    ]
)

# app.include_router(api_router,prefix="/")
app.include_router(api_router)
app.mount("/img", StaticFiles(directory="static/img"), name="static")

rabbitmq.init_queue()


@app.exception_handler(500)
async def exception_handler(request: Request, exc: Exception):
    logging.error(f"Unexpected {exc=}, {type(exc)=}")
    logging.error(f"Unexpected {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"message": (f"Failed method {request.method} at URL {request.url}.")},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logging.error(f"Failed method {request.method} at URL {request.url}.")
    logging.error(f"detail {exc.errors()}, {type(exc)=}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors()}),
    )
