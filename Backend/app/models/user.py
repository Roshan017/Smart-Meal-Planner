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
class DayPlan(BaseModel):
    meals: List[Dict]
    nutrients: Dict
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class MealItem(BaseModel):
    id: int
    title: str
    image: str
    calories: float
    date_added: Optional[str]  # Always ISO formatted string

    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }



class UserPublic(BaseModel):
    id: Optional[str]
    image_url: Optional[str]
    username: str
    email: Optional[EmailStr] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    diet: Optional[str] = None
    cuisine: Optional[str] = None
    created_at: Optional[datetime] = None
    activity_level: Optional[str] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None
    goal: Optional[str] = None
    calorie_target: Optional[float] = None
    selected_meals: List[MealItem] = []
    cal_remaining: Optional[float] = None
    
    
    day_plan: Optional[DayPlan] = None
    day_plan_generated_at: Optional[datetime] = None
    week_plan: Optional[Dict[str, Dict]] = Field(default_factory=dict)

    class Config:
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }


   
class UserDetails(BaseModel):
    image_url: Optional[str] = None
    age: int = Field(..., ge=10, le = 100)
    gender: Literal["male", "Female"]
    height_cm: int = Field(..., gt=100)
    weight_kg: int = Field(...,gt = 5)
    activity_level: Literal["sedentary", "light", "moderate", "active", "very_active"]
    goal: Literal["Maintain", "Lose-Weight", "Gain-Weight"]
    cuisine: Optional[str] = None
    dietary_preferences: Optional[str] = None
    bmr: Optional[float] = None
    tdee: Optional[float] = None
    calorie_target: Optional[float] = None
    day_plan: Optional[DayPlan] = None
    day_plan_generated_at: Optional[datetime] = None
    week_plan: Optional[List[Dict]] = Field(default_factory=list)

    