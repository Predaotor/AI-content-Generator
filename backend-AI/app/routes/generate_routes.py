from fastapi import APIRouter, HTTPException
from schemas import TemplateRequest, TemplateResponse, ImageResponse, ImageRequest
from utils.openai_api import generate_text_template, generate_image_template

router = APIRouter()


@router.post("/generate-template", response_model=TemplateResponse)
async def generate_template(request: TemplateRequest):
    try:
        if request.template_type in ["blog_post", "email_draft"]:
            generated = generate_text_template(request.template_type, request.details)

            # Ensure you're returning a proper Pydantic model
            return TemplateResponse(generated_template=generated)

        raise HTTPException(status_code=400, detail="Unsupported template type")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating template: {str(e)}")


@router.post("/generate-image-template", response_model=ImageResponse)
async def generate_image_template_route(request: ImageRequest):
    try:
        image_url= generate_image_template(request.prompt)
        return ImageResponse(image_url=image_url)  # ✅ Correct
 # Return structured image JSON (type, data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")