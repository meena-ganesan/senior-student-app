from fastapi import APIRouter

from app.api.api_v1.endpoints import users, chores, auth, students, seniors

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(
    students.router, prefix="/students", tags=["students"])
api_router.include_router(seniors.router, prefix="/seniors", tags=["seniors"])
api_router.include_router(chores.router, prefix="/chores", tags=["chores"])
