# app/routes/auth_routes.py
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import os 
from dotenv import load_dotenv
import schemas, crud
from utils.auth import get_password_hash, create_access_token, verify_password
from database import get_db
from utils import auth 
from datetime import timedelta, date 
from dependencies import get_current_user
from models import User, UserToken, SavedOutput
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
import json
from pydantic import BaseModel

class GoogleAuthRequest(BaseModel):
    id_token: str

router = APIRouter()


# Create api route for user registration 
@router.post("/register")
async def register(user: schemas.UserCreate, db: Session = Depends(auth.get_db)):
    # Check if the email already exists 
    db_user = crud.get_user_by_email(db, email=user.email)
    
    # if it exists raise httpexception
    
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if username already exists 
    
    db_username=crud.get_user_by_username(db, username=user.username)
    if db_username:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # hash the password to create a new user
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = crud.create_user(db, email=user.email, username=user.username,password=hashed_password)
    return {"message": "User created successfully!", "user": new_user.email}


# api to handle user login 

@router.post("/login")
async def login(user: schemas.UserLogin, db: Session = Depends(auth.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)

    if not db_user:
        db_user = crud.get_user_by_username(db, username=user.username)

    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email/username or password")

    access_token_expires = timedelta(minutes=30)
    access_token = auth.create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )

    # ✅ Return username from the database, not the incoming request
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": db_user.username
    }

load_dotenv()
    
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
if not GOOGLE_CLIENT_ID:
    print("ERROR: GOOGLE_CLIENT_ID is not set in environment variables")
    raise RuntimeError("GOOGLE_CLIENT_ID is not set in environment variables")

@router.post("/google")
async def google_auth(request_data: GoogleAuthRequest, db: Session = Depends(auth.get_db)):
    try:
        print(f"Google auth: Endpoint called")
        token = request_data.id_token
        if not token:
            raise HTTPException(status_code=400, detail="Missing ID token")
        print(f"Google auth: Starting token verification...")
        idinfo = google_id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        print(f"Google auth: Token verified successfully")
        email = idinfo["email"]
        name = idinfo.get("name")
        picture = idinfo.get("picture")
        print(f"Google auth: Email from token: {email}")
        db_user = crud.get_user_by_email(db, email=email)
        print(f"Google auth: User exists in DB: {db_user is not None}")
        if not db_user:
            # Make username unique for Google users
            # Take only the part before @ and limit to 20 characters
            base_username = email.split('@')[0]
            username = base_username[:20]  # Limit to 20 characters
            
            # Check if username already exists and add number if needed
            original_username = username
            counter = 1
            while crud.get_user_by_username(db, username):
                username = f"{original_username}{counter}"
                counter += 1
                if len(username) > 25:  # Prevent too long usernames
                    username = f"user{counter}"
                    counter += 1
            
            print(f"Google auth: Creating user with username: {username}")
            try:
                db_user = crud.create_user(db, email=email, username=username, password=None)
                print(f"Google auth: User created successfully with ID: {db_user.id}")
            except Exception as e:
                print(f"Error creating user from Google auth: {e}")
                raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")
        access_token_expires = timedelta(minutes=30)
        access_token = auth.create_access_token(
            data={"sub": db_user.email}, expires_delta=access_token_expires
        )
        print(f"Google auth: Returning token for user: {db_user.email}")
        return {
            "token": access_token,
            "user": {"email": db_user.email, "username": db_user.username, "picture": picture}
        }
    except Exception as e:
        print(f"Google auth error: {e}")
        print(f"Google auth error type: {type(e)}")
        import traceback
        print(f"Google auth traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=400, detail=f"Invalid ID token: {str(e)}")

@router.get("/profile")
def get_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Check if user is active
        if not user.is_active:
            raise HTTPException(status_code=403, detail="User account is inactive")

        # Get tokens used
        token_record = db.query(UserToken).filter(UserToken.user_id == user.id).first()
        tokens_used = token_record.tokens_used if token_record else 0

        # Get saved outputs
        outputs = db.query(SavedOutput).filter(SavedOutput.user_id == user.id).all()
        output_list = [
            {
                "id": output.id,
                "template_type": output.template_type,
                "content": output.content,
                "created_at": output.created_at,
            }
            for output in outputs
        ]

        return {
            "username": user.username,
            "email": user.email,
            "tokens_used": tokens_used,
            "saved_outputs": output_list
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching profile: {str(e)}")
