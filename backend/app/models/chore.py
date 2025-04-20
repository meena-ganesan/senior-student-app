from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    DateTime,
    Text,
    Enum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base


class ChoreStatus(str, enum.Enum):
    PENDING = "pending"
    MATCHED = "matched"
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Chore(Base):
    __tablename__ = "chores"

    id = Column(Integer, primary_key=True, index=True)
    senior_id = Column(Integer, ForeignKey("seniors.id"))
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
    title = Column(String)
    description = Column(Text)
    date_needed = Column(DateTime(timezone=True))
    estimated_duration = Column(Integer)  # In minutes
    special_instructions = Column(Text, nullable=True)
    status = Column(Enum(ChoreStatus), default=ChoreStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    senior = relationship("Senior", backref="chores")
    student = relationship("Student", backref="assigned_chores")
