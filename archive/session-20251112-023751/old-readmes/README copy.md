<div align="center">

# 🚚 MIA Logistics Manager

**Hệ thống quản lý vận chuyển thông minh với AI Analytics**

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/caovinhphuc/mia-logistics-manager)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/caovinhphuc/mia-logistics-manager)

**[Features](#-tính-năng) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deploy](#-deployment) • [Support](#-support)**

---

</div>

## 📖 Giới Thiệu

**MIA Logistics Manager** là hệ thống quản lý vận chuyển logistics hiện đại, tích hợp AI để tối ưu hóa quy trình vận hành, theo dõi real-time và phân tích dữ liệu thông minh.

### ✨ Điểm Nổi Bật

| Tính năng | Mô tả |
|-----------|-------|
| 🚀 **Real-time Dashboard** | Theo dõi vận chuyển theo thời gian thực với cập nhật tự động |
| 🤖 **AI-Powered Analytics** | Dự đoán nhu cầu, tối ưu lộ trình, ước tính chi phí |
| 📊 **Advanced Reporting** | Báo cáo chi tiết, phân tích xu hướng với biểu đồ trực quan |
| 🗺️ **Route Optimization** | Tối ưu hóa lộ trình giao hàng với Google Maps integration |
| 📱 **Responsive Design** | Hoạt động mượt trên mọi thiết bị (Mobile, Tablet, Desktop) |
| 🌐 **Vietnamese Localization** | Hoàn toàn tiếng Việt, định dạng ngày tháng Việt Nam |
| 🔐 **RBAC System** | Phân quyền chi tiết với Role-Based Access Control |
| 📦 **Google Sheets Integration** | Sử dụng Google Sheets làm database (25 sheets connected) |

---

## 🎯 Tính Năng

### 🏢 Core Features

<div align="center">

| Module | Tính năng | Trạng thái |
|--------|-----------|------------|
| 📦 **Vận chuyển** | Quản lý đơn hàng, yêu cầu vận chuyển, chờ chuyển kho | ✅ Hoàn thành |
| 🚛 **Nhà vận chuyển** | Quản lý thông tin, đánh giá hiệu suất | ✅ Hoàn thành |
| 📍 **Địa điểm** | Quản lý kho, địa điểm giao hàng | ✅ Hoàn thành |
| 📥 **Inbound** | Quản lý nhập hàng quốc tế/nội địa (70+ cột) | ✅ Hoàn thành |
| 👥 **Nhân viên** | Quản lý nhân viên, phân quyền | ✅ Hoàn thành |
| 📊 **Báo cáo** | Dashboard, analytics, thống kê | ✅ Hoàn thành |

</div>

### 🚀 Advanced Features

- 🤖 **AI Demand Prediction** - Dự đoán nhu cầu vận chuyển
- 📈 **Performance Analytics** - Phân tích hiệu suất chi tiết
- 💰 **Revenue Tracking** - Theo dõi doanh thu, lợi nhuận
- 🔔 **Smart Notifications** - Thông báo qua Telegram, Email
- 📊 **Custom Dashboards** - Tùy chỉnh dashboard theo nhu cầu
- 🔒 **Role-based Access** - Phân quyền chi tiết theo resource:action
- 🗺️ **Google Maps Integration** - Tính khoảng cách, tối ưu route
- ⚙️ **Volume Calculator** - Tính toán khối lượng tự động

---

## 🚀 Quick Start

### 📋 Yêu Cầu

- **Node.js** >= 18.x
- **npm** >= 8.x hoặc **yarn**
- **Git**
- **Google Sheets API** credentials (Service Account)

### ⚡ Cài Đặt Nhanh

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/mia-logistics-manager.git
cd mia-logistics-manager

# 2. Cài đặt dependencies Frontend
npm install

# 3. Cài đặt dependencies Backend
cd backend
npm install
cd ..

# 4. Cấu hình Environment Variables
# Copy .env.example thành .env và điền thông tin
cp .env.example .env

# 5. Khởi động project (Recommended)
./start-project.sh

# Hoặc khởi động thủ công:
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
npm start
```

### 🌐 URLs Sau Khi Khởi Động

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:5050>
- **Health Check**: <http://localhost:5050/api/health>
- **AI Service** (Optional): <http://localhost:8000>

### 🔑 Tài Khoản Mặc Định

- **Email**: <admin@mia.vn>
- **Password**: admin@123
- **Role**: Admin (full permissions)

---

## 📁 Cấu Trúc Project

```
mia-logistics-manager/
├── 📁 src/                          # Frontend React
│   ├── components/                  # React components
│   │   ├── custom/                 # Custom widgets
│   │   └── atoms/                  # Base components
│   ├── features/                   # Feature modules
│   │   ├── carriers/              # Nhà vận chuyển
│   │   ├── shipments/             # Vận chuyển
│   │   ├── inbound/               # Nhập hàng
│   │   └── analytics/             # Phân tích
│   ├── services/                   # API services
│   │   ├── googleSheets/          # Google Sheets integration
│   │   └── api/                   # API clients
│   ├── contexts/                   # React contexts
│   └── App.jsx                     # Main app component
│
├── 📁 backend/                      # Backend API (Node.js/Express)
│   └── src/
│       ├── routes/                  # API routes (16 modules)
│       │   ├── authRoutes.js       # Authentication
│       │   ├── carriersRoutes.js   # Carriers CRUD
│       │   ├── transfersRoutes.js  # Transfers CRUD
│       │   ├── locationsRoutes.js  # Locations CRUD
│       │   ├── transportRequestsRoutes.js
│       │   ├── inboundDomesticRoutes.js
│       │   ├── inboundInternationalRoutes.js
│       │   ├── rolesRoutes.js      # RBAC System
│       │   ├── employeesRoutes.js
│       │   ├── rolePermissionsRoutes.js
│       │   ├── adminRoutes.js     # Admin operations
│       │   ├── settingsRoutes.js  # Settings
│       │   ├── telegramRoutes.js  # Telegram notifications
│       │   ├── googleSheetsRoutes.js
│       │   └── googleSheetsAuthRoutes.js
│       ├── services/               # Business logic
│       └── utils/                  # Utilities
│
├── 📁 ai-service/                  # AI Service (Python/FastAPI) - Optional
│   ├── main_simple.py             # FastAPI app
│   └── models/                     # ML models
│
├── 📁 public/                       # Static files
├── 📁 docs/                        # Documentation
│   ├── md/                         # Markdown docs
│   └── guides/                     # Guides
└── 📁 scripts/                     # Utility scripts
```

---

## 🛠️ Tech Stack

### 🎨 Frontend

<div align="center">

| Technology | Version | Mô tả |
|------------|---------|-------|
| **React** | 18.2 | UI Framework |
| **React Router** | v6 | Routing |
| **Material-UI** | v5 | UI Components |
| **Chart.js** | Latest | Data visualization |
| **Axios** | Latest | HTTP client |
| **TypeScript** | Latest | Type safety |

</div>

### ⚙️ Backend

<div align="center">

| Technology | Version | Mô tả |
|------------|---------|-------|
| **Node.js** | 18+ | Runtime |
| **Express.js** | 4.x | API Server |
| **Google Sheets API** | Latest | Data storage |
| **Telegram Bot API** | Latest | Notifications |
| **Socket.IO** | Latest | Real-time |

</div>

### 🤖 AI Service

- **Python** 3.9+
- **FastAPI** - Modern async API framework
- **scikit-learn** - Machine Learning
- **pandas** - Data processing

### 🛠️ Tools & DevOps

- **ESLint & Prettier** - Code quality
- **Git** - Version control
- **Docker** - Containerization (optional)
- **Vercel/Netlify** - Frontend deployment
- **Railway/Heroku** - Backend deployment

---

## 📚 Documentation

<div align="center">

| Document | Mô tả | Link |
|----------|-------|------|
| 📖 **TEMPLATE_GUIDE.md** | Hướng dẫn tùy chỉnh template | [Xem](./TEMPLATE_GUIDE.md) |
| 🚀 **DEPLOYMENT.md** | Hướng dẫn deployment chi tiết | [Xem](./docs/md/DEPLOYMENT.md) |
| ⚙️ **GOOGLE_SHEETS_SETUP.md** | Setup Google Sheets | [Xem](./docs/md/GOOGLE_SHEETS_SETUP.md) |
| 📝 **FEATURES_STATUS.md** | Trạng thái tính năng | [Xem](./docs/md/FEATURES_STATUS.md) |
| 🔧 **API_DOCUMENTATION.md** | Tài liệu API | [Xem](./docs/md/README.md) |

</div>

---

## 🔌 API Endpoints

### 📊 Health & Status

```bash
GET  /api/health                          # Health check
GET  /api/google-sheets-auth/status       # Google Sheets status
GET  /api/admin/stats                     # System statistics
GET  /api/admin/sheets                    # Sheets information
```

### 🔐 Authentication

```bash
POST /api/auth/login                      # Đăng nhập
POST /api/auth/register                   # Đăng ký
POST /api/auth/logout                     # Đăng xuất
GET  /api/auth/me                         # Thông tin user hiện tại
PUT  /api/auth/change-password            # Đổi mật khẩu
POST /api/auth/init                       # Khởi tạo auth sheets
```

### 👥 User Management (RBAC)

```bash
# Roles
GET    /api/roles                         # Danh sách roles
POST   /api/roles                         # Tạo role
PUT    /api/roles/:id                     # Cập nhật role
DELETE /api/roles/:id                     # Xóa role

# Employees
GET    /api/employees                     # Danh sách nhân viên
POST   /api/employees                     # Tạo nhân viên
PUT    /api/employees/:id                 # Cập nhật nhân viên
DELETE /api/employees/:id                 # Xóa nhân viên

# Permissions
GET    /api/role-permissions              # Tất cả permissions
GET    /api/role-permissions/role/:roleId # Permissions của role
POST   /api/role-permissions              # Gán permission
```

### 📦 Business Data

```bash
# Carriers
GET    /api/carriers                      # Danh sách nhà VC
POST   /api/carriers                      # Tạo nhà VC
PUT    /api/carriers/:id                  # Cập nhật
DELETE /api/carriers/:id                  # Xóa

# Transfers
GET    /api/transfers                     # Phiếu chuyển kho
POST   /api/transfers                     # Tạo phiếu
PUT    /api/transfers/:id                 # Cập nhật
DELETE /api/transfers/:id                 # Xóa

# Locations, Transport Requests, Inbound...
# (Tương tự CRUD operations)
```

**Tổng số:** **50+ API endpoints** từ **16 route modules** (100% complete)

Xem chi tiết: [API Documentation](./docs/md/README.md)

---

## 🎨 Customization

### 🎯 Brand Configuration

Chỉnh sửa `src/config/brand.js`:

```javascript
export const BRAND_CONFIG = {
  companyName: "MIA Logistics",
  productName: "MIA Logistics Manager",
  colors: {
    primary: "#1976d2",
    secondary: "#dc004e",
  },
  logo: "/logo.png",
  // ... more config
};
```

### ➕ Add Custom Features

1. Tạo component trong `src/components/custom/`
2. Import và sử dụng trong Dashboard
3. Kết nối với API endpoint trong `src/services/api/`
4. Thêm route trong `src/config/router.tsx`

Xem chi tiết trong [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md)

---

## 🚀 Deployment

### ⚡ Quick Deploy với Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 🌐 Deployment Options

<div align="center">

| Platform | Frontend | Backend | AI Service | Recommendation |
|----------|----------|---------|------------|----------------|
| **Vercel** | ✅ | ❌ | ❌ | ⭐⭐⭐⭐⭐ Frontend |
| **Netlify** | ✅ | ❌ | ❌ | ⭐⭐⭐⭐ Frontend |
| **Railway** | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ Full stack |
| **Heroku** | ✅ | ✅ | ❌ | ⭐⭐⭐⭐ Backend |
| **Docker** | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ Production |
| **AWS** | ✅ | ✅ | ✅ | ⭐⭐⭐⭐⭐ Enterprise |

</div>

### 📦 Production Build

```bash
# Build frontend
npm run build

# Build backend (nếu cần)
cd backend && npm install --production

# Start production
cd backend && NODE_ENV=production npm start
```

Xem hướng dẫn chi tiết: [DEPLOYMENT.md](./docs/md/DEPLOYMENT.md)

---

## 📊 Scripts

### 🛠️ Development

```bash
npm start              # Chạy dev server (Frontend)
npm run dev            # Alias của start
cd backend && npm start # Backend server
```

### 🏗️ Production

```bash
npm run build          # Build production
npm run build:prod     # Build + optimize
npm run serve          # Test production build locally
```

### 🔍 Code Quality

```bash
npm run lint           # Check linting errors
npm run lint:fix       # Fix linting errors
npm run format         # Format code với Prettier
npm run type-check     # TypeScript type checking
```

### 📈 Analysis

```bash
npm run analyze        # Analyze bundle size
```

---

## 🤝 Contributing

Contributions are welcome! 🎉

### 📝 Development Workflow

1. **Fork** repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

### ✅ Code Standards

- Follow ESLint rules
- Use TypeScript for new files
- Write descriptive commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

<div align="center">

**MIA Logistics Team**

| Contact | Link |
|---------|------|
| 🌐 **GitHub** | [@caovinhphuc](https://github.com/caovinhphuc) |
| 📧 **Email** | <support@mialogistics.vn> |
| 🌍 **Website** | <https://mialogistics.vn> |

</div>

---

## 🙏 Acknowledgments

<div align="center">

| Technology | Link |
|------------|------|
| [React](https://reactjs.org/) | UI Framework |
| [Material-UI](https://mui.com/) | Component Library |
| [Chart.js](https://www.chartjs.org/) | Data Visualization |
| [Google Sheets API](https://developers.google.com/sheets/api) | Data Storage |
| [Express.js](https://expressjs.com/) | Backend Framework |
| [FastAPI](https://fastapi.tiangolo.com/) | AI Service Framework |

</div>

---

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi:

<div align="center">

| Channel | Link |
|---------|------|
| 📧 **Email** | <support@mialogistics.vn> |
| 🐛 **Issues** | [GitHub Issues](https://github.com/YOUR_USERNAME/mia-logistics-manager/issues) |
| 💬 **Discussions** | [GitHub Discussions](https://github.com/YOUR_USERNAME/mia-logistics-manager/discussions) |
| 📖 **Documentation** | [Docs](./docs/md/README.md) |

</div>

---

<div align="center">

### ⭐ Nếu project này hữu ích, hãy cho chúng tôi 1 star! ⭐

**Made with ❤️ by MIA Logistics Team**

[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/mia-logistics-manager?style=social)](https://github.com/YOUR_USERNAME/mia-logistics-manager)

---

**Version 2.1.0** • Last Updated: 2025-01-30

</div>
