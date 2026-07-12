# Viettel Store AI - Workspace Rules

Chào mừng bạn đến với dự án **Viettel Store AI** (Hệ thống đặt số thứ tự, tư vấn gói cước, sim đẹp thông qua Chatbot AI). Dưới đây là các quy tắc phát triển cốt lõi bắt buộc phải tuân theo khi lập trình cả Frontend lẫn Backend.

---

## 1. Quy tắc kiến trúc Backend (FastAPI)

### 1.1 Luồng dữ liệu (Data Flow)
Mỗi module chức năng bắt buộc phải tuân theo mô hình 4 tầng độc lập:
```
Router (Định tuyến)
  ↓
Controller (Điều hướng & Validate đầu vào)
  ↓
Service (Xử lý Business Logic)
  ↓
Repository (Tương tác Cơ sở dữ liệu qua raw SQL)
```

- **Router**: Chỉ khai báo endpoint, prefix, tags và map sang hàm của Controller.
- **Controller**: Trích xuất dữ liệu yêu cầu, gọi Service thích hợp và trả về kết quả. Không viết logic kinh doanh hoặc truy vấn DB tại đây.
- **Service**: Nơi tập trung toàn bộ logic xử lý nghiệp vụ, kiểm tra ràng buộc logic. Không viết câu lệnh SQL ở Service.
- **Repository**: Chỉ chứa các hàm tương tác với cơ sở dữ liệu bằng SQL thuần.

### 1.2 Database & SQL
- **Không sử dụng ORM** (như SQLAlchemy hay Tortoise).
- **Sử dụng truy vấn Raw SQL** bất đồng bộ qua thư viện `asyncpg`.
- **An sau bảo mật**: Luôn tham số hóa các câu truy vấn để tránh SQL Injection (sử dụng `$1`, `$2`, `$3`...). Ví dụ:
  ```python
  sql = "SELECT * FROM users WHERE email = $1"
  return await get_pool().fetchrow(sql, email)
  ```
- Tránh viết SQL trực tiếp ngoài tầng Repository.
- **Tham khảo Schema gốc**: Khi viết các Pydantic Schema, DTO hoặc câu truy vấn SQL, bắt buộc tham chiếu và đối chiếu chính xác với cấu trúc bảng định nghĩa trong file [db-script.sql](file:///d:/workspace/viettel_store_ai/db-script.sql) ở thư mục gốc để đảm bảo đúng kiểu dữ liệu, tên cột và các ràng buộc.

### 1.3 Schema & Validate dữ liệu
- Luôn sử dụng **Pydantic** để định nghĩa cấu trúc Request và Response.
- Các file schema được đặt tại thư mục `<module_name>/schemas/`.

### 1.4 Xử lý Exception & Response chuẩn hóa
- Khi xảy ra lỗi nghiệp vụ (ví dụ: email đã tồn tại, hết sim, số thứ tự không hợp lệ), luôn ném ra `AppException` từ thư mục `app/core/exceptions.py`.
- Response trả về client khi có lỗi hoặc thành công nên chuẩn hóa định dạng JSON:
  - Khi thành công: `{"success": True, "data": ...}` hoặc `{"message": "..."}`
  - Khi thất bại (qua exception handler): `{"success": False, "message": "Chi tiết lỗi"}`

---

## 2. Quy tắc kiến trúc Frontend (React 19 + Vite)

### 2.1 Stack Công nghệ & Libraries
- **Core**: React 19, React Router DOM v7.
- **State Management & API**: Redux Toolkit (để quản lý global state) và Axios (để call/lấy API từ server).
- **CSS / Styling**: Tailwind CSS v4, Vanilla CSS.
- **Icons**: Lucide React, React Icons, Ant Design Icons.
- Tránh cài đặt thêm các thư viện giao diện nặng nề trừ khi có yêu cầu đặc biệt.

### 2.2 Component & Lazy Loading
- **Routing**: Tất cả các trang mới phải được khai báo trong `web/src/routes/index.js` và được import bằng cơ chế lazy load:
  ```javascript
  page: React.lazy(() => import("../pages/user/NewPage/NewPage"))
  ```
- **Layouts**: Phân định rõ layout sử dụng thuộc tính:
  - `isShowUserLayout: true` (Giao diện khách hàng)
  - `isShowAdminLayout: true` (Giao diện admin)
  - `isShowStaffLayout: true` (Giao diện nhân viên quầy)

### 2.3 Tiêu chuẩn thiết kế & Brand Identity (Viettel)
- **Hệ màu chủ đạo**:
  - Đỏ Viettel chính: `#EE0033` (hoặc gradient từ `#EE0033` sang `#A00022`)
  - Màu nền: Trắng `#FFFFFF` hoặc Xám nhạt `#f4f5f7`
  - Text chính: `#212529`
- **Phong cách**: Premium, Glassmorphism nhẹ, Bo góc lớn (`rounded-2xl` hoặc `rounded-3xl`), Bóng mờ tinh tế (`shadow-xl`).
- **3D & Spacing Scripts**: Dự án có hai script cjs chạy tự động là `apply3d.cjs` và `applySpacing.cjs`. Khi sửa đổi cấu trúc CSS, hãy lưu ý cấu trúc class của các card/button để không phá vỡ tính năng tự động áp dụng hiệu ứng của hai file này.

---

## 3. Quy trình làm việc và Git
- Trước khi làm việc: Luôn chạy `git pull origin main`.
- Chạy thử backend: Hoạt động trong môi trường ảo `.venv`, chạy lệnh `fastapi dev` hoặc `python app.py` từ thư mục `server/`.
- Chạy thử frontend: Chạy lệnh `npm run dev` từ thư mục `web/`.
- Commit thông điệp rõ ràng, tập trung vào tác vụ vừa hoàn thành.
- **Tạo API thay vì tự động chạy script insert**: Khi nhận được yêu cầu thêm đối tượng hoặc dữ liệu mới (ví dụ: thêm chi nhánh, thêm nhân viên...), AI chỉ thiết lập/xây dựng cấu trúc API tương ứng (Router -> Controller -> Service -> Repository), không được tự ý viết và chạy các file script để insert trực tiếp dữ liệu ảo vào database trừ khi người dùng có yêu cầu cụ thể.

---

## 4. Quy định cấu hình môi trường & Bảo mật

### 4.1 Quản lý biến môi trường (No Example Defaults)
- Các cấu hình (cổng, khóa bảo mật...) bắt buộc phải đọc trực tiếp từ `.env` / `.env.development`.
- Không tự ý đính kèm giá trị dự phòng mặc định (như `or "your_jwt_secret"` hoặc `os.getenv("PORT", 8000)`) trong mã nguồn hoặc file cấu hình trung tâm.
- Sử dụng các câu lệnh kiểm tra kiểu dữ liệu nghiêm ngặt (`if variable is None: raise ValueError(...)`) hoặc chú thích `# type: ignore` để xử lý cảnh báo kiểm tra kiểu tĩnh (Pyrefly) thay vì đính kèm chuỗi mặc định vào `os.getenv`.

### 4.2 Cấu hình Cookie & Tên miền chạy Local (Same-site)
- Môi trường chạy local dev sử dụng cookie HTTP-Only với cấu hình `SameSite="Lax"`.
- Trình duyệt chỉ gửi kèm cookie Lax nếu cổng Frontend và Backend chạy cùng một tên miền (Ví dụ: Frontend `http://localhost:5173` và Backend `http://localhost:8000`). Tránh chạy lệch tên miền như `localhost` (web) và `127.0.0.1` (api).

### 4.3 Khóa bảo mật Token riêng biệt
- Sử dụng 2 khóa bảo mật (Secret Key) riêng biệt để nâng cao tính an toàn:
  - `JWT_SECRET`: Dùng để ký và xác thực Access Token.
  - `JWT_REFRESH_SECRET`: Dùng để ký và xác thực Refresh Token.
