from pydantic import BaseModel 

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