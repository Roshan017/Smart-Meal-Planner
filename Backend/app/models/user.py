from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal, List, Dict, Union
from bson import ObjectId
from datetime import datetime


class UserInDB(BaseModel):
    id: Optional[str] = Field(alias="_id")
    username: str
    email: EmailStr
    hashed_password: str
    created_at: Optional[datetime] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: Optional[str]
    username: str
    email: Optional[EmailStr] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None
    goal: Optional[str]  = None
    calorie_target: Optional[float] = None
    selected_meals: Optional[List[Dict[str, Union[int, str, float]]]] = []
    cal_remaining: Optional[int] = None
   
class UserDetails(BaseModel):
    age: int = Field(..., ge=10, le = 100)
    gender: Literal["male", "Female", "Other"]
    height_cm: int = Field(..., gt=100)
    weight_kg: int = Field(...,gt = 5)
    activity_level: Literal["sedentary", "light", "moderate", "active", "very_active"]
    goal: Literal["Maintain", "Lose-Weight", "Gain-Weight"]
    dietary_preferences: Optional[str] = None
    bmr: Optional[float] = None
    tdee: Optional[float] = None
    calorie_target: Optional[float] = None
    