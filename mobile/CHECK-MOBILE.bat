@echo off
setlocal
cd /d "%~dp0"
node scripts\build-ios.mjs --check-only
set "CHECK_EXIT=%ERRORLEVEL%"
pause
exit /b %CHECK_EXIT%
