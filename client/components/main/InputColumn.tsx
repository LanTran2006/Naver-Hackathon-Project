import React, { useState } from 'react';
import { InputMode } from '../../types';
import VideoInput from './VideoInput';
import FileUploadInput from './AudioInput';
import TextInput from './TextInput';
import { VideoIcon, UploadCloudIcon, TypeIcon } from '../common/Icons';

interface InputColumnProps {
    onNewAIMessage: (text: string) => void;
}

const InputColumn: React.FC<InputColumnProps> = ({ onNewAIMessage }) => {
    const [inputMode, setInputMode] = useState<InputMode>('video');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSendToAI = async (source: string) => {
        console.log(`Sending to placeholder endpoint: POST /api/translate/${source}`);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        const aiResponseText = "Hey, would you be free to grab some dinner tonight?";
        onNewAIMessage(aiResponseText);
    };
    
    return (
        <div className="w-full max-w-4xl mx-auto">
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
                    {inputMode === 'video' && <VideoInput onSendToAI={() => handleSendToAI('video')} />}
                    {inputMode === 'upload' && <FileUploadInput onSendToAI={() => handleSendToAI('upload')} />}
                    {inputMode === 'text' && <TextInput onSendToAI={() => handleSendToAI('text')} />}

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