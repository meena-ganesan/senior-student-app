from pydantic import BaseModel
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.schemas.user import User


class SeniorBase(BaseModel):
    needs: str  # JSON string of needs
    mobility_status: Optional[str] = ""
    emergency_contact_name: str
    emergency_contact_phone: str


class SeniorCreate(SeniorBase):
    user_id: Optional[int] = None


class SeniorUpdate(BaseModel):
    needs: Optional[str] = None
    mobility_status: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None


class SeniorInDBBase(SeniorBase):
    id: int
    user_id: int

    model_config = {
        "from_attributes": True
    }


class Senior(SeniorInDBBase):
    pass


class SeniorWithUser(Senior):
    user: 'User'
