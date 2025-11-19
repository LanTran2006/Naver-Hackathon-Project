import { useState, useCallback, useRef } from 'react';
import type Webcam from 'react-webcam';
import { RecordingStatus } from '../types';

interface WebcamRecorderOptions {
  webcamRef: React.RefObject<Webcam>;
  countdownSeconds?: number;
  recordingSeconds?: number;
}

export const useWebcamRecorder = ({
  webcamRef,
  countdownSeconds = 2,
  recordingSeconds = 3,
}: WebcamRecorderOptions) => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const recordedChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const countdownIntervalRef = useRef<number | undefined>(undefined);
  const recordingTimeoutRef = useRef<number | undefined>(undefined);
  const fallbackStreamRef = useRef<MediaStream | null>(null);

  const clearCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = undefined;
    }
  }, []);

  const clearRecordingTimeout = useCallback(() => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = undefined;
    }
  }, []);

  const stopFallbackStream = useCallback(() => {
    if (fallbackStreamRef.current) {
      fallbackStreamRef.current.getTracks().forEach((track) => track.stop());
      fallbackStreamRef.current = null;
    }
  }, []);

 

  const getActiveStream = useCallback(async () => {
    const webcamStream = webcamRef.current?.stream ?? null;
    if (webcamStream) {
      return webcamStream;
    }
    try {
      const fallbackStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      fallbackStreamRef.current = fallbackStream;
      setCameraReady(true);
      setCameraError(null);
      return fallbackStream;
    } catch (error) {
      console.error('Cannot access webcam stream', error);
      setCameraReady(false);
      setCameraError('Unable to access the webcam. Please verify permissions.');
      setStatus('idle');
      return null;
    }
  }, [webcamRef]);

  const handleCameraReady = useCallback(() => {
    setCameraReady(true);
    setCameraError(null);
  }, []);

  const handleCameraError = useCallback((err: string | DOMException) => {
    const message =
      typeof err === 'string' ? err : err?.message || 'Unable to use the webcam.';
    setCameraReady(false);
    setCameraError(message);
  }, []);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    clearRecordingTimeout();
  }, [clearRecordingTimeout]);

  const handleStartRecording = useCallback(async () => {
    setRecordedBlob(null);
    const stream = await getActiveStream();
    if (!stream) return;

    setStatus('countdown');
    setCountdown(countdownSeconds);
    let current = countdownSeconds;
    clearCountdown();
    countdownIntervalRef.current = window.setInterval(() => {
      current -= 1;
      setCountdown(current);
      if (current === 0) {
        clearCountdown();
        setStatus('recording');

        const mimeType = 'video/webm';
        const options = mimeType ? { mimeType } : undefined;
        mediaRecorderRef.current = new MediaRecorder(stream, options);
        recordedChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const blobType = 'video/webm';
          const blob = new Blob(recordedChunksRef.current, { type: blobType });
          setRecordedBlob(blob);
          setStatus('preview');
          stopFallbackStream();
        };

        mediaRecorderRef.current.start();
        clearRecordingTimeout();
        recordingTimeoutRef.current = window.setTimeout(() => {
          handleStopRecording();
        }, recordingSeconds * 1000);
      }
    }, 1000);
  }, [
    countdownSeconds,
    getActiveStream,
    handleStopRecording,
    recordingSeconds,
    clearCountdown,
    clearRecordingTimeout,
    stopFallbackStream,
  ]);

  const handleRecordAgain = useCallback(() => {
    clearCountdown();
    clearRecordingTimeout();
    recordedChunksRef.current = [];
    setRecordedBlob(null);
    setStatus('idle');
    setCountdown(countdownSeconds);
    stopFallbackStream();
  }, [clearCountdown, clearRecordingTimeout, countdownSeconds, stopFallbackStream]);

  const cleanup = useCallback(() => {
    handleStopRecording();
    clearCountdown();
    clearRecordingTimeout();
    recordedChunksRef.current = [];
    setRecordedBlob(null);
    setStatus('idle');
    setCameraReady(false);
    stopFallbackStream();
  }, [handleStopRecording, clearCountdown, clearRecordingTimeout, stopFallbackStream]);

  return {
    status,
    countdown,
    recordedBlob,
    cameraReady,
    cameraError,
    handleCameraReady,
    handleCameraError,
    handleStartRecording,
    handleRecordAgain,
    cleanup,
  };
};


