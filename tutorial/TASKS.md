# Danh sách Task Phát triển & Đề xuất Nâng cấp (Viettel Store AI Tasks)

Tài liệu này tổng hợp toàn bộ các công việc (Task) cho dự án **Viettel Store AI**, được phân chia rõ ràng theo danh mục các Task đã hoàn thành, các Task cốt lõi cần triển khai tiếp theo và đề xuất nâng cấp hệ thống.

---

## ✅ I. Danh sách Task Đã Hoàn Thành (Completed Tasks)

### 1. 📧 Xác thực Tài khoản & Quên Mật khẩu qua Email OTP (Email Verification & Password Reset) — [✅ ĐÃ HOÀN THÀNH]
- **Mô tả**: Tích hợp luồng xác thực Email OTP cho cả Đăng ký tài khoản mới và Khôi phục mật khẩu khi quên.
- **Kết quả triển khai chi tiết**:
  - **Luồng Xác thực Đăng ký**: 
    - Gửi mã OTP 6 chữ số qua Email khi đăng ký tài khoản.
    - Lưu mã OTP tại bộ nhớ tạm Server (**In-Memory Store 10 phút**), không làm phình schema Database `khachhang`.
    - Chuyển hướng người dùng tới trang `/verify-otp` với dòng nhắc nhở đếm ngược hết hạn 10 phút.
    - Cập nhật cờ `da_xac_thuc_email = true` và `trang_thai = 'HoatDong'` trong PostgreSQL sau khi xác thực thành công.
    - Chặn đăng nhập tài khoản chưa kích thực, bổ sung nút **"Xác Thực Email Ngay"** ngay tại màn hình `/login`.
  - **Luồng Quên & Khôi phục Mật khẩu**:
    - Nút **"Quên mật khẩu?"** tại `/login` dẫn tới trang `/forget-password`.
    - Nhập Email để nhận mã OTP khôi phục (10 phút) và thiết lập mật khẩu mới (mã hóa `bcrypt`).
  - **Dịch vụ Mail & Trải nghiệm UX**:
    - Email HTML chuẩn thương hiệu Viettel ([email.py](file:///d:/workspace/viettel_store_ai/server/app/core/email.py)), tự động in mã OTP ra Terminal (Log-first debugging) khi test local.
    - Nút đếm ngược 60 giây để yêu cầu gửi lại mã OTP.
- **Các file đã hoàn thiện**:
  - Backend: `server/app/modules/auth/services/auth_service.py`, `server/app/modules/auth/repositories/auth_repository.py`, `server/app/modules/auth/auth_routes.py`, `server/app/core/email.py`
  - Frontend: `web/src/pages/auth/RegisterPage/RegisterPage.jsx`, `web/src/pages/auth/VerifyOtpPage/VerifyOtpPage.jsx`, `web/src/pages/auth/ForgotPasswordPage/ForgotPasswordPage.jsx`, `web/src/pages/auth/LoginPage/LoginPage.jsx`

---

### 2. 🔑 Giao diện & Luồng Đăng nhập Google (Google OAuth Login Integration) — [✅ ĐÃ HOÀN THÀNH]
- **Mô tả**: Tích hợp phương thức Đăng nhập & Đăng ký nhanh bằng tài khoản Google (Google OAuth2), khắc phục triệt để lỗi không hiển thị icon Google trên Vercel.
- **Kết quả triển khai chi tiết**:
  - **Khắc phục lỗi Icon Google trên Vercel**: Sử dụng `FcGoogle` từ `react-icons/fc` (Vector SVG nhúng trực tiếp) thay cho link ảnh SVG bên ngoài, đảm bảo 100% hiển thị sắc nét trên Vercel và Localhost mà không bị chặn bởi CORS/CSP.
  - **Giao diện Nút Đăng nhập Google**: Thiết kế component dùng chung `GoogleLoginButton.jsx` với hiệu ứng viền nổi 3D phong cách Viettel Store, tích hợp ở cả trang **Đăng nhập (`/login`)** và **Đăng ký (`/register`)**.
  - **Backend & Auth Handling**:
    - Endpoint `/api/auth/google-login` xác thực `access_token` qua Google UserInfo API hoặc `id_token` qua Google OAuth library.
    - Tự động liên kết `google_id` nếu Email đã tồn tại hoặc khởi tạo user mới với cờ `da_xac_thuc_email = true`.
    - Trả về cặp JWT Access Token / Refresh Token và tự động điều hướng người dùng theo phân quyền (Admin / Staff / User).
- **Các file đã hoàn thiện**:
  - Component: `web/src/components/common/GoogleLoginButton/GoogleLoginButton.jsx`
  - Frontend: `web/src/pages/auth/LoginPage/LoginPage.jsx`, `web/src/pages/auth/RegisterPage/RegisterPage.jsx`
  - Backend: `server/app/modules/auth/services/auth_service.py`, `server/app/modules/auth/repositories/auth_repository.py`

---

### 3. 📱 Tối ưu Giao diện Responsive đa thiết bị (Mobile / Tablet / Desktop Responsiveness) — [✅ ĐÃ HOÀN THÀNH]
- **Mô tả**: Tối ưu hóa toàn bộ giao diện Frontend đáp ứng linh hoạt và hoàn hảo trên mọi độ phân giải màn hình (Di động `< 768px`, Tablet `768px - 1024px`, Desktop `> 1024px`).
- **Kết quả triển khai chi tiết**:
  - **Header & Mobile Navigation Drawer**:
    - Nút Hamburger Menu (`Menu` / `X` icon) xuất hiện linh hoạt trên di động (`md:hidden`).
    - Thanh Mobile Slide-out Drawer từ cạnh trái hiển thị trọn vẹn danh mục liên kết điều hướng (Trang chủ, Kho SIM, Gói cước, Cửa hàng, Tư vấn AI, Hỗ trợ) và Trạng thái người dùng.
  - **Kho SIM & Chatbot AI**:
    - Thao tác cuộn ngang mượt mà cho các tab bộ lọc phân loại SIM.
    - Chatbot AI sắp xếp layout theo thứ tự ưu tiên giao diện chat chính trên di động (`flex-col-reverse lg:flex-row`), ô gõ tin nhắn giữ vị trí thuận tiện khi mở bàn phím ảo.
  - **Bảng dữ liệu Quản trị & Nhân viên Quầy (Admin / Staff)**:
    - Tất cả bảng dữ liệu trong `TableComponent` được bọc lớp cuộn ngang `overflow-x-auto w-full` chống tràn màn hình.
- **Các file đã hoàn thiện**:
  - Component: `web/src/components/user/HeaderComponent/HeaderComponent.jsx`, `web/src/components/shared/TableComponent/TableComponent.jsx`
  - Pages: `web/src/pages/user/BuySim/BuySim.jsx`, `web/src/pages/user/ChatbotPage/ChatbotPage.jsx`

---

### 4. 🔒 Điều kiện & Quy tắc Chỉnh sửa Thông tin Người dùng (User Profile Update Rules & Validation) — [✅ ĐÃ HOÀN THÀNH]
- **Mô tả**: Đặt ra các điều kiện ràng buộc và kiểm tra dữ liệu nghiêm ngặt khi người dùng hoặc admin thực hiện cập nhật thông tin cá nhân trong trang Profile / Setting.
- **Kết quả triển khai chi tiết**:
  - **Kiểm tra định dạng trường (Validation Checks)**:
    - **Họ và tên**: Tối thiểu 2 ký tự.
    - **Số điện thoại (SĐT)**: 10 chữ số chuẩn nhà mạng Việt Nam (bắt đầu bằng `03`, `05`, `07`, `08`, `09` - Regex: `^(0[3|5|7|8|9])+([0-9]{8})$`).
    - **Số CCCD / CMND**: Đúng 12 chữ số (Regex: `^[0-9]{12}$`).
    - **Email**: Đúng định dạng Email chuẩn RFC.
    - **Mật khẩu**: Kiểm tra mật khẩu cũ, mật khẩu mới tối thiểu 6 ký tự và khớp với mật khẩu xác nhận.
- **Các file đã hoàn thiện**:
  - Pages: `web/src/pages/admin/SettingPageAdmin/SettingPageAdmin.jsx`, `web/src/pages/user/UserProfilePage/UserProfilePage.jsx`

---

### 5. 🛒 Trang Quản lý & Lịch sử Đơn hàng Mua SIM/Gói Cước dành cho Khách hàng (Customer SIM Order History & Tracking) — [✅ ĐÃ HOÀN THÀNH]
- **Mô tả**: Cho phép khách hàng xem lại toàn bộ lịch sử các đơn hàng đặt mua SIM, gói cước và theo dõi trạng thái xử lý đơn hàng của mình.
- **Kết quả triển khai chi tiết**:
  - **Giao diện Lịch sử Đơn hàng (`/my-orders` & `/profile/orders`)**:
    - **Thống kê số liệu đơn hàng**: Thẻ tổng quan 4 chỉ số (Tất cả đơn hàng, Đã thanh toán, Chờ thanh toán, Đã hủy).
    - **Tìm kiếm & Bộ lọc linh hoạt**: Tìm nhanh theo Số SIM hoặc Mã đơn hàng + Các Tab bộ lọc theo trạng thái đơn.
    - **Badge trạng thái trực quan**: `Đã thanh toán` (Xanh lá), `Chờ thanh toán VNPay` (Vàng), `Thanh toán tại quầy` (Xanh dương), `Đã hủy` (Đỏ).
  - **Modal Chi tiết & Xem Hóa đơn Điện tử (PDF / Print)**:
    - Hiển thị đầy đủ thông tin Khách hàng, Cửa hàng Viettel Store nhận SIM (Địa chỉ, Hotline, Bản đồ).
    - Bảng chi tiết sản phẩm: Thẻ SIM Số đẹp, Phí hòa mạng (50.000đ), Tổng thanh toán.
    - Nút **"In / Tải Hóa đơn PDF"** mở khung in hóa đơn điện tử thương hiệu Viettel Store chuẩn định dạng PDF.
  - **Nút "Thanh toán ngay"**: Nút thanh toán trực tiếp qua cổng VNPay đối với các đơn hàng chưa hoàn tất thanh toán.
- **Các file đã hoàn thiện**:
  - Backend: `server/app/modules/orders/repositories/order_repository.py`, `server/app/modules/orders/services/order_service.py`, `server/app/modules/orders/controllers/order_controller.py`, `server/app/modules/orders/order_routes.py`, `server/app/routers.py`
  - Frontend: `web/src/api/order/order.api.js`, `web/src/pages/user/OrderHistoryPage/OrderHistoryPage.jsx`, `web/src/routes/index.js`, `web/src/components/user/HeaderComponent/HeaderComponent.jsx`

---

### 6. 📧 Tự động Gửi Hóa đơn Điện tử qua Email khi Thanh toán Thành công (Automated E-Invoice Emailing) — [✅ ĐÃ HOÀN THÀNH]
- **Mô tả**: Ngay sau khi khách hàng hoàn thành thanh toán mua SIM (qua cổng VNPay Online thành công hoặc được nhân viên quầy xác nhận giao SIM & nhận tiền mặt), hệ thống tự động tạo và gửi Email Hóa đơn điện tử thương hiệu Viettel Store chuẩn Responsive về hòm thư khách hàng.
- **Kết quả triển khai chi tiết**:
  - **Mẫu HTML Email Hóa đơn Viettel Store**: Thiết kế chuẩn Responsive gồm Logo, Mã DH, Ngày đặt, Thông tin người mua, Địa điểm nhận SIM tại cửa hàng Viettel Store, Bảng kê chi tiết đơn giá SIM, phí hòa mạng (50.000đ), tổng thanh toán & Dấu xác thực điện tử (`✓ ĐÃ XÁC THỰC VIETTEL STORE`).
  - **Kích hoạt tự động bất đồng bộ**: Gửi qua SMTP bằng `asyncio.to_thread` không gây trễ API chính.
- **Các file đã hoàn thiện**:
  - Backend: `server/app/core/email.py` (`send_invoice_email`), `server/app/modules/payment/repositories/payment_repository.py` (`get_full_order_invoice_data`), `server/app/modules/payment/services/payment_service.py` (`process_vnpay_return`, `confirm_staff_sim_received`)

---

### 7. 🌓 Chế độ Giao diện Tối / Sáng linh hoạt (Dark / Light Mode Toggle) — [✅ ĐÃ HOÀN THÀNH]
- **Mô tả**: Bổ sung nút chuyển đổi chế độ giao diện giữa Sáng (Light Mode) và Tối (Dark Mode Viettel Premium), tự động đồng bộ và lưu ưu tiên của người dùng vào `localStorage`.
- **Kết quả triển khai chi tiết**:
  - **React ThemeContext & Hook `useTheme()`**: Quản lý trạng thái theme toàn cục, tự động gắn class `dark` vào `<html className="dark">` để chuyển màu giao diện.
  - **Nút Toggle Sun/Moon trên Header**: Tích hợp nút icon chuyển đổi trên tất cả thanh Header (Khách hàng `HeaderComponent`, Nhân viên quầy `HeaderComponentStaff`, Admin `HeaderComponentAdmin`).
  - **Tối ưu CSS Dark Mode Overrides**: Tối ưu màu sắc nền tối `#0f172a`, card `#1e293b`, chữ sáng `#f8fafc` giữ vững độ tương phản và màu đỏ Viettel chính `#EE0033`.
- **Các file đã hoàn thiện**:
  - Context & Main: `web/src/context/ThemeContext.jsx`, `web/src/main.jsx`, `web/src/index.css`
  - Components: `web/src/components/user/HeaderComponent/HeaderComponent.jsx`, `web/src/components/staff/HeaderComponentStaff/HeaderComponentStaff.jsx`, `web/src/components/admin/HeaderComponentAdmin/HeaderComponentAdmin.jsx`

---

## 📋 IV. Bảng Theo dõi Tiến độ Thực hiện (Task Tracking Checklist)

| STT | Tên Task / Chức năng | Phân loại | Mức độ Ưu tiên | Trạng thái |
| :---: | :--- | :---: | :---: | :---: |
| 1 | Xác thực Đăng ký & Quên mật khẩu qua Email OTP | Auth / Core | 🔥 Rất cao | ✅ Hoàn thành |
| 2 | Giao diện & Luồng Đăng nhập bằng Google (OAuth) | Auth / UI | 🔥 Rất cao | ✅ Hoàn thành |
| 3 | Tối ưu Giao diện Responsive trên Di động / Tablet | UI / UX | 🔥 Rất cao | ✅ Hoàn thành |
| 4 | Ràng buộc & Điều kiện Chỉnh sửa Thông tin User | Security / UX | 🔥 Rất cao | ✅ Hoàn thành |
| 5 | Trang Quản lý & Lịch sử Đơn hàng Mua SIM Khách hàng | Feature / Core | 🔥 Rất cao | ✅ Hoàn thành |
| 6 | Tự động Gửi Hóa đơn Điện tử qua Email | Automation | 🔥 Rất cao | ✅ Hoàn thành |
| 7 | Chế độ Giao diện Tối / Sáng (Dark Mode Toggle) | UI / UX | 🔥 Rất cao | ✅ Hoàn thành |
