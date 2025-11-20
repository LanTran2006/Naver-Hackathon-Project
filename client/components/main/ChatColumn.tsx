import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChatMessage } from '../../types';
import { SendIcon, MicIcon, FileTextIcon } from '../common/Icons';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import SpeechControls from './SpeechControls';

interface ConversationColumnProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    onSummarize: () => void;
    isSummarizing: boolean;
}

const ConversationColumn: React.FC<ConversationColumnProps> = ({ messages, onSendMessage, onSummarize, isSummarizing }) => {
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [inputText, setInputText] = useState('');
    const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
    const [lastSpokenId, setLastSpokenId] = useState<ChatMessage['id'] | null>(null);

    const {
        isSupported: isSpeechSupported,
        isSpeaking,
        speak,
        stop: stopSpeech
    } = useSpeechSynthesis({ lang: 'vi-VN' });

    const {
        isSupported: isRecognitionSupported,
        isListening,
        transcript,
        error: recognitionError,
        start: startRecognition,
        stop: stopRecognition,
        resetError: resetRecognitionError
    } = useSpeechRecognition({ lang: 'vi-VN' });

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (inputText.trim() === '') return;
        onSendMessage(inputText);
        setInputText('');
        if (isListening) {
            stopRecognition();
        }
    };

    const handleVoiceInput = () => {
        if (!isRecognitionSupported) {
            return;
        }
        if (isListening) {
            stopRecognition();
            return;
        }
        resetRecognitionError();
        startRecognition();
    };

    const handleToggleSpeech = () => {
        if (!isSpeechSupported) {
            return;
        }
        setIsSpeechEnabled((prev) => {
            const next = !prev;
            if (next) {
                const latestAi = [...messages]
                    .reverse()
                    .find((msg) => msg.sender === 'User (AI)');
                setLastSpokenId(latestAi ? latestAi.id : null);
            } else {
                stopSpeech();
            }
            return next;
        });
    };

    const latestAiMessage = useMemo(
        () => [...messages].reverse().find((msg) => msg.sender === 'User (AI)'),
        [messages]
    );

    useEffect(() => {
        if (!isSpeechEnabled || !isSpeechSupported) {
            return;
        }
        if (!latestAiMessage) {
            return;
        }
        if (lastSpokenId === latestAiMessage.id) {
            return;
        }
        const cleanText = latestAiMessage.text.replace(/<br\s*\/?>/gi, '\n');
        speak(cleanText, () => {
            setLastSpokenId(latestAiMessage.id);
        });
        setLastSpokenId(latestAiMessage.id);
    }, [isSpeechEnabled, isSpeechSupported, latestAiMessage, lastSpokenId, speak]);

    useEffect(() => {
        if (!transcript) {
            return;
        }
        setInputText(transcript);
    }, [transcript]);

    useEffect(() => {
        if (isSpeechEnabled) {
            return;
        }
        stopSpeech();
    }, [isSpeechEnabled, stopSpeech]);

    return (
        <div className="h-full flex flex-col bg-transparent">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex-shrink-0 flex items-center justify-between gap-3 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-8 rounded-full bg-blue-500"></div>
                    <h3 className="font-bold text-gray-800 text-lg">Conversation</h3>
                </div>
                <div className="flex items-center gap-2">
                    <SpeechControls
                        isEnabled={isSpeechEnabled}
                        isSupported={isSpeechSupported}
                        isSpeaking={isSpeaking}
                        onToggle={handleToggleSpeech}
                    />
                    <button
                        onClick={onSummarize}
                        disabled={messages.length < 2 || isSummarizing}
                        className="flex items-center space-x-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
                    >
                        <FileTextIcon className="w-4 h-4" />
                        <span>{isSummarizing ? 'Summarizing...' : 'Summarize'}</span>
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-6 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <svg className="w-10 h-10 text-gray-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0 0 12 22z"></path></svg>
                        </div>
                        <p className="font-semibold text-gray-600 text-lg mb-2">No messages yet</p>
                        <p className="text-sm max-w-xs mx-auto">Start a conversation by recording a video, uploading a file, or typing a message.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map(msg => {
                            const isFriend = msg.sender === 'Friend';
                            return (
                                <div key={msg.id} className={`flex ${isFriend ? 'justify-end' : 'justify-start'} items-end gap-2 group`}>
                                    {!isFriend && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
                                            AI
                                        </div>
                                    )}

                                    <div className={`max-w-[85%] lg:max-w-[75%] p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${isFriend
                                            ? 'bg-white text-gray-800 rounded-br-none border border-gray-100'
                                            : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-bl-none'
                                        }`}>
                                        {!isFriend && <p className="text-[10px] font-bold text-blue-100 uppercase tracking-wider mb-1">AI Assistant</p>}
                                        {isFriend && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">You</p>}

                                        <p className="leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                                        <p className={`text-[10px] mt-2 text-right ${isFriend ? 'text-gray-400' : 'text-blue-200'}`}>{msg.timestamp}</p>
                                    </div>

                                    {isFriend && (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0">
                                            You
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>
                )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-100 bg-white/90 backdrop-blur-md flex-shrink-0">
                <div className="relative flex items-center gap-2 max-w-3xl mx-auto">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="w-full pl-5 pr-24 py-4 border-0 bg-gray-100 rounded-full text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                    />

                    <div className="absolute right-2 flex items-center gap-1">
                        <button
                            onClick={handleVoiceInput}
                            className={`p-2.5 rounded-full transition-all duration-200 ${isListening
                                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
                                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                                } ${!isRecognitionSupported && 'opacity-50 cursor-not-allowed'}`}
                            disabled={!isRecognitionSupported}
                            title="Voice Input"
                        >
                            <MicIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSend}
                            className={`p-2.5 rounded-full transition-all duration-200 ${inputText
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            disabled={!inputText}
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {isListening && (
                    <p className="mt-3 text-center text-sm text-blue-600 font-medium animate-pulse">
                        Listening... speak naturally
                    </p>
                )}
                {recognitionError && (
                    <p className="mt-2 text-center text-sm text-red-500 bg-red-50 py-1 px-3 rounded-full inline-block mx-auto">
                        {recognitionError}
                    </p>
                )}
                {!isRecognitionSupported && (
                    <p className="mt-2 text-center text-xs text-gray-400">
                        Voice input not supported in this browser
                    </p>
                )}
            </div>
        </div>
    );
};

export default ConversationColumn;