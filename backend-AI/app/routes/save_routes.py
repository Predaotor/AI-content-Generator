from fastapi import Depends, HTTPException, APIRouter
from models import User, SavedOutput
from sqlalchemy.orm import Session
from database import get_db
from models import UserToken
from schemas import SavedOutputSchema, SaveOutputRequest
from fastapi.security import OAuth2PasswordBearer
import os
from datetime import date, datetime
from dotenv import load_dotenv
from dependencies import get_current_user

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
load_dotenv()

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")
FREE_TOKEN_LIMIT = 100
TOKENS_PER_OUTPUT = 1

@router.post("/save-output", response_model=SavedOutputSchema)
def save_output(
    data: SaveOutputRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        allowed_types = {"blog_post", "email_draft", "image"}
        if data.template_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Unsupported template type")

        # --- REMOVE TOKEN LIMIT CHECKS HERE ---
        # No token usage or limit logic for saving output

        # Save generated content in SavedOutput table
        new_output = SavedOutput(
            user_id=user.id,
            template_type=data.template_type,
            content=data.content,
            created_at=datetime.now()
        )
        db.add(new_output)
        db.commit()
        db.refresh(new_output)

        # Return the saved output using the new schema
        return SavedOutputSchema(
            template_type=new_output.template_type,
            content=new_output.content,
            created_at=new_output.created_at
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error saving output: {str(e)}")
