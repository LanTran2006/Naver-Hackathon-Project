import React, { useState, useEffect } from 'react';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';
import { VideoIcon, SparklesIcon } from '../common/Icons';

interface VideoInputProps {
    onSendToAI: () => Promise<void>;
}

const VideoInput: React.FC<VideoInputProps> = ({ onSendToAI }) => {
    const { status, countdown, recordedBlob, videoRef, handleStartRecording, handleRecordAgain, cleanup } = useMediaRecorder({ 
        mediaType: 'video',
        countdownSeconds: 2,
        recordingSeconds: 3
    });
    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoPreviewSrc, setVideoPreviewSrc] = useState<string | null>(null);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (status === 'recording') {
            setProgress(0);
            const startTime = Date.now();
            interval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const newProgress = Math.min((elapsedTime / (3 * 1000)) * 100, 100);
                setProgress(newProgress);
            }, 100);
        } else {
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [status]);

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
    }, [cleanup]);
    
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
        if (!recordedBlob) return;
        setIsSending(true);
        await onSendToAI();
        setIsSending(false);
    };

    return (
        <div className="w-full">
            <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden relative border border-gray-200">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline style={{ display: status === 'preview' ? 'none' : 'block' }} />
                
                {status === 'idle' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4">
                        <VideoIcon className="w-16 h-16 opacity-50 mb-4" />
                        <button
                            onClick={handleStartRecording}
                            className="bg-primary text-white font-semibold py-3 px-8 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-primary-hover transition"
                        >
                            Start recording
                        </button>
                    </div>
                )}
                {status === 'countdown' && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                        <p className="text-xl">Get ready...</p>
                        <p className="text-7xl font-bold">{countdown}</p>
                    </div>
                )}
                 {status === 'recording' && (
                    <>
                        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span></span>
                            <span>REC</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-600">
                            <div className="h-full bg-red-500 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                        </div>
                    </>
                )}
                {status === 'preview' && videoPreviewSrc && (
                    <video src={videoPreviewSrc} className="w-full h-full object-cover" controls autoPlay loop />
                )}
            </div>

            {status === 'preview' && (
                <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleRecordAgain} className="w-full bg-secondary text-gray-700 font-medium py-3 rounded-lg hover:bg-secondary-hover transition">Record again</button>
                        <button onClick={handleDownload} className="w-full bg-secondary text-gray-700 font-medium py-3 rounded-lg hover:bg-secondary-hover transition">Download video</button>
                    </div>
                    <button onClick={handleSend} disabled={isSending} className="w-full bg-accent text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:bg-gray-400">
                        <SparklesIcon className="w-6 h-6" />
                        {isSending ? 'Understanding...' : 'Understand this for me'}
                    </button>
                </div>
            )}
            <p className="text-xs text-gray-500 text-center mt-4">LReg optimizes video frames before sending them to the backend.</p>
        </div>
    );
};

export default VideoInput;