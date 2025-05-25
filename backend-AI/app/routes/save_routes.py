from fastapi import Depends, HTTPException, status, APIRouter
from models import User, SavedOutput
from sqlalchemy.orm import Session
from database import get_db
from jose import jwt, JWTError
from models import UserToken
from schemas import SaveOutputRequest
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv
from pydantic import BaseModel

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")
FREE_TOKEN_LIMIT = 100
TOKENS_PER_OUTPUT = 1



def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/save-output")
def save_output(
    data: SaveOutputRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Get or create token tracking
        token_usage = db.query(UserToken).filter(UserToken.user_id == user.id).first()
        if not token_usage:
            token_usage = UserToken(user_id=user.id, tokens_used=0)
            db.add(token_usage)
            db.commit()

        # Check if user has tokens left
        if token_usage.tokens_used + TOKENS_PER_OUTPUT > FREE_TOKEN_LIMIT:
            raise HTTPException(
                status_code=403,
                detail="Token limit reached. Upgrade your plan for more access."
            )

        # Save the output
        new_output = SavedOutput(
            user_id=user.id,
            template_type=data.template_type,
            content=data.content
        )
        db.add(new_output)

        # Update token usage
        token_usage.tokens_used += TOKENS_PER_OUTPUT
        db.commit()

        return {"message": "Output saved successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error saving output: {str(e)}")
