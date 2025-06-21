#!/bin/bash

# AI Content Generator Deployment Script with Railway Database
set -e

echo "🚀 Starting AI Content Generator deployment with Railway database..."

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

# Check if backend .env file exists
if [ ! -f backend-AI/.env ]; then
    print_warning "backend-AI/.env file not found. Creating from example..."
    if [ -f env.example ]; then
        print_status "Please copy the backend configuration from env.example to backend-AI/.env"
        print_status "Make sure to update the backend-AI/.env file with your actual values."
        print_status "Don't forget to add your Railway DATABASE_URL!"
        exit 1
    else
        print_error "env.example file not found. Please create backend-AI/.env file manually."
        exit 1
    fi
fi

# Check if root .env file exists for docker-compose
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from example..."
    if [ -f env.example ]; then
        cp env.example .env
        print_status "Created .env file from example. Please update with your actual values."
        print_status "Make sure to also update backend-AI/.env with your backend configuration."
        exit 1
    else
        print_error "env.example file not found. Please create a .env file manually."
        exit 1
    fi
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install it and try again."
    exit 1
fi

print_status "Building and starting services..."

# Build and start services
docker-compose up --build -d

print_status "Waiting for services to be ready..."

# Wait for services to be healthy
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "✅ All services are running successfully!"
    
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   Nginx (if enabled): http://localhost:80"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    
    echo ""
    print_status "Deployment completed successfully!"
    print_warning "Don't forget to:"
    echo "   1. Update your .env file with real API keys and secrets"
    echo "   2. Update backend-AI/.env with your Railway DATABASE_URL"
    echo "   3. Configure SSL certificates if needed"
    echo "   4. Set up proper domain names"
    echo "   5. Configure backup strategies"
    
else
    print_error "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi 