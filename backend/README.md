# Backend - Course Platform API

A Spring Boot REST API for the course platform.

## Tech Stack

- **Framework**: Spring Boot
- **Language**: Java
- **Database**: PostgreSQL
- **Build Tool**: Gradle

## Getting Started

### Prerequisites

- Java 21 or higher
- PostgreSQL (or use Docker)

### Setup Database

1. Create a PostgreSQL database
2. Update `src/main/resources/application.properties` with your database settings

### Run the Application

```bash
./gradlew bootRun
```

The API will be available at http://localhost:8080

### Build

```bash
./gradlew build
```

The JAR file will be in `build/libs/`

## API Endpoints

- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get course by ID
- `GET /api/courses/featured` - Get featured courses

## Project Structure

```
backend/
├── src/main/java/com/example/demo/
│   ├── controllers/    # REST controllers
│   ├── models/         # Database entities
│   ├── services/       # Business logic
│   ├── repositories/   # Data access
│   └── responses/      # DTOs
└── src/main/resources/
    └── application.properties
```

## Data Initialization

Course data is initialized using SQL scripts. This is a better practice than hardcoding data in Java.

### How It Works

1. **SQL Script**: `src/main/resources/data.sql`
   - Contains all course, chapter, and video data
   - Runs automatically when the app starts
   - Clears old data and inserts fresh data

2. **Configuration**: `src/main/resources/application.properties`
   - `spring.sql.init.mode=always` - Enable SQL script execution
   - `spring.sql.init.data-locations=classpath:data.sql` - Specify the SQL file
   - `spring.jpa.defer-datasource-initialization=true` - Run SQL after schema creation

### Update Course Data

To update course data:

1. Edit `src/main/resources/data.sql`
2. Add or modify SQL INSERT statements
3. Restart the application
4. Data will be reloaded automatically

### Workflow

```bash
# 1. Edit the SQL file
vim src/main/resources/data.sql

# 2. Restart the backend
./gradlew bootRun

# 3. Data is automatically loaded from data.sql
```

### Benefits

- ✅ Data separated from code
- ✅ Easy to version control
- ✅ Easy to update and maintain
- ✅ Better for BDD/SDD practices
- ✅ Standard Spring Boot approach

## Testing

Run unit tests:

```bash
./gradlew test
```

### Test Coverage

Unit tests are available for:
- **CourseService** - Business logic tests
- **CourseController** - REST API tests
- **CourseMapper** - Data mapping tests

All tests use Mockito for mocking dependencies.

## Configuration

Edit `src/main/resources/application.properties` to change:
- Database connection
- Server port
- Other settings
