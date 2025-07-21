# import necessary modules 
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session 
from database import init_db
from fastapi.security import OAuth2PasswordBearer
import  models
from utils import auth 
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes, generate_routes, save_routes



app=FastAPI() 

# Initialize DB tables 
init_db()



# Allow frontend (e.g, running on http://localhost:3000)
origins=[ 
        "http://localhost:3000", # REACT/Next.js dev server 
        "http://127.0.0.1:3000",
         ]


#apply CORS settings 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # allow requests from this origin 
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods 
    allow_headers=["*"],  # allow all headers 
)

# Include routes 
app.include_router(auth_routes.router, prefix="/auth")
app.include_router(generate_routes.router, prefix="/generate")
app.include_router(save_routes.router, prefix="/save")

# OAuth2PasswordBearer is used to extract the token from requests
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


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
  uvicorn.run(app, host="0.0.0.0.", port=8000, reload=True)