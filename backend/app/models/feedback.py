from sqlalchemy import Column, ForeignKey, Integer, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    chore_id = Column(Integer, ForeignKey("chores.id"))
    given_by_id = Column(Integer, ForeignKey("users.id"))
    about_user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)  # 1-5 stars
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    chore = relationship("Chore", backref="feedback")
    given_by = relationship(
        "User", foreign_keys=[given_by_id], backref="feedback_given"
    )
    about_user = relationship(
        "User", foreign_keys=[about_user_id], backref="feedback_received"
    )
