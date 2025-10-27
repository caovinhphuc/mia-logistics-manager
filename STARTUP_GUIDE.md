# 🚀 MIA Logistics Manager - Startup Guide

**Date**: 27 October 2024
**Status**: ✅ Ready to Start

---

## 🎯 Quick Start

### Method 1: Using Start Script (Recommended)
```bash
chmod +x start.sh
./start.sh
```

### Method 2: Manual Start
```bash
npm start
```

### Method 3: Using Node Directly
```bash
PORT=3000 npm start
```

---

## 📋 Prerequisites

- ✅ Node.js installed
- ✅ npm installed
- ✅ Dependencies installed (`npm install`)
- ✅ Environment configured (`.env` file)

---

## 🔧 Startup Scripts

### 1. `start.sh` - Simple Startup
```bash
./start.sh
```
- Kills old processes
- Checks dependencies
- Starts CRA development server
- Runs on port 3000

### 2. `start-project.sh` - Full Project Startup
```bash
./start-project.sh
```
- Includes backend server
- More comprehensive setup
- For full-stack development

---

## 🌐 Access URLs

Once started, access the application at:
- **Main App**: http://localhost:3000
- **Login Page**: http://localhost:3000/login (if not authenticated)

---

## ⏱️ Startup Time

First compilation: **30-60 seconds**
Subsequent starts: **10-20 seconds**

---

## 🔐 Login Credentials

After startup, login with:

### Admin
- Email: `admin@mialogistics.com`
- Password: `admin123`

### Manager
- Email: `manager@mialogistics.com`
- Password: `manager123`

### Operator
- Email: `operator@mialogistics.com`
- Password: `operator123`

### Driver
- Email: `driver@mialogistics.com`
- Password: `driver123`

---

## 🛑 Stopping the Application

Press `Ctrl+C` in the terminal

Or manually kill the process:
```bash
lsof -ti:3000 | xargs kill -9
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Not Installed
```bash
npm install
```

### Module Not Found Errors
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Compilation Errors
```bash
# Check for syntax errors
npm run build
```

---

## 📝 Current Status

✅ Authentication System: **Implemented**
✅ Login Page: **Created**
✅ Protected Routes: **Active**
✅ Context Providers: **Configured**
⏳ App: **Starting...**

---

## 🎯 Next Steps After Startup

1. Open http://localhost:3000
2. Login with test credentials
3. Test authentication flow
4. Explore dashboard
5. Test features

---

**Ready to start!** 🚀
