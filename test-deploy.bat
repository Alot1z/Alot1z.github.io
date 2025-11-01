@echo off
echo Testing deployment...
echo.

echo [1/3] Building website...
npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo Build successful!

echo.
echo [2/3] Committing changes...
git add .
git commit -m "Test deployment - %date% %time%"
if errorlevel 1 (
    echo ERROR: Commit failed!
    pause
    exit /b 1
)
echo Commit successful!

echo.
echo [3/3] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo ERROR: Push failed!
    pause
    exit /b 1
)
echo Push successful!

echo.
echo ================================================
echo SUCCESS! Website deployed to GitHub Pages!
echo ================================================
echo.
echo Visit: https://Alot1z.github.io
echo.

start https://Alot1z.github.io
pause
