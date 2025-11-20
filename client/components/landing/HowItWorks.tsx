import React from 'react';
import { VideoIcon, BrainCircuitIcon, MessageSquareIcon } from '../common/Icons';

const StepCard: React.FC<{
    icon: React.ReactNode;
    number: string;
    title: string;
    description: string;
}> = ({ icon, number, title, description }) => (
    <div className="relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 text-center group">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white">
            {number}
        </div>
        <div className="mt-8 mb-6 inline-flex p-4 rounded-full bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">
            {description}
        </p>
    </div>
);

const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Workflow</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Simple, powerful communication.
                    </h3>
                    <p className="text-xl text-gray-600">
                        From gesture to text in three simple steps.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 transform -translate-y-1/2"></div>

                    <StepCard
                        number="1"
                        icon={<VideoIcon className="w-8 h-8" />}
                        title="Record Video"
                        description="Simply record a short video of your gestures, signs, or expressions directly in the browser."
                    />
                    <StepCard
                        number="2"
                        icon={<BrainCircuitIcon className="w-8 h-8" />}
                        title="AI Interpretation"
                        description="Our AI analyzes the visual data to understand your meaning and intent with high accuracy."
                    />
                    <StepCard
                        number="3"
                        icon={<MessageSquareIcon className="w-8 h-8" />}
                        title="Text Output"
                        description="The interpreted message is instantly converted into text, ready to be sent to your friends."
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
