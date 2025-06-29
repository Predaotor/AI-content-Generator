#!/usr/bin/env python3
"""
Database Migration Management Script
Handles migrations for both local and production environments
"""

import os
import sys
import subprocess
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def check_environment():
    """Check if required environment variables are set"""
    required_vars = ['DATABASE_URL', 'DATABASE_PUBLIC_URL']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("Please set these variables in your .env file before running migrations")
        print("Example .env file content:")
        print("DATABASE_URL=postgresql://username:password@host:port/database")
        print("DATABASE_PUBLIC_URL=postgresql://username:password@host:port/database")
        return False
    
    print("✅ Environment variables are set")
    print(f"Using database: {os.getenv('DATABASE_URL') or os.getenv('DATABASE_PUBLIC_URL')}")
    return True

def create_initial_migration():
    """Create the initial migration"""
    return run_command(
        'alembic revision --autogenerate -m "Initial migration"',
        "Creating initial migration"
    )

def run_migrations():
    """Run pending migrations"""
    return run_command(
        "alembic upgrade head",
        "Running migrations"
    )

def show_migration_status():
    """Show current migration status"""
    return run_command(
        "alembic current",
        "Checking migration status"
    )

def show_migration_history():
    """Show migration history"""
    return run_command(
        "alembic history",
        "Showing migration history"
    )

def main():
    """Main function"""
    print("🗄️  Database Migration Manager")
    print("=" * 40)
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    # Show available commands
    print("\nAvailable commands:")
    print("1. Create initial migration")
    print("2. Run migrations")
    print("3. Show migration status")
    print("4. Show migration history")
    print("5. All of the above")
    
    choice = input("\nEnter your choice (1-5): ").strip()
    
    if choice == "1":
        create_initial_migration()
    elif choice == "2":
        run_migrations()
    elif choice == "3":
        show_migration_status()
    elif choice == "4":
        show_migration_history()
    elif choice == "5":
        print("\n🚀 Running all migration tasks...")
        create_initial_migration()
        run_migrations()
        show_migration_status()
        show_migration_history()
    else:
        print("❌ Invalid choice")

if __name__ == "__main__":
    main() 