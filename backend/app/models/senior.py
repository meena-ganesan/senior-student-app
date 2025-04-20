from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
# No need for func import

from app.db.session import Base


class Senior(Base):
    __tablename__ = "seniors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    needs = Column(Text, default="")  # JSON string of needs
    mobility_status = Column(String, default="")
    emergency_contact_name = Column(String, default="")
    emergency_contact_phone = Column(String, default="")

    # Relationship
    user = relationship("User", backref="senior_profile")
