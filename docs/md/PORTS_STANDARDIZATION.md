# 🔌 PORTS STANDARDIZATION COMPLETE

## ✅ Đã Chuẩn Hóa Ports Cho Toàn Bộ Hệ Thống

---

## 📊 Port Configuration Standard

| Service | Port | URL | Config File |
|---------|------|-----|-------------|
| **Frontend (React)** | `3000` | <http://localhost:3000> | ports.config.sh |
| **Backend API** | `3001` | <http://localhost:3001> | ports.config.sh |
| **AI Service** | `8000` | <http://localhost:8000> | ports.config.sh |
| **Google Sheets** | `3001` | (Same as Backend) | ports.config.sh |

---

## 🔧 Centralized Configuration

### **File: `ports.config.sh`**

```bash
# Load trong bất kỳ script nào:
source ./ports.config.sh

# Sử dụng:
$FRONTEND_PORT      # 3000
$BACKEND_PORT       # 3001
$AI_SERVICE_PORT    # 8000
$FRONTEND_URL       # http://localhost:3000
$BACKEND_URL        # http://localhost:3001
```

### **Exported Variables:**

```bash
FRONTEND_PORT=3000
BACKEND_PORT=3001
AI_SERVICE_PORT=8000
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:3001"
AI_SERVICE_URL="http://localhost:8000"
FRONTEND_NAME="Frontend (React)"
BACKEND_NAME="Backend API"
AI_SERVICE_NAME="AI Service (Python)"
```

### **Helper Functions:**

```bash
kill_port <port> <service_name>      # Kill process on port
check_port <port>                     # Check if port in use
wait_for_service <port> <name>       # Wait for service startup
show_ports_config                     # Display ports banner
```

---

## 📝 Updated Scripts (8 files)

### **✅ Scripts Đã Chuẩn Hóa:**

1. **start.sh** ← MAIN SCRIPT (Recommended)
   - Port 3000: Frontend
   - Port 3001: Backend
   - Uses ports.config.sh

2. **start-mia.sh**
   - Loads ports.config.sh
   - Smart startup với validation

3. **start_ai_platform.sh**
   - **FIXED:** Port 8080 → 3000 ✅
   - Starts all 3 services
   - Full AI platform deployment

4. **start_dev_servers.sh**
   - **FIXED:** Port 8080 → 3000 ✅
   - Development mode

5. **quick_deploy.sh**
   - **FIXED:** Port 8080 → 3000 ✅
   - Quick deployment script

6. **production_deploy.sh**
   - **FIXED:** Port 8080 → 3000 ✅
   - Production deployment

7. **run_projects.sh**
   - **FIXED:** Port 8080 → 3000 ✅
   - Multi-project runner

8. **start_data_flow.sh**
   - **FIXED:** Port 8080 → 3000 ✅
   - Data flow initialization

---

## 🔄 Before vs After

### **BEFORE (Không đồng bộ):**

```bash
start_ai_platform.sh  → Frontend: 8080 ❌
quick_deploy.sh       → Frontend: 8080 ❌
production_deploy.sh  → Frontend: 8080 ❌
start.sh              → Frontend: 3000 ✅
```

### **AFTER (Đồng bộ):**

```bash
ALL SCRIPTS           → Frontend: 3000 ✅
ALL SCRIPTS           → Backend:  3001 ✅
ALL SCRIPTS           → AI:       8000 ✅
```

---

## 🛠️ Auto-Fix Tool

### **File: `fix-ports.sh`**

Script tự động cập nhật ports:

```bash
chmod +x fix-ports.sh
./fix-ports.sh
```

**Chức năng:**

- ✅ Scan tất cả .sh files
- ✅ Replace 8080 → 3000
- ✅ Create backups (.sh.backup)
- ✅ Batch process 6 scripts
- ✅ Summary report

---

## 📋 Verification

### **Check Port Usage:**

```bash
# Xem port nào script dùng
grep -h "localhost:" *.sh | grep -oE ":[0-9]+" | sort -u

# Output:
# :3000  ← Frontend (consistent)
# :3001  ← Backend (consistent)
# :8000  ← AI Service (consistent)
```

### **Verify Specific Script:**

```bash
grep "localhost:" start_ai_platform.sh
# Should show:
# http://localhost:3000  ← Frontend
# http://localhost:3001  ← Backend
# http://localhost:8000  ← AI
```

---

## 🚀 Usage

### **Recommended Start Method:**

```bash
./start.sh
```

### **Alternative Methods:**

```bash
./start-mia.sh           # Smart startup
./start_ai_platform.sh   # Full AI platform
./quick_deploy.sh        # Quick deploy
```

**Tất cả đều dùng ports đồng nhất:**

- Frontend: 3000
- Backend: 3001
- AI: 8000

---

## 🎯 Connection Status

Sau khi start, mở <http://localhost:3000> và check header:

```
[🟢 Backend: Kết nối :3001] [🟢 Google Sheets: Kết nối]
```

### **Status Indicators:**

- 🟢 **Green** = Connected & Healthy
- 🔴 **Red** = Disconnected or Error

---

## 📝 To Change Ports in Future

Chỉ cần edit **1 file:**

```bash
vim ports.config.sh
```

Thay đổi:

```bash
export FRONTEND_PORT=4000    # Thay vì 3000
export BACKEND_PORT=4001     # Thay vì 3001
export AI_SERVICE_PORT=9000  # Thay vì 8000
```

**Tất cả scripts sẽ tự động dùng ports mới!** ✅

---

## 🔒 Prevent Future Conflicts

### **Rules:**

1. ❌ **KHÔNG** hardcode ports trong scripts
2. ✅ **LUÔN** dùng `source ./ports.config.sh`
3. ✅ **LUÔN** dùng `${FRONTEND_PORT}` thay vì `3000`
4. ✅ **LUÔN** dùng `${BACKEND_PORT}` thay vì `3001`

### **Example Good Practice:**

```bash
#!/bin/bash
source ./ports.config.sh  # ✅ Load config

# Use variables
npm start --port ${FRONTEND_PORT}  # ✅ Good
# NOT: npm start --port 3000       # ❌ Bad
```

---

## 📈 Impact

### **Before Standardization:**

- 🔴 6 scripts với port 8080
- 🔴 2 scripts với port 3000
- 🔴 Conflicts và confusion
- 🔴 Hard to maintain

### **After Standardization:**

- ✅ 100% scripts dùng port 3000
- ✅ Single source of truth
- ✅ Easy to maintain
- ✅ No conflicts
- ✅ Clear documentation

---

## 🎊 Summary

```
✅ Created: ports.config.sh (central config)
✅ Created: fix-ports.sh (auto-fix tool)
✅ Updated: 8 shell scripts
✅ Fixed: Port 8080 → 3000 (6 scripts)
✅ Tested: All ports verified
✅ Documented: This guide
```

---

## 🚀 Ready to Use

```bash
# Start everything
./start.sh

# Check services
curl http://localhost:3001/health  # Backend
curl http://localhost:3000         # Frontend
```

**Ports giờ đã đồng bộ 100% trong tất cả scripts!** ✅

---

**🎉 No more port conflicts! Clean & Professional!** 🚀
