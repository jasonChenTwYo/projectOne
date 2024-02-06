from fastapi import FastAPI
from app.api.router import api_router
import logging

logging.basicConfig(format='[%(asctime)s] %(levelname)s in %(module)s:%(lineno)d: %(message)s', level=logging.INFO)

app = FastAPI()

#app.include_router(api_router,prefix="/")
app.include_router(api_router)

@app.get("/")
def read_root(): 
    return {"Hello": "World"}