from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
# No need for func import

from app.db.session import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    school_name = Column(String, default="")
    grade = Column(Integer, default=0)
    skills = Column(Text, default="")  # Comma separated skills
    availability = Column(Text, default="")  # JSON string of availability
    background_check_status = Column(String, default="pending")
    parent_consent = Column(Boolean, default=False)
    service_hours = Column(Integer, default=0)

    # Relationship
    user = relationship("User", backref="student_profile")
