@echo off
echo 🔧 Initializing static and media volumes...

REM Create local directories for volume mounting
echo [INFO] Creating local directories...

REM Backend directories
if not exist "backend-AI\static" mkdir "backend-AI\static"
if not exist "backend-AI\media" mkdir "backend-AI\media"
if not exist "backend-AI\uploads" mkdir "backend-AI\uploads"

REM Frontend directories
if not exist "frontend-AI\public\static" mkdir "frontend-AI\public\static"
if not exist "frontend-AI\public\media" mkdir "frontend-AI\public\media"

echo [INFO] Setting permissions...

REM Create .gitkeep files to ensure directories are tracked
echo [INFO] Creating .gitkeep files...

echo. > "backend-AI\static\.gitkeep"
echo. > "backend-AI\media\.gitkeep"
echo. > "backend-AI\uploads\.gitkeep"
echo. > "frontend-AI\public\static\.gitkeep"
echo. > "frontend-AI\public\media\.gitkeep"

REM Update .gitignore
echo [INFO] Updating .gitignore...

REM Check if .gitignore exists and add exceptions
if exist .gitignore (
    REM Add exceptions for .gitkeep files in static/media directories
    findstr /C:"!*/static/.gitkeep" .gitignore >nul
    if errorlevel 1 (
        echo. >> .gitignore
        echo # Keep static and media directories >> .gitignore
        echo !*/static/.gitkeep >> .gitignore
        echo !*/media/.gitkeep >> .gitignore
        echo !*/uploads/.gitkeep >> .gitignore
    )
) else (
    echo [WARNING] .gitignore not found. Creating one...
    echo # Keep static and media directories > .gitignore
    echo !*/static/.gitkeep >> .gitignore
    echo !*/media/.gitkeep >> .gitignore
    echo !*/uploads/.gitkeep >> .gitignore
)

echo [INFO] ✅ Volume initialization completed!
echo.
echo 📁 Created directories:
echo    ./backend-AI/static/
echo    ./backend-AI/media/
echo    ./backend-AI/uploads/
echo    ./frontend-AI/public/static/
echo    ./frontend-AI/public/media/
echo.
echo [INFO] You can now run: docker-compose up --build

pause 