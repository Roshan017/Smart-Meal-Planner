from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

MONGO_URI = settings.MONGO_URI

client: AsyncIOMotorClient = None
database = None

async def connect_to_mongo():
    global client, database
    try:
        client = AsyncIOMotorClient(MONGO_URI)
        await client.admin.command("ping")
        database = client["SmartMealPlanner"]
        print("✅ Connected to MongoDB")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)
        database = None

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")

def get_db():
    global database
    
    return database
