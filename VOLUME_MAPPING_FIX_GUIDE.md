# 🔧 HƯỚNG DẪN SỬA LỖI VOLUME CALCULATIONS MAPPING

---

## 🎯 **VẤN ĐỀ HIỆN TẠI**

Từ hình ảnh bạn cung cấp, tôi thấy frontend đang hiển thị tất cả giá trị "1 kiện = khối (m3)" là 0, cho thấy dữ liệu chưa được load từ Google Sheets thành công.

---

## ✅ **CÁC BƯỚC ĐÃ THỰC HIỆN**

### **1. Cập nhật Default Values:**

```typescript
// ✅ Đã sửa từ unitVolume: 0 thành giá trị thực
const defaultRules: VolumeRule[] = [
  { id: "S", name: "Size S", unitVolume: 0.04, description: "" },     // ✅
  { id: "M", name: "Size M", unitVolume: 0.09, description: "" },     // ✅
  { id: "L", name: "Size L", unitVolume: 0.14, description: "" },     // ✅
  { id: "BAG_S", name: "Bao nhỏ", unitVolume: 0.01, description: "" }, // ✅
  { id: "BAG_M", name: "Bao trung", unitVolume: 0.05, description: "" }, // ✅
  { id: "BAG_L", name: "Bao lớn", unitVolume: 0.10, description: "" }, // ✅
  { id: "OTHER", name: "Khác", unitVolume: 0.00, description: "" },    // ✅
];
```

### **2. Cải thiện Loading Logic:**

```typescript
// ✅ Thêm loading state và error handling
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// ✅ Cải thiện useEffect với comprehensive error handling
useEffect(() => {
  (async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/settings/volume-rules?spreadsheetId=${SHEET_ID}`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      // ... mapping logic
    } catch (err) {
      // Fallback to defaults
      setRules(defaultRules);
    } finally {
      setLoading(false);
    }
  })();
}, []);
```

### **3. Cải thiện UI Feedback:**

```typescript
// ✅ Loading indicators
<Typography variant="body2" color="text.secondary">
  Định nghĩa khối lượng cho từng loại kiện hàng
  {loading && " - Đang tải dữ liệu..."}
</Typography>

// ✅ Error alerts
{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    Lỗi kết nối Google Sheets: {error}
  </Alert>
)}

// ✅ Dynamic empty message
emptyMessage={
  loading
    ? "Đang tải dữ liệu từ Google Sheets..."
    : editMode
      ? "Chưa có quy tắc nào. Thêm dòng để bắt đầu."
      : "Không có dữ liệu"
}
```

---

## 🔍 **BƯỚC TIẾP THEO - KIỂM TRA & DEBUG**

### **1. Kiểm tra Backend API:**

```bash
# Test API endpoint trực tiếp
curl "http://localhost:5050/api/settings/volume-rules"

# Kết quả mong muốn:
[
  {
    "id": "S",
    "name": "Size S",
    "unitVolume": "0.04",
    "description": "",
    "createdAt": "2025-10-31 ...",
    "updatedAt": "2025-10-31 ..."
  },
  // ... more rules
]
```

### **2. Kiểm tra Google Sheets Connection:**

```bash
# Test Google Sheets service account
curl "http://localhost:5050/api/_debug/file-info"

# Kết quả mong muốn:
{
  "serviceAccountExists": true,
  "spreadsheetId": "configured"
}
```

### **3. Kiểm tra Browser Network Tab:**

```
1. Mở DevTools (F12)
2. Vào tab Network
3. Refresh trang /transfers
4. Tìm request: /api/settings/volume-rules
5. Kiểm tra Response:
   - Status: 200 OK ✅
   - Response Body: Array với 7 objects ✅
   - unitVolume values: không phải "0" ✅
```

### **4. Kiểm tra Console Logs:**

```javascript
// Thêm temporary debug trong VolumeCalculator.tsx
useEffect(() => {
  (async () => {
    try {
      console.log('🔍 Loading volume rules from:', `/api/settings/volume-rules?spreadsheetId=${SHEET_ID}`);

      const res = await fetch(`/api/settings/volume-rules?spreadsheetId=${SHEET_ID}`);
      console.log('📡 API Response status:', res.status, res.statusText);

      const data = await res.json();
      console.log('📊 Raw data from API:', data);

      const mapped = data.map((r) => ({
        id: String(r.id || ""),
        name: String(r.name || ""),
        unitVolume: parseLocaleNumber(r.unitVolume),
        description: String(r.description || ""),
      }));

      console.log('✅ Mapped rules:', mapped);
      setRules(mapped);

    } catch (err) {
      console.error('❌ Loading failed:', err);
    }
  })();
}, []);
```

---

## 🛠️ **GIẢI PHÁP KHẮC PHỤC**

### **Scenario 1: API không response data**

```bash
# Kiểm tra backend đang chạy
netstat -an | grep 5050

# Restart backend
cd backend
npm start
```

### **Scenario 2: Google Sheets chưa có data**

```bash
# Seed initial data
curl -X POST "http://localhost:5050/api/auth/init"

# Hoặc tạo data trực tiếp
curl -X POST "http://localhost:5050/api/settings/volume-rules" \
  -H "Content-Type: application/json" \
  -d '{
    "rules": [
      {"id": "S", "name": "Size S", "unitVolume": 0.04, "description": ""},
      {"id": "M", "name": "Size M", "unitVolume": 0.09, "description": ""}
    ]
  }'
```

### **Scenario 3: CORS hoặc Network issues**

```javascript
// Thay đổi API URL trong frontend
const API_BASE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5050'
  : '';

const res = await fetch(`${API_BASE}/api/settings/volume-rules`);
```

### **Scenario 4: Google Service Account issues**

```bash
# Kiểm tra service account file
ls -la backend/service-account-key.json

# Verify file permissions
chmod 600 backend/service-account-key.json
```

---

## 🚀 **TEST PLAN**

### **1. Immediate Fix Test:**

```bash
# 1. Restart cả frontend & backend
npm start  # frontend (port 3000)
cd backend && npm start  # backend (port 5050)

# 2. Navigate to http://localhost:3000/transfers
# 3. Xem console logs cho debug info
# 4. Check Network tab cho API calls
```

### **2. Data Verification:**

```bash
# Verify Google Sheets có data
curl "http://localhost:5050/api/settings/volume-rules" | jq '.[0].unitVolume'
# Expected: "0.04" (not "0")

# Verify frontend receives data
# Check browser console for mapped rules
```

### **3. End-to-End Test:**

```bash
# 1. Load page → Should show default values (0.04, 0.09, etc.)
# 2. Enter counts: Size S = 10, Size M = 5
# 3. Total volume should calculate: 10*0.04 + 5*0.09 = 0.85 m³
# 4. Click "Làm mới từ Sheet" → Should reload from API
# 5. Edit mode → Should allow editing values
```

---

## 📊 **EXPECTED RESULTS**

Sau khi thực hiện các fix này, bạn sẽ thấy:

```
✅ Size S:     0.04 m³ (thay vì 0)
✅ Size M:     0.09 m³ (thay vì 0)
✅ Size L:     0.14 m³ (thay vì 0)
✅ Bao nhỏ:    0.01 m³ (thay vì 0)
✅ Bao trung:  0.05 m³ (thay vì 0)
✅ Bao lớn:    0.10 m³ (thay vì 0)
✅ Khác:       0.00 m³ (giữ nguyên)

✅ Total calculation works correctly
✅ Loading states show properly
✅ Error handling displays helpful messages
✅ Refresh from Sheet button works
✅ Edit mode allows modifications
```

---

## 🎯 **NEXT STEPS**

1. **Test API endpoint** trực tiếp với curl
2. **Check browser DevTools** Network + Console
3. **Verify Google Sheets** có dữ liệu
4. **Restart services** nếu cần thiết
5. **Update SHEET_ID** nếu sử dụng sheet khác

Hãy thực hiện các bước này và cho tôi biết kết quả để tôi có thể hỗ trợ tiếp! 🚀
