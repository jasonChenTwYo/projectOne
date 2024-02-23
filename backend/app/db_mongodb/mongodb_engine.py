from odmantic import AIOEngine, SyncEngine
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from app.config.config import settings

db = settings.MONGO_INITDB_DATABASE
host = settings.MONGODB_HOST
user = settings.MONGO_USER
passward = settings.MONGO_PASSWORD

async_client = AsyncIOMotorClient(f"mongodb://{user}:{passward}@{host}:27017/{db}")
async_engine = AIOEngine(client=async_client, database=db)

sync_client = MongoClient(f"mongodb://{user}:{passward}@{host}:27017/{db}")
sync_engine = SyncEngine(client=sync_client, database=db)
