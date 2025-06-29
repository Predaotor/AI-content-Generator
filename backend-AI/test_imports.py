#!/usr/bin/env python3
"""
Test script to verify all imports work correctly
Run this before deployment to catch import issues
"""

import sys
import os

def test_imports():
    """Test all critical imports"""
    try:
        # Add paths
        current_dir = os.path.dirname(os.path.abspath(__file__))
        app_dir = os.path.join(current_dir, 'app')
        sys.path.insert(0, app_dir)
        sys.path.insert(0, current_dir)
        
        print("✅ Testing imports...")
        
        # Test basic imports
        from fastapi import FastAPI
        print("✅ FastAPI imported successfully")
        
        from sqlalchemy.orm import Session
        print("✅ SQLAlchemy imported successfully")
        
        # Test app imports
        from app.database import init_db, get_db
        print("✅ Database module imported successfully")
        
        from app.models import User, UserToken, SavedOutput
        print("✅ Models imported successfully")
        
        from app.utils import auth
        print("✅ Auth utils imported successfully")
        
        from app.routes import auth_routes, generate_routes, save_routes
        print("✅ Routes imported successfully")
        
        from app.schemas import UserCreate, UserLogin
        print("✅ Schemas imported successfully")
        
        from app.crud import create_user, get_user_by_email
        print("✅ CRUD functions imported successfully")
        
        from app.dependencies import get_current_user
        print("✅ Dependencies imported successfully")
        
        # Test main app import
        from app.main import app
        print("✅ Main app imported successfully")
        
        print("\n🎉 All imports successful! The app should deploy correctly.")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1) 