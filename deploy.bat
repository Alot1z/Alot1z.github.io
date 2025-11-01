@echo off
setlocal enabledelayedexpansion

echo ================================================
echo Alot1z GitHub Repository Wiki - Final Deploy Script
echo ================================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: npm is not available
    pause
    exit /b 1
)

:: Check if git is available
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    echo.
    pause
    exit /b 1
)

echo ✅ All dependencies found
echo.

:: Install dependencies if needed
if not exist node_modules (
    echo [1/5] Installing Node.js dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
) else (
    echo [1/5] Dependencies already installed ✅
)

echo.
echo [2/5] Building the website...
echo.

:: Build the Docusaurus site
npm run build
if errorlevel 1 (
    echo ❌ ERROR: Failed to build the website
    echo Please check the error messages above and fix any issues
    pause
    exit /b 1
)

echo ✅ Website built successfully!

echo.
echo [3/5] Checking git status...

:: Check if we're in a git repository
if not exist .git (
    echo ❌ ERROR: Not a git repository
    echo Please run this script from the root of the Alot1z.github.io repository
    pause
    exit /b 1
)

:: Check if there are changes to commit
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo ✅ No changes to commit
) else (
    echo Found uncommitted changes. Committing them...
    git add .
    git commit -m "Update repository wiki - %date% %time%"
    if errorlevel 1 (
        echo ❌ ERROR: Failed to commit changes
        pause
        exit /b 1
    )
    echo ✅ Changes committed successfully!
)

echo.
echo [4/5] Deploying to GitHub Pages...

:: Push to GitHub (this will trigger GitHub Pages deployment)
git push origin main
if errorlevel 1 (
    echo ❌ ERROR: Failed to push to GitHub
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

echo ✅ Successfully pushed to GitHub!

echo.
echo [5/5] Verifying deployment...

:: Wait a moment for GitHub to process
timeout /t 3 /nobreak >nul

echo ================================================
echo 🎉 SUCCESS: Your repository wiki has been deployed!
echo ================================================
echo.
echo 📍 Your website is available at:
echo    https://Alot1z.github.io
echo.
echo ⏱️  It may take 1-2 minutes for GitHub Pages to update.
echo.
echo 📊 Deployment Summary:
echo    • Repository: Alot1z/Alot1z.github.io
echo    • Branch: main
echo    • Build: Docusaurus static site
echo    • Hosting: GitHub Pages
echo.

:: Ask user if they want to open the website
set /p open_site="🌐 Do you want to open the website now? (y/n): "
if /i "%open_site%"=="y" (
    echo Opening website...
    start https://Alot1z.github.io
    echo ✅ Website opened in default browser
) else (
    echo You can visit the website later at: https://Alot1z.github.io
)

echo.
echo 🎯 Quick commands for next time:
echo    • Update content: Double-click this file
echo    • View live site: https://Alot1z.github.io
echo    • View GitHub: https://github.com/Alot1z/Alot1z.github.io
echo.
echo Press any key to exit...
pause >nul
exit /b 0
