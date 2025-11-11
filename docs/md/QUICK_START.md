# 🚀 QUICK START - MIA LOGISTICS MANAGER

## Cách Nhanh Nhất Để Chạy Ứng Dụng

### ⚡ One-Command Start (Khuyến nghị)

```bash
./start.sh
```

Script này sẽ tự động:
- ✅ Kill các process cũ (ports 3000, 3001, 8080)
- ✅ Cài dependencies nếu chưa có
- ✅ Start Backend API (port 3001)
- ✅ Start Frontend (port 3000)

---

## 📋 Manual Start (Nếu cần)

### Terminal 1 - Backend (Port 3001)
```bash
cd backend
npm install        # Lần đầu tiên
npm start
```

### Terminal 2 - Frontend (Port 3000)
```bash
npm install        # Lần đầu tiên
npm start
```

---

## 🌐 URLs

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://localhost:3000 | 3000 |
| **Backend API** | http://localhost:3001 | 3001 |
| **Health Check** | http://localhost:3001/health | 3001 |

---

## 🔍 Kiểm Tra Status

### Check Backend
```bash
curl http://localhost:3001/health
```

### Check Frontend
```bash
# Mở browser: http://localhost:3000
```

### Check Ports
```bash
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
```

---

## ⚠️ Troubleshooting

### Port đã được sử dụng
```bash
# Kill port 3000
lsof -ti:3000 | xargs kill -9

# Kill port 3001
lsof -ti:3001 | xargs kill -9
```

### Frontend không load
```bash
# Clear cache và rebuild
rm -rf node_modules build
npm install --legacy-peer-deps
npm start
```

### Backend không kết nối
```bash
# Check logs
tail -f logs/backend.log

# Restart backend
cd backend
npm start
```

### Connection Status màu đỏ
1. Check backend đang chạy: `lsof -i :3001`
2. Check health: `curl localhost:3001/health`
3. Xem connection status trong header app

---

## 🛑 Stop Services

### Dừng bằng start.sh
```bash
# Press Ctrl+C trong terminal đang chạy start.sh
# Tự động kill cả frontend và backend
```

### Dừng thủ công
```bash
# Kill frontend
lsof -ti:3000 | xargs kill -9

# Kill backend
lsof -ti:3001 | xargs kill -9
```

---

## 📊 Connection Status Indicator

Sau khi start xong, mở http://localhost:3000 và xem header:

```
[🟢 Backend: Kết nối :3001] [🟢 Google Sheets: Kết nối]
```

- 🟢 Green = Kết nối OK
- 🔴 Red = Mất kết nối

---

## 🎯 Next Steps

Sau khi start thành công:

1. ✅ **Test Frontend**: http://localhost:3000
2. ✅ **Test Backend**: http://localhost:3001/health
3. ✅ **Check Connection Status** trong header
4. ✅ **Test AI Dashboard**: http://localhost:3000/ai-analytics
5. ✅ **Test Logistics Widget**: Click vào Dashboard

---

## 📝 Scripts Available

```bash
./start.sh              # Start all services
npm start               # Start frontend only
cd backend && npm start # Start backend only
npm run dev             # Start with concurrently (if configured)
```

---

## 🆘 Need Help?

### Check Logs
```bash
# Backend logs
tail -f logs/backend.log

# Frontend logs (in terminal)
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | Kill process: `lsof -ti:PORT \| xargs kill -9` |
| Module not found | Run: `npm install --legacy-peer-deps` |
| Backend not starting | Check backend/package.json exists |
| White screen | Clear cache, rebuild |
| Connection red | Restart backend first |

---

**💡 Tip:** Luôn dùng `./start.sh` để đảm bảo cả hai services start đúng cách!

---

**🎉 Chúc bạn development vui vẻ!** 🚀

