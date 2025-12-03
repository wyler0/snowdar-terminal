#!/bin/bash

# SNOWDAR - Start Script
# ======================

cd "$(dirname "$0")"

echo ""
echo "  ❄️  SNOWDAR Terminal  ❄️"
echo "  ========================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "  ❌ Node.js is not installed!"
    echo "  Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "  📦 Installing dependencies..."
    npm install
    echo ""
fi

# Kill any existing server on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null

echo "  🚀 Starting server..."
echo "  Open http://localhost:8080 in your browser"
echo ""
echo "  Press Ctrl+C to stop"
echo ""

node server.js

