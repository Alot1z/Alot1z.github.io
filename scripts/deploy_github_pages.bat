@echo off
echo ========================================
echo 🚀 Deploy to GitHub Pages
echo ========================================
echo.

echo 📋 Clearing local build directory...
if exist "G:\GITHUB-REPOs\Alot1z.github.io\_build" rmdir /s /q "G:\GITHUB-REPOs\Alot1z.github.io\_build"
echo.

echo 📁 Copying static files...
xcopy "G:\GITHUB-APIs\Alot1z.github.io\static\*" "G:\GITHUB-REPOs\Alot1z.github.io\_build\static" /E /Y /E

echo 📄 Building website...
cd "G:\GITHUB-REPOs\Alot1z.github.io\_build"
call npm run build

echo 📤 Committing to Git...
cd "G:\GITHUB-REPOs\Alot1z.github.io"
git add .
git add -A
git commit -m "🚀 Auto-deploy GitHub Repository Wiki System - %(date%)"
git push origin main

echo ========================================
echo ✅ Deployment complete!
echo ========================================
echo 📊 Your wiki is now live at: https://Alot1z.github.io
echo.

echo.
echo 🔄 Cleaning up build directory...
if exist "G:\GITHUB-REPOs\Alot1z.github.io\_build" rmdir /s /q "G:\GITHUB-REPOs\Alot1z.github.io\_build"

echo.
pause
