server/
│
├── app/
│   │
│   ├── main.py
│   │   # Entry point FastAPI
│   │   # Khởi tạo app
│   │   # Đăng ký router
│   │   # Middleware
│   │   # CORS
│   │
│   ├── lifespan.py
│   │   # Chạy khi server start/shutdown
│   │   # Kết nối Redis
│   │   # Load AI model
│   │   # Scheduler
│   │
│   ├── routers.py
│   │   # Gom toàn bộ router module
│   │   # auth_router
│   │   # sim_router
│   │   # package_router
│   │   # store_router
│   │   # queue_router
│   │   # chatbot_router
│   │
│   ├── core/
│   │
│   │   ├── config.py
│   │   │   # Đọc .env
│   │   │   # Cấu hình hệ thống
│   │   │
│   │   ├── database.py
│   │   │   # PostgreSQL connection pool
│   │   │   # get_db()
│   │   │
│   │   ├── jwt.py
│   │   │   # create_access_token()
│   │   │   # create_refresh_token()
│   │   │   # verify_token()
│   │   │
│   │   ├── security.py
│   │   │   # bcrypt hash password
│   │   │   # verify password
│   │   │
│   │   ├── ai.py
│   │   │   # OpenAI client
│   │   │   # Prompt manager
│   │   │
│   │   ├── logger.py
│   │   │   # Log toàn hệ thống
│   │   │
│   │   ├── response.py
│   │   │   # Format response chung
│   │   │
│   │   ├── exceptions.py
│   │   │   # Custom exception
│   │   │
│   │   └── constants.py
│   │       # Hằng số hệ thống
│   │
│   ├── common/
│   │
│   │   ├── dependencies/
│   │   │
│   │   │   ├── auth_dependency.py
│   │   │   │   # Lấy user từ JWT
│   │   │   │
│   │   │   ├── admin_dependency.py
│   │   │   │   # Chỉ ADMIN được truy cập
│   │   │   │
│   │   │   └── store_dependency.py
│   │   │       # Kiểm tra cửa hàng tồn tại
│   │   │
│   │   ├── utils/
│   │   │
│   │   │   ├── datetime_util.py
│   │   │   │   # Format ngày giờ
│   │   │   │
│   │   │   ├── string_util.py
│   │   │   │   # Xử lý chuỗi
│   │   │   │
│   │   │   ├── pagination_util.py
│   │   │   │   # Pagination
│   │   │   │
│   │   │   └── estimate_wait_util.py
│   │   │       # Tính thời gian chờ
│   │   │
│   │   └── enums/
│   │
│   │       ├── role_enum.py
│   │       │   # ADMIN
│   │       │   # CUSTOMER
│   │       │
│   │       ├── sim_status_enum.py
│   │       │   # AVAILABLE
│   │       │   # SOLD
│   │       │
│   │       └── queue_status_enum.py
│   │           # WAITING
│   │           # PROCESSING
│   │           # DONE
│   │
│   ├── modules/
│   │
│   ├─────────────────────────────
│   │ AUTH MODULE
│   ├─────────────────────────────
│   │
│   │   ├── auth/
│   │   │
│   │   │   ├── controllers/
│   │   │   │
│   │   │   │   └── auth_controller.py
│   │   │   │       # Login
│   │   │   │       # Logout
│   │   │   │       # Refresh Token
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   ├── auth_service.py
│   │   │   │   │   # Business login
│   │   │   │   │
│   │   │   │   └── token_service.py
│   │   │   │       # Access token
│   │   │   │       # Refresh token
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │
│   │   │   │   └── auth_repository.py
│   │   │   │       # Query users
│   │   │   │
│   │   │   ├── schemas/
│   │   │   │
│   │   │   │   ├── login_request.py
│   │   │   │   └── login_response.py
│   │   │   │
│   │   │   └── routes.py
│   │   │       # /api/auth/*
│   │
│   ├─────────────────────────────
│   │ SIM MODULE
│   ├─────────────────────────────
│   │
│   │   ├── sim/
│   │   │
│   │   │   ├── controllers/
│   │   │   │
│   │   │   │   └── sim_controller.py
│   │   │   │       # CRUD Sim
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   └── sim_service.py
│   │   │   │       # Logic sim đẹp
│   │   │   │       # Filter sim
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │
│   │   │   │   └── sim_repository.py
│   │   │   │       # Query bảng sims
│   │   │   │
│   │   │   ├── schemas/
│   │   │   │
│   │   │   │   ├── create_sim.py
│   │   │   │   ├── update_sim.py
│   │   │   │   └── sim_response.py
│   │   │   │
│   │   │   └── routes.py
│   │   │       # /api/sims/*
│   │
│   ├─────────────────────────────
│   │ PACKAGE MODULE
│   ├─────────────────────────────
│   │
│   │   ├── package/
│   │   │
│   │   │   ├── controllers/
│   │   │   │
│   │   │   │   └── package_controller.py
│   │   │   │       # CRUD gói cước
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   └── package_service.py
│   │   │   │       # Logic tìm gói cước
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │
│   │   │   │   └── package_repository.py
│   │   │   │       # Query packages
│   │   │   │
│   │   │   └── routes.py
│   │
│   ├─────────────────────────────
│   │ STORE MODULE
│   ├─────────────────────────────
│   │
│   │   ├── store/
│   │   │
│   │   │   ├── controllers/
│   │   │   │
│   │   │   │   └── store_controller.py
│   │   │   │       # CRUD cửa hàng
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   └── store_service.py
│   │   │   │       # Quản lý chi nhánh
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │
│   │   │   │   └── store_repository.py
│   │   │   │       # Query stores
│   │   │   │
│   │   │   └── routes.py
│   │
│   ├─────────────────────────────
│   │ QUEUE MODULE
│   ├─────────────────────────────
│   │
│   │   ├── queue/
│   │   │
│   │   │   ├── controllers/
│   │   │   │
│   │   │   │   └── queue_controller.py
│   │   │   │       # Đăng ký số thứ tự
│   │   │   │       # Hủy số thứ tự
│   │   │   │       # Check trạng thái
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   ├── queue_service.py
│   │   │   │   │   # Sinh STT tự động
│   │   │   │   │
│   │   │   │   └── estimate_service.py
│   │   │   │       # Ước tính thời gian chờ
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │
│   │   │   │   └── queue_repository.py
│   │   │   │       # Query queue
│   │   │   │
│   │   │   └── routes.py
│   │
│   ├─────────────────────────────
│   │ CHATBOT MODULE
│   ├─────────────────────────────
│   │
│   │   ├── chatbot/
│   │   │
│   │   │   ├── controllers/
│   │   │   │
│   │   │   │   └── chatbot_controller.py
│   │   │   │       # API chat
│   │   │   │
│   │   │   ├── services/
│   │   │   │
│   │   │   │   ├── chatbot_service.py
│   │   │   │   │   # Điều phối AI
│   │   │   │   │
│   │   │   │   ├── package_ai_service.py
│   │   │   │   │   # Tư vấn gói cước
│   │   │   │   │
│   │   │   │   └── sim_ai_service.py
│   │   │   │       # Tư vấn sim đẹp
│   │   │   │
│   │   │   ├── prompts/
│   │   │   │
│   │   │   │   ├── package_prompt.txt
│   │   │   │   └── sim_prompt.txt
│   │   │   │
│   │   │   ├── vector_store/
│   │   │   │
│   │   │   │   └── knowledge.json
│   │   │   │       # Dữ liệu train AI
│   │   │   │
│   │   │   └── routes.py
│   │
│   ├─────────────────────────────
│   │ ORDER MODULE (PHASE 3)
│   ├─────────────────────────────
│   │
│   │   ├── order/
│   │   │
│   │   │   ├── controllers/
│   │   │   │   # Mua sim online
│   │   │   │
│   │   │   ├── services/
│   │   │   │   # Thanh toán
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   # Query orders
│   │   │   │
│   │   │   └── routes.py
│   │
│   ├─────────────────────────────
│   │ NOTIFICATION MODULE (PHASE 3)
│   ├─────────────────────────────
│   │
│   │   ├── notification/
│   │   │
│   │   │   ├── websocket_service.py
│   │   │   │   # Push realtime
│   │   │   │
│   │   │   ├── fcm_service.py
│   │   │   │   # Gửi thông báo điện thoại
│   │   │   │
│   │   │   └── email_service.py
│   │   │       # Email xác nhận
│
├── ai_data/
│   │
│   ├── viettel_packages.json
│   │   # Toàn bộ gói cước
│   │
│   ├── viettel_sims.json
│   │   # Danh sách sim
│   │
│   ├── faq.json
│   │   # Hỏi đáp thường gặp
│   │
│   └── train.py
│       # Build dữ liệu AI
│
├── uploads/
│   │
│   ├── sims/
│   │   # Ảnh sim
│   │
│   ├── stores/
│   │   # Ảnh cửa hàng
│   │
│   └── avatars/
│       # Avatar admin
│
├── tests/
│   # Unit Test
│
├── requirements.txt
├── .env
└── README.md

-----------------------------------------------
Admin

Quản lý nhân viên
Quản lý khách hàng
CRUD gói cước
CRUD chi nhánh
Theo dõi hàng đợi
Dashboard thống kê

Staff

Check-in khách đến quầy
Gọi số thứ tự
Hoàn thành giao dịch
Quản lý booking
Xem thông tin khách hàng

Customer

Đăng ký
Đăng nhập
Xem gói cước
Chat với AI
Đặt lịch giao dịch
Xem số thứ tự
Xem thời gian dự kiến

-----------------------------------------------

Phase 1
Login Admin
CRUD Sim
CRUD Gói cước
CRUD Cửa hàng
Đăng ký số thứ tự
Ước tính thời gian chờ
Phase 2
AI Chatbot
Tìm kiếm gói cước
Tư vấn sim
Phase 3
Mua sim online
Thông báo khi gần tới lượt
Tích hợp dữ liệu thật từ Viettel (nếu được cấp)