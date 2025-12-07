# Simple Waterball

A course platform project with frontend and backend.

## What is this?

This is a web app for showing courses. Students can:
- See a list of courses
- Click a course to see details
- Watch videos in each course

## Demo

![Simple Waterball Demo](./frontend/public/gifs/simple-waterball-allen-release.gif)

## Tech Stack

- **Frontend**: Next.js (React, TypeScript)
- **Backend**: Spring Boot (Java)
- **Database**: PostgreSQL

## Quick Start

### Using Docker (Easy Way)

```bash
docker-compose up
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:8080
- Database on localhost:5432

### Manual Setup

1. **Start Backend**
   ```bash
   cd backend
   ./gradlew bootRun
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open Browser**
   - Go to http://localhost:3000

## User Authentication

This project includes a simple authentication system with registration, login, and logout functionality.

### Access Authentication Pages

- **Login Page**: http://localhost:3000/login
- **Register Page**: http://localhost:3000/register

### Registration Flow

1. Navigate to the register page (`/register`)
2. Fill in the form:
   - **名字** (Name): Your display name
   - **帳號** (Username): Your unique username
   - **密碼** (Password): Your password
3. Click **註冊** (Register) button
4. Upon successful registration, you'll be redirected to the login page

### Login Flow

1. Navigate to the login page (`/login`)
2. Enter your credentials:
   - **帳號** (Username): The username you registered with
   - **密碼** (Password): Your password
3. Click **登入** (Login) button
4. Upon successful login, you'll be redirected to the home page
5. Your login status will be displayed in the header

### Logout

- Click the **登出** (Logout) button in the header
- You'll be redirected back to the login page

### Features

- ✅ Simple registration with name, username, and password
- ✅ Secure login with username and password
- ✅ Session persistence (stored in localStorage)
- ✅ Error handling for duplicate usernames and invalid credentials
- ✅ Clean, independent authentication pages with brand logo

## Project Structure

```
simple-waterball/
├── frontend/                    # Next.js app
│   ├── app/                     # Pages and routes
│   ├── components/              # React components
│   ├── tests/                   # E2E and BDD tests
│   └── specs/                   # BDD feature files
├── backend/                     # Spring Boot app
│   ├── src/main/java/          # Java source code
│   └── src/main/resources/     # Config and data.sql
└── docker-compose.yml          # Docker setup
```

## Data Initialization

Course data is initialized using SQL scripts (best practice):

- **Location**: `backend/src/main/resources/data.sql`
- **How it works**: Spring Boot runs this SQL file on startup
- **Benefits**: Data separated from code, easy to update

### Update Course Data

1. Edit `backend/src/main/resources/data.sql`
2. Add or modify SQL INSERT statements
3. Restart the backend: `cd backend && ./gradlew bootRun`
4. Data will be reloaded automatically

This approach is better than hardcoding data in Java code.

## Testing

- **Unit Tests**: `cd frontend && npm run test`
- **E2E Tests**: `cd frontend && npm run test:e2e`
- **BDD Tests**: `cd frontend && npm run test:bdd`

## Learn More

- Frontend docs: See `frontend/README.md`
- Backend docs: See `backend/README.md`
- Testing docs: See `README-TESTING.md`
