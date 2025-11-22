import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { VideoIcon, SparklesIcon } from '../common/Icons';
import { RecordingStatus } from '../../types';
import { useTranslation } from 'react-i18next';

interface VideoInputProps {
    onSendToAI: (blob: Blob) => Promise<void>;
}

const VideoInput: React.FC<VideoInputProps> = ({ onSendToAI }) => {
    const { t } = useTranslation();
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
    const [isPaused, setIsPaused] = useState(false);
    const [videoPreviewSrc, setVideoPreviewSrc] = useState<string | null>(null);
    const [showChunkCountdown, setShowChunkCountdown] = useState(false);
    const [chunkCountdown, setChunkCountdown] = useState(3);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const chunkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        if (status === 'recording' && !isPaused && !showChunkCountdown) {
            const startTime = Date.now() - (recordingTime * 1000);
            interval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const seconds = Math.floor(elapsedTime / 1000);
                setRecordingTime(seconds);
                
                // Mỗi 3 giây thì pause và countdown
                if (seconds > 0 && seconds % 3 === 0) {
                    // Pause recording
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
    }, [status, isPaused, showChunkCountdown, recordingTime]);

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
        setIsPaused(false);
        recordedChunksRef.current = [];
        
        const stream = webcamRef.current?.stream || await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: audioEnabled 
        });
        if (!stream) return;
        
        streamRef.current = stream;
        
        // Mute audio tracks if audio is disabled
        if (!audioEnabled && stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = false;
            });
        }
        
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
                
                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                    setRecordedBlob(blob);
                    setStatus('preview');
                };
                
                mediaRecorderRef.current.start();
            }
        }, 1000);
    };

    const handleStopRecording = () => {
        if (chunkTimerRef.current) {
            clearTimeout(chunkTimerRef.current);
        }
        if (mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')) {
            if (mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.pause();
            }
            setIsPaused(true);
            setShowChunkCountdown(false);
        }
    };

    const handleContinueRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
        }
    };

    const handleEndRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        cleanup();
    };

    const handleRecordAgain = () => {
        setRecordedBlob(null);
        setStatus('idle');
        setIsPaused(false);
        setShowChunkCountdown(false);
        recordedChunksRef.current = [];
    };
    
    const handleDownload = () => {
        if (recordedBlob) {
            const url = URL.createObjectURL(recordedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'lreg-recording.webm';
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
                    audio
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
                                <p className="text-lg font-semibold">{t('app.video.allowCamera')}</p>
                                {cameraError && <p className="text-sm text-red-200">{cameraError}</p>}
                            </>
                        ) : (
                            <>
                                <VideoIcon className="w-12 h-12 opacity-80 mx-auto" />
                                <p className="text-lg font-semibold">{t('app.video.readyToRecord')}</p>
                                
                                {/* Audio toggle */}
                                <button
                                    onClick={() => setAudioEnabled(!audioEnabled)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                        audioEnabled 
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {audioEnabled ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        ) : (
                                            <>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                                <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                            </>
                                        )}
                                    </svg>
                                    {audioEnabled ? t('app.video.audioOn') : t('app.video.audioOff')}
                                </button>
                                
                                <button
                                    onClick={handleStartRecording}
                                    disabled={!cameraReady || status !== 'idle'}
                                    className="bg-primary text-white font-semibold py-3 px-8 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-primary-hover transition disabled:bg-gray-500"
                                >
                                    {t('app.video.startRecording')}
                                </button>
                            </>
                        )}
                    </div>
                )}
                {status === 'countdown' && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                        <p className="text-xl">{t('app.video.getReady')}</p>
                        <p className="text-7xl font-bold">{countdown}</p>
                    </div>
                )}
                {showChunkCountdown && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-20">
                        <p className="text-xl">Chuẩn bị động tác tiếp theo...</p>
                        <p className="text-7xl font-bold">{chunkCountdown}</p>
                    </div>
                )}
                 {status === 'recording' && !isPaused && (
                    <>
                        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span></span>
                            <span>REC {recordingTime}s</span>
                        </div>
                        {/* Audio status indicator */}
                        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {audioEnabled ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                ) : (
                                    <>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        <line x1="2" y1="2" x2="22" y2="22" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                    </>
                                )}
                            </svg>
                            <span>{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
                        </div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                            <button
                                onClick={handleStopRecording}
                                className="bg-yellow-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
                            >
                                {t('app.video.stopRecording')}
                            </button>
                        </div>
                    </>
                )}
                {status === 'recording' && isPaused && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white space-y-4 z-10">
                        <p className="text-xl font-semibold">Recording Paused</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleContinueRecording}
                                className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition"
                            >
                                Continue
                            </button>
                            <button
                                onClick={handleEndRecording}
                                className="bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition"
                            >
                                End Video
                            </button>
                        </div>
                    </div>
                )}
                {status === 'preview' && videoPreviewSrc && (
                    <video
                        src={videoPreviewSrc}
                        className="absolute inset-0 w-full h-full object-cover"
                        controls
                        autoPlay
                        loop
                    />
                )}
            </div>

            {status === 'preview' && (
                <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleRecordAgain} className="w-full bg-secondary text-gray-700 font-medium py-3 rounded-lg hover:bg-secondary-hover transition">
                            Record another video
                        </button>
                        <button onClick={handleDownload} className="w-full bg-secondary text-gray-700 font-medium py-3 rounded-lg hover:bg-secondary-hover transition">
                            Download video
                        </button>
                    </div>
                    <button onClick={handleSend} disabled={isSending} className="w-full bg-accent text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:bg-gray-400">
                        <SparklesIcon className="w-6 h-6" />
                        {isSending ? 'Sending...' : 'Send video to AI'}
                    </button>
                </div>
            )}
            <p className="text-xs text-gray-500 text-center mt-4">TalkSign optimizes video frames before sending them to the backend.</p>
        </div>
    );
};

export default VideoInput;