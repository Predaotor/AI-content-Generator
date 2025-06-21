@echo off
REM Production deployment script for AI Content Generator

echo 🚀 Starting production deployment...

REM Set production environment variables
set NEXT_PUBLIC_API_URL=http://backend:8000
set NODE_ENV=production

REM Build and start services
echo 📦 Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check service health
echo 🏥 Checking service health...
docker-compose ps

echo ✅ Deployment completed!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 🌍 Nginx Proxy: http://localhost:80

REM Show logs
echo 📋 Recent logs:
docker-compose logs --tail=20

pause 