from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user.
    """
    try:
        print(
            f"Creating user with email: {user_in.email}, user_type: {user_in.user_type}")

        user = crud.user.get_by_email(db, email=user_in.email)
        if user:
            raise HTTPException(
                status_code=400,
                detail="The user with this email already exists in the system.",
            )

        # Create the user
        user = crud.user.create(db=db, obj_in=user_in)
        print(f"Created user with ID: {user.id}")

        # Create profile based on user type
        if user.user_type == "student":
            try:
                # Create student profile
                student_data = {
                    "user_id": user.id,
                    "school_name": "",
                    "grade": 0,
                    "skills": "",
                    "availability": "",
                    "parent_consent": False
                }

                # If student profile data was provided, use it
                if hasattr(user_in, "student_profile") and user_in.student_profile:
                    print(
                        f"Student profile data provided: {user_in.student_profile}")
                    student_profile_data = user_in.student_profile.dict(
                        exclude_unset=True)
                    for key, value in student_profile_data.items():
                        if value is not None and key != 'user_id':  # Skip user_id as we set it above
                            student_data[key] = value

                student_in = schemas.StudentCreate(**student_data)
                student = crud.student.create(db=db, obj_in=student_in)
                print(f"Created student profile with ID: {student.id}")
            except Exception as e:
                print(f"Error creating student profile: {str(e)}")
                import traceback
                traceback.print_exc()
                # Continue with user creation even if profile creation fails
        elif user.user_type == "senior":
            try:
                # Create senior profile
                senior_data = {
                    "user_id": user.id,
                    "needs": "",
                    "mobility_status": "",
                    "emergency_contact_name": "",
                    "emergency_contact_phone": ""
                }

                # If senior profile data was provided, use it
                if hasattr(user_in, "senior_profile") and user_in.senior_profile:
                    print(
                        f"Senior profile data provided: {user_in.senior_profile}")
                    senior_profile_data = user_in.senior_profile.dict(
                        exclude_unset=True)
                    for key, value in senior_profile_data.items():
                        if value is not None and key != 'user_id':  # Skip user_id as we set it above
                            senior_data[key] = value

                senior_in = schemas.SeniorCreate(**senior_data)
                senior = crud.senior.create(db=db, obj_in=senior_in)
                print(f"Created senior profile with ID: {senior.id}")
            except Exception as e:
                print(f"Error creating senior profile: {str(e)}")
                import traceback
                traceback.print_exc()
                # Continue with user creation even if profile creation fails

        return user
    except Exception as e:
        print(f"Error in create_user: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


@router.get("/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve users.
    """
    users = crud.user.get_multi(db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=schemas.User)
def read_user(
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    return user


@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.put("/me", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    return crud.user.update(db=db, db_obj=current_user, obj_in=user_in)


@router.put("/{user_id}", response_model=schemas.User)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a user.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    # Only allow users to update their own profile unless they are admin
    if user.id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions",
        )
    return crud.user.update(db=db, db_obj=user, obj_in=user_in)
