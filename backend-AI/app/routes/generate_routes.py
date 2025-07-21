from fastapi import APIRouter, HTTPException, Depends
from schemas import TemplateRequest, TemplateResponse, ImageResponse, ImageRequest
from schemas import AdjustmentRequest, AdjustmentResponse
from utils.openai_api import generate_text_template, generate_image_template
from datetime import date 
from models import UserToken, User
from sqlalchemy.orm import Session
from dependencies import  get_current_user
from database import get_db

router = APIRouter()

FREE_TOKEN_LIMIT = 1000  # Daily or total limit depending on business model
TOKENS_PER_OUTPUT = 100  # Estimate or calculate dynamically

def get_or_create_token_usage(user: User, db: Session) -> UserToken:
    today = date.today()
    token_usage = db.query(UserToken).filter(UserToken.user_id == user.id).first()
    if not token_usage:
        token_usage = UserToken(user_id=user.id, tokens_used=0, last_used=today)
        db.add(token_usage)
        db.commit()
        db.refresh(token_usage)
    elif token_usage.last_used != today:
        token_usage.tokens_used = 0
        token_usage.last_used = today
    return token_usage



@router.post("/generate-template", response_model=TemplateResponse)
async def generate_template(
    request: TemplateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        token_usage = get_or_create_token_usage(current_user, db)

        if token_usage.tokens_used + TOKENS_PER_OUTPUT > FREE_TOKEN_LIMIT:
            raise HTTPException(status_code=403, detail="Token limit reached.")

        if request.template_type not in ["blog_post", "email_draft"]:
            raise HTTPException(status_code=400, detail="Unsupported template type")

        generated = generate_text_template(request.template_type, request.details)

        token_usage.tokens_used += TOKENS_PER_OUTPUT
        db.commit()

        return TemplateResponse(generated_template=generated)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating template: {str(e)}")

@router.post("/adjust-content", response_model=AdjustmentResponse)
async def adjust_content(
    request: AdjustmentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        token_usage = get_or_create_token_usage(current_user, db)

        if token_usage.tokens_used + TOKENS_PER_OUTPUT > FREE_TOKEN_LIMIT:
            raise HTTPException(status_code=403, detail="Token limit reached.")

        # Create a prompt that includes the original content and adjustments
        adjustment_prompt = f"""
Original content:
{request.original_content}

User adjustments: {request.adjustments}

Please regenerate the content incorporating the user's adjustments while maintaining the same structure and purpose.
"""

        # Use the existing generate_text_template function with the adjustment prompt
        adjusted_content = generate_text_template(request.template_type, adjustment_prompt)

        token_usage.tokens_used += TOKENS_PER_OUTPUT
        db.commit()

        return AdjustmentResponse(adjusted_content=adjusted_content)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adjusting content: {str(e)}")

@router.post("/generate-image-template", response_model=ImageResponse)
async def generate_image_template_route(request: ImageRequest,
                     db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):
    
    try :
      token_usage= get_or_create_token_usage(current_user, db)
      if token_usage.tokens_used + TOKENS_PER_OUTPUT > FREE_TOKEN_LIMIT:
        raise HTTPException(status_code=403, detail="Token limit reached.")
    except HTTPException:
        raise
    try:
        image_url= generate_image_template(request.prompt)
        return ImageResponse(image_url=image_url)  # ✅ Correct
 # Return structured image JSON (type, data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")