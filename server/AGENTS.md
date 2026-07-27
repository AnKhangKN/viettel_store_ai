# Project Rules

Architecture

Router
↓
Controller
↓
Service
↓
Repository

Repository:
- SQL only

Service:
- Business logic only

Controller:
- Validate request
- Return response

Database:
- PostgreSQL

Never use ORM.

Use async.

Phone number rule:
- Số điện thoại phải duy nhất trên toàn hệ thống
- Không được trùng trong PostgreSQL database
- Không được trùng với dữ liệu trong `data-cskh.xlsx`
- Áp dụng cho mọi thao tác thêm/cập nhật liên quan tới số điện thoại

Read only files related to the task.