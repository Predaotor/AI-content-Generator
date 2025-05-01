# backend app database 
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

import os 
from dotenv import load_dotenv

load_dotenv() # Load environment variables 

DB_NAME=os.getenv("DB_NAME")
DB_USER=os.getenv("DB_USERNAME")
DB_PASSWORD=os.getenv("DB_PASSWORD")
DB_HOST=os.getenv("DB_HOST")
DB_PORT=os.getenv("DB_PORT") 

connection=f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(connection)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

