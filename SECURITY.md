# 🔒 Security Policy

## Supported Versions

Các phiên bản hiện đang được hỗ trợ với security updates:

| Version | Supported          |
| ------- | ------------------ |
| 2.1.x   | ✅ Yes             |
| 2.0.x   | ✅ Yes             |
| 1.x.x   | ⚠️ Limited support |
| < 1.0   | ❌ No              |

## 🐛 Reporting a Vulnerability

Nếu bạn phát hiện lỗ hổng bảo mật, vui lòng **KHÔNG** tạo public issue.

### Quy trình báo cáo

1. **Email riêng tư**: Gửi email đến `kho.1@mia.vn` với subject "Security Vulnerability Report"

2. **Thông tin cần cung cấp**:
   - Mô tả chi tiết về lỗ hổng
   - Các bước để reproduce
   - Phiên bản bị ảnh hưởng
   - Potential impact
   - Proof of Concept (nếu có)

3. **Timeline mong đợi**:
   - **24 giờ**: Xác nhận đã nhận được báo cáo
   - **7 ngày**: Đánh giá ban đầu và mức độ nghiêm trọng
   - **30 ngày**: Fix và release patch (tùy mức độ)
   - **60 ngày**: Public disclosure (sau khi đã fix)

### Severity Levels

#### 🔴 Critical (P0)

- Remote code execution
- SQL injection với data access
- Authentication bypass
- **Response time**: 24-48 giờ

#### 🟠 High (P1)

- XSS với sensitive data exposure
- CSRF trên critical functions
- Privilege escalation
- **Response time**: 3-7 ngày

#### 🟡 Medium (P2)

- Information disclosure
- Denial of Service
- Rate limiting issues
- **Response time**: 14-30 ngày

#### 🟢 Low (P3)

- Minor configuration issues
- Low-impact information disclosure
- **Response time**: 30-60 ngày

## 🛡️ Security Best Practices

### For Developers

#### 1. Authentication & Authorization

```javascript
// ✅ Always verify user permissions
const hasPermission = await checkUserPermission(user, 'write:transport');
if (!hasPermission) {
  return res.status(403).json({ error: 'Forbidden' });
}

// ✅ Use secure password hashing
const hashedPassword = await bcrypt.hash(password, 10);
```

#### 2. Input Validation

```javascript
// ✅ Validate all user inputs
const validateInput = (data) => {
  // Sanitize and validate
  return sanitize(data);
};

// ❌ Never trust user input
// const query = `SELECT * FROM users WHERE id = ${userId}`; // SQL Injection!
```

#### 3. API Security

```javascript
// ✅ Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// ✅ CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

#### 4. Data Protection

```javascript
// ✅ Encrypt sensitive data
const encrypted = encryptData(sensitiveData);

// ✅ Use HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use(helmet()); // Security headers
}
```

### For Users

#### 1. Password Security

- Sử dụng password mạnh (8+ ký tự, chữ hoa, chữ thường, số, ký tự đặc biệt)
- Không dùng lại password cho nhiều hệ thống
- Đổi password định kỳ (mỗi 90 ngày)
- Enable 2FA nếu có

#### 2. Account Security

- Đăng xuất sau khi sử dụng xong
- Không share credentials
- Báo cáo ngay nếu phát hiện hoạt động đáng ngờ

#### 3. Data Protection

- Chỉ cấp quyền tối thiểu cần thiết
- Review permissions định kỳ
- Backup data quan trọng

### For Administrators

#### 1. Environment Security

```bash
# ✅ Secure .env file
chmod 600 .env

# ✅ Never commit secrets
echo ".env" >> .gitignore
```

#### 2. Service Account Security

- Rotate credentials mỗi 90 ngày
- Sử dụng principle of least privilege
- Monitor service account usage
- Revoke unused credentials

#### 3. Network Security

- Sử dụng HTTPS cho production
- Configure firewall rules
- Enable logging và monitoring
- Regular security audits

#### 4. Dependency Management

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## 🔍 Security Audits

### Regular Audits

Chúng tôi thực hiện security audits định kỳ:

- **Code Review**: Mỗi PR phải được review
- **Dependency Scan**: Weekly automated scans
- **Penetration Testing**: Quarterly (mỗi quý)
- **Security Training**: Annual cho tất cả developers

### Audit Checklist

```markdown
- [ ] All dependencies up to date
- [ ] No known vulnerabilities (npm audit)
- [ ] Authentication working correctly
- [ ] Authorization enforced on all endpoints
- [ ] Input validation implemented
- [ ] Output encoding/escaping
- [ ] Secure session management
- [ ] HTTPS enforced in production
- [ ] Sensitive data encrypted
- [ ] Logging và monitoring active
- [ ] Backup strategy implemented
- [ ] Incident response plan ready
```

## 📚 Security Resources

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)

### Tools

- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Vulnerability scanning
- [Snyk](https://snyk.io/) - Dependency monitoring
- [OWASP ZAP](https://www.zaproxy.org/) - Penetration testing
- [Helmet.js](https://helmetjs.github.io/) - Security headers

## 🚨 Security Contacts

- **Security Team Email**: <kho.1@mia.vn>
- **Emergency Hotline**: [Your phone number]
- **PGP Key**: [Your PGP key for encrypted communications]

## 📝 Disclosure Policy

### Responsible Disclosure

Chúng tôi tin tưởng vào responsible disclosure và cam kết:

1. **Không truy tố**: Không truy tố các security researchers báo cáo theo đúng quy trình
2. **Recognition**: Credit công khai cho researchers (nếu họ muốn)
3. **Bug Bounty**: Xem xét rewards cho vulnerabilities nghiêm trọng
4. **Transparency**: Public disclosure sau khi đã fix

### Hall of Fame

Cảm ơn những người đã đóng góp vào việc cải thiện security:

- [Coming soon...]

## 🔄 Updates

Security policy này được review và update định kỳ mỗi quý.

**Last Updated**: November 11, 2025
**Version**: 1.0
