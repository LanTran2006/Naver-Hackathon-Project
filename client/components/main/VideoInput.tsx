import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { VideoIcon, SparklesIcon } from '../common/Icons';
import { RecordingStatus } from '../../types';
import { convertWebMToMP4 } from '../../utils/videoConverter';

interface VideoInputProps {
    onSendToAI: (blob: Blob) => Promise<void>;
}

const VideoInput: React.FC<VideoInputProps> = ({ onSendToAI }) => {
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const [status, setStatus] = useState<RecordingStatus>('idle');
    const [countdown, setCountdown] = useState(2);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [videoPreviewSrc, setVideoPreviewSrc] = useState<string | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [showChunkCountdown, setShowChunkCountdown] = useState(false);
    const [chunkCountdown, setChunkCountdown] = useState(3);

    const handleCameraReady = () => {
        setCameraReady(true);
        setCameraError(null);
    };

    const handleCameraError = (err: string | DOMException) => {
        const message = typeof err === 'string' ? err : err?.message || 'Unable to use the webcam.';
        setCameraReady(false);
        setCameraError(message);
    };

    const cleanup = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (status === 'recording' && !showChunkCountdown) {
            const startTime = Date.now() - (recordingTime * 1000);
            interval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const seconds = Math.floor(elapsedTime / 1000);
                setRecordingTime(seconds);

                // Mỗi 3 giây thì pause và countdown
                if (seconds > 0 && seconds % 3 === 0) {
                    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                        mediaRecorderRef.current.pause();
                        setShowChunkCountdown(true);
                        setChunkCountdown(3);

                        // Countdown 3-2-1
                        let count = 3;
                        const countdownInterval = setInterval(() => {
                            count--;
                            setChunkCountdown(count);
                            if (count === 0) {
                                clearInterval(countdownInterval);
                                setShowChunkCountdown(false);
                                // Resume recording
                                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
                                    mediaRecorderRef.current.resume();
                                }
                            }
                        }, 1000);
                    }
                }
            }, 1000);
        } else if (status !== 'recording') {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [status, showChunkCountdown, recordingTime]);

    useEffect(() => {
        if (recordedBlob) {
            const url = URL.createObjectURL(recordedBlob);
            setVideoPreviewSrc(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        }
        setVideoPreviewSrc(null);
    }, [recordedBlob]);

    useEffect(() => {
        return () => cleanup();
    }, []);

    const handleStartRecording = async () => {
        setRecordedBlob(null);
        recordedChunksRef.current = [];

        const stream = webcamRef.current?.stream || await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (!stream) return;

        streamRef.current = stream;

        setStatus('countdown');
        setCountdown(2);
        let count = 2;
        const countdownInterval = setInterval(() => {
            count--;
            setCountdown(count);
            if (count === 0) {
                clearInterval(countdownInterval);
                setStatus('recording');

                mediaRecorderRef.current = new MediaRecorder(stream, {
                    mimeType: 'video/webm;codecs=vp8',
                    videoBitsPerSecond: 1000000
                });

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunksRef.current.push(event.data);
                    }
                };

                mediaRecorderRef.current.onstop = async () => {
                    const webmBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });

                    try {
                        setIsConverting(true);
                        console.log('Converting video to MP4...');
                        const mp4Blob = await convertWebMToMP4(webmBlob);
                        console.log('Conversion complete!');
                        setRecordedBlob(mp4Blob);
                    } catch (error) {
                        console.error('Conversion failed, using WebM:', error);
                        setRecordedBlob(webmBlob);
                    } finally {
                        setIsConverting(false);
                        setStatus('preview');
                    }
                };

                mediaRecorderRef.current.start();
            }
        }, 1000);
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setShowChunkCountdown(false);
            // Don't cleanup immediately - wait for onstop to complete conversion
        }
    };

    const handleRecordAgain = () => {
        setRecordedBlob(null);
        setStatus('idle');
        setShowChunkCountdown(false);
        recordedChunksRef.current = [];
    };

    const handleDownload = () => {
        if (recordedBlob) {
            const url = URL.createObjectURL(recordedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'lreg-recording.mp4';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    };

    const handleSend = async () => {
        if (!recordedBlob) return; // Skip when no video is recorded.
        setIsSending(true); // Mark as sending.
        try {
            await onSendToAI(recordedBlob); // Pass blob upward so parent can call backend.
        } finally {
            setIsSending(false); // Always clear sending state.
        }
    };

    return (
        <div className="w-full">
            <div className="relative w-full bg-gray-900 rounded-2xl overflow-hidden min-h-[420px] shadow-inner">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored
                    disablePictureInPicture={false}
                    forceScreenshotSourceSize={false}
                    imageSmoothing={true}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={0.92}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${status === 'preview' ? 'opacity-0' : 'opacity-100'}`}
                    onUserMedia={handleCameraReady}
                    onUserMediaError={handleCameraError}
                    videoConstraints={{
                        facingMode: 'user',
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        frameRate: { ideal: 30 }
                    }}
                />

                {status === 'idle' && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 space-y-3 text-center">
                        {!cameraReady ? (
                            <>
                                <VideoIcon className="w-16 h-16 opacity-80 mx-auto" />
                                <p className="text-lg font-semibold">Allow the browser to use your webcam for preview.</p>
                                {cameraError && <p className="text-sm text-red-200">{cameraError}</p>}
                            </>
                        ) : (
                            <>
                                <VideoIcon className="w-12 h-12 opacity-80 mx-auto" />
                                <p className="text-lg font-semibold">Ready to record</p>
                                <button
                                    onClick={handleStartRecording}
                                    disabled={!cameraReady || status !== 'idle'}
                                    className="bg-primary text-white font-semibold py-3 px-8 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-primary-hover transition disabled:bg-gray-500"
                                >
                                    Start recording
                                </button>
                            </>
                        )}
                    </div>
                )}
                {status === 'countdown' && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                        <p className="text-xl">Get ready...</p>
                        <p className="text-7xl font-bold">{countdown}</p>
                    </div>
                )}
                {isConverting && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
                        <p className="text-xl font-semibold">Converting to MP4...</p>
                        <p className="text-sm text-gray-300 mt-2">Please wait</p>
                    </div>
                )}
                {showChunkCountdown && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-20">
                        <p className="text-xl">Chuẩn bị động tác tiếp theo...</p>
                        <p className="text-7xl font-bold">{chunkCountdown}</p>
                        <button
                            onClick={handleStopRecording}
                            className="mt-8 bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition"
                        >
                            Stop Recording
                        </button>
                    </div>
                )}
                {status === 'recording' && !showChunkCountdown && (
                    <>
                        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span></span>
                            <span>REC {recordingTime}s</span>
                        </div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                            <button
                                onClick={handleStopRecording}
                                className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition"
                            >
                                Stop Recording
                            </button>
                        </div>
                    </>
                )}
                {status === 'preview' && videoPreviewSrc && (
                    <video
                        src={videoPreviewSrc}
                        className="absolute inset-0 w-full h-full object-cover"
                        controls
                    />
                )}
            </div>

            {status === 'preview' && (
                <div className="mt-4 space-y-3 max-w-md mx-auto">
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleRecordAgain} className="w-full bg-secondary text-gray-700 font-medium py-2 rounded-lg hover:bg-secondary-hover transition text-sm">
                            Record another video
                        </button>
                        <button onClick={handleDownload} className="w-full bg-secondary text-gray-700 font-medium py-2 rounded-lg hover:bg-secondary-hover transition text-sm">
                            Download video
                        </button>
                    </div>
                    <button onClick={handleSend} disabled={isSending} className="w-full bg-accent text-white font-semibold py-2.5 px-6 rounded-lg text-base flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:bg-gray-400">
                        <SparklesIcon className="w-5 h-5" />
                        {isSending ? 'Sending...' : 'Send video to AI'}
                    </button>
                </div>
            )}
            <p className="text-xs text-gray-500 text-center mt-4">LReg optimizes video frames before sending them to the backend.</p>
        </div>
    );
};

export default VideoInput;