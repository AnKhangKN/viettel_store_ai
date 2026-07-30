# 📋 Danh Sách Mock Data & Trạng Thái Xử Lý

> **Cập nhật mới nhất**: 2026-07-30  
> **Quy tắc xử lý**:
> - ✅ **Đã hoàn thành**: Đã kết nối thành công API từ cơ sở dữ liệu có sẵn.
> - 🟢 **Giữ nguyên (Nội dung tĩnh)**: Không đụng tới DB (Marketing / FAQ / Menu điều hướng tĩnh / Thống kê UI).
> - ⏭️ **Bỏ qua**: Các mục yêu cầu tạo thêm bảng DB / backend module mới (`tintuc`, `dichvu`, `faq`).

---

## ✅ Đã kết nối API thật (Cơ sở dữ liệu)

| Trang / Component | API đang dùng | Ghi chú |
|---|---|---|
| `PackagePage.jsx` | `GET /api/package` | Đầy đủ, có loading/error state |
| `PackageDetailPage.jsx` | `GET /api/package/:id` | Ổn định |
| `HomePage.jsx` — Đặc Quyền Hội Viên | `GET /api/package` | Lấy 3 gói cước mới nhất từ DB |
| `HomePage.jsx` — Hệ thống chi nhánh | `GET /api/branch` | Lấy danh sách chi nhánh từ DB |
| `StoreLocatorPage.jsx` | `GET /api/branch` | **[x] Đã hoàn thành** (kết nối `getAllBranches()`) |
| `ChatbotPage.jsx` | `POST /api/chatbot`, `GET /api/branch` | AI Gemini + DB chi nhánh |
| `UserProfilePage.jsx` | `PATCH /api/user/profile`, `PATCH /api/user/change-password` | Đầy đủ validate & update DB |

---

## 🟢 Nội dung tĩnh (Giữ nguyên - Không cần đụng tới DB)

| Vị trí / Trang | Chi tiết nội dung | Lý do giữ nguyên |
|---|---|---|
| `NavbarComponent.jsx` | `menuItems` (Trang chủ, Kho SIM, Gói cước, AI Chatbot...) | Cấu trúc menu điều hướng cố định |
| `SupportPage.jsx` | Danh sách câu hỏi thường gặp (FAQ) & Danh mục hỗ trợ | Nội dung hỗ trợ khách hàng tĩnh |
| `MobileServicesPage.jsx` | Danh sách dịch vụ di động & Tính năng marketing | Trang giới thiệu thông tin marketing tĩnh |
| `MobileServiceDetailPage.jsx` | Chi tiết từng dịch vụ di động | Trang thông tin chi tiết tĩnh |
| `HomePage.jsx` | `backgroundImages` (Hero slider) & Thống kê (70M+, 99%, 63 tỉnh thành) | Assets giao diện & số liệu ấn tượng |
| `PackagePage.jsx` | `priceRanges` | Bộ lọc khoảng giá UI |

---

## ⏭️ Bỏ qua (Do yêu cầu tạo bảng DB mới)

| Trang / Component | Đề xuất DB mới | Trạng thái |
|---|---|---|
| `NewsPage.jsx` | Bảng `tintuc` + API `GET /api/news` | ⏭️ Bỏ qua theo yêu cầu (không tạo DB mới) |
| `NewsDetailPage.jsx` | API `GET /api/news/:id` | ⏭️ Bỏ qua theo yêu cầu (không tạo DB mới) |

