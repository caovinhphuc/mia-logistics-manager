# 🔍 AUDIT SIDEBAR NAVIGATION

**Ngày kiểm tra:** 28/10/2025
**Trạng thái tổng thể:** ⚠️ **CẦN CẢI THIỆN**

---

## 📊 CẤU TRÚC HIỆN TẠI

### Menu Items Hiện Tại

1. **Dashboard** - Trang chủ
2. **Quản lý vận chuyển** (transport)
   - Yêu cầu vận chuyển
   - Tuyến đường
   - Phương tiện
   - **Quy tắc tính khối** (volume-rules)
   - **Nhà vận chuyển** (carriers) ⚠️

3. **Quản lý kho** (warehouse)
   - Tồn kho
   - Đơn hàng
   - Địa điểm

4. **Nhập hàng** (inbound)
   - Quốc nội
   - Quốc tế
   - Lịch trình
   - Báo cáo

5. **Nhân viên** (employees) ⚠️

6. **Chuyển kho** (transfers) ⚠️

7. **Quản lý nhân viên** (staff) ⚠️
   - Nhân viên
   - Lịch làm việc
   - Hiệu suất

8. **Đối tác** (partners)
   - Nhà cung cấp
   - Khách hàng
   - Hợp đồng

9. **Bản đồ**
10. **Báo cáo**
11. **Cài đặt**

---

## ❌ VẤN ĐỀ PHÁT HIỆN

### 1. 🔴 **TRÙNG LẶP "NHÂN VIÊN"** - **CRITICAL** ⚠️

**Hiện trạng:**

- ❌ Có 2 mục "Nhân viên" ở 2 nơi khác nhau:
  1. Mục **"Nhân viên"** (line 187-193) → `/employees`
  2. Mục **"Quản lý nhân viên"** → `/staff` với children có **"Nhân viên"** (line 211-215) → `/staff/employees`

**Vấn đề:**

- ⚠️ Confusing cho users
- ⚠️ 2 routes khác nhau cho cùng 1 chức năng
- ⚠️ Duplicate functionality

**Cần làm:**

- ✅ Gộp thành 1 mục "Nhân viên" duy nhất
- ✅ Dưới "Quản lý nhân viên" với các sub-items

---

### 2. ⚠️ **"CHUYỂN KHO" (TRANSFERS) NÊN NẰM DƯỚI "WAREHOUSE"** - **MEDIUM**

**Hiện trạng:**

- ⚠️ "Chuyển kho" đang là 1 mục top-level (line 195-201)
- ⚠️ Nhưng "Chuyển kho" là 1 chức năng của warehouse

**Vấn đề:**

- ⚠️ Logic grouping không rõ ràng
- ⚠️ "Chuyển kho" nên là sub-item của "Quản lý kho"

**Cần làm:**

- ⚠️ Move "Chuyển kho" vào "Quản lý kho" thành sub-item

---

### 3. ⚠️ **"NHÀ VẬN CHUYỂN" TRONG "QUẢN LÝ VẬN CHUYỂN"** - **LOW**

**Hiện trạng:**

- ✅ "Nhà vận chuyển" đang nằm dưới "Quản lý vận chuyển"
- ✅ Nhưng đây là quản lý carriers (nhà vận chuyển bên ngoài)

**Vấn đề:**

- ⚠️ Có thể nhầm lẫn với "Quản lý vận chuyển nội bộ"

**Đề xuất:**

- ⚠️ Có thể giữ nguyên HOẶC đổi tên "Quản lý vận chuyển" → "Vận chuyển & Logistics"

---

## 📋 ĐỀ XUẤT CẤU TRÚC MỚI

### **Cấu trúc đề xuất:**

```
1. Dashboard ✅
   └─ Trang chủ

2. Vận chuyển & Logistics (đổi tên)
   ├─ Yêu cầu vận chuyển
   ├─ Tuyến đường
   ├─ Phương tiện
   ├─ Quy tắc tính khối
   └─ Nhà vận chuyển

3. Quản lý kho
   ├─ Tồn kho
   ├─ Đơn hàng
   ├─ Địa điểm
   └─ Chuyển kho ⬅️ MOVE HERE

4. Nhập hàng ✅
   ├─ Quốc nội
   ├─ Quốc tế
   ├─ Lịch trình
   └─ Báo cáo

5. Quản lý nhân viên (KEEP THIS, REMOVE standalone "Nhân viên")
   ├─ Nhân viên
   ├─ Lịch làm việc
   └─ Hiệu suất

6. Đối tác ✅
   ├─ Nhà cung cấp
   ├─ Khách hàng
   └─ Hợp đồng

7. Bản đồ ✅

8. Báo cáo ✅
   ├─ Phân tích
   ├─ Tài chính
   └─ Hiệu suất

9. Cài đặt ✅
   ├─ Chung
   ├─ API
   ├─ Bảo mật
   └─ Hệ thống
```

---

## 🎯 HÀNH ĐỘNG CẦN THỰC HIỆN

### **Priority 1: Gộp "Nhân viên" (GẤP)**

- ❌ Remove standalone "Nhân viên" mục (line 187-193)
- ✅ Keep "Quản lý nhân viên" với sub-items

### **Priority 2: Move "Chuyển kho"**

- ⚠️ Move "Chuyển kho" từ top-level (line 195-201)
- ⚠️ Vào "Quản lý kho" như sub-item

### **Priority 3: Đổi tên (Optional)**

- ⚠️ "Quản lý vận chuyển" → "Vận chuyển & Logistics"

---

## 📊 SO SÁNH BEFORE/AFTER

### BEFORE

```
✅ Dashboard
✅ Quản lý vận chuyển
   - ...
   - Nhà vận chuyển
✅ Quản lý kho
   - Tồn kho
   - Đơn hàng
   - Địa điểm
✅ Nhập hàng
✅ Nhân viên ⬅️ REMOVE
✅ Chuyển kho ⬅️ MOVE
✅ Quản lý nhân viên
   - Nhân viên
✅ Đối tác
```

### AFTER

```
✅ Dashboard
✅ Vận chuyển & Logistics (đổi tên)
✅ Quản lý kho
   - Tồn kho
   - Đơn hàng
   - Địa điểm
   - Chuyển kho ⬅️ MOVE HERE
✅ Nhập hàng
✅ Quản lý nhân viên (ONLY THIS)
   - Nhân viên
   - Lịch làm việc
   - Hiệu suất
✅ Đối tác
```

---

## 🎯 KẾT LUẬN

**Vấn đề chính:**

1. ❌ Duplicate "Nhân viên" - cần gộp
2. ⚠️ "Chuyển kho" nên ở dưới "Quản lý kho"

**Khuyến nghị:**

- ✅ **Priority 1 là GẤP** - gộp "Nhân viên"
- ⚠️ Priority 2 và 3 có thể làm sau
- ✅ Core structure là OK, chỉ cần sắp xếp lại

---

**Tác giả:** AI Assistant
**Cập nhật:** 28/10/2025
