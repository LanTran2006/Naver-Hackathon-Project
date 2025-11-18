
import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { VideoIcon, SparklesIcon } from '../common/Icons';
import { uploadVideoAndGetLabel } from '../../api';
import { useWebcamRecorder } from '../../hooks/useWebcamRecorder';

const VideoDemo: React.FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const {
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
    } = useWebcamRecorder({ webcamRef });
    const [aiResponse, setAiResponse] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        return () => cleanup(); // Dọn dẹp stream & timer khi unmount.
    }, [cleanup]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (status === 'recording') {
            setProgress(0); // Reset tiến trình khi bắt đầu quay.
            const startTime = Date.now();
            interval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const newProgress = Math.min((elapsedTime / (3 * 1000)) * 100, 100); // 3 giây quay.
                setProgress(newProgress);
            }, 100);
        } else {
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [status]);
    
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
        if (!recordedBlob) return; // Không có video thì không gửi.
        setIsSending(true); // Đánh dấu đang gửi.
        setAiResponse('');
        console.log('Sending landing demo video to FastAPI backend');
        try {
            const label = await uploadVideoAndGetLabel(recordedBlob); // Gọi backend lấy nhãn.
            setAiResponse(`AI hiểu bạn đang ký hiệu: "${label}".`);
        } catch (error: any) {
            const message =
                typeof error?.message === 'string'
                    ? error.message
                    : 'Đã xảy ra lỗi khi xử lý video.';
            setAiResponse(`Xin lỗi, có lỗi khi xử lý video: ${message}`);
        } finally {
            setIsSending(false); // Luôn tắt trạng thái gửi.
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
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${status === 'preview' ? 'opacity-0' : 'opacity-100'}`}
                    onUserMedia={handleCameraReady}
                    onUserMediaError={handleCameraError}
                    videoConstraints={{ facingMode: 'user' }}
                />

                {status === 'idle' && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center space-y-3">
                        {!cameraReady ? (
                            <>
                                <VideoIcon className="w-16 h-16 opacity-80" />
                                <p className="text-lg font-semibold">Cho phép trình duyệt sử dụng webcam để xem trước.</p>
                                {cameraError && <p className="text-sm text-red-200">{cameraError}</p>}
                            </>
                        ) : (
                            <>
                                <VideoIcon className="w-12 h-12 opacity-80 mx-auto" />
                                <p className="font-medium">Xem trước webcam tại đây.</p>
                                <button
                                    onClick={handleStartRecording}
                                    className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-hover transition"
                                >
                                    Bắt đầu quay
                                </button>
                            </>
                        )}
                    </div>
                )}
                {status === 'countdown' && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                        <p className="text-xl">Chuẩn bị...</p>
                        <p className="text-7xl font-bold">{countdown}</p>
                    </div>
                )}
                {status === 'recording' && (
                    <>
                        <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
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
                        Quick demo – Record 3 seconds
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleDownload} className="bg-secondary text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-secondary-hover transition">Download video</button>
                            <button onClick={resetDemo} className="bg-secondary text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-secondary-hover transition">Record again</button>
                        </div>
                        <button onClick={handleSendToAI} disabled={isSending} className="w-full bg-accent text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:bg-gray-400">
                           <SparklesIcon className="w-6 h-6" />
                           {isSending ? 'Analyzing...' : 'Send to AI demo'}
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
