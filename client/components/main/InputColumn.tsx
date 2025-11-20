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
            onNewAIMessage(' Đang xử lý video...');

            const collectedWords: string[] = [];

            await uploadVideoInChunks(blob, (current, total, label) => {
                collectedWords.push(label);
                const progressText = ` Đang xử lý đoạn ${current}/${total}: "${label}"\n\n` +
                    `Kết quả hiện tại: ${collectedWords.join(' ')}`;
                onNewAIMessage(progressText);
            });

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
            const label = await uploadVideoAndGetLabel(file);
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
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
                {/* Tabs */}
                <div className="p-2 bg-gray-50/50 border-b border-gray-100">
                    <div className="flex p-1 bg-gray-100/80 rounded-2xl">
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
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-8">
                    <div className="min-h-[400px] flex flex-col">
                        {inputMode === 'video' && (
                            <div className="flex-1 rounded-2xl overflow-hidden bg-black shadow-inner">
                                <VideoInput onSendToAI={handleSendVideoToAI} />
                            </div>
                        )}
                        {inputMode === 'upload' && (
                            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-blue-50/30 transition-colors">
                                <FileUploadInput onSendToAI={handleSendUploadedFileToAI} />
                            </div>
                        )}
                        {inputMode === 'text' && (
                            <div className="flex-1">
                                <TextInput
                                    onSendToAI={async (suggestion) => {
                                        onNewAIMessage(`Gợi ý câu trả lời:\n${suggestion}`);
                                    }}
                                />
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group"
                            >
                                <span className={`transform transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </span>
                                {showAdvanced ? 'Hide' : 'Show'} advanced options
                            </button>

                            {showAdvanced && (
                                <div className="mt-4 grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Output detail</label>
                                        <div className="relative">
                                            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer hover:bg-white transition-colors">
                                                <option>Normal</option>
                                                <option>Short</option>
                                                <option>Detailed</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Tone</label>
                                        <div className="relative">
                                            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer hover:bg-white transition-colors">
                                                <option>Neutral</option>
                                                <option>Friendly</option>
                                                <option>Formal</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
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
        className={`flex-1 flex items-center justify-center font-medium py-2.5 px-4 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
    >
        {icon}
        {label}
    </button>
);

export default InputColumn;