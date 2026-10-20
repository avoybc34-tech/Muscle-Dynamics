@echo off
setlocal
cd /d "%~dp0"
title Muscle Dynamics - iPhone cloud build
echo Muscle Dynamics - guided iPhone build
echo Expo and Apple prompts require your own accounts. Git is not required.
where node >nul 2>&1
if errorlevel 1 (
  echo Install Node.js 22 LTS, then reopen this launcher.
  pause
  exit /b 1
)
node scripts\build-ios.mjs %*
set "BUILD_EXIT=%ERRORLEVEL%"
echo.
if not "%BUILD_EXIT%"=="0" echo Build stopped. Read the error above before retrying.
pause
exit /b %BUILD_EXIT%
