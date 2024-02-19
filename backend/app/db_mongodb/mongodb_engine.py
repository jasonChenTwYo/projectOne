from odmantic import AIOEngine, SyncEngine
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient

user = "appuser"
passward = "1234567"
db = "projectOne"

async_client = AsyncIOMotorClient(f"mongodb://{user}:{passward}@localhost:27017/{db}")
async_engine = AIOEngine(client=async_client, database=db)

sync_client = MongoClient(f"mongodb://{user}:{passward}@localhost:27017/{db}")
sync_engine = SyncEngine(client=sync_client, database=db)
