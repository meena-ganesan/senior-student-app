from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

from app.models.user import UserType
from app.schemas.student import StudentCreate
from app.schemas.senior import SeniorCreate


class UserBase(BaseModel):
    email: EmailStr
    user_type: UserType
    first_name: str
    last_name: str
    phone: str
    address: str
    city: str
    state: str
    zip_code: str


class UserCreate(UserBase):
    password: str
    student_profile: Optional[StudentCreate] = None
    senior_profile: Optional[SeniorCreate] = None


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    is_active: Optional[bool] = None
    is_approved: Optional[bool] = None


class UserInDBBase(UserBase):
    id: int
    is_active: bool
    is_approved: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }


class User(UserInDBBase):
    pass


class UserInDB(UserInDBBase):
    password: str
