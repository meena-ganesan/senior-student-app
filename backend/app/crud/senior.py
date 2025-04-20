from typing import Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.senior import Senior
from app.schemas.senior import SeniorCreate, SeniorUpdate


class CRUDSenior(CRUDBase[Senior, SeniorCreate, SeniorUpdate]):
    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[Senior]:
        return db.query(Senior).filter(Senior.user_id == user_id).first()


senior = CRUDSenior(Senior)
