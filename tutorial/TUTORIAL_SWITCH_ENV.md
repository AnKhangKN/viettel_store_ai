# Hướng dẫn Chi tiết Chuyển đổi Môi trường (Deployment Test ↔ Production)

Tài liệu này ghi chép lại toàn bộ các chỉnh sửa đã thực hiện trong dự án **Viettel Store AI** để đưa ứng dụng về môi trường **Deployment Test (Local/Staging)**, đồng thời hướng dẫn chi tiết cách gắn lại cấu hình để chuyển ứng dụng về môi trường **Production** (Render + Vercel) sau khi hoàn tất kiểm thử và cập nhật.

---

## 1. 📝 Tóm tắt các Thay đổi đã Chỉnh sửa (What Changed)

Để ứng dụng có thể chạy và kết nối ổn định ở môi trường Deployment Test local, các file sau đây đã được điều chỉnh:

### 1.1 `server/app/core/config.py`
- **Trước đây**: Đơn thuần nạp `.env.development` trước với `override=False`, khiến cho biến `APP_ENV` luôn bị cố định là `"development"` và không bao giờ nạp được `.env.production`.
- **Đã sửa đổi**: Cập nhật logic nạp cấu hình linh hoạt:
  ```python
  app_env_initial = os.getenv("APP_ENV", "development").lower()

  if (BASE_DIR / ".env").exists():
      load_dotenv(BASE_DIR / ".env", override=True)
  elif app_env_initial == "production":
      load_dotenv(BASE_DIR / ".env.production", override=True)
  else:
      load_dotenv(BASE_DIR / ".env.development", override=True)
  ```
- **Tác dụng**: Giúp hệ thống tự động nhận diện file môi trường cần dùng dựa trên biến hệ thống `APP_ENV` hoặc sự xuất hiện của file `.env`.

### 1.2 `server/.env.development`
- Cấu hình các thông số phục vụ kiểm thử Local Test:
  - `APP_ENV=development`
  - `DB_HOST=localhost`
  - `DB_PORT=5433` (hoặc `5432` tùy môi trường Postgres Local)
  - `FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000`
  - `VNPAY_RETURN_URL=http://localhost:5173/payment/vnpay-return`

### 1.3 `web/.env.development`
- Điểm kết nối Backend phục vụ Frontend chạy local test:
  - `VITE_BACKEND_URL=http://localhost:8000`

---

## 2. 🧪 Trạng thái Môi trường Hiện tại (Deployment Test Environment)

Dự án hiện tại đang ở trạng thái **Deployment Test**:
- **Backend (FastAPI)**: Đang chạy ở cổng `8000` (`http://localhost:8000`).
- **Frontend (Vite/React)**: Đang kết nối tới Backend local `http://localhost:8000`.
- **Database (PostgreSQL)**: Kết nối với Database local (`localhost:5433`, User: `admin`, Database: `viettel_db`).
- **CORS & Payment Return**: Cho phép giao tiếp từ `http://localhost:5173`.

---

## 3. 🚀 Quy trình Gắn lại Cấu hình để Chuyển về Production

Khi bạn đã hoàn tất việc kiểm thử, cập nhật tính năng mới và muốn đẩy ứng dụng lên chạy chính thức trên môi trường **Production**, hãy thực hiện theo 2 phương án dưới đây:

### Phương án A: Deploy lên Cloud (Render & Vercel) - Khuyên dùng

#### Bước 1: Cấu hình biến môi trường trên Render (Backend)
Trên Bảng điều khiển Render (Render Dashboard -> Environment Settings), khai báo các biến môi trường sau:
```env
APP_ENV=production
APP_PORT=8000
DB_HOST=<Host_PostgreSQL_Cloud_Render>
DB_PORT=5432
DB_NAME=viettel_db
DB_USER=<User_PostgreSQL_Cloud>
DB_PASSWORD=<Password_PostgreSQL_Cloud>
JWT_SECRET=<Secret_Key_32_Ky_Tu>
JWT_REFRESH_SECRET=<Refresh_Secret_Key_32_Ky_Tu>
FRONTEND_ORIGINS=https://viettel-store-ai.vercel.app
VNPAY_RETURN_URL=https://viettel-store-ai.vercel.app/payment/vnpay-return
```

#### Bước 2: Cấu hình biến môi trường trên Vercel (Frontend)
Trên Bảng điều khiển Vercel (Vercel Project -> Settings -> Environment Variables), khai báo:
```env
VITE_BACKEND_URL=https://viettel-store-ai.onrender.com
VITE_GOOGLE_CLIENT_ID=986202308768-98sttntsaaicoovotagpd0i7m2g3ja31.apps.googleusercontent.com
```

#### Bước 3: Re-deploy / Trigger Build
- Commit và Push mã nguồn mới lên nhánh `main` trên GitHub.
- Render và Vercel sẽ tự động kích hoạt tiến trình Build & Deploy sản phẩm mới nhất.

---

### Phương án B: Chạy chế độ Production ngay tại Máy Cục bộ (Local Production Test)

Nếu muốn chạy thử nghiệm chế độ Production ngay trên máy cá nhân:

#### Bước 1: Chạy Server với biến `APP_ENV=production`
Mở PowerShell tại thư mục `server`:
```powershell
$env:APP_ENV="production"
.\.venv\Scripts\fastapi dev
```
*(Server sẽ tự động nạp toàn bộ cấu hình từ file `.env.production`)*

#### Bước 2: Build Frontend theo chuẩn Production
Mở Terminal tại thư mục `web`:
```powershell
npm run build
npm run preview
```

---

## 4. 🔄 Quy trình Chuyển từ Production trở lại Deployment Test

Khi cần bảo trì, phát triển thêm tính năng mới hoặc sửa lỗi:
1. Mở PowerShell tại `server`, bỏ biến `APP_ENV` hoặc đặt `$env:APP_ENV="development"`.
2. Khởi chạy Server local: `fastapi dev` (mặc định nạp `.env.development`).
3. Khởi chạy Frontend local: `npm run dev` (mặc định nạp `.env.development`).

---

## 5. 📊 Bảng Đối chiếu Cấu hình Môi trường (Reference Matrix)

| Biến môi trường | Môi trường Test (Local) | Môi trường Production (Cloud) |
| :--- | :--- | :--- |
| `APP_ENV` | `development` | `production` |
| `DB_HOST` | `localhost` | `dpg-d9k2715aeets73a0i7v0-a` (Render Cloud DB) |
| `DB_PORT` | `5433` (hoặc `5432`) | `5432` |
| `FRONTEND_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | `https://viettel-store-ai.vercel.app` |
| `VITE_BACKEND_URL` | `http://localhost:8000` | `https://viettel-store-ai.onrender.com` |
| `VNPAY_RETURN_URL` | `http://localhost:5173/payment/vnpay-return` | `https://viettel-store-ai.vercel.app/payment/vnpay-return` |
