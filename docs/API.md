# API Documentation

Tài liệu API cho MIA Logistics Manager Backend.

## Base URL

```
Development: http://localhost:5050
Production: https://api.mialogistics.com
```

## Authentication

Tất cả API endpoints (trừ health check) yêu cầu authentication.

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## API Endpoints

### Health & Status

#### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-12T10:30:00.000Z",
  "uptime": 3600,
  "version": "2.1.1"
}
```

#### GET /api/google-sheets-auth/status

Kiểm tra kết nối Google Sheets.

**Response:**

```json
{
  "status": "connected",
  "spreadsheetId": "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As",
  "sheetsCount": 25
}
```

---

### Authentication

#### POST /api/auth/login

Đăng nhập.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "Admin"
  }
}
```

#### POST /api/auth/register

Đăng ký tài khoản mới.

**Request:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Doe",
  "role": "Operator"
}
```

#### POST /api/auth/logout

Đăng xuất.

#### GET /api/auth/me

Lấy thông tin user hiện tại.

**Response:**

```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "Admin",
  "permissions": ["read:all", "write:transport"]
}
```

---

### Carriers

#### GET /api/carriers

Lấy danh sách nhà vận chuyển.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `search` (string): Search term

**Response:**

```json
{
  "data": [
    {
      "id": "carrier-1",
      "name": "Viettel Post",
      "contactPerson": "Nguyen Van A",
      "phone": "0901234567",
      "email": "contact@viettelpost.vn",
      "serviceAreas": ["Hanoi", "HCMC"],
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

#### POST /api/carriers

Tạo nhà vận chuyển mới.

**Request:**

```json
{
  "name": "New Carrier",
  "contactPerson": "John Doe",
  "phone": "0901234567",
  "email": "contact@carrier.com",
  "serviceAreas": ["Hanoi"]
}
```

#### PUT /api/carriers/:id

Cập nhật nhà vận chuyển.

#### DELETE /api/carriers/:id

Xóa nhà vận chuyển.

---

### Locations

#### GET /api/locations

Lấy danh sách địa điểm.

#### POST /api/locations

Tạo địa điểm mới.

**Request:**

```json
{
  "name": "Warehouse A",
  "address": "123 Main St, Hanoi",
  "type": "warehouse",
  "coordinates": {
    "lat": 21.0285,
    "lng": 105.8542
  }
}
```

#### PUT /api/locations/:id

Cập nhật địa điểm.

#### DELETE /api/locations/:id

Xóa địa điểm.

---

### Transfers

#### GET /api/transfers

Lấy danh sách chuyển kho.

**Query Parameters:**

- `page` (number)
- `limit` (number)
- `status` (string): pending, in_transit, completed
- `fromDate` (date)
- `toDate` (date)

**Response:**

```json
{
  "data": [
    {
      "id": "transfer-1",
      "fromLocation": "Warehouse A",
      "toLocation": "Warehouse B",
      "date": "2025-11-12",
      "status": "in_transit",
      "volume": 150.5,
      "items": [
        {
          "id": "item-1",
          "name": "Product A",
          "quantity": 100,
          "unit": "pcs"
        }
      ]
    }
  ],
  "pagination": {...}
}
```

#### POST /api/transfers

Tạo yêu cầu chuyển kho mới.

#### PUT /api/transfers/:id

Cập nhật chuyển kho.

#### DELETE /api/transfers/:id

Xóa chuyển kho.

---

### Inbound

#### GET /api/inbound/domestic

Lấy danh sách nhập hàng quốc nội.

#### POST /api/inbound/domestic

Tạo phiếu nhập hàng quốc nội.

#### GET /api/inbound/international

Lấy danh sách nhập hàng quốc tế (70+ columns).

#### POST /api/inbound/international

Tạo phiếu nhập hàng quốc tế.

---

### RBAC

#### GET /api/roles

Lấy danh sách vai trò.

#### POST /api/roles

Tạo vai trò mới.

#### GET /api/employees

Lấy danh sách nhân viên.

#### POST /api/employees

Tạo nhân viên mới.

#### GET /api/role-permissions

Lấy danh sách phân quyền.

#### POST /api/role-permissions

Gán quyền cho vai trò.

---

### Utilities

#### POST /api/telegram/send

Gửi tin nhắn Telegram.

**Request:**

```json
{
  "message": "Hello from MIA Logistics!"
}
```

#### GET /api/sheets/info

Lấy thông tin Google Sheets.

---

## Error Responses

### Standard Error Format

```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Headers**:
  - `X-RateLimit-Limit`: Total allowed requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

## Pagination

All list endpoints support pagination:

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 50, max: 100)

**Response Format:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 250,
    "pages": 5
  }
}
```

## Examples

### cURL Examples

```bash
# Login
curl -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get carriers
curl http://localhost:5050/api/carriers \
  -H "Authorization: Bearer <token>"

# Create transfer
curl -X POST http://localhost:5050/api/transfers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fromLocation": "warehouse-a",
    "toLocation": "warehouse-b",
    "date": "2025-11-12",
    "items": []
  }'
```

### JavaScript/Axios Examples

```javascript
// Login
const response = await axios.post('http://localhost:5050/api/auth/login', {
  email: 'admin@example.com',
  password: 'admin123',
});

const token = response.data.token;

// Get carriers
const carriers = await axios.get('http://localhost:5050/api/carriers', {
  headers: { Authorization: `Bearer ${token}` },
});

// Create transfer
const transfer = await axios.post(
  'http://localhost:5050/api/transfers',
  {
    fromLocation: 'warehouse-a',
    toLocation: 'warehouse-b',
    date: '2025-11-12',
    items: [],
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
```

## Webhooks (Future)

Coming soon: Webhook support for real-time notifications.

## API Versioning

Current version: `v2.1.1`

Future versions will be available at `/api/v2/`, `/api/v3/`, etc.

---

For more information, see the [main README](../README.md).
