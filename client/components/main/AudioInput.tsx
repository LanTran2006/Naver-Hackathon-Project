import React, { useState, useRef } from 'react';
import { UploadCloudIcon, SparklesIcon } from '../common/Icons';

interface FileUploadInputProps {
    onSendToAI: (file: File) => Promise<void>;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({ onSendToAI }) => {
    const [isSending, setIsSending] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSendUploaded = async () => {
        if (!uploadedFile) return; // Skip when no file is selected.
        setIsSending(true); // Mark as sending.
        console.log('Sending uploaded file to AI backend');
        try {
            await onSendToAI(uploadedFile); // Pass uploaded file to parent handler.
        } finally {
            setIsSending(false); // Always clear sending state.
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleClearUpload = () => {
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="audio/*,video/*"
            />

            {uploadedFile ? (
                <div className="w-full space-y-4 p-4 md:p-0 text-center">
                    <p className="font-semibold">File Preview: <span className="font-normal text-gray-600 truncate">{uploadedFile.name}</span></p>
                    {uploadedFile.type.startsWith('audio/') && (
                        <audio src={URL.createObjectURL(uploadedFile)} controls className="w-full" />
                    )}
                    {uploadedFile.type.startsWith('video/') && (
                        <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden relative border border-gray-200">
                             <video src={URL.createObjectURL(uploadedFile)} controls className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleClearUpload} className="w-full bg-secondary text-gray-700 font-medium py-3 rounded-lg hover:bg-secondary-hover transition">
                            Choose another file
                        </button>
                        <button onClick={handleSendUploaded} disabled={isSending} className="w-full bg-accent text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:bg-gray-400">
                             <SparklesIcon className="w-5 h-5" />
                            {isSending ? 'Sending...' : 'Send file to AI'}
                        </button>
                    </div>
                </div>
            ) : (
                <div 
                    onClick={handleUploadClick}
                    className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-100 hover:border-primary transition"
                >
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <UploadCloudIcon className="w-16 h-16 mb-4" />
                        <p className="font-semibold text-lg">Click to select a file</p>
                        <p className="text-sm">or drag and drop audio/video files here</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploadInput;