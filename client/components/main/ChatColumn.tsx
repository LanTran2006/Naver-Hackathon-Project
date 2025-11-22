import React, { useEffect, useMemo, useRef, useState } from 'react'; // Import React hooks để quản lý UI.
import { ChatMessage } from '../../types'; // Định nghĩa kiểu message.
import { SendIcon, MicIcon, FileTextIcon } from '../common/Icons'; // Biểu tượng UI.
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'; // Hook đọc giọng.
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'; // Hook nhận dạng giọng nói.
import SpeechControls from './SpeechControls'; // Component popover bật/tắt đọc tự động.
import { useTranslation } from 'react-i18next';

interface ConversationColumnProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    onSummarize: () => void;
    isSummarizing: boolean;
}

const ConversationColumn: React.FC<ConversationColumnProps> = ({ messages, onSendMessage, onSummarize, isSummarizing }) => {
    const { t } = useTranslation();
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [inputText, setInputText] = useState(''); // State input người dùng.
    const [isSpeechEnabled, setIsSpeechEnabled] = useState(false); // Cho biết đang bật đọc tự động hay không.
    const [lastSpokenId, setLastSpokenId] = useState<ChatMessage['id'] | null>(null); // Lưu ID message AI đã đọc.

    const {
        isSupported: isSpeechSupported,
        isSpeaking,
        speak,
        stop: stopSpeech
    } = useSpeechSynthesis({ lang: 'vi-VN' }); // Khởi tạo hook đọc giọng tiếng Việt.

    const {
        isSupported: isRecognitionSupported,
        isListening,
        transcript,
        error: recognitionError,
        start: startRecognition,
        stop: stopRecognition,
        resetError: resetRecognitionError
    } = useSpeechRecognition({ lang: 'vi-VN' }); // Khởi tạo hook nhận dạng giọng nói.

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSend = () => {
        if (inputText.trim() === '') return; // Không gửi khi rỗng.
        onSendMessage(inputText); // Gửi thẳng qua parent.
        setInputText(''); // Reset input.
        if (isListening) { // Nếu đang nghe thì dừng để tránh thu âm tiếp.
            stopRecognition(); // Dừng nhận dạng.
        } // Hết kiểm tra đang nghe.
    };

    const handleVoiceInput = () => {
        if (!isRecognitionSupported) { // Nếu trình duyệt không hỗ trợ.
            return; // Không làm gì, UI đã báo lỗi.
        }
        if (isListening) { // Nếu đang nghe thì bấm để dừng.
            stopRecognition(); // Dừng nhận dạng.
            return; // Thoát hàm.
        }
        resetRecognitionError(); // Xoá lỗi cũ trước khi bắt đầu.
        startRecognition(); // Bắt đầu thu âm.
    };

    const handleToggleSpeech = () => {
        if (!isSpeechSupported) { // Không hỗ trợ thì không cho bật.
            return;
        }
        setIsSpeechEnabled((prev) => {
            const next = !prev; // Đảo trạng thái.
            if (next) { // Nếu vừa bật.
                const latestAi = [...messages]
                    .reverse()
                    .find((msg) => msg.sender === 'User (AI)'); // Tìm message AI mới nhất.
                setLastSpokenId(latestAi ? latestAi.id : null); // Đánh dấu đã đọc hết cũ.
            } else {
                stopSpeech(); // Khi tắt thì dừng ngay mọi câu đang đọc.
            }
            return next; // Cập nhật state.
        });
    };

    const latestAiMessage = useMemo(
        () => [...messages].reverse().find((msg) => msg.sender === 'User (AI)'),
        [messages]
    ); // Tìm message AI mới nhất để tái sử dụng.

    useEffect(() => {
        if (!isSpeechEnabled || !isSpeechSupported) {
            return; // Không đọc khi chưa bật hoặc không hỗ trợ.
        }
        if (!latestAiMessage) {
            return; // Không có message AI để đọc.
        }
        if (lastSpokenId === latestAiMessage.id) {
            return; // Đã đọc message này rồi.
        }
        const cleanText = latestAiMessage.text.replace(/<br\s*\/?>/gi, '\n'); // Chuẩn hoá xuống dòng.
        speak(cleanText, () => {
            setLastSpokenId(latestAiMessage.id); // Đánh dấu đã đọc xong.
        });
        setLastSpokenId(latestAiMessage.id); // Ngăn đọc lại nếu speak chưa callback.
    }, [isSpeechEnabled, isSpeechSupported, latestAiMessage, lastSpokenId, speak]);

    useEffect(() => {
        if (!transcript) {
            return; // Không cập nhật khi không có kết quả mới.
        }
        setInputText(transcript); // Đưa văn bản vừa nhận vào ô input.
    }, [transcript]);

    useEffect(() => {
        if (isSpeechEnabled) {
            return; // Chỉ dừng khi người dùng tắt.
        }
        stopSpeech(); // Dừng mọi câu đang đọc khi tắt.
    }, [isSpeechEnabled, stopSpeech]);

    return (
        <div className="bg-white border-l border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0 flex items-center justify-between gap-3 flex-wrap">
                 <h3 className="font-semibold text-gray-800 text-lg">{t('app.chat.title')}</h3>
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
                        className="flex items-center space-x-2 text-sm font-medium text-primary hover:bg-primary-light px-3 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FileTextIcon className="w-4 h-4" />
                        <span>{isSummarizing ? t('app.chat.summarizing') : t('app.chat.summarize')}</span>
                    </button>
                 </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                {messages.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                        <svg className="w-16 h-16 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0 0 12 22z"></path></svg>
                        <p className="font-medium">{t('app.chat.emptyTitle')}</p>
                        <p className="text-sm">{t('app.chat.emptySubtitle')}</p>
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
                        placeholder={t('app.chat.replyPlaceholder')}
                        className="flex-grow px-4 py-3 border border-gray-300 rounded-full bg-gray-100 focus:ring-primary focus:border-primary focus:bg-white"
                    />
                     <button
                        onClick={handleVoiceInput}
                        className={`p-3 rounded-full transition ${
                            isListening ? 'text-red-500 animate-pulse bg-red-50' : 'text-gray-500 hover:text-primary hover:bg-gray-100'
                        } ${isRecognitionSupported ? '' : 'cursor-not-allowed opacity-60'}`}
                        disabled={!isRecognitionSupported}
                     >
                        <MicIcon className="w-6 h-6"/>
                    </button>
                    <button onClick={handleSend} className="bg-primary text-white p-3 rounded-full hover:bg-primary-hover transition shadow disabled:bg-gray-400" disabled={!inputText}>
                        <SendIcon className="w-6 h-6"/>
                    </button>
                </div>
                {isListening && (
                    <p className="mt-2 text-sm text-primary">{t('app.speech.listening')}</p>
                )}
                {recognitionError && (
                    <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{recognitionError}</p>
                )}
                {!isRecognitionSupported && (
                    <p className="mt-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
                        {t('app.speech.browserNote')}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ConversationColumn;