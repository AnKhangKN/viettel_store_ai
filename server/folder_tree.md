server/
│
├── app.py
│   # Entry point của Flask
│
├── config.py
│   # Cấu hình môi trường, database, JWT,...
│
├── requirements.txt
│
├── .env
├── .env.example
│
├── database/
│   │
│   ├── connection.py
│   │   # Khởi tạo SQLAlchemy
│   │
│   └── migrations/
│       # Flask-Migrate
│
├── common/
│   │
│   ├── constants/
│   │   └── constants.py
│   │       # Hằng số dùng chung
│   │
│   ├── decorators/
│   │   └── auth_decorator.py
│   │       # JWT, phân quyền
│   │
│   ├── exceptions/
│   │   └── custom_exception.py
│   │       # Exception tự định nghĩa
│   │
│   ├── middlewares/
│   │   └── request_logger.py
│   │       # Log request
│   │
│   ├── responses/
│   │   └── response.py
│   │       # Response chuẩn toàn hệ thống
│   │
│   └── utils/
│       ├── datetime_util.py
│       ├── distance_util.py
│       ├── jwt_util.py
│       └── validator_util.py
│
├── modules/
│   │
│   ├── auth/
│   │   │
│   │   ├── controllers/
│   │   │   └── controller.py
│   │   │       # Nhận request đăng nhập
│   │   │
│   │   ├── services/
│   │   │   └── service.py
│   │   │       # Logic login, refresh token
│   │   │
│   │   ├── repositories/
│   │   │   └── repository.py
│   │   │       # Truy vấn bảng users
│   │   │
│   │   ├── models/
│   │   │   └── model.py
│   │   │       # User model
│   │   │
│   │   ├── schemas/
│   │   │   └── schema.py
│   │   │       # Validate login request
│   │   │
│   │   ├── routes/
│   │   │   └── route.py
│   │   │
│   │   └── __init__.py
│   │
│   ├── customer/
│   │   │
│   │   ├── controllers/
│   │   │   └── controller.py
│   │   │       # API tra cứu khách hàng
│   │   │
│   │   ├── services/
│   │   │   └── service.py
│   │   │       # Xử lý nghiệp vụ khách hàng
│   │   │
│   │   ├── repositories/
│   │   │   └── repository.py
│   │   │       # Truy vấn customer
│   │   │
│   │   ├── models/
│   │   │   └── model.py
│   │   │       # Customer model
│   │   │
│   │   ├── schemas/
│   │   │   └── schema.py
│   │   │
│   │   ├── routes/
│   │   │   └── route.py
│   │   │
│   │   └── __init__.py
│   │
│   ├── package/
│   │   │
│   │   ├── controllers/
│   │   │       # Danh sách gói cước
│   │   │
│   │   ├── services/
│   │   │       # Tìm kiếm gói cước
│   │   │
│   │   ├── repositories/
│   │   │       # Query package
│   │   │
│   │   ├── models/
│   │   │       # Package model
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── routes/
│   │   │
│   │   └── __init__.py
│   │
│   ├── branch/
│   │   │
│   │   ├── controllers/
│   │   │       # API cửa hàng Viettel
│   │   │
│   │   ├── services/
│   │   │       # Tìm cửa hàng gần nhất
│   │   │
│   │   ├── repositories/
│   │   │
│   │   ├── models/
│   │   │       # Branch model
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── routes/
│   │   │
│   │   └── __init__.py
│   │
│   ├── queue/
│   │   │
│   │   ├── controllers/
│   │   │       # Đăng ký số thứ tự
│   │   │
│   │   ├── services/
│   │   │       # Tính thời gian chờ
│   │   │
│   │   ├── repositories/
│   │   │       # QueueTicket query
│   │   │
│   │   ├── models/
│   │   │       # QueueTicket model
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── routes/
│   │   │
│   │   └── __init__.py
│   │
│   ├── ai_chat/
│   │   │
│   │   ├── controllers/
│   │   │       # API chatbot
│   │   │
│   │   ├── services/
│   │   │       # Gọi OpenAI/LangChain
│   │   │
│   │   ├── repositories/
│   │   │       # Lưu lịch sử chat
│   │   │
│   │   ├── models/
│   │   │       # ChatHistory
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── routes/
│   │   │
│   │   └── __init__.py
│   │
│   ├── sim/
│   │   │
│   │   ├── controllers/
│   │   │       # API mua sim
│   │   │
│   │   ├── services/
│   │   │       # Nghiệp vụ đặt sim
│   │   │
│   │   ├── repositories/
│   │   │
│   │   ├── models/
│   │   │       # Sim model
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── routes/
│   │   │
│   │   └── __init__.py
│   │
│   └── dashboard/
│       │
│       ├── controllers/
│       │       # API cho admin
│       │
│       ├── services/
│       │       # Thống kê
│       │
│       ├── repositories/
│       │
│       ├── models/
│       │
│       ├── schemas/
│       │
│       ├── routes/
│       │
│       └── __init__.py
│
└── tests/
    │
    ├── auth/
    ├── customer/
    ├── package/
    ├── queue/
    └── ai_chat/