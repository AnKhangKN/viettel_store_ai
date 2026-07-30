# Hướng dẫn Triển khai Hệ thống lên Production (Render + Vercel)

Tài liệu này hướng dẫn chi tiết các bước triển khai toàn bộ hệ thống **Viettel Store AI** lên hạ tầng Cloud Production chính thức sử dụng **Render** (cho Backend FastAPI & PostgreSQL) và **Vercel** (cho Frontend React/Vite).

---

## 1. 🌐 Tổng quan Hạ tầng Production

- **Backend Web Service**: Chạy trên [Render.com](https://render.com) (Python 3.10+, FastAPI, Uvicorn).
- **Frontend App**: Deploy trên [Vercel.com](https://vercel.com) (Static Site, React 19).
- **Database**: Render PostgreSQL Cloud Service.
- **Dữ liệu CSKH**: Commit file `server/data/data-cskh.xlsx` lên Git để Render đọc trực tiếp trên server production.

---

## 2. 🐘 Bước 1: Triển khai Cơ sở Dữ liệu PostgreSQL trên Render

1. Đăng nhập Render Dashboard, chọn **New +** -> **PostgreSQL**.
2. Điền thông tin:
   - **Name**: `viettel-store-db`
   - **Database**: `viettel_db`
   - **User**: `vietteluser900`
   - **Region**: Singapore (ap-southeast-1) hoặc Oregon.
3. Sau khi khởi tạo xong, copy thông tin **Internal Database URL** hoặc **External Database URL**.
4. Truy cập PostgreSQL bằng công cụ quản trị (DBeaver/pgAdmin) hoặc Dòng lệnh để thực thi file `db-script.sql` khởi tạo toàn bộ cấu trúc Bảng và Dữ liệu mẫu ban đầu.

---

## 3. 🐍 Bước 2: Triển khai Backend FastAPI lên Render

1. Trên Render Dashboard, chọn **New +** -> **Web Service**.
2. Kết nối với Repository GitHub của dự án.
3. Cấu hình dịch vụ:
   - **Name**: `viettel-store-ai-backend`
   - **Root Directory**: `server`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `fastapi dev` hoặc `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Cấu hình **Environment Variables**:
   - `APP_ENV` = `production`
   - `DB_HOST` = `<Host_PostgreSQL_Cloud_Render>`
   - `DB_PORT` = `5432`
   - `DB_NAME` = `viettel_db`
   - `DB_USER` = `vietteluser900`
   - `DB_PASSWORD` = `<Mật_khẩu_DB_Render>`
   - `JWT_SECRET` = `<Secret_Key_32_Ky_Tu>`
   - `JWT_REFRESH_SECRET` = `<Refresh_Secret_Key_32_Ky_Tu>`
   - `FRONTEND_ORIGINS` = `https://viettel-store-ai.vercel.app`
   - `VNPAY_RETURN_URL` = `https://viettel-store-ai.vercel.app/payment/vnpay-return`
   - `GEMINI_API_KEY` = `<Khóa_API_Gemini>`
   - `GROQ_API_KEY` = `<Khóa_API_Groq>`
5. Nhấn **Create Web Service**. Sau khi deploy xong, Render sẽ cấp URL Backend có dạng: `https://viettel-store-ai.onrender.com`.

---

## 4. ⚡ Bước 3: Triển khai Frontend React 19 lên Vercel

1. Đăng nhập Vercel Dashboard, chọn **Add New** -> **Project**.
2. Import Repository GitHub của dự án.
3. Cấu hình Dự án:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Cấu hình **Environment Variables**:
   - `VITE_BACKEND_URL` = `https://viettel-store-ai.onrender.com`
   - `VITE_GOOGLE_CLIENT_ID` = `986202308768-98sttntsaaicoovotagpd0i7m2g3ja31.apps.googleusercontent.com`
5. Nhấn **Deploy**. Sau khi hoàn tất, Vercel sẽ cấp URL Frontend chính thức (Ví dụ: `https://viettel-store-ai.vercel.app`).

---

## 5. ✅ Bước 4: Kiểm tra và Nghiệm thu Hệ thống Production

1. Mở trang Web Production trên trình duyệt.
2. Kiểm tra tính năng Đăng ký / Đăng nhập (AccessToken & Cookie HTTPS-Only).
3. Đặt SIM / Gói cước và chạy thử luồng thanh toán VNPay Sandbox.
4. Mở cửa sổ Chatbot AI và thử nghiệm tra cứu thông tin số điện thoại khách hàng (đối chiếu dữ liệu trong `data-cskh.xlsx`).
5. Thử nghiệm kết nối WebSocket hàng chờ trên giao diện Nhân viên quầy.
