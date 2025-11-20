import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { Page } from '../../types';
import GradientText from '../ui/GradientText';

const Hero: React.FC = () => {
    const app = useContext(AppContext);

    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-200/30 blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100">
                            <span className="text-sm font-medium text-blue-600 tracking-wide uppercase">
                                AI-Powered Communication
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6 tracking-tight flex flex-col items-start">
                            <span className="block -ml-2 sm:-ml-4">Translate</span>
                            <span className="block ml-8 sm:ml-16 text-gray-800">gestures</span>
                            <div className="ml-16 sm:ml-32 mt-2">
                                <GradientText
                                    colors={["#000000", "#a3a3a3", "#000000", "#a3a3a3", "#000000"]}
                                    animationSpeed={5}
                                    showBorder={false}
                                    className="text-5xl lg:text-7xl font-bold mx-0"
                                >
                                    into words.
                                </GradientText>
                            </div>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Record your video, and let our AI interpret your gestures and expressions into clear, natural language instantly.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button
                                onClick={() => app?.navigateTo(Page.MainApp)}
                                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Launch App
                            </button>
                            <a
                                href="#how-it-works"
                                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                            >
                                Learn More
                            </a>
                        </div>

                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-gray-500 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span>Free to use</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span>No account required</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-[600px] lg:max-w-none">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
                            <img
                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                                alt="App Interface Preview"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
