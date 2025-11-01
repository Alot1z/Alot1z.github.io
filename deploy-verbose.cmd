@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Alot1z GitHub Repository Wiki - Verbose Deploy
echo ========================================
echo.

:: Use full paths to avoid PATH issues
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"

echo DEBUG: Using Node.js: %NODE_EXE%
echo DEBUG: Using npm: %NPM_CMD%
echo DEBUG: Current directory: %CD%
echo.

:: Verify tools exist
echo STEP 1: Verifying tools...
if not exist "%NODE_EXE%" (
    echo ERROR: Node.js not found at %NODE_EXE%
    pause
    exit /b 1
)
echo DEBUG: Node.js exists

if not exist "%NPM_CMD%" (
    echo ERROR: npm not found at %NPM_CMD%
    pause
    exit /b 1
)
echo DEBUG: npm exists

:: Check git (git should be in PATH)
echo DEBUG: Checking git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)
echo DEBUG: Git found: 
git --version

echo.
echo DEBUG: All dependency checks passed!
echo.

:: Check package.json
echo STEP 2: Checking package.json...
if not exist package.json (
    echo ERROR: package.json not found
    echo DEBUG: Current directory contents:
    dir /b
    pause
    exit /b 1
)
echo DEBUG: package.json found

:: Check node_modules
echo STEP 3: Checking node_modules...
if exist node_modules (
    echo DEBUG: node_modules directory exists
    dir node_modules /b | find /c /v "" > temp_count.txt
    set /p node_count=<temp_count.txt
    del temp_count.txt
    echo DEBUG: Found !node_count! items in node_modules
) else (
    echo DEBUG: node_modules directory does not exist - will install
)

echo.
echo STEP 4: Installing/Updating dependencies...
if not exist node_modules (
    echo DEBUG: Running npm install...
    "%NPM_CMD%" install
    set npm_result=!errorlevel!
    echo DEBUG: npm install result: !npm_result!
    if !npm_result! neq 0 (
        echo ERROR: npm install failed with errorlevel !npm_result!
        pause
        exit /b 1
    )
    echo DEBUG: npm install completed successfully
) else (
    echo DEBUG: Dependencies already installed, skipping npm install
)

echo.
echo STEP 5: Building the website...
echo DEBUG: Running npm run build...
"%NPM_CMD%" run build
set build_result=!errorlevel!
echo DEBUG: Build result: !build_result!

if !build_result! neq 0 (
    echo ERROR: Build failed with errorlevel !build_result!
    echo DEBUG: Checking if build directory exists...
    if exist build (
        echo DEBUG: build directory exists
        dir build /b
    ) else (
        echo DEBUG: build directory does not exist
    )
    pause
    exit /b 1
)

echo DEBUG: Build completed successfully!
if exist build (
    echo DEBUG: build directory contents:
    dir build /b
)

echo.
echo STEP 6: Checking git status...
echo DEBUG: Current git status:
git status

:: Check if we're in a git repository
if not exist .git (
    echo ERROR: Not a git repository
    pause
    exit /b 1
)
echo DEBUG: In git repository

:: Check if there are changes to commit
echo DEBUG: Checking for changes to commit...
git status --porcelain > temp_changes.txt
set /p changes=<temp_changes.txt
del temp_changes.txt

if "%changes%"=="" (
    echo DEBUG: No changes to commit
) else (
    echo DEBUG: Found changes:
    echo %changes%
    echo DEBUG: Committing changes...
    git add .
    git commit -m "Update repository wiki - %date% %time%"
    set commit_result=!errorlevel!
    echo DEBUG: Commit result: !commit_result!
    if !commit_result! neq 0 (
        echo ERROR: Failed to commit changes with errorlevel !commit_result!
        pause
        exit /b 1
    )
    echo DEBUG: Changes committed successfully
)

echo.
echo STEP 7: Deploying to GitHub Pages...
echo DEBUG: Pushing to origin main...
git push origin main
set push_result=!errorlevel!
echo DEBUG: Push result: !push_result!

if !push_result! neq 0 (
    echo ERROR: Failed to push to GitHub with errorlevel !push_result!
    echo DEBUG: Checking git remote...
    git remote -v
    echo DEBUG: Checking current branch...
    git branch
    pause
    exit /b 1
)

echo DEBUG: Successfully pushed to GitHub!

echo.
echo STEP 8: Updating deployment timestamp...

:: Update config.ini with new deployment time
echo DEBUG: Getting current timestamp...
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD%T%HH%:%Min%:%Sec%Z"

echo DEBUG: Timestamp: %timestamp%

:: Update config.ini with repository path configuration
echo DEBUG: Updating config.ini...
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

echo DEBUG: config.ini updated

:: Add and commit config update
echo DEBUG: Committing config.ini update...
git add config.ini
git commit -m "Update deployment timestamp - %date% %time%" >nul 2>&1
git push origin main >nul 2>&1

echo DEBUG: Configuration update completed!

echo.
echo STEP 9: Verifying deployment...

:: Wait a moment for GitHub to process
echo DEBUG: Waiting for GitHub to process...
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
echo    Branch: main
echo    Build: Docusaurus static site
echo    Hosting: GitHub Pages
echo    Deploy Time: %timestamp%
echo.

:: Ask user if they want to open the website
echo STEP 10: Final confirmation...
set /p open_site="Do you want to open the website now? (y/n): "
if /i "%open_site%"=="y" (
    echo DEBUG: Opening website...
    start https://Alot1z.github.io
    echo DEBUG: Website opened in default browser
) else (
    echo DEBUG: You can visit the website later at: https://Alot1z.github.io
)

echo.
echo DEBUG: All steps completed successfully!
echo Quick commands for next time:
echo    Update content: Double-click this file
echo    View live site: https://Alot1z.github.io
echo    View GitHub: https://github.com/Alot1z/Alot1z.github.io
echo.
echo Press any key to exit...
pause >nul
echo DEBUG: Script completed normally
exit /b 0