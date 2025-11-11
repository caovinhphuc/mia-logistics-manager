# 🚀 Quick Setup Google Apps Script

## ✅ URL Đã Sẵn Sàng

URL Google Apps Script đã được deploy:

```
https://script.google.com/macros/s/AKfycbzwaH8tFHn2pB9kF6ikA_DA5LZStyK4dBYS3PIFEhi4EUjmoIehiMEqMNS6afEPrpL0qg/exec
```

## 📋 Bước 1: Thêm vào .env

Thêm dòng này vào file `.env` ở project root:

```bash
REACT_APP_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/AKfycbzwaH8tFHn2pB9kF6ikA_DA5LZStyK4dBYS3PIFEhi4EUjmoIehiMEqMNS6afEPrpL0qg/exec
```

## 📋 Bước 2: Test

Chạy script test:

```bash
./test-apps-script.sh
```

Hoặc test thủ công:

```bash
curl "https://script.google.com/macros/s/AKfycbzwaH8tFHn2pB9kF6ikA_DA5LZStyK4dBYS3PIFEhi4EUjmoIehiMEqMNS6afEPrpL0qg/exec?origin=Ho+Chi+Minh+City&destination=Hanoi"
```

**Kết quả mong đợi:**

```json
{
  "success": true,
  "distance": 16.95,
  "duration": 34,
  "method": "google_maps_services"
}
```

## 📋 Bước 3: Restart Frontend

```bash
# Stop frontend (Ctrl+C)
# Start lại
npm start
```

## ✅ Done

Frontend tự động sử dụng Google Apps Script để tính khoảng cách thực tế.

**Lưu ý:**

- ✅ Script **KHÔNG CẦN** Google Maps API Key - sử dụng Google Maps Services có sẵn trong Apps Script
- ✅ Script sử dụng DirectionFinder để tính khoảng cách đường bộ chính xác, fallback về Haversine nếu cần
- ✅ Nếu không có URL trong `.env`, hệ thống sẽ dùng mock data
- ✅ Format response: `{ success: true, distance: 16.95, duration: 34, method: "google_maps_services" }`

## 🔍 Troubleshooting

### Script trả về lỗi "Missing origin or destination parameter"

→ Kiểm tra URL có đầy đủ parameters không

### Script trả về HTML thay vì JSON

→ Đây là redirect bình thường của Google Apps Script, frontend sẽ tự xử lý

### Distance luôn là mock data

→ Kiểm tra `REACT_APP_APPS_SCRIPT_WEB_APP_URL` đã được set trong `.env` và đã restart frontend

Xem chi tiết: `docs/GOOGLE_APPS_SCRIPT_SETUP.md`
