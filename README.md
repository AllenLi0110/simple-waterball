# Simple Waterball

A course platform project with frontend and backend.

## What is this?

This is a web app for showing courses. Students can:
- See a list of courses
- Click a course to see details
- Watch videos in each course

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
