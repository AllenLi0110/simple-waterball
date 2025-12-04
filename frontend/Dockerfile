# --- Stage 1: Build ---
  # Use Node 20 Slim as the base image
  FROM node:20-slim AS base
  WORKDIR /app

  # Install necessary tools (e.g., git) - optional
  # RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

  # Copy package configuration files
  COPY package.json package-lock.json ./

  # Install dependencies
  RUN npm install

# --- Stage 2: Build the frontend ---
  FROM base AS builder
  # Copy all frontend source code
  COPY . .

  # Enable Next.js Standalone mode (Crucial for Docker deployment)
  ENV NEXT_PUBLIC_API_URL=http://backend:8080
  ENV NEXT_TELEMETRY_DISABLED 1
  ENV NEXT_PRIVATE_STANDALONE=true 
  # Legacy variable for older Next.js versions:
  # ENV NEXT_STANDALONE=true 

  # Execute the Next.js build command
  RUN npm run build

# --- Stage 3: Runtime environment ---
  # Use a smaller runtime environment
  FROM node:20-slim AS runner
  WORKDIR /app

  # 1. Copy the standalone server code
  COPY --from=builder /app/.next/standalone ./
  # 2. Copy public assets and static build files
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/.next/static ./.next/static
  # 3. Copy production-only node_modules (if needed)
  COPY --from=builder /app/node_modules ./node_modules

  # Set runtime environment variables
  ENV NODE_ENV production
  ENV NEXT_PUBLIC_API_URL=http://backend:8080
  ENV NEXT_PRIVATE_STANDALONE=true

  # Next.js default running port
  EXPOSE 3000

  # Start the Next.js service
  CMD ["node", "server.js"]