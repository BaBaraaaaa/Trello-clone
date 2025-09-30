# Trello Clone - Backend API

Đây là RESTful API cho ứng dụng Trello Clone, xây dựng bằng Node.js, Express và MongoDB (Mongoose). Cung cấp các endpoint để quản lý authentication, boards, columns và cards.

## 🔧 Cài đặt

1. Clone repo và vào thư mục backend:
   ```bash
   git clone <repo_url>
   cd Trello-clone/backend
   ```
2. Cài dependencies:
   ```bash
   npm install
   ```
3. Tạo file `.env` trong `backend/` với nội dung:
   ```properties
   MONGO_URI=<connection_string>
   JWT_SECRET=<secret_key>
   PORT=5001
   CORS_ORIGIN=http://localhost:3000
   ```
4. Khởi động server:
   ```bash
   npm run dev
   ```
   - Server chạy trên `http://localhost:<PORT>` (mặc định 5001).

## 📦 Công nghệ

- Node.js & Express
- TypeScript
- MongoDB với Mongoose
- JWT authentication
- Swagger UI (`/api-docs`) để tự động tạo API documentation
- CORS cấu hình cho frontend tại `CORS_ORIGIN`

## 🚀 Endpoints

### Authentication

| Method | URL               | Mô tả                     |
|--------|-------------------|---------------------------|
| POST   | `/api/auth/register` | Đăng ký tài khoản mới    |
| POST   | `/api/auth/login`    | Đăng nhập, nhận JWT token |
| POST   | `/api/auth/logout`   | Thu hồi refresh token và đăng xuất |
| POST   | `/api/auth/refresh`  | Cấp lại access token mới   |
| GET    | `/api/auth/me`       | Lấy thông tin người dùng hiện tại |

### Boards

> **Yêu cầu** header `Authorization: Bearer <token>`

| Method | URL                | Mô tả                       |
|--------|--------------------|-----------------------------|
| GET    | `/api/boards`      | Lấy danh sách boards của user  |
| GET    | `/api/boards/:id`  | Lấy thông tin board theo ID   |
| POST   | `/api/boards`      | Tạo board mới                 |
| PUT    | `/api/boards/:id`  | Cập nhật board                |
| DELETE | `/api/boards/:id`  | Xóa board                     |

### Columns

> **Yêu cầu** header `Authorization: Bearer <token>`

| Method | URL                       | Mô tả                        |
|--------|---------------------------|------------------------------|
| GET    | `/api/columns/board/:boardId` | Lấy cột theo board ID      |
| POST   | `/api/columns`            | Tạo column                  |
| PUT    | `/api/columns/:id`        | Cập nhật column             |
| DELETE | `/api/columns/:id`        | Xóa column                  |

### Cards

> **Yêu cầu** header `Authorization: Bearer <token>`

| Method | URL                          | Mô tả                       |
|--------|------------------------------|-----------------------------|
| GET    | `/api/cards/column/:columnId` | Lấy cards theo column ID   |
| POST   | `/api/cards`                | Tạo card mới                |
| PUT    | `/api/cards/:id`            | Cập nhật card               |
| DELETE | `/api/cards/:id`            | Xóa card                    |

## 💡 Additional Endpoints and Future Features

### 1. Authentication Enhancements
- **POST /api/auth/logout**  
  Thu hồi refresh token (nếu sử dụng cơ chế refresh).
- **POST /api/auth/refresh**  
  Cấp lại access token khi token cũ hết hạn.
- **GET /api/auth/me**  
  Lấy thông tin người dùng hiện tại từ JWT, dùng để hiển thị profile.

### 2. Boards Extensions
- **PATCH /api/boards/:id/star**  
  Đánh dấu hoặc bỏ đánh dấu "starred" cho board.
- **POST /api/boards/:id/members**  
  Thêm thành viên vào board (ví dụ theo email).
- **DELETE /api/boards/:id/members/:memberId**  
  Xóa thành viên khỏi board.

### 3. Columns Extensions
- **PATCH /api/columns/:id/order**  
  Thay đổi vị trí của một column (khi drag & drop).
- **PATCH /api/columns/reorder**  
  Cập nhật thứ tự nhiều columns cùng lúc.

### 4. Cards Extensions
- **PATCH /api/cards/:id/move**  
  Di chuyển card sang column khác.
- **PATCH /api/cards/reorder**  
  Thay đổi thứ tự nhiều cards trong cùng column.
- **POST /api/cards/:id/members**  
  Gán thành viên cho card.
- **DELETE /api/cards/:id/members/:memberId**  
  Bỏ gán thành viên khỏi card.
- Các tính năng bổ sung: label, due date, checklist, attachment API.

## 📑 API Documentation

Mở swagger UI:  
```
http://localhost:<PORT>/api-docs
```  
Hoặc raw JSON spec:  
```
http://localhost:<PORT>/api-docs.json
```

## 🧪 Testing

Sử dụng Jest và Supertest để chạy integration tests:
```bash
npm test
```

## 🔑 Bảo mật

- Mọi endpoint boards/columns/cards đều yêu cầu JWT trong header `Authorization`.
- Token được tạo sau khi đăng nhập hoặc đăng ký và có thời gian sống (expiresIn) 1h.

---

Chúc bạn lập trình vui vẻ! 🎉