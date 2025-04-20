from typing import Optional

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate


class CRUDStudent(CRUDBase[Student, StudentCreate, StudentUpdate]):
    def get_by_user_id(
        self, db: Session, *, user_id: int
    ) -> Optional[Student]:
        return db.query(Student).filter(Student.user_id == user_id).first()


student = CRUDStudent(Student)
