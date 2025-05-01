import jwt 
from datetime import datetime, timedelta 
from fastapi import HTTPException, Depends, status 
from sqlalchemy.orm import Session 
from passlib.context import CryptContext 
import crud, models, database
import os 
from dotenv import load_dotenv
from jwt import PyJWTError

load_dotenv() # Load environment variables 

# Secret key for encoding and decoding JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Function to hash password
def get_password_hash(password):
    return pwd_context.hash(password)

# Dependancy to get database session 
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Verify if password matches 
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# Create JWT token for the authenticated user 
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode=data.copy()
    if expires_delta:
        expire = datetime.now()+ expires_delta
    else:
        expire=datetime.now()+ timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
    
# Register User
def register_user(db: Session, email: str, username: str, password: str):
    # Check if email exists
    db_user = crud.get_user_by_email(db, email=email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if username exists
    db_username = crud.get_user_by_username(db, username=username)
    if db_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Hash the password and create the user
    hashed_password = get_password_hash(password)
    user = crud.create_user(db, email=email, username=username, password=hashed_password)
    return user

# Login User
def login_user(db: Session, password: str, username: str = None, email: str = None):
    if email:
        user = crud.get_user_by_email(db, email=email)
    elif username:
        user = crud.get_user_by_username(db, username=username)
    else:
        raise HTTPException(status_code=400, detail="Username or email must be provided")

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email/username or password")

    # Generate a JWT token (assuming you have create_access_token method available)
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
                         
                                     
# Verify JWT token
def verify_token(token: str):
    credentials_exception = HTTPException(
        status_code=401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except PyJWTError:
        raise credentials_exception