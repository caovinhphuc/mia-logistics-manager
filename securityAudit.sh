#!/bin/bash

# MIA Logistics Manager - Security Audit Script
echo "🔒 MIA Logistics Manager - Security Audit"
echo "========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check for sensitive information in code
print_info "Checking for sensitive information..."
HAS_SENSITIVE=0
if grep -r "password\|secret\|key\|token" src/ --include="*.js" --include="*.jsx" | grep -v "REACT_APP_" | grep -v "process.env"; then
    print_warning "Potential sensitive information found in code"
    HAS_SENSITIVE=1
else
    print_status "No sensitive information found in code"
fi

# Check for console.log statements in production
print_info "Checking for console.log statements..."
HAS_CONSOLE_LOGS=0
if grep -r "console\.log\|console\.warn\|console\.error" src/ --include="*.js" --include="*.jsx" | grep -v "development"; then
    print_warning "Console statements found - consider removing for production"
    HAS_CONSOLE_LOGS=1
else
    print_status "No console statements found"
fi

# Check for unused dependencies
print_info "Checking for unused dependencies..."
HAS_UNUSED_DEPS=0
if [ -f "node_modules/.bin/depcheck" ]; then
    UNUSED_OUTPUT=$(node_modules/.bin/depcheck 2>&1)
    echo "$UNUSED_OUTPUT"
    if echo "$UNUSED_OUTPUT" | grep -q "Unused dependencies"; then
        HAS_UNUSED_DEPS=1
    fi
else
    print_warning "depcheck not installed locally - run: npm install --save-dev depcheck"
    HAS_UNUSED_DEPS=1
fi

# Check for security vulnerabilities
print_info "Checking for security vulnerabilities..."
HAS_VULNS=0
AUDIT_OUTPUT=$(npm audit 2>&1)
AUDIT_STATUS=$?
echo "$AUDIT_OUTPUT"
if [ $AUDIT_STATUS -ne 0 ]; then
    HAS_VULNS=1
fi

# Check for outdated packages
print_info "Checking for outdated packages..."
HAS_OUTDATED=0
OUTDATED_OUTPUT=$(npm outdated 2>&1)
if [ -n "$OUTDATED_OUTPUT" ]; then
    echo "$OUTDATED_OUTPUT"
    HAS_OUTDATED=1
else
    print_status "No outdated packages detected"
fi

# Check environment variables
print_info "Checking environment variables..."
if [ -f ".env" ]; then
    if grep -q "YOUR_" .env || grep -q "your_" .env; then
        print_warning "Placeholder values found in .env file"
    else
        print_status "Environment variables appear to be configured"
        ENV_OK=1
    fi
else
    print_error ".env file not found"
    ENV_OK=0
fi

# Check build output for sensitive information
print_info "Checking build output..."
BUILD_OK=1
if [ -d "build" ]; then
    if grep -r "password\|secret\|key\|token" build/ | grep -v "REACT_APP_"; then
        print_warning "Potential sensitive information found in build"
        BUILD_OK=0
    else
        print_status "Build output appears clean"
    fi
else
    print_warning "Build directory not found - run: npm run build"
    BUILD_OK=0
fi

echo ""
print_info "Security audit completed!"
echo ""
echo "📋 Security Checklist:"
echo "======================"
if [ $HAS_SENSITIVE -eq 0 ]; then
echo "✓ No sensitive information in code"
else
    echo "✗ Review code for sensitive information"
fi

if [ $HAS_CONSOLE_LOGS -eq 0 ]; then
echo "✓ No console statements in production"
else
    echo "✗ Remove console statements before production"
fi

if [ $HAS_VULNS -eq 0 ]; then
    echo "✓ No known security vulnerabilities"
else
    echo "✗ Address security vulnerabilities"
fi

if [ "${ENV_OK:-0}" -eq 1 ]; then
echo "✓ Environment variables configured"
else
    echo "✗ Verify environment variable setup"
fi

if [ $BUILD_OK -eq 1 ]; then
echo "✓ Build output clean"
else
    echo "✗ Build artifacts need review"
fi
echo ""
echo "🔒 Security Best Practices:"
echo "=========================="
echo "1. Use HTTPS in production"
echo "2. Implement Content Security Policy"
echo "3. Validate all inputs"
echo "4. Sanitize outputs"
echo "5. Monitor for suspicious activity"
echo "6. Keep dependencies updated"
echo "7. Use environment variables for secrets"
echo "8. Implement rate limiting"
echo "9. Enable security headers"
echo "10. Regular security audits"
