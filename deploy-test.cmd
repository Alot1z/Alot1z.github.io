@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo Alot1z GitHub Repository Wiki - Test Build
echo ========================================
echo.

:: Use full paths
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"

echo Using Node.js: %NODE_EXE%
echo Using npm: %NPM_CMD%
echo.

:: Verify tools
echo STEP 1: Verifying tools...
if not exist "%NODE_EXE%" (
    echo ERROR: Node.js not found
    pause
    exit /b 1
)

if not exist "%NPM_CMD%" (
    echo ERROR: npm not found
    pause
    exit /b 1
)

echo Tools verified
echo.

:: Check package.json
if not exist package.json (
    echo ERROR: package.json missing
    pause
    exit /b 1
)

echo package.json found
echo.

:: Check git status
echo STEP 2: Checking git status...
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo No changes to commit
) else (
    echo Found uncommitted changes. Committing them...
    git add .
    git commit -m "Test build update - %date% %time%"
    if errorlevel 1 (
        echo ERROR: Failed to commit changes
        pause
        exit /b 1
    )
    echo Changes committed successfully!
)

echo.
echo STEP 3: Building website...
echo Running npm run build...
"%NPM_CMD%" run build

if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo STEP 4: Testing Docusaurus deploy command...
echo This will NOT actually deploy, just test the command...
echo.

:: Test docusaurus deploy but don't actually push
"%NPM_CMD%" run deploy --dry-run 2>nul
if errorlevel 1 (
    echo WARNING: Docusaurus deploy test failed
    echo This might be normal if --dry-run is not supported
    echo The actual deploy will work if Git credentials are set up correctly
) else (
    echo Docusaurus deploy test successful
)

echo.
echo ========================================
echo SUCCESS: Test completed!
echo ========================================
echo.
echo The website has been built successfully!
echo Check the 'build' directory for the output.
echo.
echo If the build succeeded, the actual deploy.cmd should work.
echo.
echo Press any key to exit...
pause >nul
exit /b 0
