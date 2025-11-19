import React, { useRef, useEffect, useState } from 'react'; // Import React hooks.
import { ChatMessage } from '../../types'; // Định nghĩa kiểu message.
import { SendIcon, MicIcon, FileTextIcon } from '../common/Icons'; // Biểu tượng UI.

interface ConversationColumnProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    onSummarize: () => void;
    isSummarizing: boolean;
}

const ConversationColumn: React.FC<ConversationColumnProps> = ({ messages, onSendMessage, onSummarize, isSummarizing }) => {
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [inputText, setInputText] = useState(''); // State input người dùng.
    const [isRecording, setIsRecording] = useState(false); // Flag voice mock.

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSend = () => {
        if (inputText.trim() === '') return; // Không gửi khi rỗng.
        onSendMessage(inputText); // Gửi thẳng qua parent.
        setInputText(''); // Reset input.
    };

    const handleVoiceInput = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            // Simulate voice-to-text
            setInputText('Thinking...');
            setTimeout(() => {
                setInputText('This is a simulated voice-to-text reply.');
                setIsRecording(false);
            }, 2000);
        }
    };

    return (
        <div className="bg-white border-l border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
                 <h3 className="font-semibold text-gray-800 text-lg">Conversation</h3>
                 <button 
                    onClick={onSummarize} 
                    disabled={messages.length < 2 || isSummarizing}
                    className="flex items-center space-x-2 text-sm font-medium text-primary hover:bg-primary-light px-3 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    <FileTextIcon className="w-4 h-4" />
                    <span>{isSummarizing ? 'Summarizing...' : 'Summarize'}</span>
                 </button>
            </div>
            
            {/* Chat Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                {messages.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                        <svg className="w-16 h-16 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0 0 12 22z"></path></svg>
                        <p className="font-medium">AI responses will appear here.</p>
                        <p className="text-sm">Use an input method on the left to start a conversation.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'Friend' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.sender === 'Friend' ? 'bg-gray-200 text-gray-800 rounded-br-lg' : 'bg-primary text-white rounded-bl-lg'}`}>
                                    <p className="font-bold text-sm mb-1">{msg.sender}</p>
                                    <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                                    <p className={`text-xs mt-1 text-right ${msg.sender === 'Friend' ? 'text-gray-500' : 'text-blue-200'}`}>{msg.timestamp}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <input 
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Reply here..."
                        className="flex-grow px-4 py-3 border border-gray-300 rounded-full bg-gray-100 focus:ring-primary focus:border-primary focus:bg-white"
                    />
                     <button onClick={handleVoiceInput} className={`p-3 rounded-full hover:bg-gray-100 transition ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-primary'}`}>
                        <MicIcon className="w-6 h-6"/>
                    </button>
                    <button onClick={handleSend} className="bg-primary text-white p-3 rounded-full hover:bg-primary-hover transition shadow disabled:bg-gray-400" disabled={!inputText}>
                        <SendIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConversationColumn;