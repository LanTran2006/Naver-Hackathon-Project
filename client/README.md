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

   # ApyHub dùng riêng cho Summarize
   VITE_APYHUB_API_KEY=your_apyhub_key
   # Có thể dùng tên APYHUB_API_KEY nhưng khuyến nghị giữ prefix VITE_
   ```
3. Run the app:
   `npm run dev`

## AI Features
- Nút **Understand this for me** (tab Text) gọi Gemini để gợi ý câu trả lời lịch sự, kết quả xuất hiện ở cột Chat.
- Nút **Summarize** dùng API [ApyHub AI Summarize](https://apyhub.com/utility/ai-summarize) để tổng kết hội thoại và trả văn bản tiếng Việt thuần.
- Nếu khóa API thiếu hoặc lỗi mạng, giao diện hiển thị thông báo thân thiện thay vì treo.

## Web Speech Voice UX
- Popover **Giọng đọc AI** (ở đầu cột Conversation) dùng Web Speech API để đọc to các phản hồi mới của AI (bên trái). Chỉ các tin mới sau khi bật mới được đọc.
- Nút mic ở khung nhập Friend nay dùng SpeechRecognition: khi bật, bạn nói tiếng Việt và hệ thống tự điền text. Nhấn lại để dừng.
- Tính năng chỉ hoạt động trên trình duyệt hỗ trợ Web Speech (Chrome/Edge desktop, Chrome Android). Safari & iOS hiện chưa hỗ trợ nên UI sẽ khóa nút.
- Khi gặp lỗi quyền micro (not-allowed), cần cấp lại quyền trong phần cài đặt trình duyệt rồi thử lại.