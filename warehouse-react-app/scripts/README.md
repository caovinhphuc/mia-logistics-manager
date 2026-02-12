# 📚 Scripts Directory - React OAS Integration v4.0

> **Cấu trúc scripts đã được tổ chức lại**  
> **Ngày cập nhật**: 2025-01-27

---

## 📁 CẤU TRÚC THƯ MỤC

```
scripts/
├── setup/              # Setup scripts
├── start-stop/         # Start/Stop scripts
├── deploy/             # Deployment scripts
├── fix/                # Fix/Troubleshooting
├── utils/              # Utility scripts
└── git/                # Git operations
```

---

## 🚀 QUICK START

### Development

```bash
# Start all services
./start.sh
# hoặc
./scripts/start-stop/start-all.sh

# Stop all services
./stop.sh
# hoặc
./scripts/start-stop/stop-all.sh
```

### Deployment

```bash
# Main deploy (Netlify + Render)
./deploy.sh "Commit message"
# hoặc
./scripts/deploy/deploy-main.sh "Commit message"

# Quick deploy (Vercel + Railway)
./quick-deploy.sh "Commit message"
# hoặc
./scripts/deploy/quick-deploy.sh "Commit message"
```

---

## 📖 TÀI LIỆU CHI TIẾT

Xem [SCRIPTS_GUIDE.md](../SCRIPTS_GUIDE.md) để biết hướng dẫn chi tiết về từng script.

---

## ⚠️ LƯU Ý

- Tất cả scripts được thiết kế để chạy từ **root directory**
- Scripts tự động detect project root
- Sử dụng wrapper scripts ở root level để dễ dàng hơn

---

**Last Updated**: 2025-01-27
