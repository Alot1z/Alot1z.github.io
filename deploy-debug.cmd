@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Alot1z GitHub Repository Wiki - Debug Deploy
echo ========================================
echo.

echo Current directory: %CD%
echo.

:: Check if Node.js is installed
echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js command failed with errorlevel %errorlevel%
    echo Trying alternative check...
    where node >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Node.js not found in PATH
        echo Please install Node.js from https://nodejs.org/
        echo.
        pause
        exit /b 1
    ) else (
        echo Node.js found in PATH but failed to run
    )
) else (
    echo Node.js check passed
)

echo.
echo Checking npm...
:: First try to run npm --version directly
npm --version
set npm_result=%errorlevel%
echo npm command result: %npm_result%

if %npm_result% neq 0 (
    echo WARNING: npm --version failed, trying alternatives...
    
    :: Check if npm exists in PATH
    where npm >nul 2>&1
    if errorlevel 1 (
        echo ERROR: npm not found in PATH
        echo Let's check Node.js installation directory...
        
        :: Try to find npm in node_modules
        if exist "%ProgramFiles%\nodejs\npm.cmd" (
            echo Found npm at: %ProgramFiles%\nodejs\npm.cmd
            set NPM_CMD="%ProgramFiles%\nodejs\npm.cmd"
        ) else if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" (
            echo Found npm at: %ProgramFiles(x86)%\nodejs\npm.cmd
            set NPM_CMD="%ProgramFiles(x86)%\nodejs\npm.cmd"
        ) else (
            echo ERROR: npm not found anywhere
            echo.
            echo Trying to reinstall npm globally...
            node --version && npm install -g npm
            if errorlevel 1 (
                echo ERROR: Failed to install npm
                pause
                exit /b 1
            )
        )
    ) else (
        echo npm found in PATH but failed to run
        where npm
    )
) else (
    echo npm check passed
    set NPM_CMD=npm
)

echo.
echo Checking git...
git --version
if errorlevel 1 (
    echo ERROR: git not found
    where git >nul 2>&1
    if errorlevel 1 (
        echo ERROR: git not in PATH
        echo Please install Git from https://git-scm.com/
        pause
        exit /b 1
    ) else (
        echo git found in PATH but failed to run
    )
) else (
    echo git check passed
)

echo.
echo All dependency checks completed!
echo Using NPM command: %NPM_CMD%
echo.

:: Test npm command
echo Testing npm functionality...
%NPM_CMD% --version
if errorlevel 1 (
    echo ERROR: npm test failed
    pause
    exit /b 1
) else (
    echo npm test passed
)

echo.
echo Current directory contents:
dir /b *.json *.js *.md *.bat *.cmd *.ini

echo.
echo Node modules check:
if exist node_modules (
    echo node_modules directory exists
    dir node_modules /b | find /c /v "" > temp_count.txt
    set /p node_count=<temp_count.txt
    del temp_count.txt
    echo Found !node_count! items in node_modules
) else (
    echo node_modules directory does not exist
)

echo.
echo Package.json check:
if exist package.json (
    echo package.json exists
    type package.json | findstr /C:"name" /C:"version"
) else (
    echo ERROR: package.json not found
    pause
    exit /b 1
)

echo.
echo Dependency check completed successfully!
echo.
echo Ready to proceed with deployment...
pause

:: Continue with actual deployment if all checks pass
echo.
echo [1/6] Installing/updating dependencies...
%NPM_CMD% install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/6] Building the website...
%NPM_CMD% run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo.
echo You can now run the full deploy.cmd or continue manually...
pause