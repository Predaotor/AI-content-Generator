from app.models import Base
from app.database import engine

# Create tables in the database 
Base.metadata.create_all(bind=engine)

