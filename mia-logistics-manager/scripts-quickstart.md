<div align="center">

# ⚡ Quick Start Guide - Scripts Usage

**Hướng dẫn nhanh để setup và develop MIA Logistics Manager**

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/caovinhphuc/mia-logistics-manager)
[![Status](https://img.shields.io/badge/status-active-success.svg)](https://github.com/caovinhphuc/mia-logistics-manager)

**[Setup](#-scenario-1-setup-project-lần-đầu) • [Features](#-scenario-3-thêm-feature-mới) • [Commands](#-command-cheat-sheet) • [Troubleshooting](#-troubleshooting)**

---

</div>

## 📋 Mục Lục

1. [Scenario 1: Setup Project Lần Đầu](#-scenario-1-setup-project-lần-đầu)
2. [Scenario 2: Tạo Structure Từ Đầu](#-scenario-2-tạo-structure-từ-đầu)
3. [Scenario 3: Thêm Feature Mới](#-scenario-3-thêm-feature-mới)
4. [Scenario 4: Daily Development](#-scenario-4-daily-development)
5. [Command Cheat Sheet](#-command-cheat-sheet)
6. [Common Workflows](#-common-workflows)
7. [Pro Tips](#-pro-tips)
8. [Troubleshooting](#-troubleshooting)

---

## 🎯 Scenario 1: Setup Project Lần Đầu

### 📥 Clone & Setup

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/mia-logistics-manager.git
cd mia-logistics-manager

# 2. Make scripts executable
chmod +x scripts/*.sh

# 3. Run setup script (tự động làm TẤT CẢ)
./scripts/setup.sh
```

### ✅ Script sẽ tự động làm

<div align="center">

| Bước | Mô tả | Thời gian |
|------|-------|-----------|
| **1** | Check Node.js, npm, Git | ~5s |
| **2** | Create `.env` file | ~3s |
| **3** | Install dependencies | 2-5 min |
| **4** | Setup Git hooks | ~10s |
| **5** | Verify build | ~30s |

</div>

**⏱️ Tổng thời gian:** **5-10 phút** (one-time setup)

### 🎉 Kết Quả

Sau khi chạy script, bạn sẽ có:

- ✅ Project structure đầy đủ
- ✅ Dependencies đã được cài đặt
- ✅ Environment variables đã được config
- ✅ Git hooks đã được setup
- ✅ Build verification passed

---

## 🎯 Scenario 2: Tạo Structure Từ Đầu

Nếu clone về chưa có structure đầy đủ:

```bash
# Generate toàn bộ structure
./scripts/generate-structure.sh

# Output:
# ✓ 80+ directories created
# ✓ 100+ files created
```

### 📦 Cấu Trúc Sẽ Được Tạo

<div align="center">

| Component | Mô tả | Files |
|-----------|-------|-------|
| **📁 Features** | Orders, Shipments, Routes... | 15+ modules |
| **🔧 Shared Components** | Reusable UI components | 20+ components |
| **🌐 Services** | API, Sheets, Maps... | 10+ services |
| **🧪 Tests** | Test structure | Full coverage |
| **⚙️ Config** | tsconfig, eslint, prettier | All configs |
| **🎨 Theme** | Material-UI theme setup | Complete |

</div>

---

## 🎯 Scenario 3: Thêm Feature Mới

### 🚀 Generate Feature Module

```bash
# Generate feature module
./scripts/generate-feature.sh customers
```

### 📁 Structure Được Tạo

```text
src/features/customers/
├── 📄 components/
│   ├── CustomerList.tsx      # List component
│   ├── CustomerCard.tsx      # Card component
│   ├── CustomerForm.tsx      # Form component
│   └── index.ts
├── 🪝 hooks/
│   ├── useCustomer.ts        # CRUD hooks
│   └── index.ts
├── 🌐 services/
│   ├── customerService.ts    # API service
│   └── index.ts
├── 📝 types/
│   ├── customer.types.ts     # TypeScript types
│   └── index.ts
└── 🔧 utils/                  # Helper functions
```

### 📋 Next Steps

<div align="center">

| Bước | Command | Mô tả |
|------|---------|-------|
| **1. Customize** | `code src/features/customers/` | Chỉnh sửa generated files |
| **2. Add Route** | Edit `src/config/router.tsx` | Thêm route mới |
| **3. Test** | `npm run dev` | Test feature |

</div>

---

## 🎯 Scenario 4: Daily Development

### 🌅 Morning Workflow

```bash
# 1. Pull latest changes
git pull origin develop

# 2. Install new dependencies (if any)
npm install

# 3. Start dev server
npm run dev
```

### ➕ Adding New Feature

```bash
# 1. Create feature branch
git checkout -b feature/invoices

# 2. Generate feature
./scripts/generate-feature.sh invoices

# 3. Develop
code src/features/invoices/

# 4. Test locally
npm run test
npm run lint

# 5. Commit
git add .
git commit -m "feat: add invoices module"

# 6. Push
git push origin feature/invoices
```

---

## 📋 Command Cheat Sheet

### ⚙️ Setup Commands

<div align="center">

| Command | Purpose | Time |
|---------|---------|------|
| `./scripts/setup.sh` | Complete project setup | **5-10 min** |
| `./scripts/generate-structure.sh` | Generate full structure | **30 sec** |
| `npm install` | Install dependencies | **2-3 min** |

</div>

### 🛠️ Development Commands

<div align="center">

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Start dev server | <http://localhost:3000> |
| `npm run build` | Production build | `build/` folder |
| `npm run test` | Run all tests | Test results |
| `npm run lint` | Check code style | Lint report |
| `npm run lint:fix` | Fix code style | Auto-fix issues |
| `npm run type-check` | TypeScript check | Type errors |

</div>

### 🎨 Feature Generation

<div align="center">

| Command | Purpose | Output |
|---------|---------|--------|
| `./scripts/generate-feature.sh orders` | Generate Orders module | Complete CRUD feature |
| `./scripts/generate-feature.sh shipments` | Generate Shipments module | Complete CRUD feature |
| `./scripts/generate-feature.sh <name>` | Generate any feature | Complete CRUD feature |

</div>

---

## 🔥 Common Workflows

### 🔄 Workflow 1: Fresh Setup

```bash
# Terminal
git clone <repo>
cd mia-logistics-manager
chmod +x scripts/*.sh
./scripts/setup.sh
./scripts/generate-structure.sh  # If needed
npm run dev
```

### ➕ Workflow 2: Add Feature → Test → Deploy

```bash
# 1. Generate
./scripts/generate-feature.sh reports

# 2. Customize
code src/features/reports/

# 3. Test
npm run test

# 4. Commit
git add .
git commit -m "feat: add reports module"

# 5. Push & PR
git push origin feature/reports
```

### 🐛 Workflow 3: Fix Bug

```bash
# 1. Create branch
git checkout -b bugfix/order-calculation

# 2. Fix code
code src/features/orders/services/

# 3. Test
npm run test

# 4. Commit
git add .
git commit -m "fix: correct order cost calculation"

# 5. Push
git push origin bugfix/order-calculation
```

---

## 🎨 Visual Guide

### 📊 Project Setup Flow

```text
┌─────────────────────┐
│   Clone Repo       │
│   git clone ...    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  chmod +x scripts/*  │
│  Make executable    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   ./setup.sh        │◄────── Tự động làm TẤT CẢ!
│                     │
│  ✓ Check deps       │
│  ✓ Install deps     │
│  ✓ Create .env      │
│  ✓ Setup hooks      │
│  ✓ Verify build     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   npm run dev       │
│   🚀 Server ready!  │
└─────────────────────┘
```

### 🎨 Feature Generation Flow

```text
┌──────────────────────────┐
│  generate-feature.sh    │
│  customers              │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   Structure Created      │
│                          │
│  ✓ components/           │
│  ✓ hooks/                │
│  ✓ services/             │
│  ✓ types/                │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   Customize Code        │
│   Edit generated files  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   Add to Routes         │
│   Update router.tsx     │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   Test & Commit         │
│   npm test && git commit│
└──────────────────────────┘
```

---

## 💡 Pro Tips

### 💡 Tip 1: Batch Feature Generation

```bash
# Generate multiple features at once
for feature in customers invoices reports settings
do
  ./scripts/generate-feature.sh $feature
  echo "✓ Generated $feature"
done
```

**Output:**

```text
✓ Generated customers
✓ Generated invoices
✓ Generated reports
✓ Generated settings
```

### 💡 Tip 2: Alias Commands

Add to `.bashrc` or `.zshrc`:

```bash
# MIA Logistics aliases
alias mia-setup='./scripts/setup.sh'
alias mia-struct='./scripts/generate-structure.sh'
alias mia-feature='./scripts/generate-feature.sh'
alias mia-dev='npm run dev'
alias mia-test='npm run test && npm run lint'
```

**Usage:**

```bash
mia-feature customers
mia-dev
mia-test
```

### 💡 Tip 3: Check Before Commit

```bash
# Pre-commit checklist
npm run type-check && \
npm run lint && \
npm run test && \
echo "✅ All checks passed!"
```

### 💡 Tip 4: Quick Status Check

```bash
# Check what's changed
git status

# Check TypeScript
npm run type-check

# Check style
npm run lint

# All in one
npm run type-check && npm run lint && echo "✅ OK"
```

### 💡 Tip 5: Auto-generate Multiple Features

```bash
# Create script: generate-all.sh
#!/bin/bash
FEATURES=("customers" "invoices" "reports" "settings" "analytics")

for feature in "${FEATURES[@]}"
do
  echo "Generating $feature..."
  ./scripts/generate-feature.sh $feature
  echo "✓ $feature done"
done

echo "✅ All features generated!"
```

---

## 🚨 Troubleshooting

### ❌ Issue 1: Permission Denied

**Error:**

```bash
./scripts/setup.sh: Permission denied
```

**Solution:**

```bash
chmod +x scripts/*.sh
```

### ❌ Issue 2: Command Not Found

**Error:**

```bash
./scripts/setup.sh: No such file or directory
```

**Solution:**

```bash
# Make sure you're in project root
cd /path/to/mia-logistics-manager

# Verify location
pwd
ls scripts/  # Should see .sh files
```

### ❌ Issue 3: npm install Fails

**Error:**

```bash
npm ERR! code ECONNREFUSED
```

**Solution:**

```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### ❌ Issue 4: TypeScript Errors After Generation

**Error:**

```bash
TS2307: Cannot find module 'react'
```

**Solution:**

```bash
# Run type check
npm run type-check

# Install missing types
npm install --save-dev @types/react @types/node

# Restart TypeScript server (in VSCode)
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### ❌ Issue 5: Scripts Not Executable

**Solution:**

```bash
# Make all scripts executable
find scripts -name "*.sh" -exec chmod +x {} \;

# Or individually
chmod +x scripts/setup.sh
chmod +x scripts/generate-feature.sh
chmod +x scripts/generate-structure.sh
```

---

## 📊 Time Estimates

<div align="center">

| Task | Time | Notes |
|------|------|-------|
| **Initial setup** | 5-10 min | One-time |
| **Generate structure** | 30 sec | One-time |
| **Generate feature** | 5 sec | Per feature |
| **Customize feature** | 30-60 min | Depends on complexity |
| **Write tests** | 15-30 min | Per feature |
| **Code review ready** | 1-2 hours | Complete feature |

</div>

---

## 📞 Need Help?

<div align="center">

| Resource | Link |
|----------|------|
| **📖 Full README** | [README.md](../README.md) |
| **📝 Scripts README** | [scripts-readme.md](./scripts-readme.md) |
| **🏗️ Architecture** | [ARCHITECTURE.md](../docs/ARCHITECTURE.md) |
| **🤝 Contributing** | [CONTRIBUTING.md](../CONTRIBUTING.md) |

</div>

### 💬 Support Channels

- **📧 Email**: <tech@mia.vn>
- **💬 Telegram**: @mia_logistics_dev
- **🐛 GitHub Issues**: [Create Issue](https://github.com/YOUR_USERNAME/mia-logistics-manager/issues)

---

## 🎉 Next Steps

After setup:

<div align="center">

| Step | Action | Link |
|------|--------|------|
| **1** | Review generated structure | Check `src/features/` |
| **2** | Read Contributing guide | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| **3** | Check Architecture docs | [ARCHITECTURE.md](../docs/ARCHITECTURE.md) |
| **4** | Join Telegram group | @mia_logistics_dev |
| **5** | Start developing! | `npm run dev` |

</div>

---

<div align="center">

### ⭐ **Happy Coding!** 🚀

**Made with ❤️ by MIA Logistics Team**

[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/mia-logistics-manager?style=social)](https://github.com/YOUR_USERNAME/mia-logistics-manager)

---

**Version 2.1.0** • Last Updated: 2025-01-30

</div>
