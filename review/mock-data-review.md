# 📋 Danh Sách Mock Data Cần Thay Bằng API Thật

> **Ngày tạo**: 2026-07-28
> **Mục đích**: Liệt kê toàn bộ các component/page đang sử dụng dữ liệu cứng (hardcoded/mock data) thay vì gọi API từ database, kèm đề xuất hướng xử lý.

---

## ✅ Đã kết nối API thật

| Trang / Component | API đang dùng | Ghi chú |
|---|---|---|
| `PackagePage.jsx` | `GET /api/package` | Đầy đủ, có loading/error state |
| `PackageDetailPage.jsx` | `GET /api/package/:id` | Ổn |
| `HomePage.jsx` — Đặc Quyền Hội Viên | `GET /api/package` | Đã kết nối 2026-07-28, lấy 3 gói đầu tiên |
| `HomePage.jsx` — Hệ thống chi nhánh | `GET /api/branch` | Ổn |
| `ChatbotPage.jsx` | `POST /api/chatbot`, `GET /api/branch` | Ổn |
| `UserProfilePage.jsx` | `PATCH /api/user/profile`, `PATCH /api/user/change-password` | Ổn |

---

## ⚠️ Đang dùng Mock Data — Cần xử lý

### 1. NewsPage.jsx — Ưu tiên CAO
**File**: `src/pages/user/NewsPage/NewsPage.jsx`

Mock data hiện tại:
- `featuredArticle` — 1 bài viết nổi bật hardcoded
- `allArticles` — Mảng 6+ bài viết hardcoded (title, excerpt, image, date, category)

Hướng xử lý:
- Cần backend tạo module `news` (bảng `tintuc`)
- API cần tạo: `GET /api/news`, `GET /api/news/:id`

---

### 2. NewsDetailPage.jsx — Ưu tiên CAO
**File**: `src/pages/user/NewsDetailPage/NewsDetailPage.jsx`

Mock data: Toàn bộ nội dung bài viết chi tiết hardcoded theo id từ URL

Hướng xử lý: Xử lý đồng thời với NewsPage khi có API news

---

### 3. MobileServicesPage.jsx — Ưu tiên TRUNG
**File**: `src/pages/user/MobileServicesPage/MobileServicesPage.jsx`

Mock data:
- `services` — Mảng 6 dịch vụ hardcoded (title, description, icon, features array)

Hướng xử lý:
- Nếu nội dung marketing tĩnh → Có thể giữ nguyên
- Nếu admin cần quản lý → Tạo bảng `dichvu` và API `GET /api/services`

---

### 4. MobileServiceDetailPage.jsx — Ưu tiên TRUNG
**File**: `src/pages/user/MobileServiceDetailPage/MobileServiceDetailPage.jsx`

Mock data: Nội dung chi tiết từng dịch vụ hardcoded theo id

Hướng xử lý: Xử lý đồng thời với MobileServicesPage

---

### 5. StoreLocatorPage.jsx — Ưu tiên CAO
**File**: `src/pages/user/StoreLocatorPage/StoreLocatorPage.jsx`

Cần kiểm tra: Trang tìm kiếm cửa hàng có đang dùng API `getAllBranches` chưa?
Nếu chưa → Kết nối với `api/branch/branch.api.js` (API đã có sẵn)

---

### 6. SupportPage.jsx — Ưu tiên THẤP
**File**: `src/pages/user/SupportPage/SupportPage.jsx`

Mock data: Danh sách FAQ/câu hỏi thường gặp hardcoded theo category

Hướng xử lý:
- Nếu FAQ là nội dung tĩnh → Giữ nguyên
- Nếu admin cần quản lý → Tạo bảng `faq` và API `GET /api/faq`

---

## 🟡 Mock Data tĩnh có thể chấp nhận

| Vị trí | Lý do chấp nhận |
|---|---|
| `NavbarComponent.jsx` — menuItems | Cấu trúc menu điều hướng, không thay đổi |
| `MobileServicesPage.jsx` — services | Nội dung marketing tĩnh |
| `HomePage.jsx` — backgroundImages | URL ảnh nền cho hero |
| `HomePage.jsx` — Thống kê (70M+, 99%, 63, 24/7) | Số liệu marketing không cần DB |
| `PackagePage.jsx` — priceRanges | Bộ lọc giá UI |

---

## 📌 Thứ tự ưu tiên xử lý tiếp theo

1. [CAO] NewsPage + NewsDetailPage — Cần tạo module news ở backend
2. [CAO] StoreLocatorPage — Kiểm tra và kết nối getAllBranches
3. [TRUNG] MobileServicesPage — Tùy quyết định nghiệp vụ
4. [THẤP] SupportPage FAQ — Giữ nguyên hoặc tạo module faq

---

## 🔗 API Frontend hiện có

| Module | File |
|---|---|
| Gói cước | `api/package/package.api.js` |
| Chi nhánh | `api/branch/branch.api.js` |
| SIM | `api/sim/sim.api.js` |
| Auth (Google Login) | `api/auth/auth.api.js` |
| User | `api/user/user.api.js` |
| Chatbot | `api/chatbot/chatbot.api.js` |
| Payment/VNPay | `api/payment/payment.api.js` |

