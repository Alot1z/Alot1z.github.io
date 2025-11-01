@echo off
setlocal enabledelayedexpansion

:: Create log file with timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"
set "log_file=deploy-log-%YYYY%-%MM%-%DD%-%HH%-%Min%-%Sec%.txt"

echo ========================================
echo Alot1z GitHub Repository Wiki - Deploy with Logging
echo ========================================
echo Log file: %log_file%
echo.

:: Initialize log file
echo DEPLOY LOG - %date% %time% > %log_file%
echo Current directory: %CD% >> %log_file%
echo. >> %log_file%

:: Use full paths to avoid PATH issues
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"

echo Using Node.js: %NODE_EXE%
echo Using npm: %NPM_CMD%
echo. >> %log_file%
echo Using Node.js: %NODE_EXE% >> %log_file%
echo Using npm: %NPM_CMD% >> %log_file%

:: Verify tools exist
echo STEP 1: Verifying tools...
echo STEP 1: Verifying tools... >> %log_file%

if not exist "%NODE_EXE%" (
    echo ERROR: Node.js not found at %NODE_EXE%
    echo ERROR: Node.js not found at %NODE_EXE% >> %log_file%
    pause
    exit /b 1
)
echo Node.js exists
echo Node.js exists >> %log_file%

if not exist "%NPM_CMD%" (
    echo ERROR: npm not found at %NPM_CMD%
    echo ERROR: npm not found at %NPM_CMD% >> %log_file%
    pause
    exit /b 1
)
echo npm exists
echo npm exists >> %log_file%

:: Check git
echo Checking git...
echo Checking git... >> %log_file%
git --version >> %log_file% 2>&1
if errorlevel 1 (
    echo ERROR: Git not found
    echo ERROR: Git not found >> %log_file%
    pause
    exit /b 1
)
echo Git found
echo Git found >> %log_file%

echo.
echo All dependency checks passed!
echo All dependency checks passed! >> %log_file%
echo. >> %log_file%

:: Check package.json
echo STEP 2: Checking package.json...
echo STEP 2: Checking package.json... >> %log_file%

if not exist package.json (
    echo ERROR: package.json not found
    echo ERROR: package.json not found >> %log_file%
    echo Directory contents: >> %log_file%
    dir /b >> %log_file%
    pause
    exit /b 1
)
echo package.json found
echo package.json found >> %log_file%

:: Install dependencies if needed
echo STEP 3: Installing dependencies...
echo STEP 3: Installing dependencies... >> %log_file%

if not exist node_modules (
    echo Running npm install...
    echo Running npm install... >> %log_file%
    "%NPM_CMD%" install >> %log_file% 2>&1
    set npm_result=!errorlevel!
    echo npm install result: !npm_result!
    echo npm install result: !npm_result! >> %log_file%
    
    if !npm_result! neq 0 (
        echo ERROR: npm install failed
        echo ERROR: npm install failed >> %log_file%
        echo Opening log file for details...
        start notepad %log_file%
        pause
        exit /b 1
    )
    echo Dependencies installed successfully
    echo Dependencies installed successfully >> %log_file%
) else (
    echo Dependencies already installed
    echo Dependencies already installed >> %log_file%
)

echo.
echo STEP 4: Building website...
echo STEP 4: Building website... >> %log_file%

echo Running npm run build...
echo Running npm run build... >> %log_file%
"%NPM_CMD%" run build >> %log_file% 2>&1
set build_result=!errorlevel!
echo Build result: !build_result!
echo Build result: !build_result! >> %log_file%

if !build_result! neq 0 (
    echo ERROR: Build failed
    echo ERROR: Build failed >> %log_file%
    echo Build failed - check log file for details
    echo Opening log file...
    start notepad %log_file%
    pause
    exit /b 1
)

echo Build completed successfully
echo Build completed successfully >> %log_file%

:: Check git status
echo STEP 5: Git operations...
echo STEP 5: Git operations... >> %log_file%

if not exist .git (
    echo ERROR: Not a git repository
    echo ERROR: Not a git repository >> %log_file%
    pause
    exit /b 1
)

echo Current git status:
echo Current git status: >> %log_file%
git status >> %log_file% 2>&1

:: Commit changes if any
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo No changes to commit
    echo No changes to commit >> %log_file%
) else (
    echo Committing changes...
    echo Committing changes... >> %log_file%
    git add . >> %log_file% 2>&1
    git commit -m "Update repository wiki - %date% %time%" >> %log_file% 2>&1
    set commit_result=!errorlevel!
    echo Commit result: !commit_result!
    echo Commit result: !commit_result! >> %log_file%
    
    if !commit_result! neq 0 (
        echo ERROR: Commit failed
        echo ERROR: Commit failed >> %log_file%
        echo Opening log file...
        start notepad %log_file%
        pause
        exit /b 1
    )
    echo Changes committed successfully
    echo Changes committed successfully >> %log_file%
)

echo.
echo STEP 6: Pushing to GitHub...
echo STEP 6: Pushing to GitHub... >> %log_file%

echo Pushing to origin main...
echo Pushing to origin main... >> %log_file%
git push origin main >> %log_file% 2>&1
set push_result=!errorlevel!
echo Push result: !push_result!
echo Push result: !push_result! >> %log_file%

if !push_result! neq 0 (
    echo ERROR: Push failed
    echo ERROR: Push failed >> %log_file%
    echo Checking git remote: >> %log_file%
    git remote -v >> %log_file% 2>&1
    echo Checking current branch: >> %log_file%
    git branch >> %log_file% 2>&1
    echo Opening log file...
    start notepad %log_file%
    pause
    exit /b 1
)

echo Successfully pushed to GitHub
echo Successfully pushed to GitHub >> %log_file%

:: Update config.ini
echo STEP 7: Updating config.ini...
echo STEP 7: Updating config.ini... >> %log_file%

:: Get timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD%T%HH%:%Min%:%Sec%Z"

echo Timestamp: %timestamp%
echo Timestamp: %timestamp% >> %log_file%

:: Create config.ini
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

echo Config.ini updated
echo Config.ini updated >> %log_file%

:: Commit config update
git add config.ini >> %log_file% 2>&1
git commit -m "Update deployment timestamp - %date% %time%" >> %log_file% 2>&1
git push origin main >> %log_file% 2>&1

echo Configuration update completed
echo Configuration update completed >> %log_file%

echo.
echo ========================================
echo SUCCESS: Deployment completed!
echo ========================================
echo Log file: %log_file%
echo.

echo Final summary:
echo Final summary: >> %log_file%
echo Website: https://Alot1z.github.io >> %log_file%
echo Deploy time: %timestamp% >> %log_file%
echo.

:: Ask user if they want to open website
set /p open_site="Open website now? (y/n): "
if /i "%open_site%"=="y" (
    start https://Alot1z.github.io
)

echo.
echo Log file saved: %log_file%
echo You can review all details in the log file.
pause