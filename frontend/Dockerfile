# Build stage
FROM oven/bun:latest as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the application with --no-verify flag to ignore type checking
RUN CI=false bun run build

# Production stage
FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lock ./

# Copy built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"] 