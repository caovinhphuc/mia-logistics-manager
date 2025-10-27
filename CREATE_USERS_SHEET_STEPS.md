# 📝 Hướng Dẫn Tạo Users Sheet

**Date**: 27 October 2024

---

## 🔗 Link Google Sheets

**URL**: https://docs.google.com/spreadsheets/d/1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k/edit

---

## ✅ Các Bước Thực Hiện

### Bước 1: Mở Google Sheets
1. Click vào link trên
2. Đăng nhập Google nếu cần
3. Sheet sẽ mở ra

### Bước 2: Tạo Sheet Mới
1. Ở dưới cùng, click vào `+` để add new sheet
2. Đặt tên: `Users`
3. Double-click vào tab để rename nếu cần

### Bước 3: Thêm Headers (Row 1)

Copy paste vào Row 1:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Email | Password | Id | Name | Role | Department | Phone | Status | Picture |

### Bước 4: Thêm Test User 1 (Row 2)

**Admin User**:
```
admin@mialogistics.com | 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9 | user_001 | Admin User | admin | IT | 0901234567 | active |
```

### Bước 5: Thêm Test User 2 (Row 3)

**Manager User**:
```
manager@mialogistics.com | 866485796cfa8d7c0cf7111640205b83076433547577511d81f8030ae99ecea5 | user_002 | Manager User | manager | Operations | 0901234568 | active |
```

### Bước 6: Thêm Test User 3 (Row 4)

**Operator User**:
```
operator@mialogistics.com | ec6e1c25258002eb1c67d15c7f45da7945fa4c58778fd7d88faa5e53e3b4698d | user_003 | Operator User | operator | Warehouse | 0901234569 | active |
```

### Bước 7: Thêm Test User 4 (Row 5)

**Driver User**:
```
driver@mialogistics.com | 494d022492052a06f8f81949639a1d148c1051fa3d4e4688fbd96efe649cd382 | user_004 | Driver User | driver | Transport | 0901234570 | active |
```

---

## 📋 Format CSV (Copy Paste Toàn Bộ)

Copy toàn bộ block này và paste vào Google Sheets:

```
Email	Password	Id	Name	Role	Department	Phone	Status	Picture
admin@mialogistics.com	240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9	user_001	Admin User	admin	IT	0901234567	active
manager@mialogistics.com	866485796cfa8d7c0cf7111640205b83076433547577511d81f8030ae99ecea5	user_002	Manager User	manager	Operations	0901234568	active
operator@mialogistics.com	ec6e1c25258002eb1c67d15c7f45da7945fa4c58778fd7d88faa5e53e3b4698d	user_003	Operator User	operator	Warehouse	0901234569	active
driver@mialogistics.com	494d022492052a06f8f81949639a1d148c1051fa3d4e4688fbd96efe649cd382	user_004	Driver User	driver	Transport	0901234570	active
```

---

## 🔐 Passwords (Plain Text)

| User | Password | Hash (SHA-256) |
|------|----------|----------------|
| admin@mialogistics.com | admin123 | 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9 |
| manager@mialogistics.com | manager123 | 866485796cfa8d7c0cf7111640205b83076433547577511d81f8030ae99ecea5 |
| operator@mialogistics.com | operator123 | ec6e1c25258002eb1c67d15c7f45da7945fa4c58778fd7d88faa5e53e3b4698d |
| driver@mialogistics.com | driver123 | 494d022492052a06f8f81949639a1d148c1051fa3d4e4688fbd96efe649cd382 |

---

## ✅ Checklist

- [ ] Open Google Sheets link
- [ ] Click `+` to create new sheet
- [ ] Name it `Users`
- [ ] Add headers to Row 1
- [ ] Add 4 test users (Rows 2-5)
- [ ] Save changes (auto-saved)
- [ ] Go back to app and try login

---

## 🧪 Test After Creation

1. Refresh the app (hard reload: Cmd+Shift+R)
2. Try login with: `admin@mialogistics.com` / `admin123`
3. Check browser console:
   - Should see: "📊 Using Google Sheets for authentication"
   - Should see: "✅ Loaded users from Google Sheets: 4"

---

## 📊 Expected Result

### Before (Mock Users)
```
📝 Using mock users for authentication
```

### After (Google Sheets)
```
📊 Using Google Sheets for authentication
✅ Loaded users from Google Sheets: 4
```

---

**When you're done, let me know and we'll test!** 🚀
