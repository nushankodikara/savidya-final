# -- Backend Build Stage -- #
FROM python:3.9-slim as backend-builder

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set pip configuration
ENV PIP_DEFAULT_TIMEOUT=1000 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir "uvicorn[standard]"

# Copy backend source code
COPY backend/ .

# -- Frontend Build Stage -- #
FROM oven/bun:latest as frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
COPY frontend/bun.lock ./

# Install dependencies
RUN bun install

# Copy frontend source code
COPY frontend/ .

# Build the frontend
RUN CI=false bun run build

# -- Final Stage -- #
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for backend
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend files from backend-builder
COPY --from=backend-builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=backend-builder /app/backend /app/backend

# Copy frontend files from frontend-builder
COPY --from=frontend-builder /app/frontend/.next /app/frontend/.next
COPY --from=frontend-builder /app/frontend/public /app/frontend/public
COPY --from=frontend-builder /app/frontend/package.json /app/frontend/
COPY --from=frontend-builder /app/frontend/node_modules /app/frontend/node_modules

# Install Node.js for running the frontend
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PATH="/usr/local/bin:$PATH"
ENV PORT=8080

# Copy the startup script
COPY start.sh /app/
RUN chmod +x /app/start.sh

# Expose port
EXPOSE 8080

# Start both services
CMD ["/app/start.sh"] 