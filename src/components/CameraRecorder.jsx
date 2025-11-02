import { useState, useRef, useEffect } from "react";

const CameraRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Khởi tạo camera khi component mount
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch (error) {
        console.error("Lỗi khi truy cập camera:", error);
        alert(
          "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera và microphone."
        );
      }
    };

    initCamera();

    // Cleanup function - dọn dẹp khi component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Bắt đầu quay video
  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      alert("Camera chưa sẵn sàng!");
      return;
    }

    chunksRef.current = [];

    const mediaRecorder = new MediaRecorder(videoRef.current.srcObject, {
      mimeType: "video/webm;codecs=vp9",
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  // Tạm dừng quay video
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsRecording(false);
      setIsPaused(true);
    }
  };

  // Tiếp tục quay video
  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsRecording(true);
      setIsPaused(false);
    }
  };

  // Kết thúc hoàn toàn
  const finishRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  // Gửi video (chưa có chức năng)
  const sendVideo = () => {
    alert("Chức năng gửi video sẽ được phát triển sau!");
    // TODO: Implement upload video logic here
  };

  // Quay video mới
  const recordNewVideo = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedVideoUrl(null);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Phần 1: Camera View - Chiếm 75% màn hình */}
      <div className="h-[75%] flex items-center justify-center bg-gray-900 relative p-6">
        {/* Loading State */}
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
              <div className="text-white text-xl font-semibold">
                Đang khởi động camera...
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Vui lòng cho phép truy cập camera
              </p>
            </div>
          </div>
        )}

        {/* Video Container với viền bo tròn và căn giữa */}
        <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`
              rounded-xl shadow-2xl object-contain max-w-full max-h-full
              transition-all duration-300
              ${isRecording ? "ring-4 ring-red-500" : ""}
            `}
          />

          {/* Status Indicator - Góc trên phải của khu vực Camera */}
          <div className="absolute top-4 right-4 z-20">
            {isRecording && (
              <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full shadow-xl animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-white font-semibold text-sm uppercase tracking-wider">
                  Recording
                </span>
              </div>
            )}
            {isPaused && (
              <div className="flex items-center gap-2 bg-yellow-600 px-4 py-2 rounded-full shadow-xl">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-white font-semibold text-sm uppercase tracking-wider">
                  Paused
                </span>
              </div>
            )}
            {!isRecording && !isPaused && cameraReady && !recordedVideoUrl && (
              <div className="flex items-center gap-2 bg-green-600/90 px-4 py-2 rounded-full shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-white font-medium text-sm">Ready</span>
              </div>
            )}
          </div>

          {/* Preview Video đã quay - Full Overlay */}
          {recordedVideoUrl && (
            <div className="absolute inset-0 bg-gray-900 z-30 flex items-center justify-center rounded-xl">
              <div className="w-full h-full flex flex-col">
                <div className="bg-gray-800 py-3 px-4 border-b border-gray-700">
                  <h3 className="text-white text-lg font-bold text-center">
                    Xem Lại Video
                  </h3>
                </div>
                <video
                  src={recordedVideoUrl}
                  controls
                  className="flex-1 w-full h-full object-contain bg-black"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Phần 2: Control Panel - Chiếm 25% màn hình */}
      <div className="h-[25%] bg-gray-800 flex justify-center items-center border-t border-gray-700">
        <div className="flex items-center justify-center gap-6">
          {/* Trạng thái: Chưa quay hoặc chưa có video */}
          {!recordedVideoUrl && !isPaused && (
            <>
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={!cameraReady}
                  className={`
                    w-20 h-20 rounded-full 
                    flex items-center justify-center
                    transition-all duration-300 transform
                    ${
                      cameraReady
                        ? "bg-gray-600 hover:bg-gray-500 hover:scale-110 active:scale-95 shadow-xl hover:shadow-2xl"
                        : "bg-gray-700 cursor-not-allowed opacity-50"
                    }
                  `}
                  title="Bắt đầu quay"
                >
                  <div className="w-6 h-6 rounded-full bg-red-500"></div>
                </button>
              ) : (
                <button
                  onClick={pauseRecording}
                  className="
                    w-20 h-20 rounded-full bg-red-600
                    flex items-center justify-center
                    transition-all duration-300 transform
                    hover:bg-red-700 hover:scale-110 active:scale-95
                    shadow-xl animate-pulse
                  "
                  title="Tạm dừng"
                >
                  <div className="flex gap-1">
                    <div className="w-2 h-6 bg-white rounded-sm"></div>
                    <div className="w-2 h-6 bg-white rounded-sm"></div>
                  </div>
                </button>
              )}
            </>
          )}

          {/* Trạng thái: Đang tạm dừng - hiển thị 2 nút */}
          {isPaused && (
            <div className="flex items-center gap-6">
              <button
                onClick={resumeRecording}
                className="
                  px-8 py-4 rounded-xl
                  bg-yellow-600 hover:bg-yellow-700
                  text-white font-semibold
                  flex items-center gap-3
                  transition-all duration-300 transform
                  hover:scale-105 active:scale-95
                  shadow-lg hover:shadow-xl
                "
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Quay Tiếp</span>
              </button>

              <button
                onClick={finishRecording}
                className="
                  px-8 py-4 rounded-xl
                  bg-red-600 hover:bg-red-700
                  text-white font-semibold
                  flex items-center gap-3
                  transition-all duration-300 transform
                  hover:scale-105 active:scale-95
                  shadow-lg hover:shadow-xl
                "
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Kết Thúc</span>
              </button>
            </div>
          )}

          {/* Trạng thái: Đã có video - hiển thị nút Gửi và Quay Lại */}
          {recordedVideoUrl && (
            <div className="flex items-center gap-6">
              <button
                onClick={sendVideo}
                className="
                  px-8 py-4 rounded-xl
                  bg-green-600 hover:bg-green-700
                  text-white font-semibold
                  flex items-center gap-3
                  transition-all duration-300 transform
                  hover:scale-105 active:scale-95
                  shadow-lg hover:shadow-xl
                "
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <span>Gửi</span>
              </button>

              <button
                onClick={recordNewVideo}
                className="
                  px-8 py-4 rounded-xl
                  bg-gray-600 hover:bg-gray-700
                  text-white font-semibold
                  flex items-center gap-3
                  transition-all duration-300 transform
                  hover:scale-105 active:scale-95
                  shadow-lg hover:shadow-xl
                "
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Quay Lại</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraRecorder;
