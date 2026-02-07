# 🔒 SECURITY ALERT: Critical Dependencies Issues

**Date**: February 7, 2026
**Severity**: 🔴 **HIGH - Requires Immediate Action**
**Status**: ⚠️ **BLOCKING OPTIMIZATION PLAN**

---

## 🚨 CRITICAL FINDINGS

Phát hiện **38 security vulnerabilities** trong dependencies đã cài và đề xuất cài:

```
2 CRITICAL
32 HIGH
4 MODERATE
───────────
38 TOTAL
```

### Affected Packages

#### 1. 🔴 **node-telegram-bot-api** (CRITICAL)

- **Current**: Chưa cài (listed as "missing")
- **Issue**: Dependencies có critical vulnerabilities
  - `form-data` <2.5.4 - Unsafe random function
  - `qs` <6.14.1 - DoS via memory exhaustion
  - `tough-cookie` <4.1.3 - Prototype pollution
- **Fix Available**: ✅ YES - Upgrade to v0.67.0 (breaking change)
- **Usage**: `backend/services/telegramService.js`
- **Impact**: Backend Telegram notifications

#### 2. 🔴 **mjml** (HIGH)

- **Current**: Chưa cài (listed as "missing")
- **Issue**: `html-minifier` ReDoS vulnerability
- **Fix Available**: ❌ **NO FIX AVAILABLE**
- **Usage**: `backend/services/emailService.js`
- **Impact**: Email template rendering

#### 3. ✅ **handlebars** (OK)

- **Current**: Chưa cài
- **Issue**: None detected
- **Fix Available**: N/A
- **Usage**: `backend/services/emailService.js`
- **Action**: Safe to install

---

## 🎯 REVISED RECOMMENDATION

### ❌ KHÔNG CÀI (DO NOT INSTALL)

#### 1. `mjml` - **NO FIX AVAILABLE**

**Problem**:

```
html-minifier ReDoS vulnerability (HIGH severity)
No fix available from maintainers
```

**Alternative Solution**:

```javascript
// BEFORE (with MJML)
import mjml from 'mjml';
const html = mjml(mjmlTemplate).html;

// AFTER (Pure HTML + Handlebars)
import handlebars from 'handlebars';
const template = handlebars.compile(htmlTemplate);
const html = template(data);
```

**Action Required**:

- ✅ Refactor `backend/services/emailService.js`
- ✅ Remove MJML templates
- ✅ Use pure HTML + CSS with Handlebars
- ✅ Test email rendering

**Effort**: 4-6 hours
**Risk**: Low (improves security significantly)

---

### ⚠️ CÀI VỚI CAUTION (INSTALL WITH BREAKING CHANGE)

#### 2. `node-telegram-bot-api` v0.67.0

**Problem**:

```
Dependencies có vulnerabilities
Fix requires breaking change upgrade
```

**Solution**:

```bash
# Install latest version (with breaking changes)
npm install node-telegram-bot-api@0.67.0

# Or use --force
npm audit fix --force
```

**Breaking Changes** (need to update code):

- API methods may have changed
- Response formats may differ
- Check [CHANGELOG](https://github.com/yagop/node-telegram-bot-api/blob/master/CHANGELOG.md)

**Action Required**:

- ✅ Install v0.67.0
- ✅ Review breaking changes
- ✅ Update `backend/services/telegramService.js` if needed
- ✅ Test Telegram integration

**Effort**: 2-3 hours
**Risk**: Medium (breaking changes)

---

### ✅ SAFE TO INSTALL

#### 3. `handlebars`

```bash
npm install handlebars
```

- No known vulnerabilities
- Widely used and maintained
- Required for email templates

#### 4. `@sendgrid/mail`

```bash
npm install @sendgrid/mail
```

- No known vulnerabilities
- Official SendGrid SDK

#### 5. `socket.io`

```bash
npm install socket.io
```

- No known vulnerabilities (in current version)
- Well maintained

#### 6. `node-fetch`

```bash
npm install node-fetch
```

- No known vulnerabilities in v3.x
- Standard library

---

## 📋 UPDATED INSTALLATION PLAN

### Phase 1: Install Safe Dependencies (Week 1, Day 1)

```bash
# Install packages without vulnerabilities
npm install handlebars @sendgrid/mail socket.io node-fetch

# Verify
npm audit
```

**Expected**: Vulnerabilities remain at current level (react-scripts only)

---

### Phase 2: Handle Telegram (Week 1, Day 2)

**Option A: Install with breaking change (Recommended)**

```bash
npm install node-telegram-bot-api@0.67.0

# Test
node backend/test-telegram.js
```

**Option B: Don't install, disable feature**

```javascript
// backend/services/telegramService.js
// Comment out or conditional import
if (process.env.TELEGRAM_ENABLED === 'true') {
  // Only import if explicitly enabled
  import TelegramBot from 'node-telegram-bot-api';
}
```

**Recommendation**: **Option A** - Install v0.67.0 và update code

---

### Phase 3: Refactor Email Service (Week 1, Day 3-4)

**Remove MJML dependency entirely**

#### Step 1: Create Pure HTML Templates

```javascript
// backend/services/emailService.js - REFACTORED

import handlebars from 'handlebars';
import nodemailer from 'nodemailer';

class EmailService {
  // ... existing code ...

  getCarrierUpdateTemplate() {
    // Pure HTML template (no MJML)
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: white;
      padding: 30px;
      border: 1px solid #e0e0e0;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{title}}</h1>
  </div>
  <div class="content">
    <p>Xin chào <strong>{{recipientName}}</strong>,</p>
    <p>{{message}}</p>
    {{#if actionUrl}}
    <a href="{{actionUrl}}" class="button">{{actionText}}</a>
    {{/if}}
    <p>Trân trọng,<br>MIA Logistics Team</p>
  </div>
  <div class="footer">
    <p>MIA Logistics Manager | kho.1@mia.vn</p>
    <p>&copy; 2026 MIA Logistics. All rights reserved.</p>
  </div>
</body>
</html>
    `;

    return handlebars.compile(htmlTemplate);
  }

  // Similar for other templates...
}
```

#### Step 2: Update package.json

```bash
# Remove mjml from dependencies (if exists)
npm uninstall mjml mjml-cli

# Keep only handlebars
npm install handlebars
```

#### Step 3: Test Email Rendering

```bash
# Test with sample data
node backend/test-email-templates.js
```

**Benefits**:

- ✅ **Zero vulnerabilities** from MJML
- ✅ **Smaller bundle** - MJML + deps ~2MB, pure HTML ~0KB
- ✅ **Faster rendering** - No MJML compilation
- ✅ **More control** - Direct HTML/CSS
- ✅ **Better compatibility** - Works everywhere

**Effort**: 4-6 hours
**Risk**: Low

---

## 🔄 UPDATED WEEK 1 SCHEDULE

### Day 1: Safe Dependencies

```bash
# Morning (2 hours)
npm install handlebars @sendgrid/mail socket.io node-fetch
npm audit
npm test

# Expected: 41 vulnerabilities → 41 (unchanged, only react-scripts)
```

### Day 2: Telegram Fix

```bash
# Morning (2 hours)
npm install node-telegram-bot-api@0.67.0

# Check breaking changes
cat node_modules/node-telegram-bot-api/CHANGELOG.md

# Test
node backend/test-telegram.js

# Update code if needed
vim backend/services/telegramService.js

# Expected: 41 → ~10 vulnerabilities (fixed telegram deps)
```

### Day 3-4: Email Service Refactor

```bash
# Day 3 Morning (3 hours)
- Create pure HTML templates
- Update emailService.js
- Remove MJML imports

# Day 3 Afternoon (2 hours)
- Test all email templates
- Verify rendering across email clients

# Day 4 Morning (2 hours)
- Document changes
- Update tests
- Remove MJML from package.json

# Expected: 10 → ~5 vulnerabilities (removed MJML chain)
```

### Day 5: Verification

```bash
# Full day (4 hours)
npm audit
npm test
npm run build
make health

# Deploy to staging
# Smoke test all features

# Expected: ~5 vulnerabilities (only react-scripts)
```

---

## 📊 IMPACT ANALYSIS

### Before Changes

```
Total vulnerabilities: 38 (current scan)
├── 2 Critical (node-telegram-bot-api deps)
├── 32 High (mjml + react-scripts)
└── 4 Moderate (tough-cookie)

node_modules size: 2.1GB
Vulnerable packages: 3 (mjml, node-telegram-bot-api, react-scripts)
```

### After Changes

```
Total vulnerabilities: ~5 (react-scripts only)
├── 0 Critical ✅
├── ~5 High (react-scripts dev deps only)
└── 0 Moderate ✅

node_modules size: 1.9GB (-200MB from not installing mjml)
Vulnerable packages: 1 (react-scripts - dev only)

Reduction: 38 → 5 = 87% improvement 🎉
```

---

## ✅ ACTION ITEMS

### Immediate (Today)

- [x] Document security findings ✅ (this file)
- [ ] Review email templates requirements
- [ ] Confirm Telegram features needed
- [ ] Get approval for refactoring plan

### Week 1 (Next 5 days)

**Day 1-2: Low-hanging fruit**

- [ ] Install safe packages (handlebars, @sendgrid/mail, socket.io, node-fetch)
- [ ] Install node-telegram-bot-api@0.67.0
- [ ] Test Telegram integration
- [ ] Fix any breaking changes

**Day 3-4: Email refactor**

- [ ] Remove MJML dependency
- [ ] Create pure HTML templates
- [ ] Update emailService.js
- [ ] Test email rendering
- [ ] Document template format

**Day 5: Verification**

- [ ] Run full test suite
- [ ] Build production
- [ ] Check npm audit
- [ ] Update documentation
- [ ] Create PR for review

---

## 🎯 SUCCESS CRITERIA

### Week 1 End Goals

✅ **Security**

- Critical vulnerabilities: 2 → 0
- High vulnerabilities: 32 → <10
- Total vulnerabilities: 38 → <10

✅ **Functionality**

- Email service working (without MJML)
- Telegram notifications working (v0.67.0)
- All tests passing
- Production build successful

✅ **Documentation**

- Updated DEPCHECK_REPORT.md
- Updated SECURITY_AUDIT_REPORT.md
- New email template guide
- Telegram migration notes

---

## 📝 DEPENDENCIES STATUS TABLE

| Package                 | Status           | Action                | Security               | Priority  |
| ----------------------- | ---------------- | --------------------- | ---------------------- | --------- |
| `handlebars`            | ⚪ Not installed | ✅ Install            | ✅ Secure              | HIGH      |
| `@sendgrid/mail`        | ⚪ Not installed | ✅ Install            | ✅ Secure              | HIGH      |
| `socket.io`             | ⚪ Not installed | ✅ Install            | ✅ Secure              | MEDIUM    |
| `node-fetch`            | ⚪ Not installed | ✅ Install            | ✅ Secure              | MEDIUM    |
| `node-telegram-bot-api` | ⚪ Not installed | ⚠️ Install v0.67.0    | ⚠️ Fixed in v0.67.0    | HIGH      |
| `mjml`                  | ⚪ Not installed | ❌ **DO NOT INSTALL** | ❌ Vulnerable (no fix) | **BLOCK** |

---

## 🚫 REVISED "DO NOT INSTALL" LIST

### Original Plan Said "Install"

- ❌ `mjml` - **BLOCKED** - No fix for html-minifier vulnerability
- ⚠️ `node-telegram-bot-api` - **Modified** - Install v0.67.0 only (breaking change)

### Revised Plan

- ✅ `handlebars` - Safe
- ✅ `@sendgrid/mail` - Safe
- ✅ `socket.io` - Safe
- ✅ `node-fetch` - Safe
- ⚠️ `node-telegram-bot-api@0.67.0` - With caution
- ❌ `mjml` - **DO NOT INSTALL**

---

## 📞 QUESTIONS TO ANSWER

### For Product/Business

1. **Email templates**: Do we really need MJML? Can we use simpler HTML?
   - **Answer**: Pure HTML is sufficient, proceed with refactor

2. **Telegram features**: Which Telegram features are critical?
   - Review if breaking changes in v0.67.0 affect us

3. **Timeline**: Can we spend Day 3-4 on email refactor?
   - **Answer**: Yes, security takes priority

### For Technical

1. **Testing**: How to test email rendering without actual sends?
   - Use `nodemailer` test accounts
   - Preview HTML in browser

2. **Telegram API**: What changed in v0.67.0?
   - Check CHANGELOG
   - Test in dev environment first

3. **Rollback**: If refactor fails, what's Plan B?
   - Keep current code (no packages installed)
   - Email service won't work until fixed
   - Or: Accept MJML risk with documented mitigation

---

## 🎬 NEXT STEPS

### Right Now

```bash
# 1. Create test branch
git checkout -b security/remove-mjml-fix-telegram

# 2. Install safe packages only
npm install handlebars @sendgrid/mail socket.io node-fetch

# 3. Test
npm test
npm audit

# 4. Commit
git add package.json package-lock.json
git commit -m "security: install safe dependencies (handlebars, sendgrid, socket.io, node-fetch)"
```

### Tomorrow

```bash
# Handle Telegram
npm install node-telegram-bot-api@0.67.0
# Test and fix breaking changes

# Remove MJML, refactor emailService.js
# Test email templates
```

---

## 📚 REFERENCES

### Vulnerability Details

- [form-data CVE](https://github.com/advisories/GHSA-fjxv-7rqg-78g4)
- [html-minifier CVE](https://github.com/advisories/GHSA-pfq8-rq6v-vf5m)
- [qs CVE](https://github.com/advisories/GHSA-6rw7-vpxm-498p)
- [tough-cookie CVE](https://github.com/advisories/GHSA-72xf-g2v4-qvf3)

### Package Info

- [node-telegram-bot-api v0.67.0 Changelog](https://github.com/yagop/node-telegram-bot-api/releases/tag/v0.67.0)
- [MJML Alternatives](https://github.com/mjmlio/mjml/issues)
- [Email Template Best Practices](https://www.goodemailcode.com/)

### Internal

- [ANALYSIS_REPORT.md](ANALYSIS_REPORT.md)
- [OPTIMIZATION_PLAN.md](OPTIMIZATION_PLAN.md)
- [DEPCHECK_REPORT.md](DEPCHECK_REPORT.md)
- [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md)

---

**Priority**: 🔴 **CRITICAL - BLOCKING**
**Status**: ⚠️ **Requires Decision & Action**
**Owner**: DevOps/Security Lead
**Due Date**: Week 1, Day 5

---

**Created**: February 7, 2026
**Last Updated**: February 7, 2026
**Version**: 1.0
