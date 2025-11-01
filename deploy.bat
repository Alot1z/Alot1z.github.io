@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo Alot1z GitHub Repository Wiki - COMPLETE DEPLOY Script
echo ========================================
echo.
echo This script will DELETE gh-pages branch and REUPLOAD everything!
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

:: ========================================
echo [1/7] FORCING GitHub Authentication Popup
echo ========================================
echo.
echo Checking GitHub authentication...
echo (This should trigger GitHub popup if needed)
echo.

:: Force GitHub authentication popup by attempting to access repository
git ls-remote https://github.com/Alot1z/Alot1z.github.io.git >nul 2>&1
if errorlevel 1 (
    echo WARNING: GitHub authentication may be required
    echo Please complete authentication in the popup if it appears
    echo.
    pause
)

echo Authentication check completed.
echo.

:: Install dependencies if needed
if not exist node_modules (
    echo [2/7] Installing Node.js dependencies...
    "%NPM_CMD%" install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
) else (
    echo [2/7] Dependencies already installed
)

echo.
echo [3/7] Checking for uncommitted changes...
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
echo [4/7] Building the website...
"%NPM_CMD%" run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo Build completed successfully!
echo.

echo [5/7] DELETING gh-pages branch completely...
echo.
echo WARNING: This will DELETE the entire gh-pages branch!
echo.

:: Switch to main branch to ensure we're not on gh-pages
git checkout main >nul 2>&1

:: Delete local gh-pages branch if it exists
git branch -D gh-pages >nul 2>&1
if not errorlevel 1 (
    echo Deleted local gh-pages branch
)

:: Delete remote gh-pages branch
echo Deleting remote gh-pages branch...
git push origin --delete gh-pages >nul 2>&1
if not errorlevel 1 (
    echo Deleted remote gh-pages branch
) else (
    echo Remote gh-pages branch may not exist or no permission to delete
)

echo Branch deletion completed.
echo.

echo [6/7] Setting up new git repository in build folder...
cd build

:: Initialize new git repository
git init
git add .
git commit -m "Initial complete deploy - %DATE% %TIME%"

:: Add remote origin
git remote add origin https://github.com/Alot1z/Alot1z.github.io.git

echo.
echo [7/7] PUSHING ALL CONTENT TO gh-pages branch...
echo.
echo This will OVERWRITE everything on gh-pages branch!
echo.

:: Force push to create new gh-pages branch
git push --force origin main:gh-pages
if errorlevel 1 (
    echo ERROR: Failed to push to gh-pages branch
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo SUCCESS: Complete deploy finished!
echo ========================================
echo.
echo The entire gh-pages branch has been DELETED and RECREATED
echo with all new content uploaded!
echo.
echo Your website is available at:
echo    https://Alot1z.github.io
echo.
echo It may take 1-2 minutes for GitHub Pages to update.
echo.

:: Update deployment timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD%T%HH%:%Min%:%Sec%"

echo Deployment completed at: %timestamp%

:: Update config.ini
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
git commit -m "Complete deploy - %date% %time%" >nul 2>&1
git push https://github.com/Alot1z/Alot1z.github.io.git main >nul 2>&1

echo Configuration updated successfully!
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
echo ========================================
echo DEPLOYMENT SUMMARY:
echo ========================================
echo    Repository: Alot1z/Alot1z.github.io
echo    Action: DELETED and RECREATED gh-pages branch
echo    Method: Complete deletion and re-upload
echo    Build: Docusaurus static site
echo    Hosting: GitHub Pages
echo    Deploy Time: %timestamp%
echo.

echo Press any key to exit...
pause >nul
exit /b 0
