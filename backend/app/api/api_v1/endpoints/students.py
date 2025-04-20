from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.Student)
def create_student_profile(
    *,
    db: Session = Depends(deps.get_db),
    student_in: schemas.StudentCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new student profile.
    """
    # Check if user is a student
    if current_user.user_type != "student":
        raise HTTPException(
            status_code=400,
            detail="User is not a student",
        )

    # Check if student profile already exists
    student = crud.student.get_by_user_id(db, user_id=current_user.id)
    if student:
        raise HTTPException(
            status_code=400,
            detail="Student profile already exists for this user",
        )

    # Create student profile
    student_in.user_id = current_user.id
    return crud.student.create(db=db, obj_in=student_in)


@router.get("/me", response_model=schemas.Student)
def read_student_profile(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current student profile.
    """
    try:
        print(
            f"Current user: {current_user.id}, {current_user.email}, {current_user.user_type}")

        # Check if user is a student
        if current_user.user_type != "student":
            raise HTTPException(
                status_code=400,
                detail="User is not a student",
            )

        # Get student profile
        print(f"Getting student profile for user_id: {current_user.id}")
        student = crud.student.get_by_user_id(db, user_id=current_user.id)
        print(f"Student profile: {student}")

        if not student:
            # Create a student profile if it doesn't exist
            print(f"Creating student profile for user_id: {current_user.id}")
            student_in = schemas.StudentCreate(
                user_id=current_user.id,
                school_name="",
                grade=0,
                skills="",
                availability="",
                parent_consent=False
            )
            student = crud.student.create(db=db, obj_in=student_in)
            print(f"Created student profile: {student}")
            return student

        return student
    except Exception as e:
        print(f"Error in read_student_profile: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


@router.put("/me", response_model=schemas.Student)
def update_student_profile(
    *,
    db: Session = Depends(deps.get_db),
    student_in: schemas.StudentUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update current student profile.
    """
    # Check if user is a student
    if current_user.user_type != "student":
        raise HTTPException(
            status_code=400,
            detail="User is not a student",
        )

    # Get student profile
    student = crud.student.get_by_user_id(db, user_id=current_user.id)
    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student profile not found",
        )

    # Update student profile
    return crud.student.update(db=db, db_obj=student, obj_in=student_in)


@router.get("/me/chores/upcoming", response_model=List[schemas.Chore])
def read_student_upcoming_chores(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current student's upcoming chores.
    """
    try:
        # Check if user is a student
        if current_user.user_type != "student":
            raise HTTPException(
                status_code=400,
                detail="User is not a student",
            )

        # Get student profile
        student = crud.student.get_by_user_id(db, user_id=current_user.id)
        if not student:
            return []

        # For now, return an empty list
        # In a real implementation, you would query the database for upcoming chores
        return []
    except Exception as e:
        print(f"Error in read_student_upcoming_chores: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


@router.get("/me/chores/completed", response_model=List[schemas.Chore])
def read_student_completed_chores(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current student's completed chores.
    """
    try:
        # Check if user is a student
        if current_user.user_type != "student":
            raise HTTPException(
                status_code=400,
                detail="User is not a student",
            )

        # Get student profile
        student = crud.student.get_by_user_id(db, user_id=current_user.id)
        if not student:
            return []

        # For now, return an empty list
        # In a real implementation, you would query the database for completed chores
        return []
    except Exception as e:
        print(f"Error in read_student_completed_chores: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
