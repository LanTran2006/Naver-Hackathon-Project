
import React, { useState } from 'react';
import { SparklesIcon } from '../common/Icons';
import { useTranslation } from 'react-i18next';
import { normalizeUserPrompt } from '../../services/gemini';

interface TextInputProps {
    onSendToAI: (suggestion: string) => Promise<void> | void;
}

const TextInput: React.FC<TextInputProps> = ({ onSendToAI }) => {
    const { t } = useTranslation();
    const [text, setText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async () => {
        if (text.trim() === '') return;
        setIsSending(true);
        setError(null);
        try {
            const normalized = await normalizeUserPrompt(text);
            await onSendToAI(normalized);
            setText('');
        } catch (err) {
            const message =
                (err as Error)?.message || 'Không thể hiểu câu này, thử lại nhé.';
            setError(message);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="w-full flex flex-col">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                placeholder={t('app.text.placeholder')}
                className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-primary focus:border-primary"
            />
            {error && (
                <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                </p>
            )}
            <button
                onClick={handleSend}
                disabled={isSending || text.trim() === ''}
                className="mt-4 w-full bg-accent text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 hover:bg-green-600 transition disabled:bg-gray-400"
            >
                <SparklesIcon className="w-6 h-6" />
                {isSending ? t('app.text.understanding') : t('app.text.understandThis')}
            </button>
        </div>
    );
};

export default TextInput;
