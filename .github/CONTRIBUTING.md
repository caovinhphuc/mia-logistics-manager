# Hướng dẫn đóng góp & Quy trình PR

Tài liệu thống nhất quy trình mở PR, checklist và CI cho MIA Logistics Manager.

---

## 🔄 Quy trình chung

1. **Tạo branch** từ `main` (ví dụ: `feature/xxx`, `bugfix/xxx`).
2. **Code + commit** (message rõ ràng).
3. **Chạy checklist local** (xem bên dưới).
4. **Mở Pull Request** → điền template (checklist trong PR).
5. **CI chạy** → sửa nếu fail.
6. **Review** → merge vào `main`.

---

## ✅ Checklist trước khi mở PR (chạy local)

Các bước sau **trùng với CI** trên GitHub. Chạy xong pass rồi hãy mở PR.

| Bước | Lệnh | Ghi chú |
|------|------|--------|
| Lint | `npm run lint` | Hoặc `npm run lint:fix` rồi commit lại |
| Format | `npm run format:check` | Hoặc `npm run format` |
| Type check | `npm run type-check` | Chỉ khi có file TS/TSX |
| Test | `npm test -- --watchAll=false` | Hoặc `npm run test:coverage` |
| Build | `npm run build` | Bắt buộc |

**Một lệnh gộp (khuyến nghị):**

```bash
npm run lint && npm run format:check && npm run type-check && npm run test:coverage && npm run build
```

Nếu dùng **husky** (pre-commit):

```bash
npm run pre-commit
```

---

## 🤖 CI trên GitHub (Workflows)

Khi push hoặc mở PR vào `main`, các workflow sau chạy:

| Workflow | File | Khi chạy | Việc làm |
|----------|------|----------|----------|
| **Deploy** | `workflows/deploy.yml` | Push/PR vào `main` | Lint, test, build, security-audit; sau đó deploy staging → production |
| **Security** | `workflows/security.yml` | Push/PR vào `main` + schedule | npm audit, Snyk, CodeQL, trufflehog |
| **Performance** | `workflows/performance.yml` | Push vào `main` + schedule | Build, Lighthouse CI, bundle analyzer |
| **Docker** | `workflows/docker.yml` | Push vào `main` hoặc tag `v*` | Build & push Docker image |

**Ý nghĩa:** PR cần **pass** job **test** trong `deploy.yml` (lint + test + build). Security/Performance có thể chạy schedule hoặc trên push.

---

## 📋 PR Template – Cách dùng

- Mỗi PR dùng **PULL_REQUEST_TEMPLATE.md**: điền mô tả, tick checklist.
- Checklist trong template **đồng bộ** với CI: nếu bạn đã tick "Lint/Build/Test pass" và chạy đúng lệnh local thì CI cũng thường pass.
- Reviewer dùng phần "Checklist cho reviewer" để kiểm tra nhanh.

---

## 🧪 Test

- **Unit:** `npm test` hoặc `npm run test:coverage`.
- **E2E:** Hiện chưa cấu hình (`npm run test:e2e` chỉ echo). Khi có E2E sẽ bổ sung vào checklist và CI.

---

## 📁 Cấu trúc .github

```
.github/
├── PULL_REQUEST_TEMPLATE.md   # Template PR + checklist thống nhất
├── CONTRIBUTING.md            # File này – quy trình & checklist
├── ISSUE_TEMPLATE/            # Template báo lỗi / feature
└── workflows/                 # GitHub Actions
    ├── deploy.yml             # Lint, test, build, deploy
    ├── security.yml           # Security scan
    ├── performance.yml        # Lighthouse, bundle
    └── docker.yml             # Docker build/push
```

---

Cập nhật lần cuối: theo quy trình hiện tại của repo (lint, test, build, deploy).
