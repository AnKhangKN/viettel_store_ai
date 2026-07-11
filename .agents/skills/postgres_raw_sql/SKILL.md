---
name: postgres_raw_sql
description: Write safe, high-performance asyncpg raw SQL queries for PostgreSQL in the repository layer.
---

# PostgreSQL Raw SQL Guidelines

Kỹ năng này hướng dẫn lập trình các truy vấn PostgreSQL thuần thông qua thư viện `asyncpg` một cách an toàn và tối ưu trong tầng Repository.

## 1. Các phương thức truy vấn chính
Sử dụng `get_pool()` từ `app.core.database` để lấy kết nối và thực thi:

- `fetchrow(sql, *args)`: Trả về một dòng (Record) duy nhất hoặc `None`. Phù hợp cho việc tìm theo khóa chính, ID, Email.
  ```python
  row = await get_pool().fetchrow("SELECT id, name FROM users WHERE id = $1", user_id)
  ```
- `fetch(sql, *args)`: Trả về danh sách các dòng (List[Record]). Dùng cho truy vấn lấy nhiều bản ghi.
  ```python
  rows = await get_pool().fetch("SELECT * FROM sims WHERE status = $1", "AVAILABLE")
  ```
- `fetchval(sql, *args)`: Trả về giá trị đầu tiên của dòng đầu tiên. Thích hợp để đếm (COUNT) hoặc kiểm tra tồn tại.
  ```python
  count = await get_pool().fetchval("SELECT COUNT(*) FROM khachhang")
  ```
- `execute(sql, *args)`: Chạy câu lệnh không cần trả về dữ liệu (như UPDATE, DELETE). Trả về chuỗi kết quả của Postgres (ví dụ: `UPDATE 1`).

## 2. Bảo mật chống SQL Injection
- **Luôn luôn** sử dụng tham số hóa bằng `$1, $2, $3...` đại diện cho các giá trị động truyền vào.
- **Không bao giờ** cộng chuỗi SQL hoặc dùng f-string với các biến đầu vào từ client.
- Ví dụ SAI:
  ```python
  # NGUY HIỂM! Dễ bị SQL Injection
  sql = f"SELECT * FROM users WHERE email = '{email}'"
  ```
- Ví dụ ĐÚNG:
  ```python
  sql = "SELECT * FROM users WHERE email = $1"
  row = await get_pool().fetchrow(sql, email)
  ```

## 3. Quản lý Transactions (Giao dịch)
Khi cần thực hiện nhiều câu lệnh INSERT/UPDATE có tính phụ thuộc lẫn nhau, hãy sử dụng transaction để đảm bảo tính toàn vẹn (ACID):
```python
from app.core.database import get_pool

async def create_order_with_items(order_body, items):
    pool = get_pool()
    async with pool.acquire() as conn:
        async with conn.transaction():
            # 1. Thêm order
            order_sql = "INSERT INTO orders(customer_id) VALUES($1) RETURNING id"
            order_id = await conn.fetchval(order_sql, order_body.customer_id)
            
            # 2. Thêm chi tiết items
            item_sql = "INSERT INTO order_items(order_id, sim_id) VALUES($1, $2)"
            for item in items:
                await conn.execute(item_sql, order_id, item.sim_id)
```

## 4. Danh sách các bảng chính trong Cơ sở dữ liệu (Database Catalog)
Hãy đối chiếu các tên bảng sau khi truy vấn:
- `users`: Tài khoản quản trị, nhân viên (`id_khach_hang`, `name`, `email`, `password`, `role`).
- `khachhang`: Tài khoản khách hàng (`id`, `name`, `phone`, `email`, `password`).
- `sims`: Danh sách sim số (`id`, `so_sim`, `price`, `status`, `loai_sim`).
- `packages`: Các gói cước dịch vụ di động (`id`, `ten_goi`, `gia_tien`, `data_limit`, `thoi_han`).
- `stores`: Danh sách cửa hàng/chi nhánh Viettel (`id`, `ten_cua_hang`, `dia_chi`, `so_dien_thoai`).
- `queue`: Hàng đợi lấy số thứ tự (`id`, `customer_id`, `store_id`, `so_thu_tu`, `status`, `created_at`).
