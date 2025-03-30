#!/bin/bash

# Build script for the Concept Activation Network MCP Server

echo "Building Concept Activation Network MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_VERSION_MAJOR=$(echo $NODE_VERSION | cut -d '.' -f 1)

if [ "$NODE_VERSION_MAJOR" -lt 18 ]; then
    echo "Error: Node.js version 18 or higher is required"
    echo "Current version: $NODE_VERSION"
    exit 1
fi

echo "Node.js version: $NODE_VERSION - OK"

# Install dependencies
echo "Installing dependencies..."
npm install

# Verify file structure
echo "Verifying file structure..."

required_files=(
    "can-server.js"
    "concept-network.js"
    "session-manager.js"
    "mcp-tools.js"
    "package.json"
    "README.md"
)

missing_files=false
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Error: Required file '$file' is missing"
        missing_files=true
    fi
done

if [ "$missing_files" = true ]; then
    exit 1
fi

echo "File structure verification - OK"

# Run linting if eslint is installed
if npm list | grep -q eslint; then
    echo "Running linting..."
    npm run lint
    
    if [ $? -ne 0 ]; then
        echo "Warning: Linting found issues"
    else
        echo "Linting - OK"
    fi
fi

# Perform basic syntax check
echo "Checking JavaScript syntax..."
for file in $(find . -name "*.js" -not -path "./node_modules/*"); do
    node --check "$file"
    if [ $? -ne 0 ]; then
        echo "Error: Syntax check failed for $file"
        exit 1
    fi
done

echo "Syntax check - OK"

echo "Build completed successfully!"
echo "You can start the server with: npm start"

exit 0
