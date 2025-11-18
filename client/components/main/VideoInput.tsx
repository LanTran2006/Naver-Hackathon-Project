import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { VideoIcon, SparklesIcon } from '../common/Icons';
import { useWebcamRecorder } from '../../hooks/useWebcamRecorder';

interface VideoInputProps {
    onSendToAI: (blob: Blob) => Promise<void>;
}

const VideoInput: React.FC<VideoInputProps> = ({ onSendToAI }) => {
    const webcamRef = useRef<Webcam>(null);
    const {
        status,
        countdown,
        recordedBlob,
        cameraReady,
        cameraError,
        handleStartRecording,
        handleRecordAgain,
        handleCameraReady,
        handleCameraError,
        cleanup
    } = useWebcamRecorder({
        webcamRef,
        countdownSeconds: 2,
        recordingSeconds: 3,
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
        return () => cleanup(); // Dọn dẹp stream khi unmount.
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
        if (!recordedBlob) return; // Nếu chưa có video thì không gửi.
        setIsSending(true); // Bật trạng thái đang gửi.
        try {
            await onSendToAI(recordedBlob); // Gửi blob video lên hàm cha để gọi backend.
        } finally {
            setIsSending(false); // Tắt trạng thái đang gửi dù thành công hay lỗi.
        }
    };

    return (
        <div className="w-full">
            <div className="relative w-full bg-gray-900 rounded-2xl overflow-hidden min-h-[420px] shadow-inner">
                <Webcam
                    ref={webcamRef}
                    audio
                    mirrored
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${status === 'preview' ? 'opacity-0' : 'opacity-100'}`}
                    onUserMedia={handleCameraReady}
                    onUserMediaError={handleCameraError}
                    videoConstraints={{ facingMode: 'user' }}
                />

                {status === 'idle' && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 space-y-3 text-center">
                        {!cameraReady ? (
                            <>
                                <VideoIcon className="w-16 h-16 opacity-80 mx-auto" />
                                <p className="text-lg font-semibold">Cho phép trình duyệt sử dụng webcam để xem trước.</p>
                                {cameraError && <p className="text-sm text-red-200">{cameraError}</p>}
                            </>
                        ) : (
                            <>
                                <VideoIcon className="w-12 h-12 opacity-80 mx-auto" />
                                <p className="text-lg font-semibold">Sẵn sàng quay video</p>
                                <button
                                    onClick={handleStartRecording}
                                    disabled={!cameraReady || status !== 'idle'}
                                    className="bg-primary text-white font-semibold py-3 px-8 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-primary-hover transition disabled:bg-gray-500"
                                >
                                    Bắt đầu quay
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
                 {status === 'recording' && (
                    <>
                        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span></span>
                            <span>REC</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full">
                            <div className="h-2 bg-gray-600">
                                <div
                                    className="h-full bg-red-500 transition-all duration-100 ease-linear"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="w-full text-center text-xs text-white bg-black/40 py-1">
                                Đang quay... {Math.ceil((3 - (progress / 100) * 3))}s
                            </div>
                        </div>
                    </>
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
                            Quay lại video mới
                        </button>
                        <button onClick={handleDownload} className="w-full bg-secondary text-gray-700 font-medium py-3 rounded-lg hover:bg-secondary-hover transition">
                            Tải video về
                        </button>
                    </div>
                    <button onClick={handleSend} disabled={isSending} className="w-full bg-accent text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:bg-gray-400">
                        <SparklesIcon className="w-6 h-6" />
                        {isSending ? 'Đang gửi...' : 'Gửi video cho AI'}
                    </button>
                </div>
            )}
            <p className="text-xs text-gray-500 text-center mt-4">LReg optimizes video frames before sending them to the backend.</p>
        </div>
    );
};

export default VideoInput;