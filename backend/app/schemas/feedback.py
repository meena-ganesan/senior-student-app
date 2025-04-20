from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FeedbackBase(BaseModel):
    chore_id: int
    given_by_id: int
    about_user_id: int
    rating: int
    comment: Optional[str] = None


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None


class FeedbackInDBBase(FeedbackBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class Feedback(FeedbackInDBBase):
    pass
