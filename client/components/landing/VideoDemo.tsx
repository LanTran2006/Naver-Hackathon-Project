
import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { VideoIcon, SparklesIcon } from '../common/Icons';
import { uploadVideoInChunks } from '../../api';
import { RecordingStatus } from '../../types';
import { useTranslation } from 'react-i18next';

const VideoDemo: React.FC = () => {
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
    const [aiResponse, setAiResponse] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

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
        return () => cleanup();
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (status === 'recording') {
            const startTime = Date.now();
            interval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                setRecordingTime(Math.floor(elapsedTime / 1000));
            }, 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [status]);
    const handleStartRecording = async () => {
        setRecordedBlob(null);
        setAiResponse('');
        setIsPaused(false);
        recordedChunksRef.current = [];
        
        const stream = webcamRef.current?.stream || await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
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
        setAiResponse('');
        setStatus('idle');
        setIsPaused(false);
        recordedChunksRef.current = [];
    };
    
    const handleDownload = () => {
        if (recordedBlob) {
            const url = URL.createObjectURL(recordedBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'lreg-demo.webm';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    };

    const handleSendToAI = async () => {
        if (!recordedBlob) return;
        setIsSending(true);
        setAiResponse(`🎬 ${t('app.messages.processing')}`);
        console.log('Sending landing demo video to FastAPI backend');
        try {
            const collectedWords: string[] = [];
            
            await uploadVideoInChunks(recordedBlob, (current, total, label) => {
                collectedWords.push(label);
                setAiResponse(
                    `📊 ${t('app.messages.processingSegment', { current, total, label })}\n\n` +
                    `${t('app.messages.currentResult', { result: collectedWords.join(' ') })}`
                );
            });
            
            setAiResponse(
                `✅ ${t('app.messages.completed')}\n\n` +
                `${t('app.messages.result', { result: collectedWords.join(' ') })}`
            );
        } catch (error: any) {
            const message =
                typeof error?.message === 'string'
                    ? error.message
                    : t('app.messages.error', { message: 'Unknown error' });
            setAiResponse(`❌ ${t('app.messages.error', { message })}`);
        } finally {
            setIsSending(false);
        }
    };

    const resetDemo = () => {
        handleRecordAgain();
        setAiResponse('');
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 w-full max-w-3xl">
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
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center space-y-3">
                        {!cameraReady ? (
                            <>
                                <VideoIcon className="w-16 h-16 opacity-80" />
                                <p className="text-lg font-semibold">{t('app.video.allowCamera')}</p>
                                {cameraError && <p className="text-sm text-red-200">{cameraError}</p>}
                            </>
                        ) : (
                            <>
                                <VideoIcon className="w-12 h-12 opacity-80 mx-auto" />
                                <p className="font-medium">{t('app.video.readyToRecord')}</p>
                                <button
                                    onClick={handleStartRecording}
                                    className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-hover transition"
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
                {status === 'recording' && !isPaused && (
                    <>
                        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            <span>{t('app.video.rec', { time: recordingTime })}</span>
                        </div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
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
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white space-y-4">
                        <p className="text-xl font-semibold">{t('app.video.stopRecording')}</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleContinueRecording}
                                className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition"
                            >
                                {t('app.video.continueRecording')}
                            </button>
                            <button
                                onClick={handleEndRecording}
                                className="bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition"
                            >
                                {t('app.video.endRecording')}
                            </button>
                        </div>
                    </div>
                )}
                {status === 'preview' && recordedBlob && (
                    <video
                        src={URL.createObjectURL(recordedBlob)}
                        className="absolute inset-0 w-full h-full object-cover"
                        controls
                        autoPlay
                        loop
                    />
                )}
            </div>

            <div className="mt-6">
                {status !== 'preview' ? (
                    <button
                        onClick={handleStartRecording}
                        disabled={status !== 'idle' || !cameraReady}
                        className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-primary-hover transition disabled:bg-gray-400"
                    >
                        <VideoIcon className="w-6 h-6" />
                        {t('app.video.startRecording')}
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleDownload} className="bg-secondary text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-secondary-hover transition">{t('app.video.downloadVideo')}</button>
                            <button onClick={resetDemo} className="bg-secondary text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-secondary-hover transition">{t('app.video.recordAgain')}</button>
                        </div>
                        <button onClick={handleSendToAI} disabled={isSending} className="w-full bg-accent text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:bg-gray-400">
                           <SparklesIcon className="w-6 h-6" />
                           {isSending ? t('app.video.processing') : t('app.video.send')}
                        </button>
                        
                        {aiResponse && (
                            <div className="mt-4 p-4 bg-primary-light rounded-lg text-primary-text">
                                <p className="font-semibold">AI Response:</p>
                                <p className="mt-1">{aiResponse}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoDemo;
