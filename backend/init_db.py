import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the parent directory to the path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import Base, engine
from app.models.user import User
from app.models.student import Student
from app.models.senior import Senior
from app.models.chore import Chore
from app.models.feedback import Feedback

# Create tables
Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")
