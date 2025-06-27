from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client: AsyncIOMotorClient | None = None
db = None

async def connect_to_mongo():
    global client,db

    try:
        client = AsyncIOMotorClient(settings.MONGO_URI)
        db = client.get_default_database()

        await client.admin.command('ping')
        print("Connected to MongoDB")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise e


async def close_mongo_connection():

    if client:
        client.close()
        print("MongoDB connection closed")