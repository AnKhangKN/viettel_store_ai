from fastapi import WebSocket

class ConnectionManager:

    def __init__(self):
        # Quản lý danh sách kết nối hoạt động theo tên phòng: dict[str, list[WebSocket]]
        # key: "queue:{id_chi_nhanh}", "chat:{id_phien}"...
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = []
        self.active_connections[room].append(websocket)
        print(f"WebSocket connected to room: {room}. Current connections: {len(self.active_connections[room])}")

    def disconnect(self, websocket: WebSocket, room: str):
        if room in self.active_connections:
            if websocket in self.active_connections[room]:
                self.active_connections[room].remove(websocket)
                print(f"WebSocket disconnected from room: {room}. Remaining: {len(self.active_connections[room])}")
            if not self.active_connections[room]:
                del self.active_connections[room]

    async def broadcast(self, room: str, message: dict):
        if room in self.active_connections:
            targets = self.active_connections[room]
            print(f"Broadcasting to room {room} ({len(targets)} connections)...")
            for connection in targets:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Error sending websocket message to room {room}: {e}")
                    # Dọn dẹp kết nối lỗi
                    self.disconnect(connection, room)

# Khởi tạo một websocket_manager toàn cục dùng chung cho toàn bộ dự án
websocket_manager = ConnectionManager()
