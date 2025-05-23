from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session 
from schemas import TemplateRequest
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer
import auth, crud, database, models, schemas
from fastapi.middleware.cors import CORSMiddleware
from openai_api import generate_text_template, generate_image_template

app=FastAPI() 





# Allow frontend (e.g, running on http://localhost:3000)
origins=[ 
        "http://localhost:3000", # REACT/Next.js dev server 
         ]


#apply CORS settings 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # allow requests from this origin 
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods 
    allow_headers=["*"],  # allow all headers 
)


# OAuth2PasswordBearer is used to extract the token from requests
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# Manage openAI apis 
@app.post("/generate-template")
async def generate_template(request: TemplateRequest):
  
  
  try: 
    # call openAI's text generation API 
    if request.template_type in ["blog_post", "emil_draft"]:
      
      generated_template=generate_text_template(request.template_type,request.details)
      return {"generated_template":generated_template}
    
    else:
      raise HTTPException(status_code=400, detail="Unsupported template type")
  
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error generating template: {str(e)}")
  

@app.post("/generate-image-template")
async def generate_image_template_route(prompt: str):
  
  try :
    # Call OpenAI's image generation API (DALLE)
    image_url=generate_image_template(prompt)
    return {"image_url":image_url}
  
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error generating image {str(e)}")

# Create api routes 
@app.post("/register")
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

@app.post("/login")
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



@app.get("/protected")
async def  protected_route(token: str=Depends(oauth2_scheme)):
    # This is protected route that  requires JWT token to acess 
    return {"message":"This is a protected route"}

@app.get("/test-db")
async def test_db(db: Session = Depends(auth.get_db)):
    try:
        # Just a basic query to see if db connection works
        users = db.query(models.User).all()
        return {"message": "DB Connection Successful!", "users_count": len(users)}
    except Exception as e:
        return {"error": str(e)}
      
    
if __name__=="__main__":
  import uvicorn 
  uvicorn.run(app, host="0.0.0.0.", port=8000)