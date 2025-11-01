@echo off
setlocal enabledelayedexpansion

:: Simple log file name
set "log_file=deploy-log.txt"

echo ========================================
echo Alot1z GitHub Repository Wiki - Simple Deploy
echo ========================================
echo Log file: %log_file%
echo.

:: Clear old log file
echo DEPLOY LOG - %date% %time% > %log_file%
echo Current directory: %CD% >> %log_file%
echo. >> %log_file%

:: Use full paths
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"

echo Using Node.js: %NODE_EXE% | tee -a %log_file%
echo Using npm: %NPM_CMD% | tee -a %log_file%
echo. | tee -a %log_file%

:: Verify tools
echo STEP 1: Checking tools...
echo STEP 1: Checking tools... >> %log_file%

if not exist "%NODE_EXE%" (
    echo ERROR: Node.js not found
    echo ERROR: Node.js not found >> %log_file%
    pause
    exit /b 1
)

if not exist "%NPM_CMD%" (
    echo ERROR: npm not found
    echo ERROR: npm not found >> %log_file%
    pause
    exit /b 1
)

echo Tools verified
echo Tools verified >> %log_file%

:: Check git
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git not found
    echo ERROR: Git not found >> %log_file%
    pause
    exit /b 1
)

echo Git verified
echo Git verified >> %log_file%
echo. >> %log_file%

:: Check package.json
if not exist package.json (
    echo ERROR: package.json missing
    echo ERROR: package.json missing >> %log_file%
    dir /b >> %log_file%
    pause
    exit /b 1
)

echo package.json found
echo package.json found >> %log_file%

:: Install dependencies
echo STEP 2: Installing dependencies...
echo STEP 2: Installing dependencies... >> %log_file%

if not exist node_modules (
    echo Running npm install...
    echo Running npm install... >> %log_file%
    "%NPM_CMD%" install >> %log_file% 2>&1
    
    if errorlevel 1 (
        echo ERROR: npm install failed
        echo ERROR: npm install failed >> %log_file%
        echo Check %log_file% for details
        start notepad %log_file%
        pause
        exit /b 1
    )
    echo npm install completed
    echo npm install completed >> %log_file%
) else (
    echo Dependencies already exist
    echo Dependencies already exist >> %log_file%
)

:: Build
echo STEP 3: Building website...
echo STEP 3: Building website... >> %log_file%

echo Running npm run build...
echo Running npm run build... >> %log_file%
"%NPM_CMD%" run build >> %log_file% 2>&1

if errorlevel 1 (
    echo ERROR: Build failed
    echo ERROR: Build failed >> %log_file%
    echo Check %log_file% for build errors
    start notepad %log_file%
    pause
    exit /b 1
)

echo Build completed
echo Build completed >> %log_file%

:: Git operations
echo STEP 4: Git operations...
echo STEP 4: Git operations... >> %log_file%

if not exist .git (
    echo ERROR: Not a git repository
    echo ERROR: Not a git repository >> %log_file%
    pause
    exit /b 1
)

:: Check for changes
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo No changes to commit
    echo No changes to commit >> %log_file%
) else (
    echo Committing changes...
    echo Committing changes... >> %log_file%
    git add . >> %log_file% 2>&1
    git commit -m "Update repository wiki - %date% %time%" >> %log_file% 2>&1
    
    if errorlevel 1 (
        echo ERROR: Git commit failed
        echo ERROR: Git commit failed >> %log_file%
        start notepad %log_file%
        pause
        exit /b 1
    )
    echo Changes committed
    echo Changes committed >> %log_file%
)

:: Push
echo STEP 5: Pushing to GitHub...
echo STEP 5: Pushing to GitHub... >> %log_file%

echo Pushing to origin main...
echo Pushing to origin main... >> %log_file%
git push origin main >> %log_file% 2>&1

if errorlevel 1 (
    echo ERROR: Push failed
    echo ERROR: Push failed >> %log_file%
    echo Checking git remote: >> %log_file%
    git remote -v >> %log_file% 2>&1
    start notepad %log_file%
    pause
    exit /b 1
)

echo Push completed
echo Push completed >> %log_file%

:: Update config.ini
echo STEP 6: Updating config.ini...
echo STEP 6: Updating config.ini... >> %log_file%

:: Simple timestamp
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set "build_date=%%c-%%a-%%b"
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set "build_time=%%a:%%b"
set "timestamp=%build_date%T%build_time%Z"

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

:: Commit config
git add config.ini >> %log_file% 2>&1
git commit -m "Update deployment timestamp - %date% %time%" >> %log_file% 2>&1
git push origin main >> %log_file% 2>&1

echo ========================================
echo SUCCESS: Deployment completed!
echo ========================================
echo.
echo Website: https://Alot1z.github.io
echo Log file: %log_file%
echo Deploy time: %timestamp%
echo.

:: Ask to open website
set /p open_site="Open website now? (y/n): "
if /i "%open_site%"=="y" (
    start https://Alot1z.github.io
)

echo.
echo All done! Check %log_file% for full details.
pause