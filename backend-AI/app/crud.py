from sqlalchemy.orm import Session 
from models import User


# Create user function
def create_user(db: Session, email: str, username: str, password: str = None, picture: str = None):
    db_user = User(email=email, username=username, hashed_password=password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Get user
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


# Get user by username
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()
