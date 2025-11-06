import StartButton from "./StartButton";
import VideoPreview from "./VideoPreview";
import RecordingControls from "./RecordingControls";
import RecordedVideo from "./RecordedVideo";
import useMediaRecorder from "../../hooks/useMediaRecorder";
import { useState } from "react";

function CameraRecorder() {
  const {
    isRecording,
    isPaused,
    recordedUrl,
    videoRef,
    videoBlob,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
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
      <h1 className="text-3xl font-bold mb-2">Camera Recorder</h1>

      {!isRecording && !recordedUrl && <StartButton onStart={startRecording} />}

      <div>
        <VideoPreview videoRef={videoRef} isRecording={isRecording} />
        {isRecording && (
          <RecordingControls
            isPaused={isPaused}
            onPause={pauseRecording}
            onResume={resumeRecording}
            onStop={stopRecording}
          />
        )}
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
        {isLoading && <p className="text-lg text-blue-600">Processing...</p>}
        {translation && (
          <h3 className="text-2xl font-bold text-green-700">{translation}</h3>
        )}
      </div>
    </div>
  );
}

export default CameraRecorder;
