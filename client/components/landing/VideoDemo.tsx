
import React, { useState, useEffect } from 'react';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';
import { VideoIcon, SparklesIcon } from '../common/Icons';

const VideoDemo: React.FC = () => {
    const { status, countdown, recordedBlob, videoRef, handleStartRecording, handleRecordAgain, cleanup } = useMediaRecorder({ mediaType: 'video' });
    const [aiResponse, setAiResponse] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        return () => cleanup();
    }, [cleanup]);
    
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
        setAiResponse('');
        console.log('Sending to placeholder endpoint: POST /api/demo/video');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAiResponse("Example: 'I want to say hello to my friend.'");
        setIsSending(false);
    };

    const resetDemo = () => {
        handleRecordAgain();
        setAiResponse('');
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 w-full max-w-md">
            <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden relative">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

                {status === 'idle' && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4">
                        <VideoIcon className="w-16 h-16 opacity-50 mb-4" />
                        <p className="text-center font-medium">Your webcam preview will appear here.</p>
                    </div>
                )}
                {status === 'countdown' && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                        <p className="text-xl">Get ready...</p>
                        <p className="text-7xl font-bold">{countdown}</p>
                    </div>
                )}
                 {status === 'recording' && (
                    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                        <span>REC</span>
                    </div>
                )}
                {status === 'preview' && recordedBlob && (
                    <video src={URL.createObjectURL(recordedBlob)} className="w-full h-full object-cover" controls autoPlay loop />
                )}
            </div>

            <div className="mt-6">
                {status !== 'preview' ? (
                    <button
                        onClick={handleStartRecording}
                        disabled={status !== 'idle'}
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
