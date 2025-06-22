#!/bin/bash
# Startup script for Railway deployment

# Set the working directory to the backend-AI folder
cd /app

# Install dependencies if needed
pip install -r requirements.txt

# Start the FastAPI application
uvicorn app.main:app --host 0.0.0.0 --port $PORT 