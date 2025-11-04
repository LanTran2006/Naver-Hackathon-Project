function VideoPreview({ videoRef, isRecording }) {
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={`w-full max-w-[640px] rounded-lg mb-5 mx-auto ${
        !isRecording ? "h-0" : ""
      }`}
    />
  );
}

export default VideoPreview;
