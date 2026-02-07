# ⚡ Quick Start Guide - Scripts Usage

> Hướng dẫn nhanh để setup và develop MIA.vn Logistics

---

## 🎯 Scenario 1: Setup Project Lần Đầu

```bash
# Clone repo
git clone https://github.com/mia-vn/logistics.git
cd mia-logistics

# Make scripts executable
chmod +x scripts/*.sh

# Run setup script (tự động làm TẤT CẢ)
./scripts/setup.sh
```

**Script sẽ làm:**

1. ✅ Check Node.js, npm, Git
2. ✅ Create `.env` file
3. ✅ Install dependencies
4. ✅ Setup Git hooks
5. ✅ Verify build

**Thời gian:** 5-10 phút

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

**Tạo được:**

- 📁 Features folders (orders, shipments, routes...)
- 📁 Shared components
- 📁 Services (API, Sheets, Maps...)
- 📁 Tests structure
- ⚙️ Config files (tsconfig, eslint, prettier)
- 🎨 Theme setup
- 🧪 Test utilities

---

## 🎯 Scenario 3: Thêm Feature Mới

```bash
# Generate feature module
./scripts/generate-feature.sh customers

# Tạo được:
src/features/customers/
├── components/
│   ├── CustomerList.tsx      # List component
│   ├── CustomerCard.tsx      # Card component
│   ├── CustomerForm.tsx      # Form component
│   └── index.ts
├── hooks/
│   ├── useCustomer.ts        # CRUD hooks
│   └── index.ts
├── services/
│   ├── customerService.ts    # API service
│   └── index.ts
├── types/
│   ├── customer.types.ts     # TypeScript types
│   └── index.ts
└── utils/                     # Helper functions
```

**Sau đó:**

```bash
# 1. Customize generated files
code src/features/customers/

# 2. Add to routing
# Edit src/App.tsx

# 3. Test
npm run dev
```

---

## 🎯 Scenario 4: Daily Development

### Morning Workflow

```bash
# 1. Pull latest changes
git pull origin develop

# 2. Install new dependencies (if any)
npm install

# 3. Start dev server
npm run dev
```

### Adding New Feature

```bash
# 1. Create feature branch
git checkout -b feature/invoices

# 2. Generate feature
./scripts/generate-feature.sh invoices

# 3. Develop
code src/features/invoices/

# 4. Test locally
≈
npm run lint

# 5. Commit
git add .
git commit -m "feat: add invoices module"

# 6. Push
git push origin feature/invoices
```

---

## 📋 Command Cheat Sheet

### Setup Commands

| Command | Purpose | Time |
|---------|---------|------|
| `./scripts/setup.sh` | Complete project setup | 5-10 min |
| `./scripts/generate-structure.sh` | Generate full structure | 30 sec |
| `npm install` | Install dependencies | 2-3 min |

### Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run all tests |
| `npm run lint` | Check code style |
| `npm run lint:fix` | Fix code style |
| `npm run type-check` | TypeScript check |

### Feature Generation

| Command | Purpose | Output |
|---------|---------|--------|
| `./scripts/generate-feature.sh orders` | Generate Orders module | Complete CRUD feature |
| `./scripts/generate-feature.sh shipments` | Generate Shipments module | Complete CRUD feature |
| `./scripts/generate-feature.sh <name>` | Generate any feature | Complete CRUD feature |

---

## 🔥 Common Workflows

### Workflow 1: Fresh Setup

```bash
# Terminal
git clone <repo>
cd mia-logistics
chmod +x scripts/*.sh
./scripts/setup.sh
./scripts/generate-structure.sh  # If needed
npm run dev
```

### Workflow 2: Add Feature → Test → Deploy

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

### Workflow 3: Fix Bug

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

### Project Setup Flow

```
┌─────────────┐
│ Clone Repo  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ chmod +x    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ setup.sh    │◄─── Tự động làm TẤT CẢ!
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ npm run dev │
└─────────────┘
```

### Feature Generation Flow

```
┌──────────────────┐
│ generate-feature │
└────────┬─────────┘
         │
         ▼
┌────────────────┐
│ Customize Code │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Add to Routes  │
└────────┬───────┘
         │
         ▼
┌────────────────┐
│ Test & Commit  │
└────────────────┘
```

---

## 💡 Pro Tips

### Tip 1: Batch Feature Generation

```bash
# Generate multiple features at once
for feature in customers invoices reports settings
do
  ./scripts/generate-feature.sh $feature
  echo "✓ Generated $feature"
done
```

### Tip 2: Alias Commands

Add to `.bashrc` or `.zshrc`:

```bash
# MIA Logistics aliases
alias mia-setup='./scripts/setup.sh'
alias mia-struct='./scripts/generate-structure.sh'
alias mia-feature='./scripts/generate-feature.sh'
alias mia-dev='npm run dev'
alias mia-test='npm run test && npm run lint'
```

Then use:

```bash
mia-feature customers
mia-dev
```

### Tip 3: Check Before Commit

```bash
# Pre-commit checklist
npm run type-check && \
npm run lint && \
npm run test && \
echo "✅ All checks passed!"
```

### Tip 4: Quick Status Check

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

---

## 🚨 Troubleshooting

### Issue: Permission Denied

```bash
# Fix
chmod +x scripts/*.sh
```

### Issue: Command Not Found

```bash
# Make sure you're in project root
cd /path/to/mia-logistics

# Verify location
pwd
ls scripts/  # Should see .sh files
```

### Issue: npm install Fails

```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: TypeScript Errors After Generation

```bash
# Run type check
npm run type-check

# Install missing types
npm install --save-dev @types/react @types/node

# Restart TypeScript server (in VSCode)
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📊 Time Estimates

| Task | Time | Notes |
|------|------|-------|
| Initial setup | 5-10 min | One-time |
| Generate structure | 30 sec | One-time |
| Generate feature | 5 sec | Per feature |
| Customize feature | 30-60 min | Depends on complexity |
| Write tests | 15-30 min | Per feature |
| Code review ready | 1-2 hours | Complete feature |

---

## 📞 Need Help?

**Documentation:**

- [Full README](../README.md)
- [Scripts README](./README.md)
- [Architecture](../docs/ARCHITECTURE.md)
- [Contributing](../CONTRIBUTING.md)

**Support:**

- Telegram: @mia_logistics_dev
- Email: <tech@mia.vn>
- GitHub Issues

---

## 🎉 Next Steps

After setup:

1. ✅ Review generated structure
2. ✅ Read [CONTRIBUTING.md](../CONTRIBUTING.md)
3. ✅ Check [ARCHITECTURE.md](../docs/ARCHITECTURE.md)
4. ✅ Join Telegram group
5. ✅ Start developing!

---

**Happy Coding! 🚀**

> Được tạo bởi MIA.vn Tech Team
