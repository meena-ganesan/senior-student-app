from pydantic import BaseModel
# No imports needed from typing


class Settings(BaseModel):
    PROJECT_NAME: str = "Senior-Student Volunteer Connection"
    API_V1_STR: str = "/api/v1"
    # Change this in production!
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./senior_student.db"


settings = Settings()
