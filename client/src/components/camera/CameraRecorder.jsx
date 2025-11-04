import StartButton from "./StartButton";
import VideoPreview from "./VideoPreview";
import RecordingControls from "./RecordingControls";
import RecordedVideo from "./RecordedVideo";
import useMediaRecorder from "../../hooks/useMediaRecorder";

function CameraRecorder() {
  const {
    isRecording,
    isPaused,
    recordedUrl,
    videoRef,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
  } = useMediaRecorder();

  return (
    <div className="text-center p-5">
      <h1 className="text-3xl font-bold mb-2">Camera Recorder</h1>

      {!isRecording && !recordedUrl && (
        <StartButton onStart={startRecording} />
      )}

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
          onRecordAgain={resetRecording}
        />
      )}
    </div>
  );
}

export default CameraRecorder;
