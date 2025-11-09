#!/bin/bash
# Script khởi động cho Azure
# Đọc PORT từ environment variable (Azure sẽ set PORT)
PORT=${PORT:-8000}

# Chạy uvicorn với host 0.0.0.0 để Azure có thể truy cập
uvicorn app.main:app --host 0.0.0.0 --port $PORT

