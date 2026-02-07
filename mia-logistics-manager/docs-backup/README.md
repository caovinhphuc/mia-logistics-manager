# 📚 MIA Logistics Manager - Documentation

Tổng hợp tài liệu hướng dẫn sử dụng và phát triển hệ thống.

---

## 🚀 Quick Links

### For Users

- [**Main README**](../README.md) - Tài liệu chính, hướng dẫn cài đặt và sử dụng
- [**Features Detail**](FEATURES_DETAIL.md) - Chi tiết các tính năng
- [**FAQ**](../README.md#-faq-câu-hỏi-thường-gặp) - Câu hỏi thường gặp

### For Developers

- [**API Documentation**](API.md) - REST API endpoints
- [**Contributing Guide**](../CONTRIBUTING.md) - Hướng dẫn đóng góp
- [**Code of Conduct**](../CODE_OF_CONDUCT.md) - Quy tắc ứng xử

### For DevOps

- [**Deployment Checklist**](../FINAL_DEPLOYMENT_CHECKLIST.md) - Checklist deployment
- [**Security Policy**](../SECURITY.md) - Chính sách bảo mật
- [**Changelog**](../CHANGELOG.md) - Lịch sử thay đổi

---

## 📖 Documentation Index

### 🎯 Getting Started

1. **[Main README](../README.md)**
   - Quick start
   - Installation guide
   - Configuration
   - Running the application

2. **[Project Completion Summary](../PROJECT_COMPLETION_SUMMARY.md)**
   - Project overview
   - Features status
   - Deployment readiness

---

### 🔧 Technical Documentation

#### API & Integration

1. **[API.md](API.md)** - REST API Documentation
   - Endpoints reference
   - Authentication
   - Request/Response formats
   - Error handling

2. **[SWAGGER.yaml](SWAGGER.yaml)** - OpenAPI Specification
   - Interactive API documentation
   - Schema definitions
   - Try it out features

3. **[Google Apps Script Setup](GOOGLE_APPS_SCRIPT_SETUP.md)**
   - Distance calculator setup
   - Deployment guide
   - Testing procedures
   - Troubleshooting

#### Features & Functionality

4. **[Features Detail](FEATURES_DETAIL.md)**
   - Detailed feature descriptions
   - Business logic flows
   - UI/UX specifications
   - Use cases

5. **[Login System Versions](LOGIN_SYSTEM_VERSIONS.md)**
   - Evolution of login system
   - Version comparison
   - Migration guides
   - Best practices

#### Unified App (canonical)

- **[UNIFIED.md](UNIFIED.md)** – **Nguồn chính cho Unified:** vị trí `src/unified/`, cách chạy `npm run start:unified`, không dùng `src-unified`.
- **[UNIFIED_SIDEBAR_GUIDE.md](UNIFIED_SIDEBAR_GUIDE.md)** – Thêm mục Sidebar và route trong unified.
- **[UNIFIED_LAYOUT_CONFIG_GUIDE.md](UNIFIED_LAYOUT_CONFIG_GUIDE.md)** – Nút Cấu hình Layout, LayoutConfigManager.
- **[PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)** – Cấu trúc tổng thể, app chính vs unified.

---

### 👥 Contributing & Community

6. **[CONTRIBUTING.md](../CONTRIBUTING.md)**
   - Code style guidelines
   - Git workflow
   - Pull request process
   - Testing requirements

7. **[CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)**
   - Community guidelines
   - Expected behavior
   - Reporting violations

---

### 🔐 Security & Compliance

8. **[SECURITY.md](../SECURITY.md)**
   - Security policy
   - Vulnerability reporting
   - Best practices
   - Security audits

9. **[LICENSE](../LICENSE)**
   - MIT License
   - Terms and conditions
   - Third-party licenses

---

### 🚀 Deployment & Operations

10. **[Final Deployment Checklist](../FINAL_DEPLOYMENT_CHECKLIST.md)**
    - Pre-deployment checks
    - Deployment steps
    - Post-deployment verification
    - Rollback procedures

11. **[Docker Setup](../docker-compose.yml)**
    - Container orchestration
    - Multi-service deployment
    - Environment configuration

---

### 📊 Project Management

12. **[CHANGELOG.md](../CHANGELOG.md)**
    - Version history
    - Release notes
    - Breaking changes

13. **[Roadmap](../README.md#-roadmap)**
    - Q4 2025 plans
    - Q1 2026 plans
    - Long-term vision

---

## 🗂️ Documentation Structure

```
mia-logistics-manager/
├── README.md                           # Main documentation
├── CONTRIBUTING.md                     # Contributing guide
├── SECURITY.md                         # Security policy
├── CHANGELOG.md                        # Version history
├── LICENSE                             # MIT License
├── CODE_OF_CONDUCT.md                  # Code of conduct
├── PROJECT_COMPLETION_SUMMARY.md       # Project summary
├── FINAL_DEPLOYMENT_CHECKLIST.md       # Deployment guide
│
├── docs/                               # Documentation folder
│   ├── README.md                       # This file
│   ├── API.md                          # API documentation
│   ├── SWAGGER.yaml                    # OpenAPI spec
│   ├── FEATURES_DETAIL.md              # Feature details
│   ├── GOOGLE_APPS_SCRIPT_SETUP.md     # Apps Script guide
│   └── LOGIN_SYSTEM_VERSIONS.md        # Login evolution
│
├── .github/                            # GitHub templates
│   ├── workflows/ci.yml                # CI/CD pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
└── scripts/                            # Automation scripts
    ├── backup-before-migration.sh
    ├── deploy-check.sh
    ├── health-monitor.sh
    └── test-all.sh
```

---

## 🎯 Documentation by Role

### I'm a End User

**Start here:**

1. [Main README](../README.md) - Understand the system
2. [Features Detail](FEATURES_DETAIL.md) - Learn features
3. Ask questions in Issues

### I'm a Developer

**Start here:**

1. [Main README](../README.md) - Setup development
2. [Contributing Guide](../CONTRIBUTING.md) - Development workflow
3. [API Documentation](API.md) - API reference
4. [Features Detail](FEATURES_DETAIL.md) - Business logic

**Then:**

- Read code in `/src` folder
- Check examples in tests
- Join discussions

### I'm a DevOps Engineer

**Start here:**

1. [Deployment Checklist](../FINAL_DEPLOYMENT_CHECKLIST.md)
2. [Docker Setup](../docker-compose.yml)
3. [Security Policy](../SECURITY.md)

**Then:**

- Review scripts in `/scripts`
- Check CI/CD in `.github/workflows`
- Setup monitoring

### I'm a Project Manager

**Start here:**

1. [Project Summary](../PROJECT_COMPLETION_SUMMARY.md)
2. [Roadmap](../README.md#-roadmap)
3. [Changelog](../CHANGELOG.md)

**Then:**

- Review feature status
- Plan sprints based on roadmap
- Track issues and PRs

---

## 🔍 Finding Information

### Common Questions

**Q: How do I install the system?**  
A: See [Installation Section](../README.md#-cài-đặt-và-chạy) in main README

**Q: How do I deploy to production?**  
A: Follow [Deployment Checklist](../FINAL_DEPLOYMENT_CHECKLIST.md)

**Q: What APIs are available?**  
A: Check [API Documentation](API.md)

**Q: How do I contribute?**  
A: Read [Contributing Guide](../CONTRIBUTING.md)

**Q: How to report security issues?**  
A: Follow [Security Policy](../SECURITY.md)

---

## 📝 Documentation Standards

### Writing Guidelines

1. **Clear and Concise**: Avoid jargon, explain technical terms
2. **Examples**: Include code examples and screenshots
3. **Structure**: Use headings, lists, and tables
4. **Updates**: Keep documentation in sync with code
5. **Language**: Vietnamese for user docs, English for technical

### Markdown Style

```markdown
# H1 - Main Title

## H2 - Section

### H3 - Subsection

**Bold** for emphasis
`code` for code snippets
[Links](URL) for references

- Unordered list

1. Ordered list

> Blockquote for important notes
```

---

## 🆘 Getting Help

### Support Channels

1. **GitHub Issues**: Report bugs, request features
2. **Email**: kho.1@mia.vn
3. **Telegram**: MIA Logistics Group
4. **Documentation**: Search this docs first

### Before Asking

- ✅ Search existing documentation
- ✅ Check FAQ section
- ✅ Search closed issues
- ✅ Try troubleshooting steps

---

## 🔄 Keeping Updated

### How to Stay Current

1. **Watch Repository**: Get notified of changes
2. **Read Changelog**: Review [CHANGELOG.md](../CHANGELOG.md)
3. **Follow Releases**: Subscribe to release notifications
4. **Join Community**: Participate in discussions

### Documentation Updates

This documentation is actively maintained. Last update: **November 12, 2025**

Found an error? [Create an issue](https://github.com/your-username/mia-logistics-manager/issues) or [submit a PR](../CONTRIBUTING.md)!

---

## 📊 Documentation Statistics

- **Total Documentation Files**: 17+
- **Total Pages**: 5,000+ lines
- **Last Updated**: November 12, 2025
- **Coverage**: 100%

---

## 🙏 Contributing to Documentation

We welcome documentation improvements!

**How to contribute:**

1. Find the relevant doc file
2. Click "Edit" on GitHub
3. Make changes
4. Submit Pull Request

See [Contributing Guide](../CONTRIBUTING.md) for details.

---

**Made with ❤️ for Vietnamese logistics industry**

**Version**: 2.1.1  
**Status**: Production Ready ✅
