# Hướng dẫn Khởi chạy & Kiểm thử Tính năng (Deployment Test)

Tài liệu này hướng dẫn chi tiết cách khởi động toàn bộ hệ thống **Viettel Store AI** ở môi trường Deployment Test và quy trình kiểm thử từng tính năng cốt lõi.

---

## 1. 🛠️ Yêu cầu Môi trường

- **Python**: 3.10+ (Đã khởi tạo môi trường ảo `.venv` trong thư mục `server/`).
- **Node.js**: 18+ (Đã cài đặt `node_modules` trong thư mục `web/`).
- **Docker**: Docker Desktop (để chạy PostgreSQL Database local).

---

## 2. 🚀 Khởi chạy Hệ thống

### Bước 1: Khởi động Cơ sở Dữ liệu PostgreSQL Local
Mở PowerShell tại thư mục gốc dự án:
```powershell
docker-compose -f docker-compose.database.yml up -d
```
> 📌 *Lưu ý*: Database sẽ lắng nghe tại cổng `5433`, User: `admin`, Password: `123456`, Database Name: `viettel_db`. File script khởi tạo dữ liệu mẫu nằm tại `db-script.sql`.

### Bước 2: Khởi động Backend FastAPI Server
Mở PowerShell mới, di chuyển vào thư mục `server`:
```powershell
cd server
.\.venv\Scripts\activate
fastapi dev
```
> 📌 *Kênh dịch vụ*: Server sẽ mở tại `http://localhost:8000`. Bạn có thể truy cập tài liệu API Swagger tại `http://localhost:8000/docs`.

### Bước 3: Khởi động Frontend React 19 Client
Mở PowerShell mới, di chuyển vào thư mục `web`:
```powershell
cd web
npm run dev
```
> 📌 *Giao diện ứng dụng*: Mở trình duyệt truy cập `http://localhost:5173`.

---

## 3. 🧪 Quy trình Kiểm thử Các Tính năng Cốt lõi

### 3.1 Kiểm thử Chatbot AI & Dữ liệu CSKH
1. Đăng nhập hoặc sử dụng giao diện Khách hàng.
2. Mở cửa sổ Chatbot AI ở góc phải dưới màn hình.
3. Thử đặt câu hỏi tư vấn SIM phong thủy, gói cước 4G/5G hoặc hỏi đáp số điện thoại CSKH.
4. **Kiểm tra dữ liệu CSKH**: Hệ thống tự động quét 2 Sheet trong file Excel `server/data/data-cskh.xlsx` để tư vấn chính xác thông tin khách hàng dựa trên số điện thoại.

### 3.2 Kiểm thử Đặt số Thứ tự & WebSocket Thời gian thực
1. Truy cập trang **Đặt số thứ tự** (Khách hàng).
2. Chọn chi nhánh và dịch vụ cần giao dịch (ví dụ: Đổi SIM, Đăng ký gói cước).
3. Nhấn **Lấy số thứ tự**.
4. Đăng nhập tài khoản Nhân viên quầy (`staff`) và mở trang **Hàng chờ giao dịch** (`/staff/waiting-list`).
5. **Kiểm tra WebSocket**: Khi khách hàng mới lấy số, trang hàng chờ nhân viên sẽ nhận được thông báo WebSocket thời gian thực và tự động cập nhật danh sách mà không cần F5 re-load trang.

### 3.3 Kiểm thử Thanh toán VNPay Sandbox
1. Chọn Gói cước hoặc SIM số đẹp và tiến hành Đặt hàng / Thanh toán.
2. Chọn phương thức **Thanh toán qua VNPay**.
3. Hệ thống chuyển hướng sang cổng thanh toán thử nghiệm `https://sandbox.vnpayment.vn`.
4. Sử dụng thẻ thử nghiệm VNPay (Ngân hàng NCB, Số thẻ: `970419852619143219`, Tên: `NGUYEN VAN A`, Ngày phát hành: `07/15`, OTP: `123456`).
5. Sau khi thanh toán, VNPay chuyển hướng về `http://localhost:5173/payment/vnpay-return` và ghi nhận trạng thái đơn hàng thành công trong Database.
