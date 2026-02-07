# 📋 Chuẩn hóa Configuration

## ✅ ĐÃ CẬP NHẬT

### 1. Environment Variables (.env)

- ✓ REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID = 18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As

### 2. Files đã chuẩn hóa

- ✓ src/components/config/google.js - Dùng REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID
- ✓ src/services/googleSheets.js - Dùng REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID
- ✓ src/services/googleSheetsUserService.js - Import từ googleSheets.js

## 📊 CẤU TRÚC THỐNG NHẤT

### Google Sheets Config

```javascript
// TẤT CẢ dùng biến này:
process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID

// Fallback nếu không có:
"18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As"
```

### Files sử dụng

1. src/components/config/google.js
2. src/services/googleSheets.js
3. src/services/googleSheetsUserService.js
4. src/server.js (backend)

## 🔒 Content Security Policy (CSP) và API

Ứng dụng dùng **CSP** trong `public/index.html` (meta `Content-Security-Policy`). Chỉ các URL trong **connect-src** mới được gọi từ frontend (fetch, XHR, WebSocket).

- **API client** (`src/services/api/client.ts`): Trên **localhost:3000** (dev) dùng **proxy** (baseURL rỗng, request `/api/*` → CRA chuyển tới backend). Các service dùng path `/api/settings`, `/api/...`. Khi không dùng proxy (build/prod), dùng `REACT_APP_API_BASE_URL` = **origin backend không kèm /api** (vd: `http://localhost:5050` hoặc `https://api.mia.vn`).
- Nếu backend chạy **port khác** (vd: 5000, 8000): đã thêm `http://localhost:5000`, `http://localhost:8000`, `http://localhost:8080` vào **connect-src**.
- Nếu bạn set **REACT_APP_API_BASE_URL** sang host/port khác: cần **thêm đúng URL đó** vào `connect-src` trong `public/index.html`, nếu không trình duyệt sẽ chặn request → **Network Error / CSP violation**.

## ✅ KẾT QUẢ

- Tất cả dùng 1 biến environment thống nhất
- Cấu trúc đã chuẩn hóa
- Ready to use!
