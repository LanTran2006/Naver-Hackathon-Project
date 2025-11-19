# Context
Filename: task-file-name.md
Created: 2025-11-19 00:00
Author: GPT-5.1 Codex
Protocol: RIPER-5 + Multi-Dim + Agent + AI-Dev Guide

# Task Description
Tích hợp Gemini REST vào frontend để chuẩn hoá tin nhắn người dùng và tóm tắt hội thoại theo checklist yêu cầu.

# Project Overview
Ứng dụng Vite React gồm trang chính `MainAppPage` và các component chat. Chưa có dịch vụ Gemini; Summarize hiện dùng placeholder.

---
Sections below are maintained by AI during execution.
---

# Analysis (Research)
- Đọc cấu trúc dự án, xác định chưa có `client/services` (cần thêm). `ChatColumn` hiện gửi thẳng input; `MainAppPage` có summarize giả lập.
- Chưa tìm thấy thư mục `docs`. `VITE_GEMINI_API_KEY` sẽ lấy từ `import.meta.env`.

# Proposed Solutions (Innovation)
## Plan A:
- Principle: Gọi Gemini trực tiếp từ frontend qua fetch với khóa Vite.
- Steps: Tạo helper REST, cập nhật ChatColumn và MainAppPage.
- Risks: Lộ khóa ở client, cần timeout/lỗi chuẩn.

## Plan B:
- Principle: Dùng backend proxy Python để giữ khóa.
- Steps: Viết endpoint server, frontend gọi nội bộ.
- Risks: Phạm vi lớn hơn, cần triển khai backend.

## Recommended Plan
Chọn Plan A để đáp ứng yêu cầu “cung cấp VITE_GEMINI_API_KEY là chạy” và giữ phạm vi frontend.

# Implementation Plan (Planning)
Implementation Checklist:
1. Tạo `task-file-name.md` (hiện tại).
2. Viết `client/services/gemini.ts` với `callGemini`, `normalizeUserPrompt`, `summarizeConversation`.
3. Cập nhật `client/components/main/ChatColumn.tsx` tích hợp normalize + trạng thái lỗi/loading.
4. Cập nhật `client/pages/MainAppPage.tsx` gọi summarize, quản lý lỗi.
5. Kiểm thử UI, cập nhật hướng dẫn `.env`.

# Current Step
Executing: "Hoàn tất điều chỉnh Understand & schema"

# Task Progress
* 2025-11-19 00:00
  * Step: 1
  * Changes: Tạo file ghi chú nhiệm vụ và kế hoạch.
  * Summary: Hoàn tất tài liệu nền tảng.
  * Reason: Tuân thủ yêu cầu tài liệu tiến trình.
  * Blockers: None
  * Status: completed
* 2025-11-19 00:10
  * Step: 2
  * Changes: Thêm `client/services/gemini.ts` với `callGemini`, `normalizeUserPrompt`, `summarizeConversation`.
  * Summary: Hoàn thành dịch vụ Gemini với prompt chuẩn JSON và xử lý timeout.
  * Reason: Cần helper dùng chung cho ChatColumn và Summarize.
  * Blockers: None
  * Status: completed
* 2025-11-19 00:20
  * Step: 3
  * Changes: Cập nhật `ChatColumn` gọi `normalizeUserPrompt`, thêm loading & thông báo lỗi.
  * Summary: Khi người dùng gửi tin sẽ chờ Gemini chuẩn hoá trước khi thêm message.
  * Reason: Đảm bảo nội dung Friend luôn sạch và có feedback lỗi.
  * Blockers: None
  * Status: completed
* 2025-11-19 00:30
  * Step: 4
  * Changes: Thay placeholder summarize bằng `summarizeConversation`, thêm thông báo lỗi.
  * Summary: Summarize dùng Gemini thật và trả Markdown đẹp.
  * Reason: Thực thi yêu cầu tích hợp Gemini cho phần tổng kết.
  * Blockers: None
  * Status: completed
* 2025-11-19 00:40
  * Step: 5
  * Changes: Cập nhật `client/README.md` với biến `VITE_GEMINI_API_KEY`, ghi chú tính năng Gemini và checklist test thủ công.
  * Summary: Hướng dẫn rõ cách cấu hình và các ca test cần chạy với khóa thật.
  * Reason: Đảm bảo người dùng thêm key là chạy được như yêu cầu.
  * Blockers: Chưa có khóa Gemini để tự kiểm thử trực tiếp.
  * Status: completed
* 2025-11-19 00:50
  * Step: 6
  * Changes: Sửa `vite.config.ts` để inject `__APP_GEMINI_API_KEY__`, cập nhật service Gemini + `vite-env.d.ts` và README, hỗ trợ đọc khóa từ `.env` (GEMINI_API_KEY) lẫn `VITE_GEMINI_API_KEY`.
  * Summary: Frontend nay tự nhận khóa từ `.env` như yêu cầu, không báo thiếu cấu hình.
  * Reason: Người dùng chỉ tạo `.env` với `GEMINI_API_KEY`.
  * Blockers: None
  * Status: completed
* 2025-11-19 01:10
  * Step: 7
  * Changes: Bỏ `additionalProperties` trong schema Gemini, chuyển logic chuẩn hoá sang nút Understand, trả ChatColumn về gửi raw, cập nhật README mô tả đúng hành vi.
  * Summary: Chỉ Summarize & Understand dùng Gemini; lỗi 400 biến mất.
  * Reason: Yêu cầu người dùng: Chat bên phải gửi thường, Understand mới paraphrase.
  * Blockers: None
  * Status: completed

# Final Review
(chưa hoàn tất)

