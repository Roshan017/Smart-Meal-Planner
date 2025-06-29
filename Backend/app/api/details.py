from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import UserDetails
from app.core.security import   get_current_user
from app.db.client import get_db

from bson import ObjectId

router = APIRouter()

@router.post("/details", response_model=UserDetails)
async def set_user_details(prefs: UserDetails, current_user: dict = Depends(get_current_user)):
    db = get_db()

    user_id = ObjectId(current_user["_id"])

    data = prefs.model_dump()

    data["user_id"] = user_id

    await db['user_details'].update_one(
        {"user_id": user_id},
        {"$set": data},
        upsert=True
    )
    print("Details saved successfully")

    return prefs
