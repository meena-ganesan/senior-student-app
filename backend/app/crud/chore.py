from typing import List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.chore import Chore, ChoreStatus
from app.schemas.chore import ChoreCreate, ChoreUpdate


class CRUDChore(CRUDBase[Chore, ChoreCreate, ChoreUpdate]):
    def get_by_senior_id(
        self, db: Session, *, senior_id: int, skip: int = 0, limit: int = 100
    ) -> List[Chore]:
        return (
            db.query(self.model)
            .filter(Chore.senior_id == senior_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_student_id(
        self, db: Session, *, student_id: int, skip: int = 0, limit: int = 100
    ) -> List[Chore]:
        return (
            db.query(self.model)
            .filter(Chore.student_id == student_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_available_chores(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Chore]:
        return (
            db.query(self.model)
            .filter(Chore.status == ChoreStatus.PENDING)
            .filter(Chore.student_id.is_(None))
            .offset(skip)
            .limit(limit)
            .all()
        )


chore = CRUDChore(Chore)
