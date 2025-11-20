import React from 'react';
import { BrainCircuitIcon, MessageSquareIcon, SparklesIcon, HistoryIcon, MicIcon, VideoIcon } from '../common/Icons';

const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
}> = ({ icon, title, description, color }) => (
    <div className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${color} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">
            {description}
        </p>
    </div>
);

const Features: React.FC = () => {
    const features = [
        {
            icon: <BrainCircuitIcon className="w-7 h-7 text-blue-600" />,
            title: "AI Interpretation",
            description: "State-of-the-art AI translates visual gestures and audio cues into clear, understandable text in real-time.",
            color: "bg-blue-50"
        },
        {
            icon: <MessageSquareIcon className="w-7 h-7 text-purple-600" />,
            title: "Real-time Chat",
            description: "Seamless two-way communication interface designed for speed and clarity, making conversations natural.",
            color: "bg-purple-50"
        },
        {
            icon: <SparklesIcon className="w-7 h-7 text-amber-600" />,
            title: "Smart Rephrasing",
            description: "Get intelligent suggestions to refine your messages, ensuring your intent is conveyed perfectly.",
            color: "bg-amber-50"
        },
        {
            icon: <MicIcon className="w-7 h-7 text-red-600" />,
            title: "Voice UX",
            description: "Integrated Web Speech API allows for hands-free operation with voice-to-text and text-to-speech capabilities.",
            color: "bg-red-50"
        },
        {
            icon: <HistoryIcon className="w-7 h-7 text-green-600" />,
            title: "Session History",
            description: "Keep track of your generated messages during your session to easily reference past interactions.",
            color: "bg-green-50"
        },
        {
            icon: <VideoIcon className="w-7 h-7 text-indigo-600" />,
            title: "Video Input",
            description: "Upload or record video clips directly in the browser for immediate AI analysis and translation.",
            color: "bg-indigo-50"
        }
    ];

    return (
        <section id="features" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Features</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Everything you need to communicate.
                    </h3>
                    <p className="text-xl text-gray-600">
                        Powerful tools built to bridge the gap between speech-impaired users and the world.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
