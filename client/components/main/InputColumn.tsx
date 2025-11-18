import React, { useState } from 'react';
import { InputMode } from '../../types';
import VideoInput from './VideoInput';
import FileUploadInput from './AudioInput';
import TextInput from './TextInput';
import { VideoIcon, UploadCloudIcon, TypeIcon } from '../common/Icons';
import { uploadVideoAndGetLabel } from '../../api';

interface InputColumnProps {
    onNewAIMessage: (text: string) => void;
}

const InputColumn: React.FC<InputColumnProps> = ({ onNewAIMessage }) => {
    const [inputMode, setInputMode] = useState<InputMode>('video');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSendVideoToAI = async (blob: Blob) => {
        try {
            const label = await uploadVideoAndGetLabel(blob); // Gọi backend để lấy nhãn.
            const aiResponseText = `AI hiểu bạn đang ký hiệu: "${label}".`; // Câu trả lời thân thiện.
            onNewAIMessage(aiResponseText); // Đẩy vào cột chat.
        } catch (error: any) {
            const message =
                typeof error?.message === 'string'
                    ? error.message
                    : 'Đã xảy ra lỗi khi xử lý video.';
            onNewAIMessage(`Xin lỗi, có lỗi khi xử lý video: ${message}`);
        }
    };

    const handleSendUploadedFileToAI = async (file: File) => {
        try {
            const label = await uploadVideoAndGetLabel(file); // Gửi file upload lên backend.
            const aiResponseText = `AI hiểu nội dung file của bạn là: "${label}".`;
            onNewAIMessage(aiResponseText);
        } catch (error: any) {
            const message =
                typeof error?.message === 'string'
                    ? error.message
                    : 'Đã xảy ra lỗi khi xử lý file.';
            onNewAIMessage(`Xin lỗi, có lỗi khi xử lý file: ${message}`);
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
                            onSendToAI={async () => {
                                // Giữ nguyên hành vi text tạm thời: trả về câu mẫu.
                                const aiResponseText =
                                    'Hey, would you be free to grab some dinner tonight?';
                                onNewAIMessage(aiResponseText);
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