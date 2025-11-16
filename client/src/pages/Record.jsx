import { Link } from "react-router-dom";
import CameraRecorder from "../components/camera/CameraRecorder";
import { useState } from "react";

function Record() {
  // State để giữ file .mp4 (hoặc .webm) người dùng chọn
  const [uploadedFile, setUploadedFile] = useState(null);

  // State loading và kết quả DÀNH RIÊNG cho việc upload
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadTranslation, setUploadTranslation] = useState("");

  /**
   * Cập nhật state khi người dùng chọn file
   */
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  /**
   * Hàm gọi API, GẦN GIỐNG hệt hàm trong CameraRecorder
   */
  const handleTranslateUpload = async () => {
    if (!uploadedFile) {
      alert("Bạn chưa chọn file!");
      return;
    }

    setUploadLoading(true);
    setUploadTranslation("Đang dịch file upload...");

    const formData = new FormData();
    // 'file' -> Phải khớp tên ở backend
    // `uploadedFile.name` -> Lấy tên file gốc
    formData.append("file", uploadedFile, uploadedFile.name);

    console.log("Đang gửi file upload đến backend...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/predict`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Đã nhận kết quả (từ file upload):", data);

      if (data.translation) {
        setUploadTranslation(`Kết quả (File): ${data.translation}`);
      } else if (data.error) {
        setUploadTranslation(`Lỗi (File): ${data.error}`);
      }
    } catch (error) {
      console.error("Lỗi kết nối server (File):", error);
      setUploadTranslation("Lỗi: Không thể kết nối tới backend.");
    } finally {
      setUploadLoading(false);
    }
  };
  return (
    <div>
      <div className="p-4">
        <Link
          to="/"
          className="inline-block bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm rounded no-underline"
        >
          ← Back to Home
        </Link>
      </div>
      <CameraRecorder />

      <hr className="my-8" />

      <div className="text-center p-5 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Hoặc: Test bằng cách Tải file lên
        </h2>
        <p className="mb-4">
          (Dùng file .mp4 từ YouTube hoặc điện thoại để kiểm tra độ chính xác
          của model)
        </p>

        {/* Input để chọn file */}
        <input
          type="file"
          accept="video/mp4, video/webm, video/mov"
          onChange={handleFileChange}
          className="mb-4"
        />

        {/* Nút Dịch file */}
        <button
          onClick={handleTranslateUpload}
          disabled={uploadLoading || !uploadedFile}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-sm rounded cursor-pointer m-1.5 disabled:bg-blue-300"
        >
          {uploadLoading ? "Đang xử lý file..." : "Dịch từ File"}
        </button>

        {/* Kết quả của việc upload */}
        <div className="mt-5">
          {uploadTranslation && (
            <h3 className="text-2xl font-bold text-blue-700">
              {uploadTranslation}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default Record;
