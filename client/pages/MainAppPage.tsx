import React, { useContext, useState } from 'react'; // Import React & context.
import { AppContext } from '../App'; // App context.
import { Page, ChatMessage } from '../types'; // Kiểu page/message.
import InputColumn from '../components/main/InputColumn'; // Cột input.
import ConversationColumn from '../components/main/ChatColumn'; // Cột chat.
import { LogoIcon } from '../components/common/Icons'; // Logo.
import { summarizeConversation } from '../services/gemini'; // Helper tóm tắt Gemini.

const MainAppPage: React.FC = () => {
    const app = useContext(AppContext);
    const { navigateTo } = app!;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSummarizing, setIsSummarizing] = useState(false); // Flag đang summarize.
    const [summarizeError, setSummarizeError] = useState<string | null>(null); // Lưu lỗi summarize.

    const handleNewAIMessage = (text: string) => {
        const newMessage: ChatMessage = {
            id: Date.now(),
            sender: 'User (AI)',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleNewFriendMessage = (text: string) => {
        const newMessage: ChatMessage = {
            id: Date.now(),
            sender: 'Friend',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleSummarize = async () => {
        if (messages.length < 2 || isSummarizing) return; // Không chạy nếu thiếu dữ liệu hoặc đang chạy.
        setSummarizeError(null); // Reset lỗi cũ.
        setIsSummarizing(true); // Bật loading.
        const conversationText = messages
            .map(msg => `${msg.sender}: ${msg.text.replace(/<br\s*\/?>/gi, '\n')}`)
            .join('\n'); // Chuẩn bị chuỗi hội thoại sạch.
        try {
        const summary = await summarizeConversation(conversationText); // Gọi Gemini.
            const summaryMessage: ChatMessage = {
                id: `summary-${Date.now()}`,
            sender: 'Summarize Conversation',
            text: summary,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }; // Tạo message summarize thuần văn bản.
            setMessages(prev => [...prev, summaryMessage]); // Thêm vào danh sách.
        } catch (error) {
            const message =
                (error as Error)?.message || 'Không thể tóm tắt hội thoại lúc này.'; // Lấy lỗi thân thiện.
            setSummarizeError(message); // Hiển thị lỗi.
        } finally {
            setIsSummarizing(false); // Tắt loading.
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-4 h-16 flex-shrink-0 flex items-center justify-between z-10">
                <div className="flex items-center space-x-2">
                    <LogoIcon className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold text-gray-800 hidden sm:inline">LReg</span>
                </div>
                <div className="text-lg font-semibold text-gray-700 hidden md:block">AI Communication Assistant</div>
                <button onClick={() => navigateTo(Page.Landing)} className="text-sm font-medium text-gray-600 hover:text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                    Back to Home
                </button>
            </header>

            <main className="flex-grow flex-1 flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/2 lg:w-3/5 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <InputColumn onNewAIMessage={handleNewAIMessage} />
                </div>
                <div className="w-full md:w-1/2 lg:w-2/5 h-full flex flex-col">
                    {summarizeError && (
                        <div className="m-3 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                            {summarizeError}
                        </div>
                    )}
                    <ConversationColumn 
                        messages={messages} 
                        onSendMessage={handleNewFriendMessage} 
                        onSummarize={handleSummarize}
                        isSummarizing={isSummarizing}
                    />
                </div>
            </main>
        </div>
    );
};

export default MainAppPage;