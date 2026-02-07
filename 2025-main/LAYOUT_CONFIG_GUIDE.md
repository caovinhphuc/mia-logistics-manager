# 🎛️ Hướng dẫn sử dụng Layout Configuration Manager

## 📋 Tổng quan
Layout Configuration Manager là công cụ mạnh mẽ để quản lý và tùy chỉnh giao diện hiển thị cho tất cả các trang trong ứng dụng. Bạn có thể:
- ✅ Ẩn/hiện các widget theo từng trang
- ✅ Tùy chỉnh bố cục cho Desktop, Tablet, Mobile
- ✅ Quản lý vị trí và kích thước của các thành phần
- ✅ Đặt lại cấu hình về mặc định

## 🚀 Cách truy cập

### 1. Từ Header
- Tìm nút **cài đặt layout** (⚙️) ở góc phải Header
- Click vào nút này để mở Layout Configuration Manager
- Nút có hiệu ứng hover đẹp mắt với animation và tooltip

### 2. Shortcut
- Sử dụng phím tắt `Ctrl + L` (nếu có cài đặt)

## 🎯 Cách sử dụng chi tiết

### **Bước 1: Chọn trang cần cấu hình**
1. **Sidebar bên trái** hiển thị danh sách tất cả các trang
2. Các trang được **nhóm theo danh mục** (Dashboard, Orders, Inventory, v.v.)
3. Click vào trang bạn muốn cấu hình
4. Trang được chọn sẽ có **màu xanh** và **icon mũi tên xuống**

### **Bước 2: Chọn chế độ hiển thị**
Ở phần trên bên phải, chọn một trong 3 chế độ:
- 📱 **Mobile** (màu xanh lá) - Dành cho điện thoại
- 📟 **Tablet** (màu xanh dương) - Dành cho máy tính bảng
- 🖥️ **Desktop** (màu tím) - Dành cho máy tính để bàn

### **Bước 3: Quản lý Widget**
Trong phần **"Quản lý widget hiện tại"**:

#### ✅ Ẩn/Hiện Widget
- **Widget đang hiển thị**: Nền xanh lá, icon 👁️
- **Widget đã ẩn**: Nền xám, icon 👁️‍🗨️
- Click nút **"Hiện"/"Ẩn"** để chuyển đổi trạng thái

#### 📊 Thông tin Widget
Mỗi widget hiển thị:
- **Tên widget** và mô tả
- **Vị trí**: Hàng, cột trong lưới
- **Kích thước**: Chiều rộng x chiều cao

### **Bước 4: Xem trước bố cục**
Phần **"Xem trước bố cục"** cho thấy:
- Cách các widget được sắp xếp
- Kích thước tương đối của từng widget
- Chỉ hiển thị các widget đang được bật

## 🔧 Các tính năng nâng cao

### **Reset Layout**
1. **Đặt lại trang hiện tại**: Nút "Đặt lại" ở góc phải
2. **Đặt lại tất cả**: Nút "Đặt lại tất cả" ở sidebar trái
   - ⚠️ **Cảnh báo**: Sẽ xóa toàn bộ cấu hình tùy chỉnh

### **Tìm kiếm trang**
- Ô tìm kiếm ở sidebar trái
- Gõ tên trang để lọc nhanh

### **Responsive Design**
- Mỗi chế độ hiển thị có cấu hình riêng biệt
- Thay đổi ở Mobile không ảnh hưởng Desktop
- Tự động lưu khi thay đổi

## 🎨 Giao diện và UX

### **Hiệu ứng Animation**
- ✨ Smooth transitions khi chuyển trang/chế độ
- 🔄 Loading states với spinner
- 🎯 Hover effects trên các button
- 📱 Responsive design cho mọi kích thước màn hình

### **Theme Support**
- 🌙 Tự động adapt với Dark/Light mode
- 🎨 Consistent color scheme
- 📐 Proper spacing và typography

### **Visual Feedback**
- 🟢 Màu xanh cho widget đang hiển thị
- ⚫ Màu xám cho widget đã ẩn
- 🔵 Indicator cho trang đang được chọn
- ⏳ Loading states trong quá trình chuyển đổi

## 📱 Responsive Usage

### **Desktop** (1024px+)
- Full sidebar với search
- Grid layout 4 cột
- Đầy đủ tooltips và labels

### **Tablet** (768px - 1024px)
- Compact sidebar
- Grid layout 3 cột
- Simplified labels

### **Mobile** (< 768px)
- Collapsible sidebar
- Single column layout
- Touch-friendly buttons
- Simplified interface

## 🔍 Troubleshooting

### **Không thấy widget nào**
- Kiểm tra xem có widget nào được cấu hình cho trang đó không
- Thử reset layout về mặc định

### **Thay đổi không được lưu**
- Đảm bảo có kết nối internet (nếu sync với server)
- Kiểm tra console để xem có lỗi JavaScript không

### **Giao diện không responsive**
- Thử refresh trang
- Kiểm tra CSS có load đầy đủ không

## 💡 Tips & Tricks

1. **Tối ưu hóa trải nghiệm**: Ẩn các widget không cần thiết để tăng performance
2. **Responsive testing**: Test cấu hình trên nhiều kích thước màn hình
3. **Backup cấu hình**: Export cấu hình trước khi thay đổi lớn
4. **User feedback**: Thu thập feedback từ users về bố cục tối ưu

## 🛠️ Developer Notes

### **Component Structure**
```
LayoutConfigManager/
├── Page Selection (Sidebar)
├── View Mode Selector (Mobile/Tablet/Desktop)
├── Widget Management (Show/Hide)
└── Layout Preview (Visual representation)
```

### **Key Props**
- `themeClasses`: Theme styling object
- `isOpen`: Control modal visibility
- `onClose`: Close handler function

### **Context Integration**
- Uses `LayoutContext` for layout management
- Integrates with theme system
- Responsive breakpoints from Tailwind CSS

---

**🎉 Chúc bạn sử dụng Layout Configuration Manager hiệu quả!**
