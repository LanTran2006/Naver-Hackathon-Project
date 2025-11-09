# Sử dụng Python 3.10 official image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies cho OpenCV và MediaPipe
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Expose port 8000
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Copy start script
COPY start.sh .
RUN chmod +x start.sh

# Run uvicorn với host 0.0.0.0 để Azure có thể truy cập
# Sử dụng PORT từ environment variable (Azure sẽ set)
CMD ["./start.sh"]

