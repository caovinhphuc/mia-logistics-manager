# MIA Logistics Manager

🚚 **Hệ thống quản lý vận chuyển chuyên nghiệp cho Việt Nam**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-username/mia-logistics-manager)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?logo=react)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.14.20-0081CB.svg?logo=mui)](https://mui.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vietnamese](https://img.shields.io/badge/Lang-Tiếng_Việt-red.svg)](src/locales/vi.json)

## 📑 Mục lục

- [📋 Tổng quan](#-tổng-quan)
- [⚡ Quick Start](#-quick-start)
- [📸 Demo & Screenshots](#-demo--screenshots)
- [🚀 Cài đặt và chạy](#-cài-đặt-và-chạy)
- [⚙️ Cấu hình Google Cloud](#️-cấu-hình-google-cloud)
- [📊 Cấu hình Google Sheets](#-cấu-hình-google-sheets)
- [🗂️ Cấu hình Google Drive](#️-cấu-hình-google-drive)
- [📱 Google Apps Script](#-google-apps-script)
- [🎨 Customization](#-customization)
- [📚 Cấu trúc dự án](#-cấu-trúc-dự-án)
- [👥 Phân quyền (RBAC)](#-phân-quyền-rbac)
- [🔐 Bảo mật](#-bảo-mật)
- [📊 Logging và Monitoring](#-logging-và-monitoring)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [📞 Hỗ trợ](#-hỗ-trợ)
- [⚠️ Security Notice](#️-security-notice)
- [📄 License](#-license)
- [🤝 Contributing](#-contributing)
- [📝 Changelog](#-changelog)

## 📋 Tổng quan

MIA Logistics Manager là một ứng dụng web hiện đại được xây dựng bằng React, tích hợp với Google Workspace (Sheets, Drive, Apps Script) để quản lý toàn diện hoạt động vận chuyển và logistics.

### ✨ Tính năng chính

- 📊 **Dashboard tổng quan** - Thống kê và báo cáo real-time
- 🚛 **Quản lý vận chuyển** - Theo dõi đơn hàng, tuyến đường, tài xế
- 📦 **Quản lý kho** - Tồn kho, nhập/xuất hàng, định vị
- 👥 **Quản lý nhân viên** - RBAC, phân quyền, lịch làm việc
- 🤝 **Quản lý đối tác** - Khách hàng, nhà cung cấp, nhà thầu
- 🗺️ **Bản đồ tích hợp** - Google Maps, tối ưu tuyến đường
- 🔔 **Hệ thống thông báo** - Real-time, đa kênh
- 📈 **Báo cáo và phân tích** - Xuất PDF, Excel, biểu đồ
- 🌐 **Đa ngôn ngữ** - Tiếng Việt và Tiếng Anh
- 🔐 **Bảo mật cao** - Session management, encryption
- 📱 **Responsive design** - Tối ưu cho mobile và desktop

### 📊 So sánh tính năng

| Tính năng | MIA Logistics | Giải pháp khác | Ghi chú |
|-----------|---------------|----------------|---------|
| 🚛 Quản lý vận chuyển | ✅ Đầy đủ | ⚠️ Cơ bản | Real-time tracking |
| 📦 Quản lý kho | ✅ Tích hợp | ❌ Riêng biệt | QR code, RFID |
| 👥 RBAC | ✅ Nâng cao | ⚠️ Cơ bản | 5 roles, fine-grained |
| 🗺️ Bản đồ | ✅ Google Maps | ⚠️ Cơ bản | Route optimization |
| 🌐 Đa ngôn ngữ | ✅ Vi/En | ❌ Chỉ En | Vietnamese first |
| 💰 Chi phí | ✅ Open source | 💸 License | Tiết kiệm 80% |

### 🏗️ Kiến trúc công nghệ

- **Frontend**: React 18, Material-UI, React Router
- **State Management**: Context API, React Query
- **Backend Integration**: Google Sheets API, Google Drive API
- **Maps**: Google Maps API, Leaflet
- **Authentication**: Google OAuth 2.0, JWT
- **Localization**: i18next
- **Build Tools**: Create React App, Webpack

## ⚡ Quick Start

```bash
# 1. Clone và cài đặt
git clone https://github.com/your-username/mia-logistics-manager.git
cd mia-logistics-manager
npm install

# 2. Cấu hình environment
cp .env.example .env
# Chỉnh sửa .env với Google credentials của bạn

# 3. Khởi động development server
npm start
```

🎉 Truy cập <http://localhost:3000> để sử dụng ứng dụng!

## 📸 Demo & Screenshots

### Dashboard Tổng quan

![Dashboard](docs/images/dashboard.png)
*Giao diện dashboard với thống kê real-time*

### Quản lý Vận chuyển

![Transport Management](docs/images/transport.png)
*Theo dõi đơn hàng và tuyến đường trên bản đồ*

### Quản lý Kho

![Warehouse Management](docs/images/warehouse.png)
*Quản lý tồn kho với QR code scanning*

> 📝 **Lưu ý**: Screenshots sẽ được cập nhật trong phiên bản tiếp theo

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js 18+
- npm 9+
- Google Cloud Platform account
- Google Workspace account (tùy chọn)

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

```bash
# Copy file environment mẫu
cp .env.example .env

# Chỉnh sửa file .env với thông tin thực tế
nano .env
```

### 4. Chạy ứng dụng

#### Development

```bash
# Sử dụng script có sẵn
./scripts/start.sh

# Hoặc chạy trực tiếp
npm start
```

#### Production

```bash
# Build và deploy
./scripts/build.sh
./scripts/deploy.sh
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

### 1. Tạo Spreadsheet chính

1. Tạo Google Spreadsheet mới: "MIA Logistics Database"
2. Tạo các sheets với cấu trúc như sau:

#### Sheet: Transport_Requests (54 cột)

```text
Cột A-Z, AA-AB: ID, Date, Origin, Destination, Driver, Vehicle, Status, etc.
```

#### Sheet: Warehouse_Inventory (67 cột)

```text
Cột A-Z, AA-AO: ItemCode, Name, Category, Quantity, Location, etc.
```

#### Sheet: Staff_Management (48 cột)

```text
Cột A-Z, AA-AV: StaffID, Name, Role, Department, Contact, etc.
```

#### Sheet: Partners_Data (92 cột)

```text
Cột A-Z, AA-CN: PartnerID, CompanyName, Type, Contact, Address, etc.
```

#### Sheet: System_Logs

```text
Cột A-I: Timestamp, Level, Category, Message, Data, UserID, SessionID, URL, UserAgent
```

### 2. Chia sẻ quyền truy cập

1. Click **Share** trên Spreadsheet
2. Thêm Service Account email với quyền **Editor**
3. Copy Spreadsheet ID từ URL vào `.env`

## 🗂️ Cấu hình Google Drive

### 1. Tạo folder structure

```text
MIA Logistics Files/
├── Transport Documents/
├── Warehouse Images/
├── Staff Documents/
├── Partner Contracts/
└── System Backups/
```

### 2. Chia sẻ quyền

1. Click chuột phải vào folder chính
2. **Share > Add Service Account email**
3. Set quyền **Editor**
4. Copy Folder ID vào `.env`

## 📱 Google Apps Script

### 1. Tạo Apps Script Project

1. Truy cập [script.google.com](https://script.google.com)
2. Tạo project mới: "MIA Logistics Scripts"
3. Copy code từ `google-apps-script/` folder

### 2. Enable APIs

1. Trong Apps Script editor, click **Services**
2. Add:
   - Google Sheets API
   - Google Drive API
   - Google Maps API
   - Google Distance Matrix API

### 3. Deploy Web App

1. Click **Deploy > New Deployment**
2. Type: **Web App**
3. Execute as: **Me**
4. Access: **Anyone**
5. Copy Web App URL vào `.env`

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
├── public/                 # Static files
├── src/
│   ├── components/         # React components
│   │   ├── auth/          # Authentication
│   │   ├── common/        # Shared components
│   │   ├── dashboard/     # Dashboard
│   │   ├── transport/     # Transport management
│   │   ├── warehouse/     # Warehouse management
│   │   ├── staff/         # Staff management
│   │   ├── partners/      # Partners management
│   │   ├── maps/          # Maps integration
│   │   ├── notifications/ # Notifications
│   │   └── reports/       # Reports
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.js
│   │   ├── GoogleContext.js
│   │   ├── ThemeContext.js
│   │   ├── LanguageContext.js
│   │   └── NotificationContext.js
│   ├── services/          # API services
│   │   ├── api/           # General API
│   │   ├── auth/          # Authentication
│   │   └── google/        # Google services
│   ├── utils/             # Utilities
│   ├── hooks/             # Custom hooks
│   ├── locales/           # Translations
│   ├── styles/            # Styling
│   └── App.js
├── scripts/               # Shell scripts
├── docs/                  # Documentation
├── google-apps-script/    # Apps Script code
├── .env.example          # Environment template
├── package.json
└── README.md
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

- Google OAuth 2.0
- JWT tokens
- Session management
- Auto logout

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

### Log Levels

- **ERROR**: Lỗi hệ thống
- **WARN**: Cảnh báo
- **INFO**: Thông tin general
- **DEBUG**: Chi tiết debug

### Log Storage

- Local Storage (1000 entries max)
- Google Sheets (unlimited)
- Console output (development)

### Monitoring

- Performance metrics
- User activity tracking
- Error reporting
- Usage analytics

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
./scripts/start.sh
```

### Production Build

```bash
./scripts/build.sh
```

### Deploy Options

1. **Local Server**

```bash
./scripts/deploy.sh
# Chọn option 1
```

1. **Firebase Hosting**

```bash
npm install -g firebase-tools
firebase login
./scripts/deploy.sh
# Chọn option 3
```

1. **Netlify**

```bash
npm install -g netlify-cli
netlify login
./scripts/deploy.sh
# Chọn option 4
```

1. **Manual Upload**

```bash
./scripts/deploy.sh
# Chọn option 2 để tạo package
# Upload file .tar.gz lên server
```

## 📞 Hỗ trợ

### Tài khoản Demo

- **Admin**: <admin@mialogistics.com> / admin123
- **Manager**: <manager@mialogistics.com> / manager123
- **Operator**: <operator@mialogistics.com> / operator123
- **Driver**: <driver@mialogistics.com> / driver123
- **Warehouse**: <warehouse@mialogistics.com> / warehouse123

### Liên hệ

- **Email**: <support@mialogistics.com>
- **Hotline**: 1900-123-456
- **Website**: <https://mialogistics.com>
- **GitHub**: <https://github.com/your-username/mia-logistics-manager>

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📝 Changelog

### v1.0.0 (2024-01-15)

- ✨ Initial release
- 🚀 Core logistics management features
- 🔐 Google Workspace integration
- 🌐 Vietnamese localization
- 📱 Responsive design
- 🔒 RBAC security system

### Upcoming Features

- 📊 Advanced analytics dashboard
- 📱 Mobile app companion
- 🤖 AI-powered route optimization
- 🔔 SMS/Telegram notifications
- 📸 QR code integration
- 🌍 Multi-region support

---

## ❤️ Made with Love

Developed with ❤️ for the Vietnamese logistics industry

## ⚠️ Security Notice

### Known Vulnerabilities

Hiện tại có **11 vulnerabilities** (5 moderate, 6 high) chủ yếu từ:
- `react-scripts@5.0.1`
- `svgo` và dependencies
- `webpack-dev-server`

**Giải thích:**
- Các lỗ hổng này **chỉ ảnh hưởng môi trường development**, không ảnh hưởng production build
- Chúng chủ yếu liên quan đến dev tools và dependencies cũ
- `npm audit fix --force` sẽ cài `react-scripts@0.0.0` (breaking change)

**Khuyến nghị:**
- Không chạy `npm audit fix --force` vì sẽ break ứng dụng
- Chấp nhận các lỗ hổng này trong development
- Production build vẫn an toàn
- Cập nhật lên React Scripts mới sau khi được release

### Best Practices

```bash
# Kiểm tra vulnerabilities
npm audit

# Không chạy fix --force
# npm audit fix --force  # ❌ KHÔNG CHẠY

# Build production an toàn
npm run build
```
