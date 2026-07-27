# Hướng dẫn chi tiết deploy Viettel Store AI lên Render + Vercel

> **Mục tiêu**: triển khai backend lên Render và frontend lên Vercel để chạy production ổn định, đồng thời giữ cho module CSKH để AI đọc, học từ file Excel và tra cứu số điện thoại sau khi deploy.

---

## 1. Tổng quan kiến trúc hiện tại

### Backend
- Framework: **FastAPI**
- Entry point hiện tại: `server/app/main.py`
- App object:
  - `app = FastAPI(...)`
- Router:
  - `app.include_router(api_router)`
- Root endpoint:
  - `GET /`

### Frontend
- Thư mục: `web/`
- Dự án frontend là app tĩnh build bằng Vite/React

### Dữ liệu CSKH
- File Excel đang dùng:
  - `server/data/data-cskh.xlsx`
- File này có **2 sheet**
- Service đọc file:
  - `server/app/modules/cskh/services/cskh_service.py`
- Khi deploy phải đọc đủ **sheet 1** và **sheet 2** để AI học được toàn bộ dữ liệu khách hàng

---

## 2. Phương án deploy khuyến nghị

### Phương án đơn giản nhất
- **Backend**: deploy bằng **Render Web Service**
- **Frontend**: deploy bằng **Vercel**
- **Excel CSKH**: commit file `data-cskh.xlsx` vào repo để backend đọc trực tiếp trên Render

### Vì sao nên làm vậy
- Render phù hợp cho backend FastAPI chạy liên tục
- Vercel phù hợp cho frontend React/Vite dạng static site
- Nếu file Excel không nằm trong repo hoặc không được mount đúng cách, backend sẽ không đọc được dữ liệu CSKH
- Vì file Excel có 2 sheet, backend cần quét cả 2 sheet để không bỏ sót dữ liệu khách hàng và để AI học đúng toàn bộ nguồn dữ liệu

### Nếu dữ liệu CSKH thay đổi thường xuyên
Nên cân nhắc chuyển sang:
- PostgreSQL
- Hoặc lưu file trên object storage và tải về lúc khởi động

---

## 3. Chuẩn bị trước khi deploy

### 3.1 Kiểm tra backend có thể chạy local
Chạy backend local bằng lệnh kiểu:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Nếu chạy ở thư mục `server/`, import `app.main` sẽ đúng với cấu trúc hiện tại.

### 3.2 Kiểm tra file Excel CSKH
Đảm bảo:
- File tồn tại tại `server/data/data-cskh.xlsx`
- File này được commit lên Git
- File có 2 sheet và service/AI phải đọc được cả 2 sheet
- Service CSKH đọc được file khi chạy local

### 3.3 Kiểm tra requirements
Trong `server/requirements.txt`, cần bảo đảm các thư viện dùng thật sự đều đã khai báo.

### 3.4 Kiểm tra CORS
Backend hiện chỉ cho phép:
- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Khi lên Render, cần thêm domain frontend thật vào CORS.

---

## 4. Deploy backend lên Render

## Bước 1: Tạo Web Service
Trên Render:
1. Chọn **New +**
2. Chọn **Web Service**
3. Kết nối repository GitHub của project
4. Chọn branch cần deploy

## Bước 2: Cấu hình service
Điền các trường chính:

### Root Directory
Nếu repo là monorepo:
- `server`

Nếu deploy từ gốc repo:
- để trống

### Environment
- `Python`

### Build Command
Nếu root là `server`:
```bash
pip install -r requirements.txt
```

### Start Command
Dùng đúng entrypoint hiện tại:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

> `$PORT` là biến Render cung cấp tự động.

---

## 5. Biến môi trường cần thiết cho backend

Tùy project đang dùng gì, thường sẽ cần:

- `DATABASE_URL`
- `SECRET_KEY`
- `GOOGLE_API_KEY`
- `GROQ_API_KEY`
- `OPENAI_API_KEY` nếu có
- `JWT_SECRET` nếu có
- `ENV=production`

Nếu backend dùng `.env` local, hãy chuyển các giá trị đó sang Render Dashboard:
- Render service
- Tab **Environment**
- Add từng biến một

---

## 6. Xử lý file Excel CSKH trên Render

Đây là phần quan trọng nhất của project hiện tại.

### Cách 1: Commit file Excel vào repo
**Khuyến nghị cho MVP / demo**
- Đặt file ở `server/data/data-cskh.xlsx`
- Commit file lên Git
- Backend trên Render sẽ đọc được ngay khi deploy
- Khi đọc file cần quét cả 2 sheet để không bỏ sót dữ liệu khách hàng

### Cách 2: Dùng Render Disk
**Khuyến nghị nếu file lớn hoặc muốn update thủ công**
- Gắn disk vào service
- Lưu file Excel vào đường dẫn cố định
- Cập nhật `CSKHService._get_excel_path()` nếu cần

### Cách 3: Chuyển Excel sang PostgreSQL
**Khuyến nghị cho production lâu dài**
- Viết script import Excel vào DB
- Tra cứu theo số điện thoại từ DB thay vì đọc file

---

## 7. Cách chỉnh CSKH để an toàn khi lên Render

### Hiện trạng
Service đang đọc:
- `data/data-cskh.xlsx`

### Nên đảm bảo thêm
- File path không phụ thuộc thư mục làm việc quá chặt
- Có log rõ ràng nếu không tìm thấy file
- Có fallback path hợp lý
- Khi load file phải đọc cả sheet 1 và sheet 2 để AI học đủ dữ liệu

### Kiểm tra cần làm
- Nếu deploy Render mà không thấy file, backend sẽ log:
  - file không tồn tại
- Cần kiểm tra log Web Service để biết file có được load không

---

## 8. Deploy frontend lên Vercel

## Bước 1: Tạo Project trên Vercel
1. Đăng nhập Vercel
2. Chọn **Add New Project**
3. Import repository GitHub của project
4. Chọn đúng thư mục frontend:
   - `web`

## Bước 2: Cấu hình build
Thông tin cấu hình chuẩn cho Vite:
- **Framework Preset**: Vite
- **Root Directory**: `web`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Bước 3: Cài đặt biến môi trường frontend
Frontend cần trỏ API tới backend Render, ví dụ:
- `VITE_API_BASE_URL=https://your-backend.onrender.com`

Nếu code đang gọi API bằng biến môi trường, chỉ cần set đúng giá trị này trên Vercel.

Nếu code đang hardcode `localhost`, cần sửa trước khi deploy.

---

## 9. Cập nhật CORS backend sau khi có domain frontend

Sau khi deploy frontend trên Vercel, thêm domain thật vào CORS trong `server/app/main.py`.

Ví dụ:
```python
allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://your-frontend.vercel.app",
]
```

Nếu frontend có nhiều domain:
- thêm đầy đủ vào `allow_origins`

---

## 10. Kiểm tra sau khi deploy backend

Sau khi Render deploy xong, kiểm tra các bước sau:

### 10.1 Test root endpoint
Mở:
```bash
https://your-backend.onrender.com/
```

Kỳ vọng:
```json
{
  "message": "Viettel Store AI API"
}
```

### 10.2 Test chatbot/API chính
Gọi các endpoint chính để xác nhận router hoạt động.

### 10.3 Test tra cứu CSKH
Gửi số điện thoại cần test vào luồng chatbot hoặc API liên quan.

Kỳ vọng:
- AI đọc được dữ liệu từ file Excel
- Trả về đúng thông tin khách hàng theo số điện thoại
- Nếu dữ liệu nằm ở sheet 1 hoặc sheet 2 thì đều phải tìm được và AI phải hiểu cả hai nguồn dữ liệu

### 10.4 Kiểm tra log Render
Cần xem:
- backend có load được file Excel không
- có lỗi import không
- có lỗi path không
- có lỗi encoding không

---

## 11. Checklist triển khai thực tế

### Giai đoạn 1: Chuẩn bị code
- [ ] Xác định repo có chứa `server/` và `web/`
- [ ] Đảm bảo `server/app/main.py` là entrypoint đúng
- [ ] Commit `server/data/data-cskh.xlsx` lên Git nếu dùng cách file tĩnh
- [ ] Kiểm tra backend chạy local bằng `uvicorn app.main:app`
- [ ] Kiểm tra frontend build local bằng `npm run build`

### Giai đoạn 2: Deploy backend
- [ ] Tạo Render Web Service
- [ ] Chọn root directory `server`
- [ ] Set Build Command
- [ ] Set Start Command
- [ ] Thêm env vars
- [ ] Deploy lần đầu

### Giai đoạn 3: Kiểm tra backend
- [ ] Mở root endpoint
- [ ] Test chatbot API
- [ ] Test CSKH lookup theo số điện thoại
- [ ] Xem logs trên Render
- [ ] Xác nhận dữ liệu ở cả sheet 1 và sheet 2 đều đọc được

### Giai đoạn 4: Deploy frontend
- [ ] Tạo project trên Vercel
- [ ] Chọn root directory `web`
- [ ] Set Build Command = `npm run build`
- [ ] Set Output Directory = `dist`
- [ ] Set `VITE_API_BASE_URL`
- [ ] Deploy frontend

### Giai đoạn 5: Hoàn thiện production
- [ ] Thêm domain frontend thật vào CORS backend
- [ ] Test end-to-end giữa frontend và backend
- [ ] Kiểm tra lại luồng CSKH từ giao diện người dùng

---

## 12. Nếu muốn dùng `render.yaml`

Có thể tạo file `render.yaml` để khai báo hạ tầng bằng code.

### Ví dụ cấu trúc
- 1 backend web service
- 1 frontend static site
- env vars khai báo sẵn

### Khi nào nên dùng
- Muốn deploy lại dễ hơn
- Muốn lưu cấu hình trong Git
- Muốn đồng bộ môi trường cho team

Nếu cần, có thể viết tiếp file `render.yaml` riêng cho project này.

---

## 13. Gợi ý hướng đi tốt nhất cho project hiện tại

### Nếu mục tiêu là chạy nhanh
1. Deploy backend lên Render
2. Commit file Excel CSKH vào repo
3. Deploy frontend lên Vercel
4. Cập nhật CORS và API base URL
5. Đảm bảo backend đọc đủ sheet 1 và sheet 2

### Nếu mục tiêu là production lâu dài
1. Import Excel sang PostgreSQL
2. Tra cứu CSKH từ DB
3. Deploy backend Render / frontend Vercel tách riêng
4. Quản lý env vars và logs chặt hơn

---

## 14. Kết luận

Để host project này lên Render + Vercel thành công, cần nhớ 3 điểm quan trọng nhất:

1. **Backend entrypoint hiện tại là `server/app/main.py`**
2. **File Excel CSKH phải tồn tại trên Render**
3. **File Excel có 2 sheet nên backend phải đọc cả sheet 1 và sheet 2**
4. **Frontend phải trỏ đúng API backend và backend phải cho phép CORS domain thật**

Nếu cần triển khai nhanh, nên chọn:
- Backend Web Service trên Render
- Frontend Static Site trên Vercel
- File Excel commit vào repo
- Đọc đủ cả 2 sheet của file Excel CSKH

Nếu cần sản xuất lâu dài, nên chuyển dữ liệu CSKH sang database.