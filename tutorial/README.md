# Thư mục Hướng dẫn & Vận hành Dự án (Viettel Store AI Tutorial)

Thư mục này chứa toàn bộ các tài liệu hướng dẫn vận hành, kiểm thử (Deployment Test) và quy trình triển khai Production cho hệ thống **Viettel Store AI**.

---

## 📚 Danh mục Tài liệu

| Tên File | Nội dung chính |
| :--- | :--- |
| 📝 [**TASKS.md**](./TASKS.md) | **[DANH SÁCH TASK]** Tổng hợp các công việc cần làm (Xác thực Email OTP, Responsive Mobile, Giao diện Login, Validate Profile) và các đề xuất nâng cấp dự án. |
| 📖 [**TUTORIAL_SWITCH_ENV.md**](./TUTORIAL_SWITCH_ENV.md) | **[QUAN TRỌNG]** Hướng dẫn chi tiết cách chuyển đổi giữa môi trường **Deployment Test (Local)** và **Production**, giải thích các file cấu hình đã sửa đổi và cách trả lại trạng thái Production. |
| 🧪 [**TUTORIAL_LOCAL_TESTING.md**](./TUTORIAL_LOCAL_TESTING.md) | Hướng dẫn cách khởi chạy full-stack (Backend FastAPI + Frontend React/Vite + Database PostgreSQL) tại môi trường Test và quy trình kiểm thử tính năng. |
| 🚀 [**TUTORIAL_PRODUCTION_DEPLOY.md**](./TUTORIAL_PRODUCTION_DEPLOY.md) | Hướng dẫn từng bước triển khai hệ thống lên hạ tầng Production (Render Web Service + Vercel Static Hosting + Render PostgreSQL). |


---

## ⚡ Hướng dẫn Nhanh Khởi chạy Môi trường Test (Quick Start)

### 1. Khởi động PostgreSQL Database
```powershell
# Chạy Docker Container PostgreSQL (Port 5433)
docker-compose -f docker-compose.database.yml up -d
```

### 2. Khởi động Backend Server (FastAPI)
```powershell
cd server
.\.venv\Scripts\activate
fastapi dev
# Server chạy tại: http://localhost:8000
```

### 3. Khởi động Frontend Client (React 19 + Vite)
```powershell
cd web
npm run dev
# Frontend chạy tại: http://localhost:5173
```

---

> 💡 **Ghi chú**: Mọi thắc mắc về cách cấu hình biến môi trường hoặc chuyển đổi từ Test sang Production, vui lòng tham khảo chi tiết tại file [**TUTORIAL_SWITCH_ENV.md**](./TUTORIAL_SWITCH_ENV.md).
