import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { Page, ChatMessage } from '../types';
import InputColumn from '../components/main/InputColumn';
import ConversationColumn from '../components/main/ChatColumn';
import { LogoIcon } from '../components/common/Icons';

const MainAppPage: React.FC = () => {
    const app = useContext(AppContext);
    const { navigateTo } = app!;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSummarizing, setIsSummarizing] = useState(false);

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
        if (messages.length < 2) return;
        setIsSummarizing(true);
        const conversationText = messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
        console.log("Summarizing conversation:\n", conversationText);

        // Placeholder for Gemini API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        const summary = "This is a placeholder summary of the conversation. It appears you were discussing dinner plans and decided to meet at 7 PM.";

        const summaryMessage: ChatMessage = {
            id: `summary-${Date.now()}`,
            sender: 'User (AI)',
            text: `**Summary of the conversation:**\n${summary}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, summaryMessage]);
        setIsSummarizing(false);
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