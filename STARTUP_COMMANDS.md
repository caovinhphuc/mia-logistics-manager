# 🚀 Startup Commands - MIA Logistics Manager

**Date**: 27 October 2024

---

## 📋 Available Commands

### 1. Development Server
```bash
npm start
# or
npm run dev
```
- Starts development server with hot reload
- Runs on `http://localhost:3000` (default)
- Uses `craco start` internally

### 2. Production Build
```bash
npm run build
```
- Creates optimized production build
- Output: `build/` directory

### 3. Production Server
```bash
npm run serve
```
- Serves production build
- Runs on `http://localhost:3000`

### 4. Full Project Startup (Script)
```bash
./start-project.sh
# or
chmod +x start-project.sh && ./start-project.sh
```

**What it does:**
- ✅ Cleans old processes (kills node processes)
- ✅ Frees ports (3000, 5050)
- ✅ Installs dependencies
- ✅ Starts backend (port 5050)
- ✅ Starts frontend (port 3000)
- ✅ Shows status

---

## 🔧 Manual Startup

### Option 1: Frontend Only
```bash
npm start
```

### Option 2: Frontend with Custom Port
```bash
PORT=3000 npm start
```

### Option 3: Frontend with Clean Cache
```bash
rm -rf node_modules/.cache
npm start
```

### Option 4: Full Clean Start
```bash
rm -rf node_modules/.cache
pkill -f "react-scripts"
npm start
```

---

## 🐛 Troubleshooting

### Issue 1: Port Already in Use
```bash
# Free port 3000
lsof -ti:3000 | xargs kill -9

# Free port 5050
lsof -ti:5050 | xargs kill -9
```

### Issue 2: Module Not Found
```bash
# Clear cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue 3: Build Errors
```bash
# Clear all caches
rm -rf node_modules/.cache build/.cache

# Clean build
npm run build
```

---

## 📝 Current Status

- ✅ Frontend compiles successfully
- ✅ Login & Profile components exist
- ⚠️ Module resolution issues (cache problem)
- ⚠️ Need to restart with clean cache

---

## 🎯 Next Steps

1. Stop current server
2. Clear cache
3. Restart server
4. Test login page

---

**Recommended Command**:
```bash
rm -rf node_modules/.cache && npm start
```
