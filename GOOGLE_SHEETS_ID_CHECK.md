# 📊 Google Sheets ID Check

**Date**: 27 October 2024

---

## 🔍 Tìm Thấy 2 Google Sheet IDs

### ID 1: Default (Trong Code)
**ID**: `18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`
**Link**: https://docs.google.com/spreadsheets/d/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As/edit

**Nơi sử dụng**:
- `src/config/google.js` (default fallback)
- `src/config/googleConfig.js`
- Tất cả documentation về Users sheet

**Status**: ⚠️ **Không rõ sheet này đã được tạo chưa**

---

### ID 2: User Provided (Trong CREDENTIALS)
**ID**: `1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k`
**Link**: https://docs.google.com/spreadsheets/d/1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k

**Nơi sử dụng**:
- `.env` (nếu đã set)
- `update-env.sh`
- `CREDENTIALS_STATUS.md`
- `GOOGLE_SHEETS_SETUP_GUIDE.md`

**Status**: ✅ **Sheet này đã được user cung cấp**

---

## ❓ Vấn Đề

Hiện tại code đang dùng **ID 1** (`18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`) làm default, nhưng user đã cung cấp **ID 2** (`1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k`).

---

## ✅ Giải Pháp

### Cần Xác Định Sheet Nào Đang Được Dùng

**Kiểm tra file `.env`**:
```bash
cat .env | grep SPREADSHEET_ID
```

**Nếu có `REACT_APP_GOOGLE_SPREADSHEET_ID` trong `.env`**:
- App sẽ dùng giá trị trong `.env`
- Nếu không có, dùng default `18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`

---

## 🎯 Khuyến Nghị

### Option 1: Dùng Sheet Của User (ID 2)
```bash
# Set trong .env
REACT_APP_GOOGLE_SPREADSHEET_ID=1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k
```

### Option 2: Update Default Trong Code
Sửa `src/config/google.js`:
```javascript
SPREADSHEET_ID:
  process.env.REACT_APP_GOOGLE_SPREADSHEET_ID ||
  "1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k", // ID của user
```

---

## ✅ Action Items

1. ✅ Đã phát hiện 2 Google Sheet IDs
2. ⏳ Cần xác định sheet nào đang được dùng
3. ⏳ Cần tạo "Users" sheet trong sheet đó
4. ⏳ Test authentication với sheet được chọn

---

**Next Step**: Kiểm tra file `.env` để xem ID nào đang được dùng!
