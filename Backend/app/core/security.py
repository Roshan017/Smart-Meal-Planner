from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timezone, timedelta
from app.core.config import settings
from bson import ObjectId
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.models.user import UserInDB
from app.db.client import get_db




oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/signin")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")


ACCESS_TOKEN_EXPIRE_MINS = 60*24 # 60 minutes * 24 hours = 1 day


SECRET_KEY = settings.JWT_SECRET_KEY

ALGO = "HS256"

def hash_password(password: str)->str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str)->bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode  = data.copy()

    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINS))
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGO)

    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
        return payload
    except JWTError:
        return None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code= 401,
                detail="Invalid Token Patload"

            )
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token is invalid or has expired"
        )
    
    db = get_db()

    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(
            status_code= 404,
            detail="User not found"
        )
    return user