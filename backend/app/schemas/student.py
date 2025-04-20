from pydantic import BaseModel
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.user import User


class StudentBase(BaseModel):
    school_name: str
    grade: int
    skills: str
    availability: Optional[str] = ""  # JSON string of availability


class StudentCreate(StudentBase):
    user_id: Optional[int] = None
    parent_consent: bool = False


class StudentUpdate(BaseModel):
    school_name: Optional[str] = None
    grade: Optional[int] = None
    skills: Optional[str] = None
    availability: Optional[str] = None
    background_check_status: Optional[str] = None
    parent_consent: Optional[bool] = None
    service_hours: Optional[int] = None


class StudentInDBBase(StudentBase):
    id: int
    user_id: int
    background_check_status: Optional[str] = "pending"
    parent_consent: bool = False
    service_hours: int = 0

    model_config = {
        "from_attributes": True
    }


class Student(StudentInDBBase):
    pass


class StudentWithUser(Student):
    user: 'User'
