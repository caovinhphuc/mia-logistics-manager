# 🚀 Quick Start Guide

## Khởi động nhanh dự án

### ⚡ Cách đơn giản nhất (Khuyến nghị)

```bash
# Khởi động Frontend + Backend
./quick-start.sh

# Hoặc dùng npm
npm run quick-start
```

Sau khi chạy, mở trình duyệt:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### 🛑 Dừng dự án

```bash
./stop.sh

# Hoặc dùng npm
npm run stop
```

---

## 📋 Các cách khởi động khác

### 1. Chỉ Frontend

```bash
npm start
# → http://localhost:3000
```

### 2. Chỉ Backend

```bash
npm run backend
# hoặc
cd backend && npm start
# → http://localhost:3001
```

### 3. Frontend + Backend (đơn giản)

```bash
npm run dev:simple
# → Frontend: http://localhost:3000
# → Backend: http://localhost:3001
```

### 4. Tất cả services (Frontend + Backend + AI Service)

```bash
npm run dev
# → Frontend: http://localhost:3000
# → Backend: http://localhost:3001
# → AI Service: http://localhost:8000
```

---

## 📝 Xem logs

```bash
# Frontend
tail -f logs/frontend.log

# Backend
tail -f logs/backend.log

# Cả hai
tail -f logs/frontend.log logs/backend.log
```

---

## 🔧 Troubleshooting

### Port đã được sử dụng

```bash
# Dừng tất cả
./stop.sh

# Hoặc kill process trên port cụ thể
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Dependencies chưa cài

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

---

## 📚 Scripts có sẵn

| Script               | Mô tả                              |
| -------------------- | ---------------------------------- |
| `quick-start.sh`     | Khởi động nhanh Frontend + Backend |
| `stop.sh`            | Dừng tất cả services               |
| `npm start`          | Chỉ Frontend                       |
| `npm run backend`    | Chỉ Backend                        |
| `npm run dev:simple` | Frontend + Backend (concurrently)  |
| `npm run dev`        | Tất cả services                    |

---

## 💡 Lưu ý

- **Quick Start** là cách đơn giản nhất, chỉ khởi động Frontend + Backend (đủ cho hầu hết các trường hợp)
- Nếu cần AI Service hoặc Automation, dùng `npm run dev` hoặc các script khác
- Tất cả logs được lưu trong thư mục `logs/`
