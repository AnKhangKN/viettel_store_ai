# 📑 BÁO CÁO REVIEW DỰ ÁN VIETTEL STORE AI

> **Ngày cập nhật**: 04/08/2026  
> **Dự án**: Viettel Store AI (Hệ thống đặt số thứ tự, tư vấn gói cước, sim đẹp & hỗ trợ CSKH qua Chatbot AI)  
> **Trạng thái tổng thể**: 🟢 Hoàn thiện kiến trúc cốt lõi, sẵn sàng kết nối và triển khai.

---

## 1. 🎯 Tổng Quan Dự Án

**Viettel Store AI** là một giải pháp chuyển đổi số toàn diện cho hệ thống cửa hàng Viettel Store. Hệ thống kết hợp giữa nền tảng web hiện đại và công nghệ trí tuệ nhân tạo (AI Chatbot) nhằm:
1. **Tối ưu trải nghiệm khách hàng tại quầy**: Khách hàng có thể lấy phiếu xếp hàng trực tuyến, theo dõi hàng chờ thời gian thực và nhận dự báo thời gian chờ chính xác.
2. **Tư vấn tự động 24/7**: Chatbot AI đóng vai trò như một tư vấn viên thông minh, gợi ý SIM đẹp, tư vấn gói cước 4G/5G phù hợp với nhu cầu và giải đáp thắc mắc CSKH từ dữ liệu doanh nghiệp.
3. **Quản lý & Vận hành tập trung**: Cung cấp giao diện làm việc tối ưu cho nhân viên quầy giao dịch (Staff) và bảng điều khiển quản trị toàn hệ thống cho quản lý (Admin).

---

## 2. 🏗️ Kiến Trúc Hệ Thống & Công Nghệ

Hệ thống được thiết kế theo mô hình **Client-Server** chuẩn hóa, phân tách rõ ràng giữa Frontend và Backend.

### 2.1 Backend Architecture (FastAPI)
- **Framework**: FastAPI (Python 3.11+) cho hiệu năng cực cao và hỗ trợ bất đồng bộ (async/await).
- **Mô hình 4 tầng độc lập (4-Layer Architecture)**:
  - `Router`: Định nghĩa endpoint API, prefix, tags và định hướng tới Controller.
  - `Controller`: Nhận yêu cầu, kiểm tra dữ liệu đầu vào (Validation qua Pydantic) và gọi Service.
  - `Service`: Chứa toàn bộ logic kinh doanh (Business Logic) và quy tắc nghiệp vụ.
  - `Repository`: Tương tác trực tiếp với Database bằng câu lệnh **Raw SQL**.
- **Cơ sở dữ liệu & Tối ưu SQL**:
  - Hệ quản trị CSDL: **PostgreSQL**.
  - Kết nối bất đồng bộ qua thư viện `asyncpg` (không dùng ORM như SQLAlchemy để đạt hiệu năng tối đa).
  - An toàn bảo mật: Tham số hóa 100% câu lệnh SQL (`$1`, `$2`, `$3`...) chống SQL Injection.
- **Xác thực & Phân quyền**:
  - JWT (JSON Web Token) với 2 secret key phân tách: `JWT_SECRET` (Access Token) và `JWT_REFRESH_SECRET` (Refresh Token).
  - Phân quyền theo vai trò (RBAC): `user` (Khách hàng), `staff` (Nhân viên quầy), `admin` (Quản trị viên).
- **Real-time Communication**:
  - Quản lý kết nối WebSocket tập trung qua `websocket_manager` ([app/core/websocket.py](file:///d:/viettel_store_ai/server/app/core/websocket.py)).
  - Chia phòng thời gian thực (Real-time Rooms): `queue:{id_chi_nhanh}` (hàng chờ quầy) và `chat:{id_phien}` (chat trực tuyến).
- **Tích hợp AI**:
  - Sử dụng OpenAI / Gemini API cho Chatbot tư vấn.
  - Xử lý và đọc dữ liệu tri thức từ file Excel/PDF (Dữ liệu CSKH).

### 2.2 Frontend Architecture (React 19 + Vite)
- **Core Stack**: React 19, Vite, React Router DOM v7.
- **Quản lý State & API**: Redux Toolkit (Global State) + Axios (API Client).
- **Styling & UI**:
  - Tailwind CSS v4 + Vanilla CSS.
  - Scripts tự động áp dụng hiệu ứng 3D & khoảng cách: `apply3d.cjs`, `applySpacing.cjs`.
  - Iconsets: Lucide React, React Icons, Ant Design Icons.
- **Thiết kế & Thương hiệu**:
  - Màu sắc chủ đạo: Đỏ Viettel (`#EE0033` - `#A00022`), Trắng và Xám nhạt.
  - Phong cách: Premium Glassmorphism, bo góc lớn (`rounded-2xl`, `rounded-3xl`), bóng đổ tinh tế (`shadow-xl`).
- **Phân rã Component & Lazy Loading**:
  - Tất cả các trang được Lazy Load qua React.lazy.
  - Phân định rõ 3 hệ thống Layout: Customer Layout, Staff Layout, Admin Layout.

---

## 3. 📊 Cơ Sở Dữ Liệu (PostgreSQL Schema)

Cơ sở dữ liệu bao gồm **17 bảng chính**, được thiết kế chuẩn hóa và có mối quan hệ chặt chẽ (định nghĩa tại [db-script.sql](file:///d:/viettel_store_ai/db-script.sql)):

| Bảng CSDL | Mô Tả Chức Năng |
|---|---|
| `chinhanh` | Quản lý danh sách chi nhánh cửa hàng Viettel Store, địa chỉ, hotline, giờ làm việc, bản đồ. |
| `khachhang` | Lưu trữ thông tin tài khoản người dùng, thông tin cá nhân, vai trò (admin/user/staff). |
| `nhanvien` | Quản lý thông tin nhân viên, chức vụ, mã nhân viên và chi nhánh công tác. |
| `quaygiaodich` | Danh sách quầy giao dịch tại từng chi nhánh. |
| `phienquaygiaodich` | Quản lý phiên làm việc của nhân viên tại quầy. |
| `phieuxephang` | Quản lý phiếu xếp hàng, số thứ tự, trạng thái (ChoKham, DangGiaoDich, HoanThanh, Huy). |
| `dudoanthoigian` | Lưu trữ dữ liệu dự đoán thời gian chờ của khách hàng. |
| `goicuoc` | Danh mục gói cước di động 4G/5G, dung lượng data, giá cước, chu kỳ. |
| `loaisim` | Phân loại SIM (Sim Tam Hoa, Sim Tứ Quý, Sim Phong Thủy, Sim Thường...). |
| `sim` | Kho số SIM, giá bán, trạng thái (ChoBan, DaBan, TamKhoa). |
| `donhangsim` | Đơn hàng mua SIM của khách hàng. |
| `chitietdonhang` | Chi tiết SIM và gói cước đi kèm trong đơn hàng. |
| `thanhtoan` | Lịch sử giao dịch thanh toán (qua VNPay / Tiền mặt), mã giao dịch, trạng thái. |
| `phienchatbot` & `tinnhanchat` | Quản lý lịch sử hội thoại và tin nhắn giữa khách hàng và Chatbot AI. |

---

## 4. 🧩 Các Module Chức Năng Chính

```
server/app/modules/
├── auth/           # Đăng ký, Đăng nhập, Refresh Token, Đổi mật khẩu
├── user/           # Quản lý hồ sơ người dùng, danh sách người dùng (Admin)
├── branch/         # Quản lý chi nhánh, định vị cửa hàng
├── queue/          # Lấy số thứ tự, gọi số thời gian thực (WebSocket), hàng chờ
├── sim/            # Tra cứu kho SIM, lọc SIM đẹp, quản lý loại SIM
├── package/        # Danh mục gói cước, chi tiết gói cước, đăng ký gói
├── orders/         # Tạo đơn hàng SIM, lịch sử đơn hàng, xử lý đơn hàng
├── payment/        # Tích hợp thanh toán VNPay, callback & kiểm tra trạng thái
├── chatbot/        # AI tư vấn gói cước, trả lời tự động, RAG CSKH
├── cskh/           # Xử lý dữ liệu CSKH từ file Excel/PDF
├── dashboard/      # Thống kê báo cáo cho Admin & Staff
├── notification/   # Hệ thống thông báo
└── booking/        # Đặt lịch hẹn trước tại cửa hàng
```

### 🎯 Chi Tiết Trải Nghiệm Theo Vai Trò (User Roles):

1. **Khách hàng (Customer / User)**:
   - Tra cứu vị trí cửa hàng gần nhất trên bản đồ.
   - Tìm kiếm & chọn mua SIM số đẹp, đăng ký gói cước di động 4G/5G.
   - Lấy phiếu xếp hàng trực tuyến trước khi đến cửa hàng hoặc quét mã lấy số tại chỗ.
   - Trò chuyện với Chatbot AI để nhận gợi ý gói cước tối ưu theo thói quen sử dụng.
   - Thanh toán trực tuyến an toàn qua VNPay.

2. **Nhân viên quầy (Counter Staff)**:
   - Đăng nhập vào phiên làm việc tại quầy giao dịch được phân công.
   - Trực quan hóa danh sách hàng chờ thời gian thực (Waiting list) nhận qua WebSocket.
   - Thực hiện thao tác gọi số tiếp theo, hoàn thành giao dịch hoặc hủy phiếu khi khách vắng mặt.

3. **Quản trị viên (Admin)**:
   - Quản lý toàn bộ danh mục: SIM, Gói cước, Chi nhánh, Quầy giao dịch, Nhân viên và Người dùng.
   - Xem báo cáo thống kê lượt phục vụ, doanh thu SIM/Gói cước, thời gian phục vụ trung bình.

---

## 5. ⭐️ Đánh Giá Ưu Điểm & Điểm Sáng Kỹ Thuật

1. **Kiến trúc chuẩn hóa & Đề cao bảo mật**:
   - Sử dụng mô hình 4 tầng kết hợp Pydantic Validation giúp hạn chế tối đa lỗi runtime dữ liệu.
   - Không lạm dụng ORM giúp truy vấn SQL vô cùng minh bạch, dễ tối ưu chỉ mục (Index) và tối đa hóa hiệu năng với `asyncpg`.
   - Bảo mật 2 lớp JWT secret key và mã hóa mật khẩu chuẩn Bcrypt.

2. **Giao diện người dùng (UI/UX) Đẳng cấp**:
   - Tuân thủ nghiêm ngặt bộ nhận diện thương hiệu Viettel (Red `#EE0033`).
   - Tích hợp hiệu ứng 3D dynamic card, glassmorphism mang lại cảm giác hiện đại, sang trọng.
   - Thiết kế đáp ứng tốt trên cả máy tính (Desktop) và di động (Mobile).

3. **Hệ thống Real-time thông minh**:
   - Tận dụng WebSocket kết hợp cơ chế phát tín hiệu Broadcast nhẹ nhàng: chỉ truyền phát sự kiện (`event`), sau đó Client tự kích hoạt làm mới dữ liệu thông qua REST API GET. Mô hình này giúp dữ liệu luôn nhất quán mà không bị nghẽn đường truyền WebSocket.

---

## 6. 🚀 Đề Xuất Nâng Cấp & Định Hướng Phát Triển

Để dự án sẵn sàng cho môi trường Production quy mô lớn, các bước nâng cấp tiếp theo nên bao gồm:

| Hạng Mục | Đề Xuất Cụ Thể |
|---|---|
| 🧪 **Testing** | Bổ sung bộ kiểm thử tự động (Unit Test / Integration Test) với `pytest` cho backend và `vitest` cho frontend. |
| ⚡ **Caching** | Tích hợp Redis Caching cho các endpoint đọc dữ liệu tĩnh/ít thay đổi (như danh sách chi nhánh, bảng giá gói cước hot). |
| 🔄 **CI/CD** | Cấu hình GitHub Actions để tự động linter, format check và chạy test khi đẩy code. |
| 📄 **API Docs** | Đầy đủ hóa các mô tả schema và response mẫu trên Swagger UI (`/docs`). |
| 🐳 **Deployment** | Đóng gói môi trường hoàn chỉnh với Docker Compose (Backend FastAPI + Frontend Nginx + PostgreSQL + Redis). |

---

## 7. 🛠️ Hướng Dẫn Khởi Chạy Nhanh (Quick Start)

### Backend (FastAPI)
```bash
cd server
python -m venv .venv
# Activate venv (Windows: .venv\Scripts\activate | Linux/Mac: source .venv/bin/activate)
pip install -r requirements.txt
fastapi dev
# Hoặc python app.py
```

### Frontend (React 19 + Vite)
```bash
cd web
npm install
npm run dev
```

---

*Báo cáo review dự án Viettel Store AI được tổng hợp dựa trên mã nguồn thực tế của hệ thống.*
