# 🚚 MIA Logistics Manager

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

**Hệ thống quản lý vận chuyển chuyên nghiệp cho Việt Nam với AI Analytics**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deploy](#-deployment) • [API](#-api-endpoints)

## 📖 Giới Thiệu

MIA Logistics Manager là hệ thống quản lý logistics hiện đại, tích hợp Google Workspace (Sheets, Drive, Apps Script) và AI để tối ưu hóa quy trình vận hành, theo dõi real-time và phân tích dữ liệu thông minh.

### ✨ Điểm Nổi Bật

- 🚀 **Real-time Dashboard** - Theo dõi vận chuyển theo thời gian thực
- 🤖 **AI-Powered Analytics** - Dự đoán thời gian giao hàng, ước tính chi phí, tối ưu lộ trình
- 📊 **Advanced Reporting** - Báo cáo chi tiết, phân tích xu hướng
- 🗺️ **Route Optimization** - Tối ưu hóa lộ trình giao hàng với Google Maps
- 📱 **Responsive Design** - Hoạt động mượt trên mọi thiết bị
- 🌐 **Vietnamese Localization** - Hoàn toàn tiếng Việt
- ☁️ **Google Workspace Integration** - Sheets, Drive, Apps Script
- 🔔 **Multi-channel Notifications** - Telegram, Email alerts

---

## 🎯 Features

### Core Features

- ✅ **Quản lý đơn hàng** - Tạo, theo dõi, cập nhật đơn hàng
- ✅ **Quản lý vận chuyển** - Phân bổ, theo dõi chuyến hàng
- ✅ **Quản lý nhà vận chuyển** - Đánh giá hiệu suất, so sánh, pricing
- ✅ **Quản lý kho** - Tồn kho, nhập/xuất hàng, định vị
- ✅ **Chuyển kho** - Transfers management với volume calculator
- ✅ **Nhập hàng** - Inbound domestic & international với calendar view
- ✅ **Theo dõi real-time** - GPS tracking, alerts
- ✅ **Báo cáo & Analytics** - Dashboard, charts, insights
- ✅ **Tính khoảng cách** - Google Apps Script integration

### Advanced Features

- 🤖 **AI Demand Prediction** - Dự đoán nhu cầu vận chuyển
- ⏱️ **Delivery Time Prediction** - Dự đoán thời gian giao hàng
- 💰 **Cost Estimation** - Ước tính chi phí vận chuyển
- 📈 **Performance Analytics** - Phân tích hiệu suất chi tiết
- 🔔 **Smart Notifications** - Telegram, Email notifications
- 📊 **Custom Dashboards** - Tùy chỉnh dashboard theo nhu cầu
- 🔒 **Role-based Access** - Phân quyền chi tiết (RBAC)
- 📦 **Volume Calculator** - Tính toán khối lượng hàng hóa

---

## 🚀 Quick Start

### Yêu Cầu

- Node.js >= 18.x
- npm >= 9.x
- Python 3.9+ (cho AI Service - optional)
- Google Cloud Platform account
- Git

### Cài Đặt

```bash
# 1. Clone repository
git clone https://github.com/your-username/mia-logistics-manager.git
cd mia-logistics-manager

# 2. Cài dependencies Frontend
npm install

# 3. Cài dependencies Backend
cd backend
npm install
cd ..

# 4. (Optional) Cài AI Service
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# 5. Copy environment variables
# File .env đã có sẵn với các giá trị thực tế
# Kiểm tra và cập nhật nếu cần

# 6. Chạy development server
./start-project.sh
# Hoặc
./start.sh
```

App sẽ mở tại: `http://localhost:3000`
Backend API: `http://localhost:5050`
AI Service: `http://localhost:8000` (nếu chạy)

---

## 📁 Cấu Trúc Project

```text
mia-logistics-manager/
├── src/                        # Frontend React code
│   ├── components/            # React components
│   │   ├── auth/             # Authentication
│   │   ├── carriers/         # Nhà vận chuyển
│   │   ├── employees/        # Nhân viên
│   │   ├── transfers/       # Chuyển kho
│   │   ├── inbound/          # Nhập hàng
│   │   └── layout/           # Layout components
│   ├── features/             # Feature modules
│   │   ├── carriers/
│   │   ├── employees/
│   │   ├── transfers/
│   │   └── inbound/
│   ├── services/             # API services
│   │   ├── googleSheets/    # Google Sheets integration
│   │   └── maps/             # Maps services
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── stores/               # Zustand stores
│   ├── locales/              # Translations (i18next)
│   └── App.js                # Main app component
├── backend/                   # Backend Node.js/Express
│   ├── src/
│   │   ├── routes/           # API routes
│   │   │   ├── carriersRoutes.js
│   │   │   ├── transfersRoutes.js
│   │   │   ├── locationsRoutes.js
│   │   │   ├── transportRequestsRoutes.js
│   │   │   ├── settingsRoutes.js
│   │   │   ├── telegramRoutes.js
│   │   │   └── googleSheetsRoutes.js
│   │   ├── services/        # Business logic
│   │   └── utils/            # Utilities
│   ├── index.js              # Main server file
│   └── package.json
├── ai-service/                # AI Service (Python/FastAPI) - Optional
│   ├── main_simple.py        # FastAPI app
│   ├── models/               # ML models
│   │   └── logistics_predictor.py
│   └── requirements.txt
├── public/                    # Static files
├── scripts/                   # Utility scripts
├── logs/                      # Log files
├── .env                       # Environment variables
└── package.json              # Frontend package.json
```

---

## 🛠️ Tech Stack

### Frontend

- **React 18.2** - UI Framework
- **React Router v6** - Routing
- **Material-UI 5** - UI Components
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Query** - Data fetching & caching
- **i18next** - Internationalization
- **Zustand** - State management

### Backend

- **Express.js** - API Server
- **Node.js 18+** - Runtime
- **Google Sheets API** - Data storage
- **Google Drive API** - File management
- **Google Apps Script API** - Distance calculation
- **Telegram Bot API** - Notifications
- **JWT** - Authentication

### AI Service (Optional)

- **FastAPI** - Python API framework
- **scikit-learn** - Machine learning
- **NumPy, Pandas** - Data processing
- **Uvicorn** - ASGI server

### Tools & DevOps

- **TypeScript** - Type safety
- **ESLint & Prettier** - Code quality
- **Git** - Version control
- **Docker** - Containerization (optional)

---

## 🔌 API Endpoints

### Core APIs

Base URL: `http://localhost:5050/api`

#### Carriers (Nhà vận chuyển)

- `GET /carriers` - Lấy danh sách carriers
- `POST /carriers` - Tạo carrier mới
- `PUT /carriers/:id` - Cập nhật carrier
- `DELETE /carriers/:id` - Xóa carrier

#### Transfers (Chuyển kho)

- `GET /transfers` - Lấy danh sách transfers
- `POST /transfers` - Tạo transfer mới
- `PUT /transfers/:id` - Cập nhật transfer
- `DELETE /transfers/:id` - Xóa transfer

#### Locations (Vị trí kho)

- `GET /locations` - Lấy danh sách locations
- `POST /locations` - Tạo location mới
- `PUT /locations/:id` - Cập nhật location
- `DELETE /locations/:id` - Xóa location

#### Transport Requests (Yêu cầu vận chuyển)

- `GET /transport-requests` - Lấy danh sách requests
- `GET /transport-requests/:requestId` - Lấy chi tiết request
- `POST /transport-requests` - Tạo request mới
- `PUT /transport-requests/:requestId` - Cập nhật request
- `DELETE /transport-requests/:requestId` - Xóa request

#### Settings (Cài đặt)

- `GET /settings/volume-rules` - Lấy quy tắc khối lượng
- `POST /settings/volume-rules` - Tạo quy tắc mới

#### Google Sheets

- `GET /sheets/info/:spreadsheetId?` - Thông tin spreadsheet
- `POST /sheets/read` - Đọc dữ liệu từ sheet
- `POST /sheets/write` - Ghi dữ liệu vào sheet
- `POST /sheets/append` - Thêm dữ liệu vào sheet

#### Telegram

- `GET /telegram/test` - Test Telegram connection
- `POST /telegram/send` - Gửi message qua Telegram

#### Health Check

- `GET /health` - Health check endpoint

### AI Service APIs (Optional)

Base URL: `http://localhost:8000`

- `GET /health` - Health check
- `POST /api/ml/predict-delivery-time` - Dự đoán thời gian giao hàng
- `POST /api/ml/estimate-cost` - Ước tính chi phí
- `POST /api/ml/forecast-demand` - Dự báo nhu cầu
- `POST /api/ml/optimize-route` - Tối ưu hóa tuyến đường

Xem chi tiết: [API Documentation](../API.md)

---

## 📚 Documentation

- [📖 README.md](../../README.md) - Hướng dẫn tổng quan
- [🚀 DEPLOYMENT.md](./DEPLOYMENT.md) - Hướng dẫn deployment chi tiết
- [⚙️ GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) - Setup Google Sheets
- [📝 TEMPLATE_GUIDE.md](../../TEMPLATE_GUIDE.md) - Hướng dẫn tùy chỉnh
- [📊 DATA_FLOW_ANALYSIS.md](./DATA_FLOW_ANALYSIS.md) - Phân tích luồng dữ liệu
- [🎯 DEMO_PRESENTATION_READY.md](./DEMO_PRESENTATION_READY.md) - Demo guide

---

## 🎨 Customization

### Brand Configuration

Edit theme và branding trong `src/styles/theme.js` hoặc config files.

### Google Sheets Configuration

File `.env` đã được cấu hình với:

- Google Spreadsheet ID: `18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`
- 25 sheets đã được kết nối
- Service Account credentials

### Add Custom Features

1. Tạo feature module trong `src/features/`
2. Tạo API route trong `backend/src/routes/`
3. Thêm vào navigation trong `src/App.js`

---

## 🚀 Deployment

### Quick Deploy với Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy Options

- ✅ **Vercel** (Recommended) - Zero-config deployment
- ✅ **Netlify** - Fast CDN, continuous deployment
- ✅ **Railway** - Full-stack deployment
- ✅ **Heroku** - Traditional PaaS
- ✅ **Docker** - Containerized deployment
- ✅ **AWS S3 + CloudFront** - Scalable infrastructure

**Lưu ý**: Backend cần deploy riêng (Railway, Heroku, hoặc VPS)

Xem hướng dẫn chi tiết: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📊 Scripts

```bash
# Development
npm start              # Chạy dev server
npm run dev:all        # Chạy frontend + backend
./start-project.sh     # Quick start (recommended)

# Production
npm run build         # Build production
npm run build:prod    # Build + optimize
npm run serve         # Test production build locally

# Code Quality
npm run lint          # Check linting errors
npm run lint:fix      # Fix linting errors
npm run format        # Format code với Prettier
npm run type-check    # TypeScript type checking

# Testing
npm test              # Run tests
npm run test:coverage # Test với coverage
npm run test:connections # Test API connections

# Analysis
npm run analyze       # Analyze bundle size
```

---

## 🔐 Security & Authentication

### Authentication

- Google OAuth 2.0
- JWT tokens
- Session management
- Auto logout

### Authorization

- Role-based access control (RBAC)
- Permission-based UI rendering
- API endpoint protection

### Roles

1. **Admin** - Toàn quyền hệ thống
2. **Manager** - Quản lý vận hành
3. **Operator** - Điều hành hàng ngày
4. **Driver** - Tài xế vận chuyển
5. **Warehouse Staff** - Nhân viên kho

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

## 👥 Team

**MIA Logistics Team**

- Email: <kho.1@mia.vn>
- GitHub: [@your-username](https://github.com/your-username/mia-logistics-manager)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

## 📞 Support

Nếu bạn gặp vấn đề hoặc có câu hỏi:

- 📧 Email: <kho.1@mia.vn>
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/mia-logistics-manager/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/mia-logistics-manager/discussions)

---

## 📈 Services Status

| Service | Status | Port | Note |
|---------|--------|------|------|
| Frontend | ✅ Running | 3000 | React App |
| Backend API | ✅ Running | 5050 | Express Server |
| Google Sheets | ✅ Connected | - | 25 tabs accessible |
| Telegram Bot | ✅ Connected | - | Auto notifications |
| Google Drive | ⚠️ Configured | - | Cần share folder |
| Apps Script | ✅ Working | - | Distance calculator |
| AI Service | ⚠️ Optional | 8000 | FastAPI (chỉ cần khi dùng AI features) |
| Email | ❌ Failed | - | SendGrid key cần update |

---

<div align="center">

**⭐ Nếu project này hữu ích, hãy cho chúng tôi 1 star! ⭐**

Made with ❤️ by MIA Logistics Team for Vietnamese logistics industry

**Version 2.1.0** | Last Updated: 2025-01-30

</div>
