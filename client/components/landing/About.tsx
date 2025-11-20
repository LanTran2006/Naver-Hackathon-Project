import React from 'react';

const About: React.FC = () => {
    return (
        <section id="about" className="py-24 bg-gray-900 text-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-8">About LReg</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
                    LReg was born from the Naver Hackathon Project with a singular mission: to break down communication barriers.
                    We believe that technology should serve everyone, and our AI-powered tools are designed to give a voice to those who need it most.
                </p>

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
                        <div className="text-gray-400">Available Anytime</div>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-4xl font-bold text-purple-400 mb-2">AI</div>
                        <div className="text-gray-400">Powered Intelligence</div>
                    </div>
                    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                        <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
                        <div className="text-gray-400">Free & Open</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
