import { useState, useRef, useCallback } from 'react';
import { RecordingStatus } from '../types';

interface MediaRecorderHookProps {
  mediaType: 'video' | 'audio';
  countdownSeconds?: number;
  recordingSeconds?: number;
}

export const useMediaRecorder = ({
  mediaType,
  countdownSeconds = 2,
  recordingSeconds = 3,
}: MediaRecorderHookProps) => {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  // FIX: Explicitly initialize useRef with `undefined` to fix "Expected 1 arguments, but got 0" error.
  // Some React typings require an argument for useRef. The ref holds timer IDs (numbers).
  const timerRef = useRef<number | undefined>(undefined);

  const startStream = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: mediaType === 'video',
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current && mediaType === 'video') {
        videoRef.current.srcObject = mediaStream;
      }
      return mediaStream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
      setStatus('idle');
      return null;
    }
  }, [mediaType]);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  }, [stream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    clearTimeout(timerRef.current);
    stopStream();
  }, [stopStream]);

  const cleanup = useCallback(() => {
    stopStream();
    clearTimeout(timerRef.current);
    setStatus('idle');
    setRecordedBlob(null);
    recordedChunksRef.current = [];
  }, [stopStream]);

  const handleStartRecording = async () => {
    cleanup();
    setRecordedBlob(null);
    const currentStream = await startStream();
    if (!currentStream) return;

    setStatus('countdown');
    setCountdown(countdownSeconds);
    let count = countdownSeconds;
    timerRef.current = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timerRef.current);
        setStatus('recording');

        mediaRecorderRef.current = new MediaRecorder(currentStream);
        recordedChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const mimeType = mediaType === 'video' ? 'video/webm' : 'audio/webm';
          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          setRecordedBlob(blob);
          setStatus('preview');
          stopStream();
        };

        mediaRecorderRef.current.start();
        
        timerRef.current = setTimeout(() => {
          stopRecording();
        }, recordingSeconds * 1000);
      }
    }, 1000);
  };
  
  const handleRecordAgain = () => {
    cleanup();
  };

  return {
    status,
    countdown,
    recordedBlob,
    videoRef,
    handleStartRecording,
    handleRecordAgain,
    stopRecording,
    cleanup,
  };
};
