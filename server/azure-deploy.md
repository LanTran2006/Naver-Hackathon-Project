# Hướng Dẫn Deploy Backend lên Azure

## Phương Pháp 1: Azure Container Apps (Khuyến nghị)

Azure Container Apps là cách đơn giản nhất để deploy Docker container lên Azure.

### Bước 1: Build và Push Docker Image lên Azure Container Registry

```bash
# 1. Đăng nhập Azure
az login

# 2. Tạo Resource Group (nếu chưa có)
az group create --name naver-hackathon-rg --location eastus

# 3. Tạo Azure Container Registry
az acr create --resource-group naver-hackathon-rg --name naverhackathonacr --sku Basic

# 4. Đăng nhập vào ACR
az acr login --name naverhackathonacr

# 5. Build và push image
cd server
az acr build --registry naverhackathonacr --image sign-language-api:latest .
```

### Bước 2: Tạo Azure Container App

```bash
# 1. Tạo Container Apps Environment
az containerapp env create \
  --name naver-hackathon-env \
  --resource-group naver-hackathon-rg \
  --location eastus

# 2. Tạo Container App
az containerapp create \
  --name sign-language-api \
  --resource-group naver-hackathon-rg \
  --environment naver-hackathon-env \
  --image naverhackathonacr.azurecr.io/sign-language-api:latest \
  --target-port 8000 \
  --ingress external \
  --registry-server naverhackathonacr.azurecr.io \
  --cpu 2.0 \
  --memory 4.0Gi \
  --min-replicas 1 \
  --max-replicas 3
```

### Bước 3: Lấy URL của API

```bash
az containerapp show \
  --name sign-language-api \
  --resource-group naver-hackathon-rg \
  --query properties.configuration.ingress.fqdn \
  --output tsv
```

---

## Phương Pháp 2: Azure App Service với Docker

### Bước 1: Build và Push Image

```bash
# Build image
cd server
docker build -t sign-language-api:latest .

# Tag image cho Azure Container Registry
docker tag sign-language-api:latest naverhackathonacr.azurecr.io/sign-language-api:latest

# Push image
docker push naverhackathonacr.azurecr.io/sign-language-api:latest
```

### Bước 2: Tạo App Service Plan và Web App

```bash
# Tạo App Service Plan (Linux, B1 tier - đủ cho ML model)
az appservice plan create \
  --name naver-hackathon-plan \
  --resource-group naver-hackathon-rg \
  --is-linux \
  --sku B1

# Tạo Web App với Docker
az webapp create \
  --resource-group naver-hackathon-rg \
  --plan naver-hackathon-plan \
  --name naver-sign-language-api \
  --deployment-container-image-name naverhackathonacr.azurecr.io/sign-language-api:latest
```

### Bước 3: Cấu hình App Settings

```bash
# Cấu hình CORS (nếu cần)
az webapp config appsettings set \
  --resource-group naver-hackathon-rg \
  --name naver-sign-language-api \
  --settings WEBSITES_PORT=8000

# Bật Always On (quan trọng cho ML model)
az webapp config set \
  --resource-group naver-hackathon-rg \
  --name naver-sign-language-api \
  --always-on true
```

---

## Phương Pháp 3: Azure Container Instances (ACI) - Đơn giản nhất

```bash
# Tạo Container Instance
az container create \
  --resource-group naver-hackathon-rg \
  --name sign-language-api \
  --image naverhackathonacr.azurecr.io/sign-language-api:latest \
  --cpu 2 \
  --memory 4 \
  --ports 8000 \
  --ip-address Public \
  --registry-login-server naverhackathonacr.azurecr.io \
  --registry-username <acr-username> \
  --registry-password <acr-password>
```

---

## Test Local Docker Image

Trước khi deploy, test local:

```bash
# Build image
cd server
docker build -t sign-language-api:latest .

# Run container
docker run -p 8000:8000 sign-language-api:latest

# Test API
curl http://localhost:8000/
```

---

## Lưu Ý Quan Trọng

1. **Memory & CPU**: ML model cần nhiều RAM (ít nhất 4GB) và CPU (2 cores)
2. **Cold Start**: Lần đầu load model sẽ mất thời gian (30-60 giây)
3. **CORS**: Cập nhật `allow_origins` trong `main.py` với domain frontend của bạn
4. **Cost**: 
   - Container Apps: ~$50-100/tháng
   - App Service B1: ~$13/tháng (nhưng có thể không đủ RAM)
   - Container Instances: Pay-per-use

---

## Cập Nhật Code

Sau khi sửa code, rebuild và redeploy:

```bash
# Build và push image mới
az acr build --registry naverhackathonacr --image sign-language-api:latest .

# Restart container app
az containerapp update \
  --name sign-language-api \
  --resource-group naver-hackathon-rg \
  --image naverhackathonacr.azurecr.io/sign-language-api:latest
```

---

## Troubleshooting

### Xem logs
```bash
# Container Apps
az containerapp logs show --name sign-language-api --resource-group naver-hackathon-rg

# App Service
az webapp log tail --name naver-sign-language-api --resource-group naver-hackathon-rg
```

### Kiểm tra health
```bash
curl https://<your-app-url>/
```

