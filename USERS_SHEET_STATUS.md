# 📊 Users Sheet Status

**Date**: 27 October 2024
**Status**: ⏳ Pending Manual Setup

---

## 🔗 Google Sheets Link

**Spreadsheet ID**: `18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`
**Link**: https://docs.google.com/spreadsheets/d/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As/edit

---

## ✅ Current Status

### Authentication Method
- **Current**: Mock Users (hardcoded)
- **Available**: Google Sheets integration (ready to use)
- **Fallback**: Automatic fallback to mock users if sheet is empty

### Mock Users Active
- ✅ admin@mialogistics.com / admin123
- ✅ manager@mialogistics.com / manager123
- ✅ operator@mialogistics.com / operator123
- ✅ driver@mialogistics.com / driver123

---

## 📝 Users Sheet Structure

### Expected Headers (Row 1)
| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Email | Password | Id | Name | Role | Department | Phone | Status | Picture |

### Data Row Example
```
admin@mialogistics.com | 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9 | user_001 | Admin User | admin | IT | 0901234567 | active | [empty]
```

---

## 🔐 Hashed Passwords (SHA-256)

| Password | Hash (64 chars) |
|----------|----------------|
| admin123 | `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9` |
| manager123 | `866485796cfa8d7c0cf7111640205b83076433547577511d81f8030ae99ecea5` |
| operator123 | `ec6e1c25258002eb1c67d15c7f45da7945fa4c58778fd7d88faa5e53e3b4698d` |
| driver123 | `494d022492052a06f8f81949639a1d148c1051fa3d4e4688fbd96efe649cd382` |

---

## 🚀 How to Enable Google Sheets Authentication

### Step 1: Open Google Sheets
1. Click the link above
2. Sign in to your Google account

### Step 2: Create Users Sheet
1. Click `+` at the bottom to add new sheet
2. Name it: `Users`

### Step 3: Add Headers
Copy these headers to Row 1:
```
Email | Password | Id | Name | Role | Department | Phone | Status | Picture
```

### Step 4: Add Test User
Add a test user in Row 2:

**Email**: `admin@mialogistics.com`
**Password**: `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`
**Id**: `user_001`
**Name**: `Admin User`
**Role**: `admin`
**Department**: `IT`
**Phone**: `0901234567`
**Status**: `active`
**Picture**: (empty)

### Step 5: Test
1. Refresh the app
2. Try logging in with `admin@mialogistics.com` / `admin123`
3. Check console to see if it's using Google Sheets

---

## ⚙️ System Behavior

### Automatic Detection
The system will:
1. ✅ Try to load users from Google Sheets "Users" sheet
2. ✅ If sheet exists and has data → Use Google Sheets
3. ✅ If sheet is empty or missing → Use Mock Users
4. ✅ No configuration needed - fully automatic

### Priority Order
```
1. Google Sheets "Users" sheet (if available)
   ↓
2. Mock Users (fallback)
```

---

## 🧪 Testing

### Current Test Accounts
All passwords: SHA-256 hashed

1. **Admin**
   - Email: admin@mialogistics.com
   - Password: admin123
   - Hash: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

2. **Manager**
   - Email: manager@mialogistics.com
   - Password: manager123
   - Hash: 866485796cfa8d7c0cf7111640205b83076433547577511d81f8030ae99ecea5

3. **Operator**
   - Email: operator@mialogistics.com
   - Password: operator123
   - Hash: ec6e1c25258002eb1c67d15c7f45da7945fa4c58778fd7d88faa5e53e3b4698d

4. **Driver**
   - Email: driver@mialogistics.com
   - Password: driver123
   - Hash: 494d022492052a06f8f81949639a1d148c1051fa3d4e4688fbd96efe649cd382

---

## 📋 Checklist

- [ ] Open Google Sheets
- [ ] Check if "Users" sheet exists
- [ ] If not, create "Users" sheet
- [ ] Add headers to Row 1
- [ ] Add at least 1 test user
- [ ] Test login with the test user
- [ ] Verify in console: "Using Google Sheets for authentication"

---

## ✅ Benefits of Google Sheets

1. **Centralized**: All users in one place
2. **Easy Management**: Add/edit users via spreadsheet
3. **Secure**: Passwords are SHA-256 hashed
4. **Automatic**: No code changes needed
5. **Fallback**: Always works with mock users

---

**Status**: Ready to create Users sheet when needed! 📊
