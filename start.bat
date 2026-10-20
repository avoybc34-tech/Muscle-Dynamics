@echo off
setlocal
cd /d "%~dp0"
echo Muscle Dynamics - local website and API - MariaDB edition
echo Do not double-click public\index.html. This website needs its server.
where node >nul 2>&1
if errorlevel 1 (echo Install Node.js 22 LTS first. & pause & exit /b 1)
node scripts\local-setup.mjs
if errorlevel 1 (pause & exit /b 1)
if not exist node_modules (
  call npm ci
  if errorlevel 1 (pause & exit /b 1)
)
call npm run db:generate
if errorlevel 1 (pause & exit /b 1)
call npm run db:deploy
if errorlevel 1 (echo Check MariaDB is running and DATABASE_URL is correct. & pause & exit /b 1)
echo Open http://localhost:3000 - first owner setup: http://localhost:3000/setup.html
call npm run dev
pause
