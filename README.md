# SeaPharm Backend API

A secure pharmacy management system with user authentication, medication CRUD, and sales tracking. 

## Features

- JWT Authentication
- Role-based access (`user`, `admin`)
- Medication inventory management
- Sales recording with stock deduction
- Sales reports (daily, monthly, grouped)
- UUID primary keys
- Sequelize ORM + MySQL

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT
- bcryptjs

---

## API Endpoint

# Auth

Method -> Endpoint   
POST ->   /api/users/register - Register user
POST ->  /api/users/login - Login
GET ->  /api/users/profile - Get profile (auth)

# Medications

Method -> Endpoint -> Access
POST ->  /api/medications -> Admin
GET ->  /api/medications -> User+
GET ->  /api/medications/search?q=asp -> User+
GET ->  /api/medications/:id -> User+
PUT ->  /api/medications/:id -> Admin
DELETE ->  /api/medications/:id -> Admin

# Sales
Method -> Endpoint -> Access
POST -> /api/sales -> Admin
GET -> /api/sales -> Admin
GET -> /api/sales/report?startDate=...&endDate=... -> Admin
GET -> /api/sales/grouped?groupBy=month -> Admin