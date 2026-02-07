# Pull Request

## 📝 Mô tả

Mô tả ngắn gọn thay đổi trong PR.

Fixes #(số issue)

---

## 🎯 Loại thay đổi

Chọn một hoặc nhiều:

- [ ] 🐛 Sửa lỗi (bug fix, không breaking)
- [ ] ✨ Tính năng mới (không breaking)
- [ ] 💥 Breaking change
- [ ] 📝 Chỉ cập nhật tài liệu
- [ ] 🎨 Thay đổi giao diện / style
- [ ] ♻️ Refactor
- [ ] ⚡ Cải thiện hiệu năng
- [ ] ✅ Thêm / cập nhật test

---

## ✅ Checklist trước khi mở PR

**Bắt buộc – trùng với CI (GitHub Actions sẽ chạy các bước này):**

- [ ] **Lint:** `npm run lint` không lỗi (hoặc `npm run lint:fix` rồi commit)
- [ ] **Build:** `npm run build` thành công
- [ ] **Test:** `npm test -- --watchAll=false` pass (hoặc `npm run test:coverage`)
- [ ] **Pre-commit (nếu dùng husky):** `npm run lint:check`, `npm run format:check`, `npm run type-check` pass

**Khuyến nghị:**

- [ ] Tự review code (đọc lại diff)
- [ ] Logic phức tạp có comment ngắn
- [ ] Không để `console.log` thừa trong code merge
- [ ] Có xử lý lỗi phù hợp (try/catch hoặc error boundary nếu cần)

---

## 🧪 Đã kiểm tra

**Chạy local:**

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm test -- --watchAll=false` (hoặc `npm run test:coverage`)

**Manual (nếu có thay đổi UI / flow):**

- [ ] Đã test trên Chrome (hoặc browser chính)
- [ ] (Tùy chọn) Đã test responsive / mobile

**Ghi chú:** Nếu PR chỉ sửa docs hoặc config không ảnh hưởng build/test, ghi rõ trong "Mô tả".

---

## 📸 Ảnh màn hình (nếu có thay đổi UI)

### Trước  
(Mô tả hoặc ảnh)

### Sau  
(Mô tả hoặc ảnh)

---

## 📋 Checklist cho reviewer

- [ ] Code dễ đọc, dễ bảo trì
- [ ] Logic đúng, không thừa/thiếu
- [ ] Cân nhắc edge case / lỗi
- [ ] Không có rủi ro bảo mật (input, secret, XSS…)
- [ ] Breaking change (nếu có) đã ghi trong mô tả

---

## 📎 Ghi chú thêm

(Mọi thông tin hữu ích cho reviewer.)

**Liên quan:** #issue | Phụ thuộc: #pr | Chặn: #pr

---

<!-- Phần dưới dành cho reviewer -->
**Ghi chú reviewer:**
