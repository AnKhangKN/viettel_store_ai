---
name: backend_module_scaffolder
description: Scaffold a new functional backend module in FastAPI following the 4-layer architecture (Router -> Controller -> Service -> Repository).
---

# Scaffold FastAPI Backend Module

Kỹ năng này hướng dẫn thiết lập một module backend mới theo kiến trúc chuẩn 4 tầng của Viettel Store AI.

## Các bước triển khai

### Bước 1: Tạo cấu trúc thư mục
Tạo thư mục con trong `app/modules/<module_name>/`:
```
app/modules/<module_name>/
├── __init__.py
├── <module_name>_routes.py
├── controllers/
│   ├── __init__.py
│   └── <module_name>_controller.py
├── services/
│   ├── __init__.py
│   └── <module_name>_service.py
├── repositories/
│   ├── __init__.py
│   └── <module_name>_repository.py
└── schemas/
    ├── __init__.py
    ├── <action>_request.py
    └── <action>_response.py
```

### Bước 2: Viết tầng Repository (`repositories/<module_name>_repository.py`)
Tầng này chỉ chứa raw SQL và tương tác trực tiếp với cơ sở dữ liệu qua `asyncpg`.

**Template:**
```python
from app.core.database import get_pool
from app.modules.<module_name>.schemas.<action>_request import <Action>Request

class <ClassName>Repository:
    async def get_all(self):
        sql = """
            SELECT id, name, status, created_at
            FROM <table_name>
            ORDER BY created_at DESC
        """
        return await get_pool().fetch(sql)

    async def get_by_id(self, item_id: int):
        sql = "SELECT id, name, status FROM <table_name> WHERE id = $1"
        return await get_pool().fetchrow(sql, item_id)

    async def create(self, body: <Action>Request):
        sql = """
            INSERT INTO <table_name> (name, status)
            VALUES ($1, $2)
            RETURNING id
        """
        return await get_pool().fetchrow(sql, body.name, body.status)
```

### Bước 3: Viết tầng Service (`services/<module_name>_service.py`)
Tầng này chứa business logic, xử lý các kiểm tra ràng buộc trước khi ghi hoặc đọc dữ liệu. Ném ra `AppException` nếu có lỗi nghiệp vụ.

**Template:**
```python
from fastapi import status
from app.core.exceptions import AppException
from app.modules.<module_name>.repositories.<module_name>_repository import <ClassName>Repository
from app.modules.<module_name>.schemas.<action>_request import <Action>Request

class <ClassName>Service:
    def __init__(self):
        self.repository = <ClassName>Repository()

    async def get_details(self, item_id: int):
        item = await self.repository.get_by_id(item_id)
        if not item:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Mục yêu cầu không tồn tại"
            )
        return item

    async def add_new(self, body: <Action>Request):
        # Business logic validation here
        new_item = await self.repository.create(body)
        return {"success": True, "id": new_item["id"]}
```

### Bước 4: Viết tầng Controller (`controllers/<module_name>_controller.py`)
Tầng Controller thực hiện nhận Request, gọi Service và trả ra kết quả.

**Template:**
```python
from app.modules.<module_name>.services.<module_name>_service import <ClassName>Service
from app.modules.<module_name>.schemas.<action>_request import <Action>Request

class <ClassName>Controller:
    def __init__(self):
        self.service = <ClassName>Service()

    async def get_item(self, item_id: int):
        return await self.service.get_details(item_id)

    async def create_item(self, body: <Action>Request):
        return await self.service.add_new(body)
```

### Bước 5: Định nghĩa Routes (`<module_name>_routes.py`)
Tạo Router để đăng ký các endpoints, map tới các phương thức của controller.

**Template:**
```python
from fastapi import APIRouter
from app.modules.<module_name>.controllers.<module_name>_controller import <ClassName>Controller

class <ClassName>Routes:
    def __init__(self):
        self.router = APIRouter(
            prefix="/<plural_name>",
            tags=["<Tag>"]
        )
        controller = <ClassName>Controller()
        
        self.router.get("/{item_id}")(controller.get_item)
        self.router.post("/")(controller.create_item)
```

### Bước 6: Đăng ký router chung (`app/routers.py`)
Import và include router mới vào `api_router` trong `app/routers.py`:
```python
from app.modules.<module_name>.<module_name>_routes import <ClassName>Routes
# ...
api_router.include_router(<ClassName>Routes().router)
```
