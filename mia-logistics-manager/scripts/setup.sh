#!/bin/bash

# ========================================
# MIA.vn Logistics - Setup Script
# ========================================
# Script tự động để setup project lần đầu
# Usage: ./scripts/setup.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# ========================================
# Step 1: Check Prerequisites
# ========================================
print_header "Step 1: Checking Prerequisites"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node -v)
    print_success "Node.js installed: $NODE_VERSION"

    # Check if version >= 18
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_error "Node.js version must be >= 18.x"
        print_info "Current version: $NODE_VERSION"
        print_info "Please upgrade: https://nodejs.org/"
        exit 1
    fi
else
    print_error "Node.js not found"
    print_info "Please install Node.js >= 18.x from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    print_success "npm installed: $NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

# Check Git
if command_exists git; then
    GIT_VERSION=$(git --version)
    print_success "Git installed: $GIT_VERSION"
else
    print_warning "Git not found (optional but recommended)"
fi

echo ""

# ========================================
# Step 2: Setup Environment Variables
# ========================================
print_header "Step 2: Setup Environment Variables"

if [ ! -f .env ]; then
    print_info "Creating .env file from template..."
    cp .env.example .env
    print_success ".env file created"
    print_warning "Please edit .env and fill in your API keys:"
    print_info "  - REACT_APP_GOOGLE_MAPS_API_KEY"
    print_info "  - REACT_APP_SPREADSHEET_ID"
    print_info "  - REACT_APP_TELEGRAM_BOT_TOKEN"
    echo ""
    read -p "Press Enter when you've updated .env file..."
else
    print_success ".env file already exists"
fi

echo ""

# ========================================
# Step 3: Install Dependencies
# ========================================
print_header "Step 3: Installing Dependencies"

print_info "Installing npm packages (this may take a few minutes)..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

echo ""

# ========================================
# Step 4: Setup Git Hooks (if Git available)
# ========================================
if command_exists git && [ -d .git ]; then
    print_header "Step 4: Setup Git Hooks"

    print_info "Setting up Husky for pre-commit hooks..."
    npm run prepare

    if [ $? -eq 0 ]; then
        print_success "Git hooks configured"
    else
        print_warning "Failed to setup Git hooks (continuing...)"
    fi
else
    print_header "Step 4: Skip Git Hooks (Git not initialized)"
fi

echo ""

# ========================================
# Step 5: Verify Setup
# ========================================
print_header "Step 5: Verifying Setup"

# Type check
print_info "Running TypeScript type check..."
npm run type-check

if [ $? -eq 0 ]; then
    print_success "TypeScript check passed"
else
    print_error "TypeScript check failed"
    print_info "Please fix TypeScript errors before continuing"
    exit 1
fi

# Linting
print_info "Running linter..."
npm run lint

if [ $? -eq 0 ]; then
    print_success "Linting passed"
else
    print_warning "Linting issues found (you can fix them later)"
fi

echo ""

# ========================================
# Step 6: Test Build
# ========================================
print_header "Step 6: Testing Build"

print_info "Running test build..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build successful"
else
    print_error "Build failed"
    print_info "Please check error messages above"
    exit 1
fi

echo ""

# ========================================
# Step 7: Setup Complete
# ========================================
print_header "Setup Complete! 🎉"

echo ""
print_success "Project setup completed successfully!"
echo ""
print_info "Next steps:"
echo "  1. Review and update .env with your API keys"
echo "  2. Start development server: ${GREEN}npm run dev${NC}"
echo "  3. Open browser: ${GREEN}http://localhost:3000${NC}"
echo ""
print_info "Useful commands:"
echo "  - ${GREEN}npm run dev${NC}         # Start dev server"
echo "  - ${GREEN}npm run test${NC}        # Run tests"
echo "  - ${GREEN}npm run build${NC}       # Build for production"
echo "  - ${GREEN}npm run lint${NC}        # Run linter"
echo ""
print_info "Documentation:"
echo "  - README.md          # Getting started"
echo "  - CONTRIBUTING.md    # How to contribute"
echo "  - docs/ARCHITECTURE.md  # System architecture"
echo ""
print_warning "Important reminders:"
echo "  - Never commit .env file to Git"
echo "  - Rotate API keys regularly"
echo "  - Run tests before pushing code"
echo ""

# Ask if user wants to start dev server
read -p "Start development server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Starting development server..."
    npm run dev
fi

# ========================================
# END OF SCRIPT
# ========================================
