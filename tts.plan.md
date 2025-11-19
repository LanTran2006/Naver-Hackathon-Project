# Context
Filename: tts.plan.md
Created: 2025-11-19 10:15
Author: GPT-5.1 Codex
Protocol: RIPER-5 + Multi-Dim + Agent + AI-Dev Guide

# Task Description
Thay thế TTS/STT backend bằng Web Speech API trên frontend: có popover bật/tắt tự động đọc phản hồi AI tiếng Việt, và mic voice input chuyển thành text cho phía Friend. Chỉ đọc tin mới bên trái, không ảnh hưởng message cũ.

# Project Overview
Ứng dụng React/Vite gồm cột Input (Video/File/Text) và Conversation (Friend vs User AI). Hiện ChatColumn mô phỏng mic và chưa có điều khiển đọc tự động.

---
Sections below are maintained by AI during execution.
---

# Analysis (Research)
- Đã rà `ChatColumn.tsx`, `TextInput.tsx`, `InputColumn.tsx`, `types.ts` để hiểu cách lưu trữ message và UI align.
- Chưa có hook Web Speech hay component điều khiển, mic hiện chỉ mô phỏng `setTimeout`.
- README chưa nhắc đến yêu cầu trình duyệt hỗ trợ Web Speech.

# Proposed Solutions (Innovation)
## Plan A:
- Principle: Dùng Web Speech API trực tiếp (SpeechSynthesis + SpeechRecognition) trên FE.
- Steps: Tạo hooks quản lý lifecycle, thêm SpeechControls popover để bật/tắt đọc, cập nhật ChatColumn nhận dạng giọng nói & đọc AI message mới.
- Risks: Khả năng tương thích kém trên Safari hoặc môi trường không HTTPS; cần fallback rõ ràng.

## Plan B:
- Principle: Gói dịch vụ STT/TTS của bên thứ ba (ví dụ ApyHub) nhưng vẫn gọi từ FE bằng khóa user cung cấp.
- Steps: Thêm service gọi REST STT/TTS, upload audio blob, phát audio trả về.
- Risks: Tăng độ trễ, yêu cầu backend giữ khóa để tránh lộ, trái với mong muốn “dễ cấu hình FE”.

## Recommended Plan
Chọn Plan A vì phù hợp yêu cầu dùng Web Speech, không cần thêm backend, trải nghiệm realtime tốt.

# Implementation Plan (Planning)
Implementation Checklist:
1. Tạo hook `client/hooks/useSpeechSynthesis.ts` quản lý speak/stop tiếng Việt, voice list, trạng thái hỗ trợ.
2. Tạo hook `client/hooks/useSpeechRecognition.ts` quấn SpeechRecognition/webkitSpeechRecognition, trả trạng thái, transcript, lỗi.
3. Xây `client/components/main/SpeechControls.tsx` (popover toggle on/off đọc tự động, hiển thị hỗ trợ).
4. Cập nhật `client/components/main/ChatColumn.tsx` tích hợp hooks: đọc message AI mới, mic chuyển voice->text, hiển thị cảnh báo khi không hỗ trợ.
5. Điều chỉnh `client/vite-env.d.ts` khai báo typings bổ sung cho SpeechRecognition/webkitSpeechRecognition.
6. Bổ sung README mô tả tính năng Web Speech + hướng dẫn testing & hạn chế trình duyệt.

# Current Step
Executing: "Step 6 – Viết README & chuẩn bị kiểm thử"

# Task Progress
* 2025-11-19 10:15
  * Step: 1
  * Changes: Lập `tts.plan.md` với thông tin nhiệm vụ, checklist chi tiết.
  * Summary: Hoàn tất tài liệu kiểm soát công việc Web Speech.
  * Reason: Đảm bảo tuân thủ template RIPER-5 trước khi code.
  * Blockers: None
  * Status: completed
* 2025-11-19 10:25
  * Step: 2
  * Changes: Thêm `useSpeechSynthesis` hook để đọc tiếng Việt, xử lý danh sách voice và cleanup.
  * Summary: Hoàn thành nền tảng TTS thuần FE, chuẩn bị cho tự động đọc.
  * Reason: Checklist yêu cầu hook riêng cho speak/stop.
  * Blockers: None
  * Status: completed
* 2025-11-19 10:32
  * Step: 3
  * Changes: Tạo `useSpeechRecognition` hook bao `SpeechRecognition`/`webkitSpeechRecognition`, trả transcript + lỗi.
  * Summary: Bổ sung khả năng voice-to-text chuẩn hoá, xử lý quyền micro.
  * Reason: Đảm bảo nút voice hoạt động thực tế thay vì mock.
  * Blockers: None
  * Status: completed
* 2025-11-19 10:40
  * Step: 4
  * Changes: Xây `SpeechControls` popover với nút bật/tắt, cảnh báo hỗ trợ và trạng thái đang đọc.
  * Summary: Người dùng có UI rõ ràng để điều khiển đọc tự động.
  * Reason: Đáp ứng yêu cầu "nút pop up on/off".
  * Blockers: None
  * Status: completed
* 2025-11-19 10:55
  * Step: 5
  * Changes: Cập nhật `ChatColumn.tsx` tích hợp hai hook, chỉ đọc AI mới, mic voice-to-text, hiển thị lỗi.
  * Summary: UX hội thoại nay hỗ trợ nghe/đọc như yêu cầu, không đọc tin cũ.
  * Reason: Checklist yêu cầu thay logic UI chính.
  * Blockers: None
  * Status: completed
* 2025-11-19 11:05
  * Step: 6
  * Changes: Bổ sung typings Web Speech trong `vite-env.d.ts` và cập nhật README mô tả tính năng & giới hạn.
  * Summary: Hoàn tất phần tài liệu + typings để build không lỗi và người dùng biết cách thử nghiệm.
  * Reason: Checklist các bước 5-6 (typings + README).
  * Blockers: None
  * Status: completed

# Final Review
(chưa hoàn tất)

