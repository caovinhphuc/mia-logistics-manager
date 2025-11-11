# 📋 Hướng dẫn Sheet Transfers (Phiếu chuyển kho)

## 📊 Thống kê tổng quan

- **Tổng số cột:** 32 cột
- **Sheet ID:** 18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
- **Sheet Name:** Transfers
- **Backend API:** `GET /api/transfers`, `POST /api/transfers`, `PUT /api/transfers/:id`

## 📝 Chi tiết tất cả 32 cột

| STT | Cột | Tên cột (EN)          | Tên cột (VI)                | Định nghĩa                          | Kiểu dữ liệu | Bắt buộc |
| --- | --- | --------------------- | --------------------------- | ------------------------------------ | ------------ | -------- |
| 1   | A   | `transfer_id`         | **ID Phiếu chuyển kho**      | ID duy nhất cho phiếu chuyển kho     | Text         | ✅       |
| 2   | B   | `orderCode`            | **Mã đơn hàng**             | Mã đơn hàng liên quan                | Text         | ❌       |
| 3   | C   | `hasVali`              | **Có vali**                 | TRUE/FALSE hoặc "Có vali"/"Không vali" | Text/String | ❌       |
| 4   | D   | `date`                 | **Ngày tạo**                | Ngày tạo phiếu                       | Date/Text    | ❌       |
| 5   | E   | `source`               | **Kho nguồn**               | Tên kho nguồn                        | Text         | ❌       |
| 6   | F   | `dest`                 | **Kho đích**                | Tên kho đích                         | Text         | ❌       |
| 7   | G   | `quantity`             | **Số lượng sản phẩm**       | Tổng số lượng sản phẩm               | Number       | ❌       |
| 8   | H   | `state`                | **Trạng thái phiếu**        | Trạng thái phiếu chuyển kho          | Text         | ❌       |
| 9   | I   | `transportStatus`      | **Trạng thái vận chuyển**   | Trạng thái vận chuyển                | Text         | ❌       |
| 10  | J   | `note`                 | **Ghi chú**                | Ghi chú bổ sung                       | Text         | ❌       |
| 11  | K   | `pkgS`                 | **Số kiện S**              | Số kiện loại S                        | Number       | ❌       |
| 12  | L   | `pkgM`                 | **Số kiện M**              | Số kiện loại M                        | Number       | ❌       |
| 13  | M   | `pkgL`                 | **Số kiện L**              | Số kiện loại L                        | Number       | ❌       |
| 14  | N   | `pkgBagSmall`          | **Số kiện túi nhỏ**        | Số kiện túi nhỏ                       | Number       | ❌       |
| 15  | O   | `pkgBagMedium`         | **Số kiện túi vừa**        | Số kiện túi vừa                       | Number       | ❌       |
| 16  | P   | `pkgBagLarge`          | **Số kiện túi lớn**        | Số kiện túi lớn                       | Number       | ❌       |
| 17  | Q   | `pkgOther`              | **Số kiện khác**            | Số kiện loại khác                     | Number       | ❌       |
| 18  | R   | `totalPackages`        | **Tổng số kiện**           | Tổng số kiện (tính tự động)          | Number       | ❌       |
| 19  | S   | `volS`                 | **Khối lượng S (m³)**      | Khối lượng loại S                     | Number       | ❌       |
| 20  | T   | `volM`                 | **Khối lượng M (m³)**      | Khối lượng loại M                     | Number       | ❌       |
| 21  | U   | `volL`                 | **Khối lượng L (m³)**      | Khối lượng loại L                     | Number       | ❌       |
| 22  | V   | `volBagSmall`           | **Khối lượng túi nhỏ (m³)** | Khối lượng túi nhỏ                    | Number       | ❌       |
| 23  | W   | `volBagMedium`          | **Khối lượng túi vừa (m³)** | Khối lượng túi vừa                   | Number       | ❌       |
| 24  | X   | `volBagLarge`           | **Khối lượng túi lớn (m³)** | Khối lượng túi lớn                   | Number       | ❌       |
| 25  | Y   | `volOther`              | **Khối lượng khác (m³)**    | Khối lượng loại khác                  | Number       | ❌       |
| 26  | Z   | `totalVolume`           | **Tổng khối lượng (m³)**    | Tổng khối lượng (tính tự động)       | Number       | ❌       |
| 27  | AA  | `dest_id`               | **ID Kho đích**             | ID của kho đích                       | Text         | ❌       |
| 28  | AB  | `source_id`             | **ID Kho nguồn**            | ID của kho nguồn                      | Text         | ❌       |
| 29  | AC  | `employee`              | **Nhân viên**               | Tên nhân viên xử lý                   | Text         | ❌       |
| 30  | AD  | `address`               | **Địa chỉ**                 | Địa chỉ đầy đủ                        | Text         | ❌       |
| 31  | AE  | `ward`                  | **Phường/Xã**               | Phường/Xã                             | Text         | ❌       |
| 32  | AF  | `district`              | **Quận/Huyện**              | Quận/Huyện                            | Text         | ❌       |
| 33  | AG  | `province`              | **Tỉnh/Thành phố**         | Tỉnh/Thành phố                        | Text         | ❌       |

## 🔧 Cấu hình trong code

### Backend Headers Array (backend/src/routes/transfersRoutes.js)

```javascript
const TRANSFERS_HEADERS = [
  "transfer_id",
  "orderCode",
  "hasVali",
  "date",
  "source",
  "dest",
  "quantity",
  "state",
  "transportStatus",
  "note",
  "pkgS",
  "pkgM",
  "pkgL",
  "pkgBagSmall",
  "pkgBagMedium",
  "pkgBagLarge",
  "pkgOther",
  "totalPackages",
  "volS",
  "volM",
  "volL",
  "volBagSmall",
  "volBagMedium",
  "volBagLarge",
  "volOther",
  "totalVolume",
  "dest_id",
  "source_id",
  "employee",
  "address",
  "ward",
  "district",
  "province",
];
```

### Frontend Interface (src/components/transfers/TransferList.tsx)

```typescript
interface Transfer {
  transfer_id: string; // ID phiếu CK (ID chính)
  orderCode: string; // Mã đơn hàng
  hasVali: string; // Có vali
  date: string; // Thời gian
  source: string; // Kho nguồn
  dest: string; // Kho đích
  quantity: number; // Số lượng SP
  state: string; // Trạng thái
  note: string; // Ghi chú
  dest_id: string; // ID Kho đích
  source_id: string; // ID Kho nguồn
  employee: string; // Nhân viên
  transportStatus?: string; // Trạng thái vận chuyển
  // Packages (số nguyên)
  pkgS?: number;
  pkgM?: number;
  pkgL?: number;
  pkgBagSmall?: number;
  pkgBagMedium?: number;
  pkgBagLarge?: number;
  pkgOther?: number;
  // Volumes (m³ - số thực)
  volS?: number;
  volM?: number;
  volL?: number;
  volBagSmall?: number;
  volBagMedium?: number;
  volBagLarge?: number;
  volOther?: number;
  // Location fields
  address?: string;
  ward?: string;
  district?: string;
  province?: string;
  // Computed field
  id?: string; // Alias for transfer_id
}
```

## 📋 Quy tắc đặt tên

### Pattern chung

- **ID chính:** `transfer_id` (bắt buộc, unique)
- **Mã đơn hàng:** `orderCode` (optional, có thể trùng với transfer_id nếu không có)
- **Trạng thái:**
  - `state`: Trạng thái phiếu (Đề nghị chuyển kho, Xuất chuyển kho, Nhập chuyển kho, Đã hủy)
  - `transportStatus`: Trạng thái vận chuyển (Chờ báo kiện, Chờ chuyển giao, Đang chuyển giao, Đã chuyển giao)
- **Kiện hàng:** `pkg{Type}` (S, M, L, BagSmall, BagMedium, BagLarge, Other)
- **Khối lượng:** `vol{Type}` (S, M, L, BagSmall, BagMedium, BagLarge, Other)
- **Tổng hợp:** `totalPackages`, `totalVolume` (tính tự động)

## 🔄 Luồng dữ liệu

1. **Tạo phiếu:** `transfer_id` + `date` + `state` + `transportStatus`
2. **Nhập thông tin kho:** `source`, `dest`, `source_id`, `dest_id`
3. **Nhập sản phẩm:** `quantity`
4. **Nhập kiện và khối lượng:** `pkgS-pkgOther`, `volS-volOther`
5. **Tính tổng:** `totalPackages`, `totalVolume` (backend tự tính)
6. **Thông tin địa điểm:** `address`, `ward`, `district`, `province`
7. **Ghi chú:** `note`, `employee`

## ✅ Mapping Frontend ↔ Backend

### Backend → Frontend (GET /api/transfers)

```typescript
const mapped: Transfer[] = data.map((r) => ({
  id: r.transfer_id || r.id || "",
  orderCode: r.orderCode || r.transfer_id || "",
  transfer_id: r.transfer_id || r.id || "",
  hasVali: normalizeHasVali(r.hasVali),
  date: r.date || "",
  source: r.source || "",
  dest: r.dest || "",
  quantity: Number(r.quantity) || 0,
  state: r.state || "Đề nghị chuyển kho",
  transportStatus: r.transportStatus || "Chờ báo kiện",
  note: r.note || "",
  dest_id: r.dest_id || "",
  source_id: r.source_id || "",
  employee: r.employee || "",
  // Packages & Volumes
  pkgS: Number(r.pkgS) || 0,
  // ... other pkg fields
  volS: Number(r.volS) || 0,
  // ... other vol fields
  // Location
  address: r.address || "",
  ward: r.ward || "",
  district: r.district || "",
  province: r.province || "",
}));
```

### Frontend → Backend (POST/PUT /api/transfers)

```typescript
const payload = {
  transfer_id: transfer.transfer_id,
  orderCode: transfer.orderCode,
  hasVali: transfer.hasVali === "Có vali" ? "TRUE" : "FALSE",
  date: transfer.date,
  source: transfer.source,
  dest: transfer.dest,
  quantity: String(transfer.quantity),
  state: transfer.state,
  transportStatus: transfer.transportStatus,
  note: transfer.note,
  // ... all other fields
};
```

## ⚠️ Lưu ý quan trọng

1. **hasVali:** Backend lưu dạng "TRUE"/"FALSE" hoặc "Có vali"/"Không vali", frontend hiển thị "Có vali"/"Không vali"
2. **Date:** Format Việt Nam (dd/MM/yyyy) hoặc ISO (YYYY-MM-DD)
3. **Numbers:** Backend normalize số thành string cho Google Sheets, frontend parse về number
4. **Trạng thái mặc định:**
   - `state`: "Đề nghị chuyển kho"
   - `transportStatus`: "Chờ báo kiện"
5. **Filter:** Frontend filter OUT "Chờ chuyển giao" khi hiển thị danh sách (chỉ hiển thị các status khác)
6. **ID mapping:**
   - `transfer_id` là primary ID
   - `id` là alias (dùng `transfer_id` hoặc `id`)
   - `orderCode` fallback về `transfer_id` nếu không có

## 🔍 Debug Checklist

Khi dữ liệu không hiển thị đúng:

1. ✅ Kiểm tra backend headers có đúng 32 cột
2. ✅ Kiểm tra Google Sheet có đúng headers
3. ✅ Kiểm tra mapping frontend có đúng field names
4. ✅ Kiểm tra data types (number vs string)
5. ✅ Kiểm tra filter logic (có filter đúng status không)
6. ✅ Kiểm tra fallback values (có default values không)

## 📝 Cập nhật

- **Ngày tạo:** Hôm nay
- **Phiên bản:** 1.0
- **Cập nhật cuối:** Để debug vấn đề load không đúng định dạng
