@echo off
echo 🚀 Starting AI Content Generator deployment with Railway database...

REM Check if backend .env file exists
if not exist backend-AI\.env (
    echo [WARNING] backend-AI\.env file not found. Creating from example...
    if exist env.example (
        echo [INFO] Please copy the backend configuration from env.example to backend-AI\.env
        echo [INFO] Make sure to update the backend-AI\.env file with your actual values.
        echo [INFO] Don't forget to add your Railway DATABASE_URL!
        pause
        exit /b 1
    ) else (
        echo [ERROR] env.example file not found. Please create backend-AI\.env file manually.
        pause
        exit /b 1
    )
)

REM Check if root .env file exists for docker-compose
if not exist .env (
    echo [WARNING] .env file not found. Creating from example...
    if exist env.example (
        copy env.example .env
        echo [INFO] Created .env file from example. Please update with your actual values.
        echo [INFO] Make sure to also update backend-AI\.env with your backend configuration.
        pause
        exit /b 1
    ) else (
        echo [ERROR] env.example file not found. Please create a .env file manually.
        pause
        exit /b 1
    )
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install it and try again.
    pause
    exit /b 1
)

echo [INFO] Building and starting services...

REM Build and start services
docker-compose up --build -d

echo [INFO] Waiting for services to be ready...

REM Wait for services to be healthy
timeout /t 30 /nobreak >nul

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if errorlevel 1 (
    echo [ERROR] ❌ Some services failed to start. Check logs with: docker-compose logs
    pause
    exit /b 1
) else (
    echo [INFO] ✅ All services are running successfully!
    
    echo.
    echo 🌐 Application URLs:
    echo    Frontend: http://localhost:3000
    echo    Backend API: http://localhost:8000
    echo    Nginx (if enabled): http://localhost:80
    echo.
    echo 📊 Service Status:
    docker-compose ps
    
    echo.
    echo [INFO] Deployment completed successfully!
    echo [WARNING] Don't forget to:
    echo    1. Update your .env file with real API keys and secrets
    echo    2. Update backend-AI\.env with your Railway DATABASE_URL
    echo    3. Configure SSL certificates if needed
    echo    4. Set up proper domain names
    echo    5. Configure backup strategies
)

pause 