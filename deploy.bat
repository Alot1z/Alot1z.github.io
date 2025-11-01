@echo off
setlocal enabledelayedexpansion

echo ================================================
echo Alot1z GitHub Repository Wiki - Auto Deploy Script
echo ================================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

:: Check if git is available
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo [1/4] Checking dependencies...
echo.

:: Install dependencies if needed
if not exist node_modules (
    echo Installing Node.js dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
) else (
    echo Dependencies already installed.
)

echo.
echo [2/4] Building the website...
echo.

:: Build the Docusaurus site
npm run build
if errorlevel 1 (
    echo ERROR: Failed to build the website
    pause
    exit /b 1
)

echo Website built successfully!

echo.
echo [3/4] Preparing deployment...
echo.

:: Check if we're in a git repository
if not exist .git (
    echo ERROR: Not a git repository
    echo Please run this script from the root of the Alot1z.github.io repository
    pause
    exit /b 1
)

:: Check git status
git status --porcelain >nul 2>&1
if not errorlevel 1 (
    echo There are uncommitted changes. Committing them...
    git add .
    git commit -m "Auto-update repository wiki - %date% %time%"
    if errorlevel 1 (
        echo ERROR: Failed to commit changes
        pause
        exit /b 1
    )
)

echo.
echo [4/4] Deploying to GitHub Pages...
echo.

:: Push to GitHub (this will trigger GitHub Pages deployment)
git push origin main
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    echo.
    echo This might be due to:
    echo 1. No internet connection
    echo 2. Incorrect GitHub credentials
    echo 3. No push permissions to the repository
    echo.
    echo Please check your Git configuration and try again.
    pause
    exit /b 1
)

echo.
echo ================================================
echo SUCCESS: Your repository wiki has been deployed!
echo ================================================
echo.
echo Your website should be available at:
echo https://Alot1z.github.io
echo.
echo It may take a few minutes for GitHub Pages to update.
echo.

:: Ask user if they want to open the website
set /p open_site="Do you want to open the website? (y/n): "
if /i "%open_site%"=="y" (
    echo Opening website...
    start https://Alot1z.github.io
)

echo.
echo Press any key to exit...
pause >nul
exit /b 0
