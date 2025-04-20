from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.models.user import UserType

router = APIRouter()


@router.post("/", response_model=schemas.Chore)
def create_chore(
    *,
    db: Session = Depends(deps.get_db),
    chore_in: schemas.ChoreCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new chore.
    """
    # Check if current user is a senior and the senior_id matches
    if current_user.user_type != UserType.SENIOR:
        raise HTTPException(
            status_code=403,
            detail="Only seniors can create chore requests",
        )

    senior = crud.senior.get_by_user_id(db, user_id=current_user.id)
    if not senior or senior.id != chore_in.senior_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to create chores for this senior",
        )

    return crud.chore.create(db=db, obj_in=chore_in)


@router.get("/", response_model=List[schemas.Chore])
def read_chores(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve chores.
    """
    # If current user is a senior, get only their chores
    if current_user.user_type == UserType.SENIOR:
        senior = crud.senior.get_by_user_id(db, user_id=current_user.id)
        if not senior:
            return []
        chores = crud.chore.get_by_senior_id(
            db, senior_id=senior.id, skip=skip, limit=limit
        )
    # If current user is a student, get available chores for matching
    else:
        chores = crud.chore.get_available_chores(db, skip=skip, limit=limit)
    return chores


@router.get("/{chore_id}", response_model=schemas.Chore)
def read_chore(
    *,
    db: Session = Depends(deps.get_db),
    chore_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get chore by ID.
    """
    chore = crud.chore.get(db=db, id=chore_id)
    if not chore:
        raise HTTPException(status_code=404, detail="Chore not found")

    # Check if user has permission to view this chore
    if current_user.user_type == UserType.SENIOR:
        senior = crud.senior.get_by_user_id(db, user_id=current_user.id)
        if not senior or chore.senior_id != senior.id:
            raise HTTPException(
                status_code=403, detail="Not enough permissions"
            )

    return chore


@router.put("/{chore_id}", response_model=schemas.Chore)
def update_chore(
    *,
    db: Session = Depends(deps.get_db),
    chore_id: int,
    chore_in: schemas.ChoreUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a chore.
    """
    chore = crud.chore.get(db=db, id=chore_id)
    if not chore:
        raise HTTPException(status_code=404, detail="Chore not found")

    # If senior is updating their own chore
    if current_user.user_type == UserType.SENIOR:
        senior = crud.senior.get_by_user_id(db, user_id=current_user.id)
        if not senior or chore.senior_id != senior.id:
            raise HTTPException(
                status_code=403, detail="Not enough permissions"
            )

    # If student is accepting a chore
    elif current_user.user_type == UserType.STUDENT:
        student = crud.student.get_by_user_id(db, user_id=current_user.id)
        if not student:
            raise HTTPException(
                status_code=403, detail="Student profile not found"
            )

        # If student is setting themselves as the assigned student
        if (
            chore_in.student_id is not None
            and chore_in.student_id != student.id
        ):
            raise HTTPException(
                status_code=403,
                detail="Students can only assign themselves to chores",
            )

    return crud.chore.update(db=db, db_obj=chore, obj_in=chore_in)


@router.delete("/{chore_id}", response_model=schemas.Chore)
def delete_chore(
    *,
    db: Session = Depends(deps.get_db),
    chore_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a chore.
    """
    chore = crud.chore.get(db=db, id=chore_id)
    if not chore:
        raise HTTPException(status_code=404, detail="Chore not found")

    # Only seniors can delete their own chores
    if current_user.user_type == UserType.SENIOR:
        senior = crud.senior.get_by_user_id(db, user_id=current_user.id)
        if not senior or chore.senior_id != senior.id:
            raise HTTPException(
                status_code=403, detail="Not enough permissions"
            )
    else:
        raise HTTPException(
            status_code=403, detail="Only seniors can delete chores"
        )

    return crud.chore.remove(db=db, id=chore_id)
