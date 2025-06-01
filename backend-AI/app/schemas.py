from pydantic import BaseModel 
from datetime import datetime
from typing import List

# Create schemas for user sign in and user  sign up 
class UserCreate(BaseModel):
    email: str 
    username: str
    password: str  
    
class UserLogin(BaseModel):
    email: str = None
    username:str= None
    password: str 
    
    # Ensuring that either email or username must be provided
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.email and not self.username:
            raise ValueError("Either email or username must be provided")
        
class Token(BaseModel):
    access_token: str 
    token_type: str
    
class TemplateRequest(BaseModel):
    template_type: str  # e.g., "blog_post", "email_draft"
    details: str  # e.g., "Write a blog post about AI technology"

class SavedOutputSchema(BaseModel):
    template_type: str
    content: str
    created_at : datetime 
    
    class config:
        from_attributes = True
        
class SaveOutputRequest(BaseModel):
    template_type: str  # e.g., "blog_post", "email_draft"
    content: str  # e.g., "Write a blog post about AI technology"
    
    class Config:
        orm_mode = True  # This allows Pydantic to read data from SQLAlchemy models
class UserProfile(BaseModel):
    id: int
    email: str
    tokens_used: int = 0  # Default to 0 tokens used
    outputs: List[SavedOutputSchema] = []  # List of saved outputs
    class Config:
        orm_mode = True  # This allows Pydantic to read data from SQLAlchemy models 
class TemplateResponse(BaseModel):
    generated_template: str  # The generated text template
class ImageResponse(BaseModel):
    image_url: str  # URL of the generated image
    
class ImageRequest(BaseModel):
    prompt: str