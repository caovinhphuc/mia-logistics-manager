# InboundSchedule Schema Documentation

Complete documentation for the InboundSchedule schema with 54 columns.

---

## 📊 Overview

InboundSchedule manages the complete lifecycle of inbound shipments from international suppliers, tracking timeline milestones and document processing status.

### Column Summary

| Group               | Columns | Description                                |
| ------------------- | ------- | ------------------------------------------ |
| **Basic Info**      | 12      | Core shipment information                  |
| **Additional Info** | 3       | Purpose, timing, PO numbers                |
| **Packaging Info**  | 3       | Packaging types and quantities             |
| **Timeline**        | 18      | 6 milestones × 3 fields (est, act, status) |
| **Document Status** | 15      | 5 milestones × 3 fields (est, act, status) |
| **System Info**     | 3       | Notes, timestamps                          |
| **TOTAL**           | **54**  | **Complete inbound management**            |

---

## 🔢 Column Details

### 1. Basic Info (12 columns)

| Column        | Vietnamese     | Type   | Format            | Validation       | Description              |
| ------------- | -------------- | ------ | ----------------- | ---------------- | ------------------------ |
| `id`          | Mã lịch nhập   | String | `INB-{timestamp}` | Required, Unique | Auto-generated unique ID |
| `date`        | Ngày tạo       | Date   | `dd/MM/yyyy`      | Required         | Creation date            |
| `pi`          | Mã PI          | String | Alphanumeric      | Required         | Proforma Invoice number  |
| `supplier`    | Nhà cung cấp   | String | Text              | Required         | Supplier name            |
| `origin`      | Nơi xuất phát  | String | Location          | Required         | Origin location          |
| `destination` | Nơi đến        | String | Address           | Required         | Destination address      |
| `product`     | Sản phẩm       | String | Text              | Required         | Product name             |
| `category`    | Danh mục       | String | Text              | Required         | Product category         |
| `quantity`    | Số lượng       | Number | Integer > 0       | Required         | Total quantity           |
| `container`   | Số container   | Number | Integer > 0       | Required         | Container count          |
| `status`      | Trạng thái     | Enum   | See below         | Required         | Shipment status          |
| `carrier`     | Nhà vận chuyển | String | Text              | Required         | Carrier name             |

**Status Values:**

- `pending` - Chờ xác nhận
- `confirmed` - Đã xác nhận
- `in-transit` - Đang vận chuyển
- `arrived` - Đã đến
- `completed` - Hoàn thành
- `cancelled` - Đã hủy

---

### 2. Additional Info (3 columns)

| Column        | Vietnamese    | Type   | Format              | Description            |
| ------------- | ------------- | ------ | ------------------- | ---------------------- |
| `purpose`     | Mục đích      | Enum   | `online/offline`    | Purpose of shipment    |
| `receiveTime` | Giờ nhận hàng | Time   | `HH:mm`             | Expected receive time  |
| `poNumbers`   | Mã PO         | String | Semicolon-separated | Purchase Order numbers |

**Example:**

```typescript
{
  purpose: 'online',
  receiveTime: '08:00',
  poNumbers: 'PO06092025:0025835;PO06092025:0025836'
}
```

---

### 3. Packaging Info (3 columns)

| Column                  | Vietnamese    | Type   | Format                      | Description           |
| ----------------------- | ------------- | ------ | --------------------------- | --------------------- |
| `packagingTypes`        | Loại đóng gói | String | Semicolon-separated         | Packaging types       |
| `packagingQuantities`   | Số lượng      | String | Semicolon-separated numbers | Quantities per type   |
| `packagingDescriptions` | Mô tả         | String | Semicolon-separated         | Descriptions per type |

**Logic:**

- Arrays must have same length
- Map index to index: `types[0]` → `quantities[0]` → `descriptions[0]`

**Example:**

```typescript
{
  packagingTypes: '1PCS/SET;2PCS/SET;5PCS/SET',
  packagingQuantities: '1000;800;200',
  packagingDescriptions: 'Single items;Pair sets;Family sets'
}

// Parses to:
[
  { type: '1PCS/SET', quantity: 1000, description: 'Single items' },
  { type: '2PCS/SET', quantity: 800, description: 'Pair sets' },
  { type: '5PCS/SET', quantity: 200, description: 'Family sets' }
]
```

---

### 4. Timeline (18 columns)

6 milestones × 3 fields each (estimated, actual, status)

#### Milestones

1. **Cargo Ready** - Hàng sẵn sàng
2. **ETD** (Estimated Time of Departure) - Khởi hành dự kiến
3. **ETA** (Estimated Time of Arrival) - Đến dự kiến
4. **Depart** - Khởi hành thực tế
5. **Arrival Port** - Đến cảng
6. **Receive** - Nhận hàng

#### Fields for each milestone

| Field Pattern                 | Type | Format       | Description    |
| ----------------------------- | ---- | ------------ | -------------- |
| `timeline_{milestone}_est`    | Date | `dd/MM/yyyy` | Estimated date |
| `timeline_{milestone}_act`    | Date | `dd/MM/yyyy` | Actual date    |
| `timeline_{milestone}_status` | Enum | See below    | Status         |

**Status Values:**

- `pending` - Chờ thực hiện
- `confirmed` - Đã xác nhận
- `in-progress` - Đang thực hiện
- `completed` - Hoàn thành
- `delayed` - Trễ hạn

**Example:**

```typescript
{
  timeline_cargoReady_est: '10/09/2025',
  timeline_cargoReady_act: '11/09/2025',
  timeline_cargoReady_status: 'completed',

  timeline_etd_est: '15/09/2025',
  timeline_etd_act: '16/09/2025',
  timeline_etd_status: 'completed',

  timeline_eta_est: '25/09/2025',
  timeline_eta_act: '',
  timeline_eta_status: 'pending'
}
```

---

### 5. Document Status (15 columns)

5 milestones × 3 fields each (estimated, actual, status)

#### Milestones

1. **Check Bill** - Kiểm tra Bill of Lading
2. **Check CO** - Kiểm tra Certificate of Origin
3. **Send Docs** - Gửi chứng từ
4. **Customs** - Thông quan
5. **Tax** - Nộp thuế

#### Fields for each milestone

| Field Pattern            | Type | Format           | Description    |
| ------------------------ | ---- | ---------------- | -------------- |
| `doc_{milestone}_est`    | Date | `dd/MM/yyyy`     | Estimated date |
| `doc_{milestone}_act`    | Date | `dd/MM/yyyy`     | Actual date    |
| `doc_{milestone}_status` | Enum | Same as timeline | Status         |

**Workflow:**

```
Check Bill → Check CO → Send Docs → Customs → Tax
```

Each step depends on the previous one.

**Example:**

```typescript
{
  doc_checkBill_est: '01/10/2025',
  doc_checkBill_act: '02/10/2025',
  doc_checkBill_status: 'completed',

  doc_checkCO_est: '02/10/2025',
  doc_checkCO_act: '',
  doc_checkCO_status: 'in-progress',

  doc_customs_est: '05/10/2025',
  doc_customs_act: '',
  doc_customs_status: 'pending'
}
```

---

### 6. System Info (3 columns)

| Column      | Vietnamese | Type      | Format                           | Description                      |
| ----------- | ---------- | --------- | -------------------------------- | -------------------------------- |
| `notes`     | Ghi chú    | String    | Text                             | Notes and milestone descriptions |
| `createdAt` | Ngày tạo   | Timestamp | `HH:mm` or `dd/MM/yyyy HH:mm:ss` | Creation timestamp               |
| `updatedAt` | Cập nhật   | Timestamp | `dd/MM/yyyy HH:mm:ss`            | Last update timestamp            |

---

## 🔄 Business Logic

### 1. Display Date Priority

For any milestone, display logic:

```typescript
displayDate = actual || estimated || createdDate;
```

### 2. Status Workflow

```
Timeline:
pending → confirmed → in-progress → completed
         ↓
      delayed

Documents:
pending → in-progress → completed
         ↓
      delayed
```

### 3. Milestone Dependencies

**Timeline:**

- No strict dependencies, can update any milestone
- But logical flow: Cargo Ready → ETD → Depart → Arrival Port → ETA → Receive

**Documents:**

- **Sequential workflow** - must complete in order
- Check Bill → Check CO → Send Docs → Customs → Tax

### 4. Notes Storage

Notes field stores:

1. General notes
2. Milestone descriptions (parsed format)

**Format:**

```
General notes text here

--- DESCRIPTIONS ---
[Milestone Name]: Description | [Another Milestone]: Description
```

**Example:**

```
Hàng cần xử lý gấp. Ưu tiên thông quan.

--- DESCRIPTIONS ---
[Cargo Ready]: Hàng đã sẵn sàng xuất kho | [ETD]: Tàu khởi hành đúng giờ | [Check Bill]: Bill đã được kiểm tra kỹ
```

---

## 🎯 Use Cases

### Create New Inbound

```typescript
const newInbound: InboundScheduleCreate = {
  // Auto-generate
  id: generateInboundId(), // INB-1757391900610
  date: getCurrentDateVietnamese(), // 12/11/2025

  // Required basic info
  pi: 'MG-VMA25-017',
  supplier: 'Eximvina',
  origin: 'NINGBO',
  destination: 'Kho trung tâm - HCM',
  product: 'Larita Juden MG0624',
  category: 'Vali',
  quantity: 3640,
  container: 2,
  status: InboundStatus.PENDING,
  carrier: 'CK Line',

  // Additional
  purpose: Purpose.ONLINE,
  receiveTime: '08:00',
  poNumbers: 'PO06092025:0025835',

  // Packaging
  packagingTypes: '2PCS/SET',
  packagingQuantities: '1820',
  packagingDescriptions: 'Pair sets',

  // Timeline (optional, can add later)
  timeline_cargoReady_est: '10/09/2025',
  timeline_cargoReady_act: '',
  timeline_cargoReady_status: TimelineStatus.PENDING,

  // System
  notes: 'Rush order',
  createdAt: getCurrentTimestamp(),
  updatedAt: getCurrentTimestamp(),
};
```

### Update Timeline

```typescript
const updateTimeline = {
  timeline_etd_act: '16/09/2025',
  timeline_etd_status: TimelineStatus.COMPLETED,
  timeline_eta_est: '26/09/2025',
  updatedAt: getCurrentTimestamp(),
};
```

### Update Documents

```typescript
const updateDocuments = {
  doc_checkBill_act: '02/10/2025',
  doc_checkBill_status: DocumentStatus.COMPLETED,
  doc_checkCO_status: DocumentStatus.IN_PROGRESS,
  updatedAt: getCurrentTimestamp(),
};
```

---

## 📊 Metrics & KPIs

### Suggested Metrics

```typescript
// Timeline completion percentage
const timelineCompletion = calculateTimelineCompletion(timeline);
// Returns: 66% (4/6 milestones completed)

// Document completion percentage
const documentCompletion = calculateDocumentCompletion(documentStatus);
// Returns: 40% (2/5 milestones completed)

// Overall progress
const overallProgress = (timelineCompletion + documentCompletion) / 2;

// Delay tracking
const hasDelays = Object.values(timeline).some((m) => m.status === 'delayed');

// Average lead time (ETD to Receive)
const leadTime = calculateDaysBetween(
  timeline.etd.act || timeline.etd.est,
  timeline.receive.act || timeline.receive.est
);
```

---

## 🔍 Query Examples

### Filter by status

```typescript
GET /api/inbound-schedule?status=in-transit,confirmed
```

### Filter by date range

```typescript
GET /api/inbound-schedule?dateFrom=01/09/2025&dateTo=30/09/2025
```

### Filter by milestone status

```typescript
GET /api/inbound-schedule?timelineMilestone=eta&timelineStatus=delayed
```

### Search

```typescript
GET /api/inbound-schedule?search=MG-VMA25
```

---

**Last Updated**: November 12, 2025  
**Version**: 2.1.1  
**Schema Version**: 1.0
