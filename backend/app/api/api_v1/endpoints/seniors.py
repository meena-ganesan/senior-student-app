from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.Senior)
def create_senior_profile(
    *,
    db: Session = Depends(deps.get_db),
    senior_in: schemas.SeniorCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new senior profile.
    """
    # Check if user is a senior
    if current_user.user_type != "senior":
        raise HTTPException(
            status_code=400,
            detail="User is not a senior",
        )

    # Check if senior profile already exists
    senior = crud.senior.get_by_user_id(db, user_id=current_user.id)
    if senior:
        raise HTTPException(
            status_code=400,
            detail="Senior profile already exists for this user",
        )

    # Create senior profile
    senior_in.user_id = current_user.id
    return crud.senior.create(db=db, obj_in=senior_in)


@router.get("/me", response_model=schemas.Senior)
def read_senior_profile(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current senior profile.
    """
    try:
        print(
            f"Current user: {current_user.id}, {current_user.email}, {current_user.user_type}")

        # Check if user is a senior
        if current_user.user_type != "senior":
            raise HTTPException(
                status_code=400,
                detail="User is not a senior",
            )

        # Get senior profile
        print(f"Getting senior profile for user_id: {current_user.id}")
        senior = crud.senior.get_by_user_id(db, user_id=current_user.id)
        print(f"Senior profile: {senior}")

        if not senior:
            # Create a senior profile if it doesn't exist
            print(f"Creating senior profile for user_id: {current_user.id}")
            senior_in = schemas.SeniorCreate(
                user_id=current_user.id,
                needs="",
                mobility_status="",
                emergency_contact_name="",
                emergency_contact_phone=""
            )
            senior = crud.senior.create(db=db, obj_in=senior_in)
            print(f"Created senior profile: {senior}")
            return senior

        return senior
    except Exception as e:
        print(f"Error in read_senior_profile: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


@router.put("/me", response_model=schemas.Senior)
def update_senior_profile(
    *,
    db: Session = Depends(deps.get_db),
    senior_in: schemas.SeniorUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update current senior profile.
    """
    # Check if user is a senior
    if current_user.user_type != "senior":
        raise HTTPException(
            status_code=400,
            detail="User is not a senior",
        )

    # Get senior profile
    senior = crud.senior.get_by_user_id(db, user_id=current_user.id)
    if not senior:
        raise HTTPException(
            status_code=404,
            detail="Senior profile not found",
        )

    # Update senior profile
    return crud.senior.update(db=db, db_obj=senior, obj_in=senior_in)


@router.get("/me/chores/pending", response_model=List[schemas.Chore])
def read_senior_pending_chores(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current senior's pending chores (no student assigned yet).
    """
    try:
        # Check if user is a senior
        if current_user.user_type != "senior":
            raise HTTPException(
                status_code=400,
                detail="User is not a senior",
            )

        # Get senior profile
        senior = crud.senior.get_by_user_id(db, user_id=current_user.id)
        if not senior:
            return []

        # For now, return an empty list
        # In a real implementation, you would query the database for pending chores
        return []
    except Exception as e:
        print(f"Error in read_senior_pending_chores: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


@router.get("/me/chores/scheduled", response_model=List[schemas.Chore])
def read_senior_scheduled_chores(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current senior's scheduled chores (student assigned, not completed).
    """
    try:
        # Check if user is a senior
        if current_user.user_type != "senior":
            raise HTTPException(
                status_code=400,
                detail="User is not a senior",
            )

        # Get senior profile
        senior = crud.senior.get_by_user_id(db, user_id=current_user.id)
        if not senior:
            return []

        # For now, return an empty list
        # In a real implementation, you would query the database for scheduled chores
        return []
    except Exception as e:
        print(f"Error in read_senior_scheduled_chores: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


@router.get("/me/chores/completed", response_model=List[schemas.Chore])
def read_senior_completed_chores(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current senior's completed chores.
    """
    try:
        # Check if user is a senior
        if current_user.user_type != "senior":
            raise HTTPException(
                status_code=400,
                detail="User is not a senior",
            )

        # Get senior profile
        senior = crud.senior.get_by_user_id(db, user_id=current_user.id)
        if not senior:
            return []

        # For now, return an empty list
        # In a real implementation, you would query the database for completed chores
        return []
    except Exception as e:
        print(f"Error in read_senior_completed_chores: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
