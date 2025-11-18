
import React, { useState } from 'react';
import { SparklesIcon } from '../common/Icons';

interface TextInputProps {
    onSendToAI: () => Promise<void>;
}

const TextInput: React.FC<TextInputProps> = ({ onSendToAI }) => {
    const [text, setText] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if(text.trim() === '') return;
        setIsSending(true);
        console.log(`Sending text: ${text}`);
        await onSendToAI();
        setIsSending(false);
    };

    return (
        <div className="w-full flex flex-col">
            <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                placeholder="Describe what you want to say..."
                className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-primary focus:border-primary"
            />
            <button
                onClick={handleSend}
                disabled={isSending || text.trim() === ''}
                className="mt-4 w-full bg-accent text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:bg-gray-400"
            >
                <SparklesIcon className="w-6 h-6" />
                {isSending ? 'Understanding...' : 'Understand this for me'}
            </button>
        </div>
    );
};

export default TextInput;
