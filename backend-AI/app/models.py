from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class User(Base):
    #Create users table 
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)  # <- Added!
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
   