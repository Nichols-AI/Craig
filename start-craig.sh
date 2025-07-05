#!/bin/bash

# Craig Quick Start Script
# Kills all servers and starts Craig desktop application

echo "🚀 Craig Quick Start Script"
echo "=========================="

# Kill all node processes and servers
echo "🔄 Stopping all existing servers..."
pkill -f node 2>/dev/null || true
pkill -f "bun run" 2>/dev/null || true
pkill -f "npm run" 2>/dev/null || true
pkill -f "yarn" 2>/dev/null || true
pkill -f "pnpm" 2>/dev/null || true
pkill -f "tauri" 2>/dev/null || true
pkill -f "craig" 2>/dev/null || true

# Wait a moment for processes to terminate
sleep 2

echo "✅ All servers stopped"

# Navigate to Craig directory
cd "$(dirname "$0")"

echo "📁 Current directory: $(pwd)"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src-tauri" ]; then
    echo "❌ Error: Not in Craig project directory"
    echo "   Please run this script from the Craig project root"
    exit 1
fi

echo "🔧 Installing dependencies (if needed)..."
bun install --silent

echo "🚀 Starting Craig desktop application..."
echo "   This will open the Craig GUI"
echo "   Press Ctrl+C to stop"

# Start Craig in development mode
bun run tauri dev