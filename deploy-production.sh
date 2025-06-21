#!/bin/bash

# Production deployment script for AI Content Generator

echo "🚀 Starting production deployment..."

# Set production environment variables
export NEXT_PUBLIC_API_URL=http://backend:8000
export NODE_ENV=production

# Build and start services
echo "📦 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
docker-compose ps

echo "✅ Deployment completed!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "🌍 Nginx Proxy: http://localhost:80"

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20 