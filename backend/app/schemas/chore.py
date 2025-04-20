from pydantic import BaseModel
from typing import Optional, TYPE_CHECKING
from datetime import datetime

from app.models.chore import ChoreStatus

if TYPE_CHECKING:
    from app.schemas.senior import Senior
    from app.schemas.student import Student


class ChoreBase(BaseModel):
    title: str
    description: str
    date_needed: datetime
    estimated_duration: int
    special_instructions: Optional[str] = None


class ChoreCreate(ChoreBase):
    senior_id: int


class ChoreUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date_needed: Optional[datetime] = None
    estimated_duration: Optional[int] = None
    special_instructions: Optional[str] = None
    status: Optional[ChoreStatus] = None
    student_id: Optional[int] = None
    completed_at: Optional[datetime] = None


class ChoreInDBBase(ChoreBase):
    id: int
    senior_id: int
    student_id: Optional[int] = None
    status: ChoreStatus
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }


class Chore(ChoreInDBBase):
    pass


class ChoreWithSenior(Chore):
    senior: 'Senior'


class ChoreWithStudent(Chore):
    student: Optional['Student'] = None
