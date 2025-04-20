from datetime import timedelta
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status, Request, Body
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app import crud
from app.api.deps import get_db
from app.core.security import create_access_token
from app.core.config import settings


class LoginRequest(BaseModel):
    username: str
    password: str


router = APIRouter()


@router.post("/login/custom")
def login_custom(
    request: Request,
    login_data: LoginRequest,
    db: Session = Depends(get_db),
) -> Any:
    """
    Custom login endpoint that doesn't use OAuth2PasswordRequestForm
    """
    try:
        print(f"Custom login attempt for username: {login_data.username}")
        print(f"Request headers: {request.headers}")

        user = crud.user.authenticate(
            db, email=login_data.username, password=login_data.password
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user"
            )

        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        # Convert user model to dict for serialization
        user_data = {
            "id": user.id,
            "email": user.email,
            "user_type": user.user_type,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_active": user.is_active,
            "is_approved": user.is_approved
        }

        return {
            "access_token": create_access_token(
                user.id, expires_delta=access_token_expires
            ),
            "token_type": "bearer",
            "user": user_data
        }
    except Exception as e:
        print(f"Error in login_custom: {str(e)}")
        import traceback
        traceback.print_exc()
        raise


@router.post("/login")
def login_access_token(
    request: Request,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    try:
        print(f"Login attempt for username: {form_data.username}")
        print(f"Request headers: {request.headers}")
        print(f"Request body: {request.body}")

        user = crud.user.authenticate(
            db, email=form_data.username, password=form_data.password
        )
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user"
            )
    except Exception as e:
        print(f"Error in login_access_token: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # Convert user model to dict for serialization
    user_data = {
        "id": user.id,
        "email": user.email,
        "user_type": user.user_type,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_active": user.is_active,
        "is_approved": user.is_approved
    }

    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "user": user_data
    }
