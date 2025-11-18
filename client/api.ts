export async function uploadVideoAndGetLabel(file: Blob | File): Promise<string> {
  const formData = new FormData(); // Chuẩn bị dữ liệu upload.
  formData.append('file', file); // FastAPI nhận parameter tên "file".

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // Cho phép override bằng env.

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/translate-sign-language/`, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error('Không thể kết nối backend:', error);
    throw new Error(
      'Không thể kết nối đến máy chủ dịch ký hiệu. Hãy kiểm tra xem backend FastAPI có đang chạy (ví dụ: `uvicorn app.main:app --host 0.0.0.0 --port 8000`) và mạng không bị chặn.'
    );
  }

  if (!response.ok) {
    throw new Error(
      `Máy chủ trả về lỗi ${response.status}. Vui lòng khởi động lại backend rồi thử lại (chi tiết: ${response.statusText}).`
    );
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(`Backend thông báo lỗi: ${data.error}`);
  }

  if (!data.label) {
    throw new Error('Server không trả về nhãn dự đoán hợp lệ.');
  }

  return data.label as string;
}
