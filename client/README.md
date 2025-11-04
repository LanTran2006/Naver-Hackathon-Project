# Naver-Hackathon-Project

## 🚀 Cách Chạy Dự Án

### Yêu Cầu Hệ Thống

- **Node.js**: Phiên bản 14.0 trở lên
- **npm** hoặc **yarn**
- **Trình duyệt**: Chrome, Edge, Firefox (phiên bản mới nhất)
- **Camera & Microphone**: Cần cho phép quyền truy cập

### Bước 1: Clone Dự Án

```bash
git clone https://github.com/LanTran2006/Naver-Hackathon-Project.git
cd Naver-Hackathon-Project
```

### Bước 2: Cài Đặt Dependencies

```bash
npm install
```

hoặc nếu dùng yarn:

```bash
yarn install
```

### Bước 3: Chạy Development Server

```bash
npm run dev
```

hoặc:

```bash
yarn dev
```

### Bước 4: Mở Trình Duyệt

Sau khi chạy lệnh trên, mở trình duyệt và truy cập:

```
http://localhost:5173
```

Hoặc địa chỉ được hiển thị trong terminal.

## 🎬 Hướng Dẫn Sử Dụng

### 1. Bắt Đầu Quay
- Click vào **nút tròn đỏ lớn** ở giữa màn hình
- Cho phép truy cập camera khi trình duyệt yêu cầu
- Màn hình sẽ hiển thị badge **"Recording"** màu đỏ ở góc trên phải

### 2. Tạm Dừng
- Khi đang quay, click vào **nút pause** (2 thanh trắng dọc)
- Badge chuyển sang **"Paused"** màu vàng

### 3. Lựa Chọn Tiếp Theo
**Sau khi tạm dừng, bạn có 2 lựa chọn:**

- **Quay Tiếp** (nút màu vàng): Tiếp tục quay video
- **Kết Thúc** (nút màu đỏ): Dừng hoàn toàn và xem lại video

### 4. Sau Khi Hoàn Thành
**Khi đã kết thúc quay, bạn có thể:**

- **Gửi** (nút xanh lá): Gửi video (chức năng đang phát triển)
- **Quay Lại** (nút xám): Reset và quay video mới

## ⚙️ Tech Stack

- **React** - UI Framework
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **MediaStream API** - Truy cập camera
- **MediaRecorder API** - Ghi video