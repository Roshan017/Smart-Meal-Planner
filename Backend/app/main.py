from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api import auth, details, meals
from app.db.client import connect_to_mongo, close_mongo_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router, prefix="/api/auth")

app.include_router(details.router, prefix="/api")

app.include_router(meals.router, prefix="/api/meals")

