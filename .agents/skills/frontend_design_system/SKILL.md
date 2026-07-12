---
name: frontend_design_system
description: Design and implement premium React 19 UI components using Tailwind CSS v4, aligned with Viettel branding.
---

# Quy chuẩn Thiết kế Giao diện Web UI (Premium Design System)

Tài liệu này định nghĩa toàn bộ quy chuẩn thiết kế giao diện React 19 sử dụng Tailwind CSS v4 của dự án **Viettel Store AI**, giúp đảm bảo tất cả các trang, component và layout mới được xây dựng đồng bộ, không bị lệch hoặc làm hỏng cấu trúc giao diện đã có.

---

## 1. Hệ Màu sắc Thương hiệu (Brand Colors)
Luôn sử dụng các mã màu chuẩn của thương hiệu Viettel để làm điểm nhấn và phân loại giao diện:
- **Đỏ Viettel chính (Primary Red)**: `#EE0033` (Sử dụng class `text-[#EE0033]` hoặc `bg-[#EE0033]`).
- **Đỏ Viettel sậm (Dark Red)**: `#A00022` / `#CC002D` (Sử dụng cho gradient hoặc trạng thái hover/active như `hover:bg-[#CC002D]`).
- **Vàng điểm nhấn (Accent Gold/Yellow)**: `text-yellow-300` hoặc `text-yellow-400` (Thường kết hợp với nền đỏ hoặc tối).
- **Màu nền Khách hàng (User background)**: Mặc định dùng Xám nhạt sạch `#f4f5f7` (`bg-[#f4f5f7]`) hoặc Trắng `#FFFFFF` (`bg-white`). Một số khu vực đặc biệt hoặc splash screen dùng màu tối/gradient.
- **Màu nền Quản trị (Admin/Staff background)**: Xám sáng `bg-gray-100` hoặc `bg-gray-50`.
- **Màu chữ chính (Main Text)**: Xám đậm `#212529` (`text-gray-900` hoặc `text-neutral-800` để tăng tính dễ đọc).

---

## 2. Quy chuẩn Bố cục trang & Khoảng cách (Layout & Spacing)

### 2.1 Cấu trúc Container chuẩn
Để nội dung luôn thẳng hàng trên mọi màn hình, luôn bao bọc nội dung chính trong một container có giới hạn độ rộng:
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Nội dung bên trong */}
</div>
```

### 2.2 Khoảng cách Vertical (Padding & Margin)
- **Hero Section (Banner đầu trang)**: Sử dụng padding dọc lớn để tạo cảm giác thoáng đãng: `py-28` hoặc `py-24`.
- **Khoảng cách giữa các Section chính**: Dùng margin đứng rộng: `mt-12 py-20` hoặc `py-16` / `space-y-16`.
- **Khoảng cách trong Card**: Đảm bảo padding đủ rộng `p-6` hoặc `p-8` đối với card lớn.
- **Grid Layout**: Sử dụng gap tối thiểu `gap-6` hoặc `gap-8` cho các thẻ danh sách:
  ```jsx
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  ```

---

## 3. Quy chuẩn Thiết kế Component (Premium Components)

### 3.1 Thẻ hiển thị dữ liệu (Premium Data Card)
Thẻ hiển thị thông tin gói cước, số sim có viền kép, bo góc lớn `rounded-2xl`, bóng mờ tinh tế và hiệu ứng nâng lên khi di chuột:
```jsx
<div className="bg-white rounded-2xl border-2 border-gray-100 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(238,0,51,0.25)] hover:-translate-y-3 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
  <div className="p-6">
    {/* Thẻ tag loại hoặc trạng thái */}
    <span className="bg-red-50 text-[#EE0033] text-xs font-extrabold px-3 py-1 rounded-full border border-red-100 uppercase">
      Ưu đãi
    </span>
    {/* Nội dung chính */}
    <h3 className="text-2xl font-black text-gray-900 mt-4">SD90</h3>
    <p className="text-sm text-gray-500 mt-2">Truy cập data không giới hạn 1.5GB/ngày.</p>
  </div>
</div>
```

### 3.2 Nút tương tác 3D Nổi (3D Interactive Button)
Nút bấm có bóng nổi 3D phản hồi theo sự kiện click (click lún xuống):
- **Nút Primary 3D (Đỏ/Vàng)**:
  ```jsx
  <button className="bg-[#EE0033] text-white font-black px-8 py-3.5 rounded-xl shadow-[0_6px_0_#A00022] hover:shadow-[0_8px_0_#A00022] hover:-translate-y-1 active:shadow-[0_0px_0_#A00022] active:translate-y-1 transition-all duration-200">
    Đăng Ký Ngay
  </button>
  ```
- **Nút Secondary 3D (Trắng bóng xám)**:
  ```jsx
  <button className="bg-white text-[#EE0033] font-black px-8 py-3.5 rounded-xl shadow-[0_6px_0_#e5e7eb] hover:shadow-[0_8px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 transition-all duration-200">
    Tìm hiểu thêm
  </button>
  ```
- **Nút Hành động trên Card (Card Action Button)**:
  ```jsx
  <button className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl shadow-[0_4px_0_#e5e7eb] hover:shadow-[0_6px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 hover:border-gray-300 transition-all">
    Chi tiết
  </button>
  ```

### 3.3 Hộp Tìm kiếm & Bộ lọc (Search Bar & Filter Bar)
- **Thanh tìm kiếm**: Thiết kế nền xám nhẹ `bg-gray-50`, bo góc `rounded-xl`, kèm icon `Search` ở góc trái tuyệt đối, khi focus đổi sang viền đỏ thương hiệu và nền trắng:
  ```jsx
  <div className="relative w-full md:w-96">
    <input
      type="text"
      placeholder="Tìm kiếm..."
      className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-11 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition-all"
    />
    <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-4" />
  </div>
  ```
- **Bộ lọc dạng tab ngang**: Nền nút xám nhạt, khi active đổi sang Đỏ Viettel có bóng đổ nhẹ:
  ```jsx
  <button className={`px-5 py-2 rounded-xl text-base font-semibold transition-all ${isActive ? 'bg-[#EE0033] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
    Tên danh mục
  </button>
  ```

### 3.4 Bảng dữ liệu Admin (Admin Table List)
Bảng dữ liệu phẳng, thoáng, chữ to rõ ràng, hàng tiêu đề có đường viền xám mảnh, các ô dữ liệu có padding rộng:
```jsx
<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80 overflow-x-auto">
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="border-b border-gray-200">
        <th className="pb-4 font-bold text-gray-700">Khách hàng</th>
        <th className="pb-4 font-bold text-gray-700">Dịch vụ</th>
        <th className="pb-4 font-bold text-gray-700">Giá trị</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      <tr className="hover:bg-gray-50/50 transition">
        <td className="py-4 text-gray-900 font-medium">Nguyễn Văn A</td>
        <td className="py-4 text-gray-600">Gói ST90N</td>
        <td className="py-4 text-[#EE0033] font-bold">90.000đ</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 4. Quản lý Quy chuẩn Phân hệ & Layouts

### 4.1 Khai báo Layout trong Routing
Tất cả các route trong `web/src/routes/index.js` phải được lazy load qua `React.lazy()` và gán thuộc tính hiển thị layout chính xác:
- `isShowUserLayout: true` (Cho giao diện khách hàng: có Header đỏ, Navbar ngang trắng, Footer xám đậm, nút chat AI nổi).
- `isShowAdminLayout: true` (Cho admin: có Header admin trắng, Sidebar dọc trắng bóng đổ, khung nội dung chính xám nhẹ).
- `isShowStaffLayout: true` (Cho nhân viên quầy).

### 4.2 Nút Quay lại chuẩn (Back Button)
Tại các trang con của phân hệ Khách hàng (User), luôn có thanh nút quay lại cố định phía dưới header (nếu trang đó không phải trang chủ `/`):
```jsx
{!isHomePage && (
  <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
    <div className="px-6 h-14 flex items-center">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center justify-center text-gray-500 hover:text-[#EE0033] hover:bg-red-50 w-10 h-10 rounded-full transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  </div>
)}
```

---

## 5. Quy tắc bảo vệ Script tự động hóa (`apply3d.cjs` & `applySpacing.cjs`)

> [!WARNING]
> Dự án sử dụng hai script chạy tự động (`web/apply3d.cjs` và `web/applySpacing.cjs`) để định dạng các thẻ card và button trên các trang chính như `HomePage.jsx` và `PackagePage.jsx` khi build/chạy. 

### Quy tắc bảo vệ lớp CSS:
1. **Không tự ý thay đổi các chuỗi class nguyên bản** của các component trên HomePage và PackagePage nếu không cập nhật tệp `.cjs` tương ứng.
2. Khi phát triển các trang mới hoặc component mới độc lập (ví dụ trong phân hệ Admin/Staff), có thể viết class 3D và Spacing trực tiếp mà không cần lo lắng về hai script này (vì script chỉ nhắm tới đường dẫn cụ thể của HomePage và PackagePage).
3. Định nghĩa các class 3D/Spacing trên trang mới nên học tập chính xác cấu trúc class của HomePage/PackagePage sau khi đã được script thay thế (như đã hướng dẫn ở mục 3.1 & 3.2).
