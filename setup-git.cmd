@echo off
echo ========================================
echo Git Setup for GitHub Deployment
echo ========================================
echo.

echo STEP 1: Check current git configuration
echo.
echo Current git user:
git config --global user.name
echo.
echo Current git email:
git config --global user.email
echo.

echo STEP 2: Check if credentials are configured
echo.
echo Credential helpers configured:
git config --global --get-regexp credential
echo.

echo STEP 3: Check remote repository
echo.
echo Current remotes:
git remote -v
echo.

echo STEP 4: Test GitHub connection
echo.
echo Testing SSH connection to GitHub...
ssh -T git@github.com
echo.

echo ========================================
echo Setup Instructions
echo ========================================
echo.
echo If SSH connection failed above, you need to:
echo.
echo 1. SETUP SSH KEYS:
echo    ssh-keygen -t ed25519 -C "your_email@example.com"
echo    eval "$(ssh-agent -s)"
echo    ssh-add ~/.ssh/id_ed25519
echo    cat ~/.ssh/id_ed25519.pub
echo    # Copy the output and add it to GitHub Settings > SSH Keys
echo.
echo 2. CONFIGURE GIT USER:
echo    git config --global user.name "Your Name"
echo    git config --global user.email "your_email@example.com"
echo.
echo 3. TEST CONNECTION:
echo    ssh -T git@github.com
echo.
echo 4. ALTERNATIVE: Use HTTPS with Personal Access Token:
echo    git remote set-url origin https://github.com/Alot1z/Alot1z.github.io.git
echo    # You'll be prompted for username and token (not password)
echo.
echo ========================================
echo Current Status
echo ========================================
echo.

:: Check if we can push without authentication
echo Testing push permissions...
git push --dry-run origin main 2>&1
if errorlevel 1 (
    echo PUSH TEST FAILED - Authentication needed
) else (
    echo PUSH TEST PASSED - Authentication working
)

echo.
echo Press any key to exit...
pause >nul