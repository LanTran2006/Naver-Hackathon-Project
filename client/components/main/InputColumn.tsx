import React, { useState } from 'react';
import { InputMode } from '../../types';
import VideoInput from './VideoInput';
import FileUploadInput from './AudioInput';
import TextInput from './TextInput';
import { VideoIcon, UploadCloudIcon, TypeIcon } from '../common/Icons';
import { uploadVideoAndGetLabel, uploadVideoInChunks } from '../../api';

interface InputColumnProps {
    onNewAIMessage: (text: string) => void;
}

const InputColumn: React.FC<InputColumnProps> = ({ onNewAIMessage }) => {
    const [inputMode, setInputMode] = useState<InputMode>('video');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSendVideoToAI = async (blob: Blob) => {
        try {
            // Hiển thị thông báo bắt đầu
            onNewAIMessage(' Đang xử lý video...');
            
            const collectedWords: string[] = [];
            
            // Gửi từng đoạn 3s và nhận kết quả
            await uploadVideoInChunks(blob, (current, total, label) => {
                collectedWords.push(label);
                // Cập nhật real-time
                const progressText = ` Đang xử lý đoạn ${current}/${total}: "${label}"\n\n` +
                                   `Kết quả hiện tại: ${collectedWords.join(' ')}`;
                onNewAIMessage(progressText);
            });
            
            // Hiển thị kết quả cuối cùng
            const finalText = ` AI đã nhận diện xong!\n\n` +
                            `Kết quả: "${collectedWords.join(' ')}"`;
            onNewAIMessage(finalText);
            
        } catch (error: any) {
            const message =
                typeof error?.message === 'string'
                    ? error.message
                    : 'An error occurred while processing the video.';
            onNewAIMessage(`Sorry, something went wrong while processing the video: ${message}`);
        }
    };

    const handleSendUploadedFileToAI = async (file: File) => {
        try {
            const label = await uploadVideoAndGetLabel(file); // Send uploaded file to backend.
            const aiResponseText = `AI interpreted your file as: "${label}".`;
            onNewAIMessage(aiResponseText);
        } catch (error: any) {
            const message =
                typeof error?.message === 'string'
                    ? error.message
                    : 'An error occurred while processing the file.';
            onNewAIMessage(`Sorry, something went wrong while processing the file: ${message}`);
        }
    };
    
    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200">
                <div className="flex space-x-1">
                    <TabButton
                        label="Video"
                        icon={<VideoIcon className="w-5 h-5 mr-2" />}
                        isActive={inputMode === 'video'}
                        onClick={() => setInputMode('video')}
                    />
                    <TabButton
                        label="Upload File"
                        icon={<UploadCloudIcon className="w-5 h-5 mr-2" />}
                        isActive={inputMode === 'upload'}
                        onClick={() => setInputMode('upload')}
                    />
                    <TabButton
                        label="Text"
                        icon={<TypeIcon className="w-5 h-5 mr-2" />}
                        isActive={inputMode === 'text'}
                        onClick={() => setInputMode('text')}
                    />
                </div>
                <div className="p-4 md:p-6">
                    {inputMode === 'video' && <VideoInput onSendToAI={handleSendVideoToAI} />}
                    {inputMode === 'upload' && <FileUploadInput onSendToAI={handleSendUploadedFileToAI} />}
                    {inputMode === 'text' && (
                        <TextInput
                            onSendToAI={async (suggestion) => {
                                onNewAIMessage(`Gợi ý câu trả lời:\n${suggestion}`);
                            }}
                        />
                    )}

                    <div className="mt-6 border-t pt-6">
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm font-medium text-gray-600 hover:text-primary">
                            {showAdvanced ? 'Hide' : 'Show'} advanced options
                        </button>
                        {showAdvanced && (
                            <div className="mt-4 grid sm:grid-cols-2 gap-4">
                               <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Output detail</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-primary focus:border-primary">
                                        <option>Normal</option>
                                        <option>Short</option>
                                        <option>Detailed</option>
                                    </select>
                               </div>
                               <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1">Tone</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-primary focus:border-primary">
                                        <option>Neutral</option>
                                        <option>Friendly</option>
                                        <option>Formal</option>
                                    </select>
                               </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface TabButtonProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}
const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center font-semibold py-3 px-4 rounded-lg transition ${
            isActive ? 'bg-primary text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
        {icon}
        {label}
    </button>
);


export default InputColumn;