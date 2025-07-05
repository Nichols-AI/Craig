@echo off
REM Craig Quick Start Script for Windows
REM Kills all servers and starts Craig desktop application

echo 🚀 Craig Quick Start Script
echo ==========================

REM Kill all node processes and servers
echo 🔄 Stopping all existing servers...
taskkill /f /im node.exe 2>nul
taskkill /f /im bun.exe 2>nul
taskkill /f /im npm.exe 2>nul
taskkill /f /im yarn.exe 2>nul
taskkill /f /im pnpm.exe 2>nul
taskkill /f /im craig.exe 2>nul

REM Wait a moment for processes to terminate
timeout /t 2 /nobreak >nul

echo ✅ All servers stopped

REM Navigate to Craig directory
cd /d "%~dp0"

echo 📁 Current directory: %cd%

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Not in Craig project directory
    echo    Please run this script from the Craig project root
    pause
    exit /b 1
)

if not exist "src-tauri" (
    echo ❌ Error: Not in Craig project directory
    echo    Please run this script from the Craig project root
    pause
    exit /b 1
)

echo 🔧 Installing dependencies if needed...
bun install --silent

echo 🚀 Starting Craig desktop application...
echo    This will open the Craig GUI
echo    Press Ctrl+C to stop

REM Start Craig in development mode
bun run tauri dev