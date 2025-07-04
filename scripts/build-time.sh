#!/bin/bash

# Build time monitoring script for Craig development

echo "🚀 Craig Build Performance Monitor"
echo "=================================="

# Frontend build timing
echo "📦 Building Frontend..."
start_time=$(date +%s.%N)
npm run build > /dev/null 2>&1
frontend_time=$(echo "$(date +%s.%N) - $start_time" | bc)
echo "✅ Frontend built in ${frontend_time}s"

# Rust build timing (dev)
echo "🦀 Building Rust (dev)..."
cd src-tauri
start_time=$(date +%s.%N)
cargo build > /dev/null 2>&1
rust_dev_time=$(echo "$(date +%s.%N) - $start_time" | bc)
echo "✅ Rust dev built in ${rust_dev_time}s"

# Rust build timing (release) - Optional
read -p "🚀 Build Rust release? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🦀 Building Rust (release)..."
    start_time=$(date +%s.%N)
    cargo build --release > /dev/null 2>&1
    rust_release_time=$(echo "$(date +%s.%N) - $start_time" | bc)
    echo "✅ Rust release built in ${rust_release_time}s"
fi

cd ..

echo "=================================="
echo "📊 Build Performance Summary:"
echo "Frontend: ${frontend_time}s"
echo "Rust Dev: ${rust_dev_time}s"
if [[ ! -z "$rust_release_time" ]]; then
    echo "Rust Release: ${rust_release_time}s"
fi
echo "=================================="