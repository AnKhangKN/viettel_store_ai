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
- **Tham khảo Schema gốc**: Khi viết các Pydantic Schema, DTO hoặc câu truy vấn SQL, bắt buộc tham chiếu và đối chiếu chính xác với cấu trúc bảng định nghĩa trong file [db-script.sql](../db-script.sql) ở thư mục gốc để đảm bảo đúng kiểu dữ liệu, tên cột và các ràng buộc.

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

### 2.4 Phân rã Component (Component Decomposition)
- **Quy định độ dài**: Tránh viết các file Page/Component chính quá dài (vượt quá 500 dòng).
- **Thư mục components nội bộ**: Khi phát triển các trang có nhiều phần giao diện phức tạp (như `HomePage`, `Dashboard`), bắt buộc phải bóc tách các Section lớn (ví dụ: Hệ thống chi nhánh & bản đồ, Banner trình chiếu, Kho gói cước...) thành các component độc lập đặt tại thư mục con `components/` của trang đó (Ví dụ: `pages/user/HomePage/components/BranchMapSection.jsx`).
- **Quản lý State cục bộ**: Các component con này nên tự quản lý các state cục bộ đặc thù của mình (như state tìm kiếm, bộ lọc cục bộ) thay vì đẩy hết lên trang chính, nhằm giảm thiểu việc render lại (re-render) không cần thiết và tối ưu hiệu năng.

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

---

## 5. Quy định Ngôn ngữ & Tương tác của AI

### 5.1 Ngôn ngữ Phản hồi và Kế hoạch
- AI bắt buộc phải trả lời và viết tất cả các tài liệu (kế hoạch triển khai `implementation_plan.md`, danh sách công việc `task.md`, báo cáo `walkthrough.md`, các đề xuất xác nhận hoặc proceed, v.v.) bằng **tiếng Việt**.
- Không sử dụng tiếng Anh hoặc ngôn ngữ khác để phản hồi trực tiếp cho người dùng, trừ các đoạn mã nguồn, tên biến, hoặc thuật ngữ chuyên ngành không thể dịch nghĩa.

---

## 6. Quy định kiến trúc WebSocket thời gian thực

### 6.1 WebSocket Manager toàn cục
- Mọi kết nối WebSocket phải được quản lý tập trung thông qua `websocket_manager` định nghĩa tại [websocket.py](file:///d:/workspace/viettel_store_ai/server/app/core/websocket.py).
- Không tự ý viết class quản lý kết nối WebSocket riêng lẻ ở từng module.

### 6.2 Định dạng Phòng (Room Name)
- Quản lý phòng kết nối theo định dạng chuỗi có tiền tố rõ ràng để phân loại mục đích sử dụng.
- Ví dụ:
  - `"queue:{id_chi_nhanh}"` đối với hàng chờ giao dịch tại quầy.
  - `"chat:{id_phien}"` đối với tin nhắn chatbot/hỗ trợ.

### 6.3 Cơ chế truyền phát (Broadcast)
- Khi có thay đổi dữ liệu từ API RESTful (ví dụ: tạo phiếu, đổi trạng thái), service tương ứng chịu trách nhiệm kích hoạt broadcast tín hiệu thay đổi đến room tương ứng thông qua:
  ```python
  import asyncio
  asyncio.create_task(websocket_manager.broadcast("room_name", {"event": "event_name"}))
  ```
- Phía Client khi nhận sự kiện qua WebSocket sẽ tự động gọi lại các API GET HTTP để lấy dữ liệu mới nhất (đảm bảo đồng bộ dữ liệu, giảm thiểu rủi ro và giữ tính đồng bộ tốt nhất).

---

## 7. Ràng buộc về kiểu dữ liệu ở Controllers (FastAPI)

### 7.1 Sử dụng Pydantic thay vì Dict cho Request Body
- Tuyệt đối không dùng kiểu `dict` chung chung cho dữ liệu nhận vào ở Controller để tránh giá trị mang kiểu `Unknown | None` khi gọi `.get()`.
- Luôn định nghĩa Request Schema kế thừa từ Pydantic `BaseModel` và chỉ định rõ kiểu dữ liệu mong đợi (ví dụ: `str` thay vì `Optional[str]`/`None` nếu trường đó là bắt buộc). Điều này giúp sửa lỗi kiểm tra kiểu tĩnh (Pyrefly `bad-argument-type`) và tự động hóa validate dữ liệu.



