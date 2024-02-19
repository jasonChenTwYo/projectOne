from odmantic import AIOEngine, SyncEngine
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os

db = os.getenv("MONGO_INITDB_DATABASE", "projectOne")
host = os.getenv("MONGODB_HOST", "localhost")
user = os.getenv("MONGO_USER", "appuser")
passward = os.getenv("MONGO_PASSWORD", "1234567")

async_client = AsyncIOMotorClient(f"mongodb://{user}:{passward}@{host}:27017/{db}")
async_engine = AIOEngine(client=async_client, database=db)

sync_client = MongoClient(f"mongodb://{user}:{passward}@{host}:27017/{db}")
sync_engine = SyncEngine(client=sync_client, database=db)
