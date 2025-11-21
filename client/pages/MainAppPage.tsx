import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Page, ChatMessage } from '../types';
import InputColumn from '../components/main/InputColumn';
import ConversationColumn from '../components/main/ChatColumn';
import { LogoIcon, VideoIcon, MessageSquareIcon } from '../components/common/Icons';
import { summarizeConversation } from '../services/gemini';

const MainAppPage: React.FC = () => {
    const app = useContext(AppContext);
    const { navigateTo } = app!;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summarizeError, setSummarizeError] = useState<string | null>(null);
    const messageIdCounter = React.useRef(0);

    // Mobile responsive state
    const [mobileTab, setMobileTab] = useState<'input' | 'chat'>('input');

    const handleNewAIMessage = (text: string) => {
        messageIdCounter.current += 1;
        const newMessage: ChatMessage = {
            id: `ai-${Date.now()}-${messageIdCounter.current}`,
            sender: 'User (AI)',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
        // Auto-switch to chat on mobile when new message arrives
        if (window.innerWidth < 768) {
            // Optional: setMobileTab('chat'); 
            // User requested: "only open when selected", so maybe don't auto-switch?
            // But a notification dot would be nice.
        }
    };

    const handleNewFriendMessage = (text: string) => {
        messageIdCounter.current += 1;
        const newMessage: ChatMessage = {
            id: `friend-${Date.now()}-${messageIdCounter.current}`,
            sender: 'Friend',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleSummarize = async () => {
        if (isSummarizing) return;
        setSummarizeError(null);
        setIsSummarizing(true);
        const summarizableMessages = messages.filter(
            (msg) => msg.sender === 'Friend' || msg.sender === 'User (AI)'
        );

        if (summarizableMessages.length < 2) {
            setIsSummarizing(false);
            setSummarizeError('Cần ít nhất một lượt trao đổi giữa Friend và AI để tóm tắt.');
            return;
        }

        const conversationText = summarizableMessages
            .map((msg) => {
                const role = msg.sender === 'Friend' ? 'Friend' : 'AI';
                const cleanText = msg.text.replace(/<br\s*\/?>/gi, '\n');
                return `${role}: ${cleanText}`;
            })
            .join('\n');
        try {
            const summary = await summarizeConversation(conversationText);
            const summaryMessage: ChatMessage = {
                id: `summary-${Date.now()}`,
                sender: 'Summarize Conversation',
                text: summary,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, summaryMessage]);
        } catch (error) {
            const message =
                (error as Error)?.message || 'Không thể tóm tắt hội thoại lúc này.';
            setSummarizeError(message);
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 h-20 flex-shrink-0 flex items-center justify-between z-20 sticky top-0">
                <div className="flex items-center gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
                        <LogoIcon className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 hidden sm:inline">
                        LReg
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-2 px-5 py-2 bg-gray-100 rounded-full border border-gray-200">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-600">AI Communication Assistant</span>
                </div>

                <button
                    onClick={() => navigateTo(Page.Landing)}
                    className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                    <span>Back to Home</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
            </header>

            <main className="flex-grow flex-1 flex flex-col md:flex-row overflow-hidden relative">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-50">
                    <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100/50 blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-100/50 blur-3xl"></div>
                </div>

                {/* Input Column - Hidden on mobile if chat tab is active */}
                <div className={`w-full md:w-1/2 lg:w-3/5 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth ${mobileTab === 'chat' ? 'hidden md:block' : 'block'}`}>
                    <InputColumn onNewAIMessage={handleNewAIMessage} />
                </div>

                {/* Chat Column - Hidden on mobile if input tab is active */}
                <div className={`w-full md:w-1/2 lg:w-2/5 h-full flex flex-col border-l border-gray-200/50 bg-white/50 backdrop-blur-sm ${mobileTab === 'input' ? 'hidden md:flex' : 'flex'}`}>
                    {summarizeError && (
                        <div className="m-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 flex items-center gap-2 shadow-sm">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button
                    onClick={() => setMobileTab('input')}
                    className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'input' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <VideoIcon className="w-6 h-6" />
                    <span className="text-xs font-medium">Input</span>
                </button>
                <button
                    onClick={() => setMobileTab('chat')}
                    className={`flex flex-col items-center gap-1 transition-colors ${mobileTab === 'chat' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <div className="relative">
                        <MessageSquareIcon className="w-6 h-6" />
                        {messages.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </div>
                    <span className="text-xs font-medium">Chat</span>
                </button>
            </div>
        </div>
    );
};

export default MainAppPage;