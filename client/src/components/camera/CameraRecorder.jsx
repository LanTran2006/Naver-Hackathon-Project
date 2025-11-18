import StartButton from "./StartButton";
import VideoPreview from "./VideoPreview";
import RecordingControls from "./RecordingControls";
import RecordedVideo from "./RecordedVideo";
import useMediaRecorder from "../../hooks/useMediaRecorder";
import { useState } from "react";
import CameraPermissionCard from "./CameraPermissionCard";
import { splitVideoIntoSegments } from "../../utils/videoSplitter";

function CameraRecorder() {
  const {
    isRecording,
    isPaused,
    isPrepared,
    recordedUrl,
    videoRef,
    videoBlob,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    prepareRecording,
  } = useMediaRecorder();

  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [translatedWords, setTranslatedWords] = useState([]);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [totalSegments, setTotalSegments] = useState(0);

  const handleTranslate = async () => {
    if (!videoBlob) {
      alert("Cannot find video blob!");
      return;
    }

    setIsLoading(true);
    setTranslation("");

    //1. tao formdata
    const formData = new FormData();
    formData.append("file", videoBlob, "recorded_video.webm");

    console.log("sending to be");

    try {
      //2. gui req => be
      const response = await fetch(
         `${import.meta.env.VITE_API_URL}/predict`,
        {
          method: "POST",
          body: formData,
        }
      );
    setTranslatedWords([]);
    setCurrentSegment(0);
    setTotalSegments(0);

    try {
      console.log("Đang cắt video thành các đoạn 3 giây...");

      // 1. Cắt video thành các đoạn 3 giây
      const segments = await splitVideoIntoSegments(videoBlob, 3);
      setTotalSegments(segments.length);
      console.log(`Đã cắt thành ${segments.length} đoạn`);

      const words = [];

      // 2. Gửi từng đoạn lên backend
      for (let i = 0; i < segments.length; i++) {
        setCurrentSegment(i + 1);
        console.log(`Đang xử lý đoạn ${i + 1}/${segments.length}...`);

        const formData = new FormData();
        formData.append("file", segments[i], `segment_${i}.webm`);

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/predict`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();
          console.log(`Kết quả đoạn ${i + 1}:`, data);

          if (data.label) {
            words.push(data.label);
            setTranslatedWords([...words]); // Cập nhật UI ngay lập tức
          } else if (data.error) {
            console.error(`Lỗi đoạn ${i + 1}:`, data.error);
            words.push("[?]"); // Đánh dấu đoạn lỗi
            setTranslatedWords([...words]);
          }
        } catch (error) {
          console.error(`Lỗi kết nối đoạn ${i + 1}:`, error);
          words.push("[?]");
          setTranslatedWords([...words]);
        }

        // Thêm delay nhỏ giữa các request để tránh quá tải server
        if (i < segments.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      // 3. Ghép thành câu hoàn chỉnh
      const finalSentence = words.join(" ");
      setTranslation(finalSentence);
      console.log("Kết quả cuối cùng:", finalSentence);
    } catch (error) {
      console.error("Lỗi khi xử lý video:", error);
      setTranslation(`Lỗi: ${error.message}`);
    } finally {
      setIsLoading(false);
      setCurrentSegment(0);
    }
  };

  const handleReset = () => {
    resetRecording();
    setTranslation("");
    setTranslatedWords([]);
    setCurrentSegment(0);
    setTotalSegments(0);
  };

  return (
    <div className="text-center p-3 md:p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-5">
        Ghi hình Camera
      </h1>
      <CameraPermissionCard
        isPrepared={isPrepared}
        prepareRecording={prepareRecording}
        ref={videoRef}
      />

      <div className="flex flex-row flex-wrap justify-center gap-2 mt-3 items-center">
        {!isRecording && (
          <StartButton onStart={startRecording} disabled={!isPrepared} />
        )}

        {isRecording && (
          <RecordingControls
            isPaused={isPaused}
            onPause={pauseRecording}
            onResume={resumeRecording}
            onStop={stopRecording}
          />
        )}

        <button
          className={`px-4 md:px-8 py-3 md:py-4 text-sm md:text-base rounded-full cursor-pointer transition 'bg-green-100 hover:bg-green-500`}
        >
          🎤 Ghi âm thanh
        </button>
      </div>

      {recordedUrl && (
        <div className="mt-5 px-3">
          <div className="flex flex-col sm:flex-row justify-center gap-2 flex-wrap">
            <button
              onClick={handleReset}
              className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm rounded cursor-pointer w-full sm:w-auto"
            >
              Ghi lại
            </button>
            <a
              href={recordedUrl}
              download="recording.webm"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm rounded cursor-pointer no-underline text-center w-full sm:w-auto"
            >
              Tải xuống
            </a>
            <button
              onClick={handleTranslate}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm rounded cursor-pointer disabled:bg-green-300 w-full sm:w-auto"
            >
              {isLoading ? "Đang dịch..." : "Dịch video"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 px-3">
        {isLoading && (
          <p className="text-base md:text-lg text-blue-600">Đang xử lý...</p>
        )}
        {translation && (
          <h3 className="text-xl md:text-2xl font-bold text-green-700 wrap-break-word">
            {translation}
          </h3>
        )}
      </div>
    </div>
  );
}

export default CameraRecorder;
