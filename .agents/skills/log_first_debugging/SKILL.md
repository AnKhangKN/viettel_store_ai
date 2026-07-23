---
name: log_first_debugging
description: Always inspect full un-truncated server/browser runtime logs and stack traces before diagnosing or fixing any errors. Never guess error causes or apply superficial patches.
---

# Quy chuẩn Debug: Không đoán lỗi – Luôn trích xuất Log trước khi sửa lỗi

Kỹ năng này bắt buộc AI tuân thủ quy trình debug dựa trên bằng chứng thực tế (evidence-based debugging). Khi gặp bất kỳ sự cố hoặc lỗi nào trong ứng dụng (Backend FastAPI hay Frontend React/Vite):

## 1. Nguyên tắc cốt lõi
- **TUYỆT ĐỐI KHÔNG ĐOÁN LỖI**: Không đưa ra giả định nguyên nhân lỗi khi chưa trực tiếp trích xuất và đọc full traceback / log.
- **ĐỌC LOG ĐẦU TIÊN**: Hành động ĐẦU TIÊN khi phát hiện lỗi là phải đọc chi tiết thông báo lỗi và dấu vết dòng code bị lỗi (stack trace).
- **KHÔNG SỬA NÔNG / KHÔNG CHE KHUẤT LỖI**: 
  - Không nuốt ngoại lệ (silent try/except).
  - Không gán dữ liệu giả (fallback dummy) chỉ để giấu lỗi.
  - Không comment dòng kiểm tra hoặc xóa test case đang thất bại.

## 2. Quy trình 4 bước Debug chuẩn

### Bước 1: Trích xuất Log (Log Extraction)
- Đọc đầu ra terminal, log của dịch vụ `fastapi dev` hoặc log build/runtime của `vite`.
- Trường hợp thông báo lỗi bị cắt ngắn, sử dụng các công cụ kiểm tra file log đầy đủ trước khi kết luận.

### Bước 2: Phân tích Nguyên nhân gốc (Root Cause Analysis)
- Xác định chính xác vị trí file (`filepath`), số dòng (`line number`) và loại ngoại lệ (`exception type`).
- Đối chiếu chính xác kiểu dữ liệu thực tế và ràng buộc Schema / API.

### Bước 3: Đề xuất phương án sửa tận gốc
- Giải quyết tận gốc lý do phá vỡ hợp đồng dữ liệu thay vì bọc try/except xung quanh.

### Bước 4: Kiểm thử xác nhận (Verification)
- Luôn chạy lại lệnh build (`npm run build`) hoặc lệnh chạy thử để xác nhận lỗi đã được khắc phục hoàn toàn.
