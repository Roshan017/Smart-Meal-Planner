from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api import auth, details, meals
from app.db.client import connect_to_mongo, close_mongo_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(lifespan=lifespan)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",             # Local frontend (dev)
        "https://forkcast1.netlify.app"      # Production frontend (Netlify)
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Routers
app.include_router(auth.router, prefix="/api/auth")
app.include_router(details.router, prefix="/api")
app.include_router(meals.router, prefix="/api/meals")
