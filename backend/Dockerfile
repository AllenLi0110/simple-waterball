# --- Stage 1: Build ---
  FROM gradle:8.7-jdk21-alpine AS builder
  WORKDIR /app
  
  # Copy build files
  COPY build.gradle settings.gradle ./
  # Copy Gradle Wrapper
  COPY gradlew ./
  COPY gradle/ ./gradle
  
  # Copy application source code
  COPY src ./src
  
  # Grant execution permission to gradlew
  RUN chmod +x ./gradlew
  
  # Build Spring Boot application (generates JAR file)
  # This step is fast due to Gradle caching
  RUN ./gradlew clean bootJar
  
  
  # --- Stage 2: Runtime (Final Image) ---
  # Use lightweight Eclipse Temurin JDK 21 JRE
  FROM eclipse-temurin:21-jre-alpine
  WORKDIR /app
  
  # Copy the generated JAR file from the builder stage
  # JAR file is typically at /app/build/libs/
  # Copy the built JAR and rename it to app.jar
  COPY --from=builder /app/build/libs/*.jar app.jar
  
  # Set timezone (Optional, but recommended)
  ENV TZ Asia/Taipei
  
  # Expose Spring Boot's default port 8080
  EXPOSE 8080
  
  # Set startup command
  # Use -D.../urandom for faster startup time
  ENTRYPOINT ["java", "-jar", "app.jar"]