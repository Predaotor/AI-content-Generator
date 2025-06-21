#!/bin/bash

# Initialize volumes script for AI Content Generator
set -e

echo "🔧 Initializing static and media volumes..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create local directories for volume mounting
print_status "Creating local directories..."

# Backend directories
mkdir -p ./backend-AI/static
mkdir -p ./backend-AI/media
mkdir -p ./backend-AI/uploads

# Frontend directories
mkdir -p ./frontend-AI/public/static
mkdir -p ./frontend-AI/public/media

# Set proper permissions
print_status "Setting permissions..."

# Set read/write permissions for the directories
chmod 755 ./backend-AI/static
chmod 755 ./backend-AI/media
chmod 755 ./backend-AI/uploads
chmod 755 ./frontend-AI/public/static
chmod 755 ./frontend-AI/public/media

# Create .gitkeep files to ensure directories are tracked
print_status "Creating .gitkeep files..."

touch ./backend-AI/static/.gitkeep
touch ./backend-AI/media/.gitkeep
touch ./backend-AI/uploads/.gitkeep
touch ./frontend-AI/public/static/.gitkeep
touch ./frontend-AI/public/media/.gitkeep

# Add .gitkeep to .gitignore exceptions
print_status "Updating .gitignore..."

# Check if .gitignore exists and add exceptions
if [ -f .gitignore ]; then
    # Add exceptions for .gitkeep files in static/media directories
    if ! grep -q "!*/static/.gitkeep" .gitignore; then
        echo "" >> .gitignore
        echo "# Keep static and media directories" >> .gitignore
        echo "!*/static/.gitkeep" >> .gitignore
        echo "!*/media/.gitkeep" >> .gitignore
        echo "!*/uploads/.gitkeep" >> .gitignore
    fi
else
    print_warning ".gitignore not found. Creating one..."
    echo "# Keep static and media directories" > .gitignore
    echo "!*/static/.gitkeep" >> .gitignore
    echo "!*/media/.gitkeep" >> .gitignore
    echo "!*/uploads/.gitkeep" >> .gitignore
fi

print_status "✅ Volume initialization completed!"
echo ""
echo "📁 Created directories:"
echo "   ./backend-AI/static/"
echo "   ./backend-AI/media/"
echo "   ./backend-AI/uploads/"
echo "   ./frontend-AI/public/static/"
echo "   ./frontend-AI/public/media/"
echo ""
print_status "You can now run: docker-compose up --build" 