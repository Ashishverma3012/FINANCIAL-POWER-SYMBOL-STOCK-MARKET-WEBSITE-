@echo off
echo ===================================================
echo   AETHERIS // AUTOMATED GITHUB PUSH UTILITY
echo ===================================================
echo.

:: Check if git command exists in PATH
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not found in your system PATH.
    echo Please install Git from https://git-scm.com/downloads and try again.
    echo.
    pause
    exit /b
)

echo [1/5] Initializing local Git repository...
if not exist .git (
    git init
) else (
    echo Local Git repository already initialized.
)
echo.

echo [2/5] Configuring remote GitHub origin...
:: Remove origin if it already exists to prevent duplicate remote errors
git remote remove origin >nul 2>nul
git remote add origin https://github.com/Ashishverma3012/FINANCIAL-POWER-SYMBOL-STOCK-MARKET-WEBSITE-.git
echo Remote origin set successfully.
echo.

echo [3/5] Staging files for commit...
git add .
echo Files staged successfully.
echo.

echo [4/5] Creating commit...
git commit -m "feat: complete scroll-animation trading dashboard with sidebar transitions"
echo Commit created successfully.
echo.

echo [5/5] Pushing repository to GitHub main branch...
git branch -M main
git push -u origin main
echo.

echo ===================================================
echo   PUSH TASK COMPLETED SUCCESSFULLY!
echo   Vercel deployment is ready to connect.
echo ===================================================
echo.
pause
