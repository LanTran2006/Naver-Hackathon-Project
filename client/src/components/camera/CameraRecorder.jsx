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
         `${import.meta.env.VITE_API_URL}/predict`,
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
    <div className="text-center p-3 md:p-5">
      <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-5">Ghi hình Camera</h1>
      <CameraPermissionCard 
        isPrepared={isPrepared} 
        prepareRecording={prepareRecording} 
        ref={videoRef}
      />
      
      <div className="flex flex-row flex-wrap justify-center gap-2 mt-3 items-center">
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
         
          className={`px-4 md:px-8 py-3 md:py-4 text-sm md:text-base rounded-full cursor-pointer transition 'bg-green-100 hover:bg-green-500`}
        >
          🎤 Ghi âm thanh
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

      <div className="mt-5 px-3">
        {isLoading && <p className="text-base md:text-lg text-blue-600">Đang xử lý...</p>}
        {translation && (
          <h3 className="text-xl md:text-2xl font-bold text-green-700 wrap-break-word">{translation}</h3>
        )}
      </div>
    </div>
  );
}

export default CameraRecorder;
