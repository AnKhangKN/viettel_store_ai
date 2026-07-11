---
name: frontend_design_system
description: Design and implement premium React 19 UI components using Tailwind CSS v4, aligned with Viettel branding.
---

# Frontend Premium Design System

Kỹ năng này hướng dẫn thiết lập giao diện React 19 đẹp mắt, hiện đại và đồng bộ với thương hiệu Viettel (Đỏ/Vàng thương hiệu) sử dụng Tailwind CSS v4.

## 1. Bảng màu thương hiệu (Brand Colors)
Sử dụng các class Tailwind v4 tương ứng:
- **Primary Red (Đỏ chính)**: `#EE0033` (`bg-[#EE0033]` hoặc `text-[#EE0033]`)
- **Dark Red (Đỏ sẫm)**: `#A00022` (`bg-[#A00022]`)
- **Accent Yellow (Vàng điểm khuyết)**: `yellow-400` / `yellow-300`
- **Background (Nền)**: Trắng `#FFFFFF` (`bg-white`) hoặc Xám sạch `#f4f5f7` (`bg-[#f4f5f7]`)
- **Text**: Xám đậm `#212529` (`text-gray-900` hoặc `text-neutral-800`)

## 2. Các thành phần giao diện chuẩn (Premium Components)

### 2.1 3D Glassmorphism Hero Card
Tạo một thẻ card có hiệu ứng 3D nổi bật:
```jsx
<div className="relative" style={{ perspective: '1000px' }}>
  <div className="absolute -top-4 w-72 h-72 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full opacity-30 blur-2xl animate-pulse"></div>
  <div 
    className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border-t border-l border-white/40 border-r border-b border-white/10 shadow-[20px_20px_40px_-10px_rgba(0,0,0,0.5)] text-center w-80 transition-all duration-500 hover:shadow-[30px_30px_50px_-15px_rgba(0,0,0,0.6)] hover:rotate-0" 
    style={{ transform: 'rotateX(15deg) rotateY(-20deg) translateZ(50px)', transformStyle: 'preserve-3d' }}
  >
    <div style={{ transform: 'translateZ(40px)' }}>
      <span className="text-base font-bold tracking-widest text-yellow-300 uppercase drop-shadow-md">Nổi bật</span>
      <h3 className="text-6xl font-black my-4 text-white drop-shadow-xl">5G150</h3>
      <p className="text-xl font-semibold text-white/90">180 GB / Tháng</p>
    </div>
  </div>
</div>
```

### 2.2 3D Interactive Button (Nút tương tác 3D nổi)
Nút bấm có chiều sâu 3D phản hồi theo sự kiện click:
```jsx
<button className="bg-white text-[#EE0033] font-black px-8 py-3.5 rounded-xl shadow-[0_6px_0_#e5e7eb] hover:shadow-[0_8px_0_#d1d5db] hover:-translate-y-1 active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 transition-all duration-200">
  Đăng Ký Ngay
</button>
```

### 2.3 Premium Data Card
Thẻ hiển thị thông tin (ví dụ: gói cước, số sim) với viền đôi bóng mờ và phản hồi hover mượt mà:
```jsx
<div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(238,0,51,0.25)] hover:-translate-y-3 transition-all duration-300 flex flex-col justify-between overflow-hidden">
  <div>
    <span className="bg-red-50 text-[#EE0033] text-xs font-extrabold px-3 py-1 rounded-full border border-red-100 uppercase">
      Ưu đãi
    </span>
    <h3 className="text-2xl font-black text-gray-900 mt-4">SD90</h3>
    <p className="text-sm text-gray-500 mt-2">Truy cập data không giới hạn 1.5GB/ngày.</p>
  </div>
  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
    <span className="text-[#EE0033] font-black text-xl">90.000đ</span>
    <button className="text-sm bg-neutral-900 text-white font-bold px-4 py-2 rounded-xl hover:bg-[#EE0033] transition-colors">
      Chi tiết
    </button>
  </div>
</div>
```

## 3. Quy chuẩn Responsive & Bố cục
- Sử dụng cấu trúc Grid linh động: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
- Không bao giờ đặt kích thước cố định cho chiều rộng của trang; sử dụng container chuẩn: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Luôn sử dụng icon từ `lucide-react` để đảm bảo phong cách thanh lịch, đồng điệu.
