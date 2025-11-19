<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1xrVKmOi8lfV4xrpVs3Mu6BZKkJoMFxpX

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Tạo file `.env` (hoặc `.env.local`) và đặt biến:
   ```
   # Ưu tiên tên có prefix VITE_
   VITE_GEMINI_API_KEY=your_api_key_here
   # Nếu đang dùng tên cũ, VITE_GEMINI_API_KEY vẫn được tự động nhận
   ```
3. Run the app:
   `npm run dev`

## Gemini Features

- Nút **Understand this for me** (tab Text) gọi Gemini để gợi ý câu trả lời lịch sự, kết quả xuất hiện ở cột Chat.
- Nút **Summarize** sẽ gửi toàn bộ hội thoại lên Gemini để nhận lại đoạn Markdown tổng kết.
- Nếu khóa API thiếu hoặc lỗi mạng, giao diện hiển thị thông báo thân thiện thay vì treo.
