# 🚀 Hướng Dẫn Push Code Lên GitHub

## ⚠️ Lưu ý
Do có nhiều files trong thư mục, bạn cần **chọn file cần commit** thủ công!

---

## 📋 Bước 1: Add files chính

```bash
# Di chuyển vào thư mục dự án
cd /Users/phuccao/Desktop/mia-logistics-manager

# Add các file quan trọng (KHÔNG add node_modules, build, credentials)
git add src/
git add public/
git add package.json
git add .gitignore
git add *.md
git add scripts/
git add config/
git add docs/
```

---

## 📋 Bước 2: Commit

```bash
# Commit với message
git commit -m "Initial commit: MIA Logistics Manager with Google Sheets auth"
```

---

## 📋 Bước 3: Tạo GitHub Repository

1. Đăng nhập vào [GitHub.com](https://github.com)
2. Click **New repository**
3. Tên: `mia-logistics-manager`
4. Chọn **Public** hoặc **Private**
5. **KHÔNG** thêm README, .gitignore, license
6. Click **Create repository**

---

## 📋 Bước 4: Add remote và push

```bash
# Copy URL của GitHub repo (ví dụ: https://github.com/your-username/mia-logistics-manager.git)
git remote add origin https://github.com/your-username/mia-logistics-manager.git
git branch -M main
git push -u origin main
```

---

## 📋 Bước 5: Deploy lên Netlify

Sau khi push lên GitHub:

1. Truy cập [Netlify Dashboard](https://app.netlify.com)
2. Click **Add new site** > **Import an existing project**
3. Chọn **GitHub** và authorize
4. Chọn repository `mia-logistics-manager`
5. Điền cấu hình (xem `NETLIFY_DEPLOY_GUIDE.md`):
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Branch**: `main`
6. Click **Deploy site**

---

## ✅ Tóm Tắt

1. Add files: `git add src/ public/ package.json .gitignore *.md`
2. Commit: `git commit -m "Initial commit"`
3. Create GitHub repo trên github.com
4. Add remote: `git remote add origin [URL]`
5. Push: `git push -u origin main`
6. Deploy lên Netlify

---

**Chạy các lệnh trên một cách tuần tự!** 🚀
