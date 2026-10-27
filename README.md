# Course API – Express.js + Modular MVC

REST API with Authentication, Category CRUD and Course CRUD.
Stack: Express 4, MongoDB (Mongoose), JWT, bcryptjs.

## Folder structure

```
server.js               # entry point (connects DB, starts server)
src/
  app.js                # express app, routes, 404 + error middleware
  config/db.js          # MongoDB connection
  models/               # M  – User, Category, Course schemas
  controllers/          # C  – business logic
  routes/               # V/R – URL -> controller mapping
  middleware/           # auth (JWT), notFound (404), errorHandler
  utils/                # asyncHandler, AppError
```

## Setup

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# edit .env if needed (MONGO_URI, JWT_SECRET)
npm start                 # or: npm run dev
```

MongoDB: install MongoDB Community locally (default URI works) **or** create a free
MongoDB Atlas cluster and paste its connection string into `MONGO_URI`.

## Endpoints

| Method | URL                      | Auth | Description               |
|--------|--------------------------|------|---------------------------|
| POST   | /api/auth/register       | no   | Register (name, email, password) |
| POST   | /api/auth/login          | no   | Login, returns JWT `token` |
| GET    | /api/auth/me             | yes  | Current user              |
| POST   | /api/categories          | yes  | Create category (name, description) |
| GET    | /api/categories          | no   | List categories           |
| GET    | /api/categories/:id      | no   | Get one                   |
| PUT    | /api/categories/:id      | yes  | Update                    |
| DELETE | /api/categories/:id      | yes  | Delete (blocked if it has courses) |
| POST   | /api/courses             | yes  | Create course (title, description, price, category, duration?) |
| GET    | /api/courses             | no   | List (optional `?category=<id>`) |
| GET    | /api/courses/:id         | no   | Get one                   |
| PUT    | /api/courses/:id         | yes  | Update                    |
| DELETE | /api/courses/:id         | yes  | Delete                    |

Protected routes need the header `Authorization: Bearer <token>`.

## Status codes used

200 OK · 201 Created · 400 Bad Request (missing/invalid field, duplicate) ·
401 Unauthorized · 404 Not Found (unknown URL or invalid/unknown ID)

## Postman evidence – how to capture the 5 screenshots

Use a Postman **Environment** or just paste the token manually.

1. **Register & Login** (Screenshot 1 – take one for each, or put both on one page)
   - `POST http://localhost:5000/api/auth/register`, Body → raw → JSON:
     `{ "name": "Your Name", "email": "you@example.com", "password": "123456" }` → **201**
   - `POST http://localhost:5000/api/auth/login`, Body:
     `{ "email": "you@example.com", "password": "123456" }` → **200**, copy the `token`.
2. **POST /api/categories → 201** (Screenshot 2)
   - Headers: `Authorization: Bearer <token>` and `Content-Type: application/json`
   - Body: `{ "name": "Web Development", "description": "Frontend and backend courses" }`
3. **GET /api/categories → 200** (Screenshot 3)
4. **400 validation error** (Screenshot 4)
   - `POST /api/categories` with the token and body `{ "description": "no name" }` → **400**
5. **404 error** (Screenshot 5)
   - `GET http://localhost:5000/api/categories/64b7f0f0f0f0f0f0f0f0f0f0` (unknown id) **or**
     `GET http://localhost:5000/api/unknown` → **404**

Make sure each screenshot shows the method + URL, the Headers tab, and the response
status + body. Write your Name and Roll No. at the top of each printed page.
