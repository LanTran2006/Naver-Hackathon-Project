import { useState, useRef, useEffect } from "react";

export default function useMediaRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPrepared, setIsPrepared] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  let [stream, setStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const videoRef = useRef(null);
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      mediaRecorderRef.current?.stop();
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
    };
  }, [stream, recordedUrl]);
  const prepareRecording = async () => {
    try {
      const str = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = str;
      setIsPrepared(true);
      setStream(str);
    } catch (error) {
      console.log(error);
    }
  };
  const startRecording = async () => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      setVideoBlob(blob)
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
    mediaRecorder.start();
    setIsRecording(true);
    setIsPaused(false);
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      if (videoRef.current) {
        videoRef.current.play();
      }
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setIsPrepared(false);
    }
  };

  const resetRecording = async () => {
    setRecordedUrl(null);
    setVideoBlob(null);
    chunksRef.current = [];
    prepareRecording();
  };

  return {
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
  };
}
