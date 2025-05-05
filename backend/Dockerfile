# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set pip configuration for better reliability
ENV PIP_DEFAULT_TIMEOUT=1000 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

# Copy requirements file
COPY requirements.txt .

# Install dependencies in stages to handle timeouts better
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir --timeout 1000 tensorflow
RUN pip install --no-cache-dir --timeout 1000 numpy pillow opencv-python-headless
RUN pip install --no-cache-dir --timeout 1000 fastapi "uvicorn[standard]" python-multipart
    

# Copy source code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PATH="/usr/local/bin:$PATH"

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"] 