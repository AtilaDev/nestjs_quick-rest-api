# Quick REST API - User Management

A RESTful API built with NestJS for managing user data with complete CRUD operations.

## Features

- 👥 User Management
- 📝 Swagger Documentation
- 🔍 Email-based User Lookup
- ⚡ Fast Response Times
- 🎯 Input Validation
- 💾 Database Integration with Prisma

## API Endpoints

### Users

| Method | Endpoint        | Description              | Query Params / Body                           |
| ------ | --------------- | ------------------------ | --------------------------------------------- |
| GET    | `/users`        | Get all users            | `limit` (optional): Number of users to return |
| GET    | `/users/:email` | Get user by email        | -                                             |
| POST   | `/users`        | Create new user          | `CreateUserDto` (email, username required)    |
| DELETE | `/users/all`    | Delete all users         | -                                             |
| DELETE | `/users/:email` | Delete user by email     | -                                             |
| PATCH  | `/users`        | Update username for user | `email`, `username` (query params)            |

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Database (compatible with Prisma)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies

```bash
pnpm install
```

3. Initialize prisma

```bash
npx prisma init
```

3. Apply migrations

```bash
npx prisma migrate dev --name init
```

4. Create Prisma Client

```bash
npx prisma generate
```
