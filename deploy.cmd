@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo Alot1z GitHub Repository Wiki - Deploy Script
echo ========================================
echo.

:: Use full paths to avoid PATH issues
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"

:: Verify tools exist
if not exist "%NODE_EXE%" (
    echo ERROR: Node.js not found at %NODE_EXE%
    pause
    exit /b 1
)

if not exist "%NPM_CMD%" (
    echo ERROR: npm not found at %NPM_CMD%
    pause
    exit /b 1
)

echo Using Node.js: %NODE_EXE%
echo Using npm: %NPM_CMD%
echo.

:: Check git (git should be in PATH)
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo All dependencies found!
echo.

:: Install dependencies if needed
if not exist node_modules (
    echo [1/4] Installing Node.js dependencies...
    "%NPM_CMD%" install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
) else (
    echo [1/4] Dependencies already installed
)

echo.
echo [2/4] Checking for uncommitted changes...
git status --porcelain
for /f "tokens=*" %%i in ('git status --porcelain') do (
    if not "%%i"=="" (
        echo Found uncommitted changes. Committing them...
        git add .
        if %ERRORLEVEL% NEQ 0 (
            echo ERROR: Failed to stage changes
            pause
            exit /b 1
        )
        
        echo Enter commit message (or press Enter for default):
        set /p COMMIT_MSG="Commit message: "
        if "!COMMIT_MSG!"=="" (
            set "COMMIT_MSG=Update wiki content - %DATE% %TIME%"
        )
        
        git commit -m "!COMMIT_MSG!"
        if %ERRORLEVEL% NEQ 0 (
            echo ERROR: Failed to commit changes
            pause
            exit /b 1
        )
        goto :changes_committed
    )
)

echo No uncommitted changes found.
:changes_committed

echo.
echo [3/4] Building and deploying with Docusaurus...

:: Use docusaurus deploy which handles GitHub Pages deployment
"%NPM_CMD%" run deploy
if errorlevel 1 (
    echo ERROR: Docusaurus deploy failed
    echo.
    echo This might be due to:
    echo 1. No internet connection
    echo 2. Incorrect GitHub credentials
    echo 3. No push permissions to the repository
    echo.
    echo Please check your Git configuration and try again.
    echo Kør setup-git.cmd for at verificere din forbindelse.
    pause
    exit /b 1
)

echo.
echo [3/4] Updating deployment timestamp...

:: Update config.ini with new deployment time
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD%T%HH%:%Min%:%Sec%Z"

echo Timestamp updated to: %timestamp%

:: Update config.ini with repository path configuration
echo Updating config.ini...
(
echo [wiki_config]
echo total_repositories=98
echo last_deploy_date=%timestamp%
echo version=2.0
echo auto_update_enabled=false
echo crawler_version=crawlee-python
echo.
echo [repositories]
echo main_repository_path=https://github.com/Alot1z?tab=stars
echo backup_repository_path=https://github.com/Alot1z?tab=repositories
echo starred_repositories_path=https://github.com/Alot1z?tab=stars
) > config.ini

:: Add and commit config update to main branch
git add config.ini
git commit -m "Update deployment timestamp - %date% %time%" >nul 2>&1
git push https://github.com/Alot1z/Alot1z.github.io.git main >nul 2>&1

echo Configuration updated successfully!

echo.
echo [4/4] Verifying deployment...

:: Wait a moment for GitHub to process (Windows compatible)
echo Waiting for GitHub to process...
ping -n 4 127.0.0.1 >nul

echo ========================================
echo SUCCESS: Your repository wiki has been deployed!
echo ========================================
echo.
echo Your website is available at:
echo    https://Alot1z.github.io
echo.
echo It may take 1-2 minutes for GitHub Pages to update.
echo.
echo Deployment Summary:
echo    Repository: Alot1z/Alot1z.github.io
echo    Branch: gh-pages (deployed from main)
echo    Build: Docusaurus static site
echo    Hosting: GitHub Pages
echo    Deploy Time: %timestamp%
echo.

:: Ask user if they want to open the website
set /p open_site="Do you want to open the website now? (y/n): "
if /i "%open_site%"=="y" (
    echo Opening website...
    start https://Alot1z.github.io
    echo Website opened in default browser
) else (
    echo You can visit the website later at: https://Alot1z.github.io
)

echo.
echo Quick commands for next time:
echo    Update content: Double-click this file
echo    View live site: https://Alot1z.github.io
echo    View GitHub: https://github.com/Alot1z/Alot1z.github.io
echo.
echo Press any key to exit...
pause >nul
exit /b 0
