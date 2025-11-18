import React, { useState } from 'react';

interface AIInterpretationCardProps {
    coreIntent: string;
    fullSentence: string;
}

const AIInterpretationCard: React.FC<AIInterpretationCardProps> = ({ coreIntent, fullSentence }) => {
    const [copied, setCopied] = useState(false);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(fullSentence).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };
    
    const handlePlayAsVoice = () => {
        console.log('Placeholder: Text-to-speech for:', fullSentence);
    };

    const handleRephrase = () => {
        console.log('Placeholder: Rephrasing sentence.');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="mb-4">
                <label className="text-sm font-semibold text-gray-500">Core Intent</label>
                <p className="mt-1 text-gray-700 p-3 bg-gray-100 rounded-lg">{coreIntent}</p>
            </div>
            <div>
                <label className="text-sm font-semibold text-gray-500">Full Sentence</label>
                <p className="mt-1 text-gray-900 text-lg p-3 bg-primary-light rounded-lg font-medium text-primary-text">{fullSentence}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={handleCopyToClipboard} className="flex-1 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-hover transition min-w-[150px]">
                    {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button onClick={handlePlayAsVoice} className="flex-1 bg-secondary text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-secondary-hover transition min-w-[120px]">Play as voice</button>
                <button onClick={handleRephrase} className="flex-1 bg-secondary text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-secondary-hover transition min-w-[120px]">Rephrase for clarity</button>
            </div>
        </div>
    );
};

export default AIInterpretationCard;
