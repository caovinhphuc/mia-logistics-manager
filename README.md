# MIA Logistics Manager

🚚 **Hệ thống quản lý vận chuyển chuyên nghiệp cho Việt Nam**

[![Status](https://img.shields.io/badge/Status-Active-success)](https://github.com/your-username/mia-logistics-manager)
[![Version](https://img.shields.io/badge/Version-2.1.1-blue)](https://github.com/your-username/mia-logistics-manager)
[![Node](https://img.shields.io/badge/Node-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

## 🚀 Quick Start

```bash
# 1. Clone và cài đặt
git clone https://github.com/your-username/mia-logistics-manager.git
cd mia-logistics-manager
npm install

# 2. Khởi động (Recommended)
./start-project.sh

# Hoặc start đơn giản
./start.sh
```

**Access URLs**:

- Frontend: <http://localhost:3000>
- Backend API: <http://localhost:5050>
- API Health: <http://localhost:5050/api/health>

## 📋 Tổng quan

MIA Logistics Manager là một ứng dụng web hiện đại được xây dựng bằng React, tích hợp với Google Workspace (Sheets, Drive, Apps Script) để quản lý toàn diện hoạt động vận chuyển và logistics.

### ✨ Tính năng chính

- 📊 **Dashboard tổng quan** - Thống kê và báo cáo real-time
- 🚛 **Quản lý vận chuyển** - Theo dõi đơn hàng, tuyến đường, tài xế
  - Đề nghị vận chuyển
  - Địa điểm lưu (Locations)
  - Chờ chuyển giao
  - Bảng tính khối
  - Quy tắc tính khối
- 📦 **Quản lý kho** - Tồn kho, nhập/xuất hàng, định vị
- 📥 **Nhập hàng** - Inbound domestic & international với calendar view
  - Nhập hàng Quốc nội
  - Nhập hàng Quốc tế (70+ cột)
  - Lịch trình nhập hàng
  - Báo cáo nhập hàng
- 🚚 **Nhà vận chuyển** - Quản lý carriers, service areas, pricing
- 👥 **Quản lý nhân sự** - Employees CRUD với Grid/Table view
- 🔐 **Phân quyền hệ thống** - RBAC hoàn chỉnh
  - Vai trò (Roles)
  - Quyền hạn (Permissions)
  - Người dùng (Users)
- 🔄 **Chuyển kho** - Transfers management với volume calculator
- 🗺️ **Tính khoảng cách** - Google Apps Script integration
- 🔔 **Thông báo đa kênh** - Telegram notifications, Email alerts
- 📈 **Báo cáo** - System logs, monitoring
- 🌐 **Đa ngôn ngữ** - Tiếng Việt (default)
- 🔐 **Bảo mật** - RBAC, authentication, session management
- 📱 **Responsive** - Mobile & desktop optimized

### 🏗️ Kiến trúc công nghệ

- **Frontend**: React 18, Material-UI v5, React Router v6
- **State Management**: Zustand, React Query, Context API
- **Styling**: Tailwind CSS v3, PostCSS, Autoprefixer
- **Backend**: Node.js, Express.js (Port 5050)
- **Backend Integration**: Google Sheets API, Google Drive API, Google Apps Script
- **Maps**: Google Maps API, Leaflet, React-Leaflet
- **Authentication**: Google OAuth 2.0, JWT, Session Management
- **Localization**: i18next, react-i18next
- **Build Tools**: React Scripts (Create React App), Webpack 5
- **Notifications**: Telegram Bot API
- **AI Service**: Python FastAPI (Optional, Port 8000)

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js 16+ (Recommended: 18+)
- npm 8+ (Recommended: 9+)
- Google Cloud Platform account
- Service Account credentials (JSON key file)
- Port 3000 (Frontend) và 5050 (Backend) available
- Python 3.8+ (Optional, cho AI Service)

### 1. Clone dự án

```bash
git clone https://github.com/your-username/mia-logistics-manager.git
cd mia-logistics-manager
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` trong thư mục gốc của dự án (nếu chưa có):

```bash
# Google Sheets Configuration
REACT_APP_GOOGLE_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As

# Google Drive Configuration
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE

# Google Apps Script Configuration
REACT_APP_GOOGLE_APPS_SCRIPT_ID=1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv
REACT_APP_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/AKfycbysU9ncMhDg_1CATGPIdewwLqUq2AM6I1RUlsl6nMR9nHDYL_BFFbKMtlIxdg_LU5VJRQ/exec

# Telegram Configuration
REACT_APP_TELEGRAM_BOT_TOKEN=8434038911:AAEsXilwvPkpCNxt0pAZybgXag7xJnNpmN0
REACT_APP_TELEGRAM_CHAT_ID=-4818209867

# Email Configuration (SendGrid)
SENDGRID_API_KEY=6TJF5SH4EEAD5RTTWF4RUUUS
EMAIL_FROM=kho.1@mia.vn

# Backend Configuration
BACKEND_PORT=5050
FRONTEND_PORT=3000

# Node Environment
NODE_ENV=development
```

**⚠️ Lưu ý bảo mật**:

- File `.env` chứa thông tin nhạy cảm, **KHÔNG** commit vào Git
- File `.env` đã được thêm vào `.gitignore`
- Sử dụng file `.env.example` để chia sẻ template

````

**⚠️ Lưu ý bảo mật**:

- File `.env` chứa thông tin nhạy cảm, **KHÔNG** commit vào Git
- File `.env` đã được thêm vào `.gitignore`
- Sử dụng file `.env.example` để chia sẻ template

### 4. Chạy ứng dụng

#### Quick Start (Recommended)

```bash
# Khởi động full-stack với Telegram notification
./start-project.sh

# Hoặc start đơn giản
./start.sh
````

#### Development Mode

```bash
# Option 1: Quick Start (Recommended)
./start-project.sh              # Development với Telegram notifications
./start.sh                      # Simple start

# Option 2: Manual Start

# Terminal 1: Start Backend
cd backend
npm install
npm start                       # Backend chạy tại http://localhost:5050

# Terminal 2: Start Frontend
npm install
npm start                       # Frontend chạy tại http://localhost:3000

# Terminal 3: AI Service (Optional)
cd ai-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main_simple:app --host 0.0.0.0 --port 8000 --reload
```

#### Access URLs

- **Backend**: <http://localhost:5050>
- **Frontend**: <http://localhost:3000>
- **Telegram**: Configured (sẽ nhận notifications khi startup)

#### Production

```bash
# Build
npm run build

# Serve locally
npx serve -s build
```

## ⚙️ Cấu hình Google Cloud

### 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới: "MIA Logistics Manager"
3. Enable các APIs cần thiết:
   - Google Sheets API
   - Google Drive API
   - Google Apps Script API
   - Google Maps JavaScript API
   - Google Places API

### 2. Tạo OAuth 2.0 Credentials

1. Vào **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client ID**
3. Chọn **Web application**
4. Thêm authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Copy Client ID và Client Secret vào file `.env`

### 3. Tạo Service Account (tùy chọn)

1. Vào **APIs & Services > Credentials**
2. Click **Create Credentials > Service Account**
3. Tải về JSON key file
4. Đặt file trong thư mục `credentials/`

## 📊 Cấu hình Google Sheets

### Spreadsheet hiện tại

**Spreadsheet ID**: `18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`

**Tên**: mia-logistics-final

**Tổng số sheets**: 25 tabs

#### Danh sách các sheets

1. **HOME** - Trang chủ
2. **Orders** - Đơn hàng
3. **Carriers** - Nhà vận chuyển
4. **Locations** - Vị trí kho
5. **Transfers** - Chuyển kho
6. **Settings** - Cài đặt
7. **Inventory** - Tồn kho
8. **Reports** - Báo cáo
9. **Sales** - Bán hàng
10. **VolumeRules** - Quy tắc khối lượng
11. **InboundInternational** - Nhập hàng quốc tế
12. **InboundDomestic** - Nhập hàng quốc nội
13. **TransportRequests** - Yêu cầu vận chuyển
14. **Users** - Người dùng
15. **Roles** - Vai trò
16. **RolePermissions** - Phân quyền
17. **Employees** - Nhân viên
18. **Logs** - Nhật ký
19. **TransportProposals** - Đề xuất vận chuyển
20. **Dashboard** - Dashboard
21. **VerificationTokens** - Mã xác thực
22. **MIA_Logistics_Data** - Dữ liệu chính
23. **Dashboard_Summary** - Tóm tắt dashboard
24. **System_Logs** - Log hệ thống
25. **Trips** - Chuyến đi

### Service Accounts (Đã kết nối)

#### 1. mia-vn-google-integration

**Email**: `mia-vn-google-integration@sinuous-aviary-474820-e3.iam.gserviceaccount.com`

**File**: `server/sinuous-aviary-474820-e3-c442968a0e87.json`

**Status**: ✅ Connected (25 sheets accessible)

#### 2. nuq74

**Email**: `nuq74@[PROJECT_ID].iam.gserviceaccount.com`

**Status**: ✅ Connected

## 🗂️ Cấu hình Google Drive

### Folder hiện tại

**Folder ID**: `1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE`

**Link**: <https://drive.google.com/drive/folders/1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE>

**Status**: ⚠️ Cần share folder với các service account emails:

```text
mia-vn-google-integration@sinuous-aviary-474820-e3.iam.gserviceaccount.com
nuq74@[PROJECT_ID].iam.gserviceaccount.com
```

**Thư mục gợi ý**:

- Transport Documents/
- Warehouse Images/
- Staff Documents/
- Partner Contracts/
- System Backups/

## 📱 Google Apps Script

### Apps Script hiện tại

**Project ID**: `1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv`

**Editor**: <https://script.google.com/u/0/home/projects/1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv/edit>

**Web App URL**: <https://script.google.com/macros/s/AKfycbysU9ncMhDg_1CATGPIdewwLqUq2AM6I1RUlsl6nMR9nHDYL_BFFbKMtlIxdg_LU5VJRQ/exec>

**Chức năng**: Tính khoảng cách giữa 2 điểm (Distance Calculator)

**Status**: ✅ Working

**Usage**:

```bash
# GET request với origin & destination
curl "https://script.google.com/macros/s/AKfycbysU9ncMhDg_1CATGPIdewwLqUq2AM6I1RUlsl6nMR9nHDYL_BFFbKMtlIxdg_LU5VJRQ/exec?origin=Hanoi&destination=Ho+Chi+Minh+City"
```

## 🎨 Customization

### Theme và Styling

- **Primary Color**: Có thể thay đổi trong `src/styles/theme.js`
- **Vietnamese Colors**: Palette màu sắc Việt Nam tích hợp sẵn
- **Dark Mode**: Hỗ trợ tự động theo hệ thống
- **Responsive**: Breakpoints tối ưu cho mobile

### Ngôn ngữ

- **Default**: Tiếng Việt
- **Supported**: Vi, En
- **Add Language**: Thêm file JSON trong `src/locales/`

### Components

- **Material-UI**: Sử dụng components có sẵn
- **Custom Components**: Trong `src/components/`
- **Layouts**: MainLayout, AuthLayout
- **Utilities**: Validation, Format, Performance

## 📚 Cấu trúc dự án

```text
mia-logistics-manager/
├── public/                      # Static files
├── src/                         # Frontend React (377+ source files)
│   ├── components/              # React components
│   │   ├── auth/               # Authentication, Login, Profile
│   │   ├── inbound/            # Nhập hàng (Inbound)
│   │   ├── carriers/           # Nhà vận chuyển
│   │   ├── locations/          # Địa điểm lưu
│   │   ├── transfers/          # Chuyển kho
│   │   ├── maps/               # Maps integration
│   │   ├── notifications/      # Notifications
│   │   ├── settings/           # Settings components
│   │   └── layout/             # MainLayout, AuthLayout
│   ├── pages/                  # Page components
│   │   ├── Employees/          # Quản lý nhân sự
│   │   ├── Settings/           # Settings pages (Roles, Permissions, Users)
│   │   ├── Transport/          # Transport management
│   │   ├── Warehouse/          # Warehouse management
│   │   ├── Partners/           # Partners management
│   │   ├── Reports/            # Reports pages
│   │   └── Locations/           # Locations pages
│   ├── features/               # Feature modules
│   │   ├── carriers/
│   │   ├── employees/
│   │   ├── transfers/
│   │   └── inbound/
│   ├── types/                  # TypeScript type definitions
│   │   ├── inboundSchedule.ts  # InboundSchedule (54 columns) ✨NEW
│   │   └── [other types]
│   ├── utils/                  # Utility functions
│   │   ├── inboundScheduleHelpers.ts  # InboundSchedule helpers ✨NEW
│   │   └── [other utils]
│   ├── contexts/               # React contexts (Auth, Theme, Language)
│   ├── services/               # API services
│   │   ├── googleSheets/       # Google Sheets services
│   │   └── maps/               # Maps services
│   ├── hooks/                  # Custom hooks
│   ├── stores/                 # Zustand stores
│   ├── shared/                 # Shared components & utilities
│   │   ├── components/         # UI components (GridView, DataTable, etc.)
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   ├── locales/                # Translations (Vietnamese default)
│   └── styles/                 # Styling
├── backend/                    # Backend Node.js/Express
│   ├── src/
│   │   ├── routes/            # 16 route modules (100% complete)
│   │   │   ├── router.js      # Main router (aggregates all routes)
│   │   │   ├── authRoutes.js  # Authentication & Users (9 endpoints)
│   │   │   ├── carriersRoutes.js
│   │   │   ├── transfersRoutes.js
│   │   │   ├── locationsRoutes.js
│   │   │   ├── transportRequestsRoutes.js
│   │   │   ├── settingsRoutes.js
│   │   │   ├── inboundDomesticRoutes.js
│   │   │   ├── inboundInternationalRoutes.js
│   │   │   ├── rolesRoutes.js
│   │   │   ├── employeesRoutes.js
│   │   │   ├── rolePermissionsRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   ├── telegramRoutes.js
│   │   │   ├── googleSheetsRoutes.js
│   │   │   └── googleSheetsAuthRoutes.js
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utilities
│   │   └── app.js             # Express app configuration
│   ├── server.cjs             # Server entry point
│   ├── package.json           # Backend dependencies
│   └── sinuous-aviary-474820-e3-c442968a0e87.json  # Service account
├── ai-service/                # AI Service (Python/FastAPI) - Optional
│   ├── main_simple.py         # FastAPI app
│   ├── models/                # ML models
│   └── requirements.txt       # Python dependencies
├── scripts/                    # Shell scripts
│   ├── start-project.sh        # Main startup script
│   ├── test-startup.sh         # Test services
│   └── test-log-real-time.sh   # Test logging
├── logs/                       # Log files (auto-generated)
├── docs/                       # Documentation (20+ specialized docs) ✨NEW
│   ├── schemas/                # Schema documentation
│   │   ├── README.md           # Schema index
│   │   └── INBOUND_SCHEDULE.md # InboundSchedule (54 columns)
│   ├── API.md                  # REST API documentation (467 lines)
│   ├── SWAGGER.yaml            # OpenAPI 3.0 specification
│   ├── FEATURES_DETAIL.md      # Feature deep dive (500+ lines)
│   ├── GOOGLE_APPS_SCRIPT_SETUP.md  # Apps Script guide (400+ lines)
│   ├── LOGIN_SYSTEM_VERSIONS.md     # Login evolution (350+ lines)
│   └── README.md               # Documentation index
├── .env                        # Environment variables
├── .env.example                # Environment template ✨NEW
├── start-project.sh            # Quick start (recommended)
├── start.sh                    # Simple start
├── package.json                # Frontend dependencies (28 scripts)
├── Makefile                    # Quick commands (50+ commands) ✨NEW
├── MASTER_INDEX.md             # Complete navigation guide ✨NEW
└── README.md                   # This file
```

## 👥 Phân quyền (RBAC)

### Roles

1. **Admin** - Toàn quyền hệ thống
2. **Manager** - Quản lý vận hành
3. **Operator** - Điều hành hàng ngày
4. **Driver** - Tài xế vận chuyển
5. **Warehouse Staff** - Nhân viên kho

### Permissions

- `read:all` - Đọc tất cả dữ liệu
- `write:transport` - Ghi dữ liệu vận chuyển
- `write:warehouse` - Ghi dữ liệu kho
- `manage:users` - Quản lý người dùng
- `view:reports` - Xem báo cáo

## 🔐 Bảo mật

### Authentication

- SHA-256 password hashing (implemented)
- Session management với localStorage
- Auto logout khi session hết hạn
- Session timeout warning (5 phút trước khi hết hạn)
- Security guards và route protection

### Authorization

- Role-based access control (RBAC)
- Permission-based UI rendering
- API endpoint protection

### Data Protection

- AES encryption for sensitive data
- HTTPS enforcement
- Input validation
- XSS protection

## 📊 Logging và Monitoring

### Log Files

Logs được ghi tự động vào thư mục `logs/`:

- `logs/backend-startup.log` - Backend startup logs
- `logs/backend.log` - Backend runtime logs
- `logs/frontend-startup.log` - Frontend compile logs

### Log Levels

- **ERROR**: Lỗi hệ thống
- **WARN**: Cảnh báo
- **INFO**: Thông tin general
- **DEBUG**: Chi tiết debug

### Log Storage

- Local files (`logs/` directory)
- Google Sheets (unlimited)
- Console output (development)

### Monitoring Scripts

```bash
# Test startup services
./scripts/test-startup.sh

# Test real-time logging
./scripts/test-log-real-time.sh

# View recent logs
tail -f logs/backend-startup.log
```

### Telegram Notifications

Hệ thống tự động gửi notification qua Telegram khi:

- Services startup
- Errors xảy ra
- System health check
- Daily reports

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests (nếu có)
npm run test:e2e
```

## 🚀 Deployment

### Local Development

```bash
# Recommended: Full startup với notifications
./start-project.sh

# Hoặc simple startup
./start.sh

# Test services trước khi start
./scripts/test-startup.sh
```

### Production Build

```bash
npm run build

# Serve build locally
npx serve -s build
```

### Deploy Options

#### Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Netlify

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### GitHub Pages

```bash
npm install -g gh-pages
npm run deploy
```

### Backend Deployment

Backend server (`backend/index.js`) cần deploy riêng:

```bash
# Deploy to Heroku
heroku create mia-logistics-backend
cd backend
git push heroku main

# Hoặc deploy to Railway
cd backend
railway up

# Hoặc deploy to Render.com
# 1. Connect GitHub repository
# 2. Set root directory: backend
# 3. Build command: npm install
# 4. Start command: node index.js
# 5. Port: 5050
```

## 🔧 Troubleshooting

### Backend không start được

```bash
# Kiểm tra port có bị chiếm
lsof -ti:5050 | xargs kill -9

# Kiểm tra service account
ls -la server/sinuous-aviary-474820-e3-c442968a0e87.json

# Check logs
tail -f logs/backend-startup.log
```

### Frontend compile errors

### Vercel error: missing `sheets_id` secret

Nếu gặp lỗi:

```text
Environment Variable "NEXT_PUBLIC_GOOGLE_SHEETS_ID" references Secret "sheets_id", which does not exist.
```

Nguyên nhân: project đang dùng mapping secret cũ (`@secret_name`) trên Vercel.

Cách xử lý nhanh:

```bash
# Link project (nếu chưa link)
vercel link

# Thêm env trực tiếp theo môi trường
vercel env add NEXT_PUBLIC_GOOGLE_SHEETS_ID production
vercel env add NEXT_PUBLIC_GOOGLE_SHEETS_ID preview
vercel env add NEXT_PUBLIC_GOOGLE_SHEETS_ID development
```

Sau đó redeploy:

```bash
vercel --prod
```

Gợi ý: với repo này, [vercel.json](vercel.json) đã được chuẩn hóa sang static build cho React (`build/`) và không còn phụ thuộc `@sheets_id` secret.

```bash
# Clean và reinstall
rm -rf node_modules package-lock.json
npm install

# Check linter errors
npm run lint

# Fix PostCSS/Tailwind errors
# Đảm bảo sử dụng Tailwind CSS v3 (không phải v4)
npm list tailwindcss
# Nếu có v4.x, cần reinstall với v3:
npm install -D tailwindcss@^3.4.18 postcss@^8.5.6 autoprefixer@^10.4.22
```

**Lỗi thường gặp**:

1. **PostCSS plugin error**: `It looks like you're trying to use 'tailwindcss' directly as a PostCSS plugin`
   - **Nguyên nhân**: Conflict giữa Tailwind CSS v3 và v4
   - **Giải pháp**: Reinstall dependencies với Tailwind v3.4.18

2. **Cannot access before initialization**: Runtime error trong React component
   - **Nguyên nhân**: Function hoisting issue, useEffect gọi function trước khi được define
   - **Giải pháp**: Đảm bảo functions được định nghĩa với useCallback trước khi sử dụng trong useEffect

### Google Sheets không kết nối được

1. Kiểm tra service account email có được share không
2. Kiểm tra spreadsheet ID trong `backend/.env`
3. Test connection:

   ```bash
   curl http://localhost:5050/api/google-sheets-auth/status
   curl http://localhost:5050/api/sheets/info
   ```

4. Verify service account file:

   ```bash
   ls -la backend/sinous-aviary-474820-e3-c442968a0e87.json
   ```

### Telegram không gửi được

1. Kiểm tra bot token trong `.env`
2. Kiểm tra chat ID
3. Test: `curl -X POST http://localhost:5050/api/alerts/test-telegram -d '{"message":"test"}'`

## 📞 Hỗ trợ

### Tài khoản Demo

- **Admin**: <admin@mialogistics.com> / admin123

### Liên hệ

- **Email**: <kho.1@mia.vn>
- **GitHub**: <https://github.com/your-username/mia-logistics-manager>

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 🔧 Backend API

### API Routes (16 modules - 100% Complete)

#### Health & Status

- `GET /api/health` - Health check
- `GET /api/google-sheets-auth/status` - Google Sheets connection status
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/sheets` - All sheets information

#### Authentication (authRoutes.js)

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/change-password` - Đổi mật khẩu
- `GET /api/auth/users` - Danh sách users (Admin)
- `GET /api/auth/users/:id` - Chi tiết user
- `PUT /api/auth/users/:id` - Cập nhật user
- `POST /api/auth/init` - Khởi tạo auth sheets

#### Core Business

- `GET/POST/PUT/DELETE /api/carriers` - Carriers CRUD
- `GET/POST/PUT/DELETE /api/transfers` - Transfers CRUD
- `GET/POST/PUT/DELETE /api/locations` - Locations CRUD
- `GET/POST/PUT/DELETE /api/transport-requests` - Transport Requests CRUD

#### Settings & Inbound

- `GET/POST /api/settings/volume-rules` - Volume rules
- `GET/POST/PUT/DELETE /api/inbound/domestic` - Inbound Domestic CRUD
- `GET/POST/PUT/DELETE /api/inbound/international` - Inbound International CRUD (70+ cột)

#### RBAC System

- `GET/POST/PUT/DELETE /api/roles` - Roles CRUD
- `GET/POST/PUT/DELETE /api/employees` - Employees CRUD
- `GET/POST/DELETE /api/role-permissions` - Role Permissions

#### Utilities

- `GET /api/sheets/info` - Google Sheets info
- `POST /api/telegram/test` - Test Telegram notification
- `POST /api/telegram/send` - Send Telegram message

**Total:** 50+ API endpoints từ 16 route modules

## 📝 Changelog

### v2.1.1 (2025-11-12) - Latest

- 🔧 **Fixed PostCSS/Tailwind CSS Configuration**:
  - Resolved conflict between Tailwind CSS v3 và v4
  - Explicitly set dependencies: `tailwindcss@^3.4.18`, `postcss@^8.5.6`, `autoprefixer@^10.4.22`
  - Updated `package.json` to prevent version conflicts
- 🐛 **Fixed Runtime Errors**:
  - Resolved "Cannot access 'fetchTransfers' before initialization" in TransferList component
  - Fixed function hoisting issues with useEffect and useCallback
  - Removed duplicate useEffect calls
- ✅ **Improved Stability**: All components now load without initialization errors
- 📚 **Updated Documentation**: Added troubleshooting section for common build errors
- ✨ **NEW: InboundSchedule Implementation** (1,167+ lines):
  - Complete TypeScript types for 54 columns (362 lines)
  - Helper functions for parsing, validation, formatting (415 lines)
  - Comprehensive schema documentation (390 lines)
  - Support for timeline (6 milestones) và document status (5 milestones)
  - Business logic for progress tracking và metrics

### v2.1.0 (2025-10-31)

- ✅ **Backend API Routes - 100% Complete**: 16 route modules đã triển khai đầy đủ
  - Authentication & User Management (9 endpoints): login, register, logout, users CRUD, change-password, init
  - Core Business: Carriers, Transfers, Locations, Transport Requests (full CRUD)
  - Settings & Volume Rules: Volume calculation rules management
  - Inbound: Domestic & International (full CRUD với 54+ cột cho International)
  - RBAC System: Roles, Employees, Role Permissions (full CRUD)
  - Admin Operations: Stats, Sheets info
  - Utilities: Google Sheets, Telegram notifications, Google Sheets Auth status
- ✅ **50+ API Endpoints**: Tất cả endpoints đã được implement và test
- ✅ **Frontend Pages - Hoàn thiện**:
  - Employees Management (`/employees`) - CRUD với Grid/Table view
  - Authorization System (`/settings/roles`, `/settings/permissions`, `/settings/users`)
  - Locations (`/transport/locations-saved`) - Địa điểm lưu
  - Tất cả routes đã được bảo vệ với RBAC
- ✅ **Google Sheets**: 25 tabs connected và working
- ✅ **Backend Server**: Express.js on port 5050
- ✅ **Telegram**: Notifications configured và working
- ✅ **Google Drive**: Folder configured
- ✅ **Apps Script**: Distance calculator working
- ✅ **Production Ready**: Deployment configuration đầy đủ
- ✅ **Session Management**: Timeout warning, smart extension, activity monitoring
- ⚠️ **Email**: SendGrid API key cần update
- 🎨 **Sidebar**: Collapse/expand functionality với đầy đủ menu items
- 📊 **Logs**: Auto-logging to `logs/` directory
- 🔄 **Scripts**: Startup scripts với Telegram notification

### v1.0.0 (2024-01-15)

- ✨ Initial release
- 🚀 Core logistics management features
- 🔐 Google Workspace integration
- 🌐 Vietnamese localization
- 📱 Responsive design
- 🔒 RBAC security system

---

**Note**: Version hiện tại của dự án là **v2.1.0** (theo backend router.js và app.js). Package.json version (1.0.0) là version của frontend package, không phải version của toàn bộ hệ thống.

## 🔧 Services Status

| Service          | Status        | Port | Note                                       |
| ---------------- | ------------- | ---- | ------------------------------------------ |
| Frontend         | ✅ Running    | 3000 | React 18, Tailwind CSS v3                  |
| Backend API      | ✅ Running    | 5050 | Express.js, 16 route modules               |
| Backend Routes   | ✅ Complete   | -    | 50+ endpoints (100%)                       |
| Google Sheets    | ✅ Connected  | -    | 25 tabs accessible                         |
| Telegram         | ✅ Connected  | -    | Bot notifications working                  |
| Google Drive     | ⚠️ Configured | -    | Need to share folder with service accounts |
| Apps Script      | ✅ Working    | -    | Distance calculator deployed               |
| Email (SendGrid) | ⚠️ Configured | -    | API key needs verification                 |
| AI Service       | ⚠️ Optional   | 8000 | Python FastAPI (optional deployment)       |
| PostCSS/Tailwind | ✅ Fixed      | -    | v3.4.18 configured correctly               |

### Recent Fixes (2025-11-12)

- ✅ PostCSS/Tailwind CSS configuration resolved
- ✅ Runtime initialization errors fixed
- ✅ All components loading successfully
- ✅ Build process working without errors

---

## ❓ FAQ (Câu hỏi thường gặp)

### Câu hỏi chung

**Q: Hệ thống có hỗ trợ offline không?**
A: Hiện tại chưa hỗ trợ offline mode hoàn toàn do phụ thuộc vào Google Sheets API. Tuy nhiên, các dữ liệu đã load được cache trong browser.

**Q: Có thể tích hợp với hệ thống kế toán không?**
A: Có thể tích hợp thông qua API hoặc Google Sheets export. Hỗ trợ xuất dữ liệu định dạng Excel/CSV.

**Q: Hệ thống có giới hạn số lượng user không?**
A: Không giới hạn số lượng users. Tuy nhiên cần lưu ý giới hạn Google Sheets API quota (theo Google Cloud Plan).

**Q: Làm sao để backup dữ liệu?**
A: Dữ liệu được lưu trên Google Sheets nên đã có sẵn backup tự động của Google. Có thể export thêm vào Drive hoặc local storage.

### Câu hỏi kỹ thuật

**Q: Port 3000 hoặc 5050 đã bị chiếm, làm sao đổi port?**
A: Sửa trong file `.env`:

```bash
FRONTEND_PORT=3001  # Thay vì 3000
BACKEND_PORT=5051   # Thay vì 5050
```

**Q: Làm sao để thêm field mới vào Google Sheets?**
A:

1. Thêm cột mới vào sheet tương ứng
2. Update schema trong `backend/src/services/`
3. Update frontend components để hiển thị field mới

**Q: Có thể sử dụng database khác thay vì Google Sheets không?**
A: Có thể. Cần implement data layer mới trong `backend/src/services/`. Hiện tại kiến trúc đã tách biệt logic và storage.

**Q: Telegram notification không hoạt động?**
A: Kiểm tra:

1. Bot token đúng trong `.env`
2. Chat ID đúng (có thể get bằng cách add bot vào group và gửi tin nhắn)
3. Bot có quyền post message trong chat/group

---

## ⚡ Performance Optimization

### Frontend Optimization

#### 1. Code Splitting

```javascript
// Lazy load components
const Employees = lazy(() => import('./pages/Employees'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

#### 2. Memoization

```javascript
// Sử dụng React.memo cho components không cần re-render thường xuyên
const DataTable = React.memo(({ data, columns }) => {
  // Component logic
});
```

#### 3. Virtual Scrolling

- Sử dụng `react-window` hoặc `react-virtualized` cho danh sách lớn (1000+ items)
- Đã implement trong `GridView` component

#### 4. Image Optimization

- Sử dụng lazy loading cho images
- Compress images trước khi upload lên Drive
- Sử dụng WebP format khi có thể

### Backend Optimization

#### 1. Caching Strategy

```javascript
// Cache Google Sheets data trong memory
// Cách cơ bản:
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Implement trong services
```

#### 2. Batch Requests

- Gom nhiều requests Google Sheets API thành một batch
- Reduce API calls, tránh vượt quota

#### 3. Database Indexing

- Nếu migrate sang SQL, đảm bảo index các trường thường query
- Optimize JOIN queries

### Google Sheets Optimization

#### 1. Reduce API Calls

- Cache data trong frontend state (Zustand)
- Chỉ fetch khi cần thiết (không fetch mỗi khi component mount)

#### 2. Pagination

- Implement pagination cho sheets lớn (>1000 rows)
- Load theo chunk thay vì load all

#### 3. Background Sync

- Sync data trong background
- Không block UI khi đang sync

---

## 💾 Backup & Recovery

### Automatic Backup (Google Sheets)

Google Sheets tự động backup mỗi lần có thay đổi:

- **Version History**: Truy cập `File > Version History` trong Google Sheets
- **Restore**: Có thể restore về bất kỳ version nào trong 30 ngày qua

### Manual Backup

#### 1. Export Google Sheets

```bash
# Script tự động export tất cả sheets
node backend/scripts/export-all-sheets.js
```

#### 2. Backup Service Account

```bash
# Backup credentials
cp backend/sinuous-aviary-474820-e3-c442968a0e87.json backup/credentials-$(date +%Y%m%d).json
```

#### 3. Backup Environment Variables

```bash
# Backup .env
cp .env backup/env-$(date +%Y%m%d).backup
```

### Recovery Procedures

#### 1. Restore từ Google Sheets Version History

1. Mở Google Sheets
2. `File > Version History > See version history`
3. Chọn version muốn restore
4. Click "Restore this version"

#### 2. Restore từ Local Backup

```bash
# Restore sheets từ export
node backend/scripts/import-sheets.js --file backup/sheets-20250101.json
```

#### 3. Disaster Recovery Plan

1. **Mất quyền truy cập Google Sheets**:
   - Liên hệ Google Cloud admin
   - Sử dụng backup service account khác

2. **Service Account bị xóa**:
   - Tạo service account mới
   - Update credentials file
   - Share lại Google Sheets với service account mới

3. **Data corruption**:
   - Restore từ version history
   - Import từ local backup

---

## 🔐 Environment Variables Reference

### Required Variables

```bash
# Google Sheets - Required
REACT_APP_GOOGLE_SPREADSHEET_ID=<spreadsheet-id>

# Backend - Required
BACKEND_PORT=5050
FRONTEND_PORT=3000
NODE_ENV=development
```

### Optional Variables

```bash
# Google Drive - Optional
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=<folder-id>

# Google Apps Script - Optional
REACT_APP_GOOGLE_APPS_SCRIPT_ID=<script-id>
REACT_APP_APPS_SCRIPT_WEB_APP_URL=<web-app-url>

# Telegram - Optional (for notifications)
REACT_APP_TELEGRAM_BOT_TOKEN=<bot-token>
REACT_APP_TELEGRAM_CHAT_ID=<chat-id>

# Email - Optional (for email alerts)
SENDGRID_API_KEY=<api-key>
EMAIL_FROM=<sender-email>

# AI Service - Optional
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_ENABLED=false
```

### Security Best Practices

1. **Never commit `.env` to Git**
2. **Use different credentials for production and development**
3. **Rotate credentials regularly** (every 90 days)
4. **Use environment-specific .env files**:
   - `.env.development`
   - `.env.staging`
   - `.env.production`

---

## 👨‍💻 Development Guidelines

### Code Style

#### JavaScript/React

```javascript
// Use functional components with hooks
const MyComponent = ({ data, onUpdate }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  return <div>Component content</div>;
};

// Use PropTypes hoặc TypeScript
MyComponent.propTypes = {
  data: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
};
```

#### Naming Conventions

- **Components**: PascalCase (`UserProfile.jsx`)
- **Functions**: camelCase (`getUserData()`)
- **Constants**: UPPER_CASE (`API_BASE_URL`)
- **Files**: PascalCase for components, camelCase for utilities

#### Project Structure

```
src/
  components/        # Shared components
  pages/            # Page components (routes)
  features/         # Feature-specific modules
  services/         # API services
  hooks/            # Custom hooks
  stores/           # State management
  utils/            # Utility functions
```

### Git Workflow

#### Branch Strategy

```bash
main              # Production code
├── develop       # Development branch
├── feature/*     # Feature branches
├── bugfix/*      # Bug fix branches
└── hotfix/*      # Hotfix branches
```

#### Commit Messages

```bash
# Format: <type>(<scope>): <subject>

feat(auth): add password reset functionality
fix(carriers): resolve carrier list pagination bug
docs(readme): update API documentation
style(dashboard): improve responsive layout
refactor(services): optimize Google Sheets service
test(auth): add unit tests for login
chore(deps): upgrade React to 18.2.0
```

#### Pull Request Process

1. Create feature branch from `develop`
2. Make changes and commit
3. Push to remote and create PR
4. Code review (at least 1 approval)
5. Merge to `develop`
6. Deploy to staging for testing
7. Merge `develop` to `main` for production

### Testing Strategy

#### Unit Tests

```bash
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
npm test -- --watch         # Watch mode
```

#### Integration Tests

```javascript
// Example: Test API endpoints
describe('GET /api/carriers', () => {
  it('should return list of carriers', async () => {
    const response = await request(app).get('/api/carriers');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
```

#### E2E Tests (Future)

- Sử dụng Playwright hoặc Cypress
- Test các user flows chính

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)

#### `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: |
          # Deploy commands

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: |
          # Deploy commands
```

### Deployment Checklist

#### Pre-deployment

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Environment variables configured
- [ ] Database migrations ready (if any)
- [ ] Backup current production data
- [ ] Notify team about deployment

#### Deployment

- [ ] Deploy backend first
- [ ] Test backend health endpoint
- [ ] Deploy frontend
- [ ] Test frontend loading
- [ ] Verify integrations (Sheets, Telegram, etc.)

#### Post-deployment

- [ ] Monitor error logs for 30 minutes
- [ ] Test critical user flows
- [ ] Check performance metrics
- [ ] Update deployment documentation
- [ ] Notify team of successful deployment

---

## 📊 Monitoring & Alerts

### Health Checks

#### Backend Health Endpoint

```bash
# Check backend status
curl http://localhost:5050/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-11-12T10:30:00.000Z",
  "uptime": 3600,
  "version": "2.1.1"
}
```

#### Google Sheets Connection

```bash
# Check Google Sheets status
curl http://localhost:5050/api/google-sheets-auth/status

# Expected response:
{
  "status": "connected",
  "spreadsheetId": "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As",
  "sheetsCount": 25
}
```

### Logging

#### Log Levels

```javascript
// ERROR: Critical errors cần xử lý ngay
logger.error('Failed to connect to Google Sheets', { error });

// WARN: Cảnh báo, không critical nhưng cần chú ý
logger.warn('API quota near limit', { usage: '90%' });

// INFO: Thông tin general về hoạt động hệ thống
logger.info('User logged in', { userId, timestamp });

// DEBUG: Chi tiết debug (chỉ trong development)
logger.debug('Processing request', { requestData });
```

#### Log Aggregation

```bash
# View real-time logs
tail -f logs/backend-startup.log
tail -f logs/backend.log

# Search logs
grep "ERROR" logs/backend.log
grep "User logged in" logs/backend.log | wc -l
```

### Alerts Configuration

#### Telegram Alerts

Hệ thống tự động gửi alert qua Telegram khi:

- Backend startup/shutdown
- Errors xảy ra
- Google Sheets connection lost
- API quota warning (>90%)

#### Email Alerts (Optional)

Configure SendGrid để nhận email alerts:

```javascript
// backend/src/services/alertService.js
const sendEmailAlert = async (subject, message) => {
  // SendGrid implementation
};
```

### Monitoring Tools (Future)

#### Application Monitoring

- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and user analytics
- **Google Analytics**: User behavior tracking

#### Infrastructure Monitoring

- **UptimeRobot**: Uptime monitoring
- **Pingdom**: Performance monitoring
- **CloudWatch**: AWS infrastructure (nếu deploy lên AWS)

---

## 🔄 Data Migration

### Migrate từ Excel to Google Sheets

#### Step 1: Export Excel to CSV

```bash
# Convert Excel to CSV (mỗi sheet thành 1 file CSV)
```

#### Step 2: Import CSV to Google Sheets

```bash
# Sử dụng script
node backend/scripts/import-csv-to-sheets.js \
  --file data/carriers.csv \
  --sheet Carriers
```

#### Step 3: Verify Data

```bash
# Check data integrity
node backend/scripts/verify-migration.js --sheet Carriers
```

### Migrate từ Google Sheets to SQL Database (Future)

#### Schema Generation

```sql
-- Auto-generate từ Google Sheets structure
CREATE TABLE carriers (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Data Migration Script

```javascript
// backend/scripts/migrate-to-sql.js
const migrateSheet = async (sheetName, tableName) => {
  const rows = await sheetsService.getRows(sheetName);
  await sqlService.bulkInsert(tableName, rows);
};
```

### Rollback Strategy

#### Backup Before Migration

```bash
# Auto backup
./scripts/backup-before-migration.sh
```

#### Rollback Steps

1. Stop application
2. Restore from backup
3. Verify data integrity
4. Restart application

---

## ✨ Best Practices

### Security Best Practices

#### 1. Authentication

- ✅ Use secure password hashing (SHA-256)
- ✅ Implement session timeout (30 minutes)
- ✅ Add session expiration warning (5 minutes before timeout)
- ✅ Require password change every 90 days

#### 2. Authorization

- ✅ Implement RBAC (Role-Based Access Control)
- ✅ Check permissions on both frontend and backend
- ✅ Use principle of least privilege

#### 3. Data Protection

- ✅ Validate all user inputs
- ✅ Sanitize data before displaying
- ✅ Use HTTPS in production
- ✅ Encrypt sensitive data at rest

#### 4. API Security

- ✅ Rate limiting (100 requests/minute per user)
- ✅ CORS configuration
- ✅ API key authentication for external services

### Performance Best Practices

#### 1. Frontend

- ✅ Lazy load routes và components
- ✅ Use React.memo cho expensive components
- ✅ Debounce search inputs
- ✅ Virtual scrolling cho long lists
- ✅ Optimize images (WebP, lazy loading)

#### 2. Backend

- ✅ Cache frequently accessed data
- ✅ Batch API requests
- ✅ Use connection pooling
- ✅ Implement pagination (limit: 50 items/page)
- ✅ Compress responses (gzip)

#### 3. Google Sheets

- ✅ Cache sheet data (TTL: 5 minutes)
- ✅ Batch read/write operations
- ✅ Monitor API quota usage
- ✅ Implement retry logic with exponential backoff

### Code Quality Best Practices

#### 1. Code Review

- Mỗi PR cần ít nhất 1 approval
- Review checklist:
  - [ ] Code follows style guide
  - [ ] Tests added/updated
  - [ ] Documentation updated
  - [ ] No console.log() left in code
  - [ ] Error handling implemented

#### 2. Documentation

- Tất cả functions cần JSDoc comments
- API endpoints cần OpenAPI/Swagger docs
- README luôn updated với latest changes

#### 3. Testing

- Unit test coverage >= 70%
- Critical paths có integration tests
- E2E tests cho main user flows

---

## 🗺️ Roadmap

### Q4 2025

#### Features

- [ ] **Mobile App** (React Native)
  - iOS & Android support
  - Offline mode với local SQLite
  - Push notifications

- [ ] **Advanced Analytics**
  - Real-time dashboard với WebSocket
  - Custom reports builder
  - Export to PDF/Excel

- [ ] **Route Optimization**
  - AI-powered route planning
  - Cost optimization suggestions
  - Traffic-aware routing

#### Technical Improvements

- [ ] **Migration to TypeScript**
  - Type safety
  - Better IDE support
  - Reduced runtime errors

- [ ] **GraphQL API**
  - Alternative to REST
  - Better data fetching
  - Real-time subscriptions

- [ ] **Microservices Architecture**
  - Split monolithic backend
  - Service mesh
  - Better scalability

### Q1 2026

#### Features

- [ ] **Customer Portal**
  - Track shipments
  - Request quotes
  - Invoice management

- [ ] **IoT Integration**
  - GPS tracking for vehicles
  - Temperature monitoring
  - Real-time alerts

- [ ] **Blockchain Integration**
  - Immutable audit trail
  - Smart contracts
  - Supply chain transparency

#### Technical Improvements

- [ ] **Kubernetes Deployment**
  - Container orchestration
  - Auto-scaling
  - High availability

- [ ] **Multi-tenant Support**
  - Separate data per tenant
  - Custom branding
  - Per-tenant configuration

### Long-term Vision

#### 2026-2027

- AI/ML integration for demand forecasting
- Blockchain for supply chain traceability
- IoT integration với real-time tracking
- Multi-country support (expand beyond Vietnam)
- Marketplace cho carriers và shippers

---

## 🎉 Credits

### Development Team

- **Project Lead**: MIA Logistics Team
- **Backend Development**: Node.js/Express specialists
- **Frontend Development**: React/Material-UI experts
- **DevOps**: Google Cloud Platform engineers

### Technologies Used

- **Frontend**: React 18, Material-UI v5, Tailwind CSS v3
- **Backend**: Node.js, Express.js
- **Database**: Google Sheets API
- **Cloud**: Google Cloud Platform
- **Notifications**: Telegram Bot API
- **Maps**: Google Maps API

### Special Thanks

- Google Workspace team for excellent APIs
- React community for amazing ecosystem
- Material-UI team for beautiful components
- Vietnamese logistics industry for inspiration

### License

MIT License - See [LICENSE](LICENSE) for details

### Support

- **Email**: <kho.1@mia.vn>
- **GitHub**: <https://github.com/your-username/mia-logistics-manager>
- **Documentation**: <https://docs.mialogistics.com> (coming soon)

---

Made with ❤️ for Vietnamese logistics industry

**Last Updated**: November 12, 2025
**Version**: 2.1.1
**Status**: Production Ready ✅
