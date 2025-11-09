import StartButton from "./StartButton";
import VideoPreview from "./VideoPreview";
import RecordingControls from "./RecordingControls";
import RecordedVideo from "./RecordedVideo";
import useMediaRecorder from "../../hooks/useMediaRecorder";
import { useState } from "react";
import CameraPermissionCard from "./CameraPermissionCard";

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
      prepareRecording
    } = useMediaRecorder();

  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!videoBlob) {
      alert("Cannot find video blob!");
      return;
    }

    setIsLoading(true);
    setTranslation("");

    //1. tao formdata
    const formData = new FormData();
    formData.append("file", videoBlob, "recorded_video,webm");

    console.log("sending to be");

    try {
      //2. gui req => be
      const response = await fetch(
        "http://localhost:8000/translate-sign-language/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Received data", data);

      //3. hien thi ket qua
      if (data.translation) {
        setTranslation(`Result: ${data.translation}`);
      } else if (data.error) {
        setTranslation(`Error from be: ${data.error}`);
      }
    } catch (error) {
      console.error("Fail to connect to server", error);
      setTranslation("Cannot connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    resetRecording();
    setTranslation("");
  };

  return (
    <div className="text-center p-5">
      <h1 className="text-3xl font-bold mb-5">Ghi hình Camera</h1>
      <CameraPermissionCard isPrepared={isPrepared} prepareRecording={prepareRecording} ref={videoRef}/>
      
      <div className="flex justify-center gap-2 mt-3 items-center">
        {!isRecording && (
          <StartButton onStart={startRecording} disabled={!isPrepared}/>
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
          className="bg-green-100 hover:bg-green-500 px-8 py-4 text-base rounded-full cursor-pointer m-2.5"
        >
          Ghi âm thanh
        </button>
      </div>
     
      {recordedUrl && (
        <RecordedVideo
          recordedUrl={recordedUrl}
          onRecordAgain={handleReset}
          onTranslate={handleTranslate}
          isLoading={isLoading}
        />
      )}

      <div className="mt-5">
        {isLoading && <p className="text-lg text-blue-600">Đang xử lý...</p>}
        {translation && (
          <h3 className="text-2xl font-bold text-green-700">{translation}</h3>
        )}
      </div>
    </div>
  );
}

export default CameraRecorder;
