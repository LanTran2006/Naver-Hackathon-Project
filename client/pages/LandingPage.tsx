import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Page } from '../types';
import { LogoIcon, VideoIcon, BrainCircuitIcon, MessageSquareIcon, SparklesIcon, HistoryIcon, MicIcon } from '../components/common/Icons';
import VideoDemo from '../components/landing/VideoDemo';

const Header: React.FC = () => {
    const app = useContext(AppContext);

    return (
        <header className="bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <LogoIcon className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold text-gray-800">LReg</span>
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-gray-600 hover:text-primary transition">Features</a>
                    <a href="#howitworks" className="text-gray-600 hover:text-primary transition">How it works</a>
                    <a href="#faq" className="text-gray-600 hover:text-primary transition">FAQ</a>
                </nav>
                <button onClick={() => app?.navigateTo(Page.MainApp)} className="bg-primary text-white font-medium px-6 py-2 rounded-lg hover:bg-primary-hover transition shadow-sm">
                    Launch App
                </button>
            </div>
        </header>
    );
};

const Footer: React.FC = () => (
    <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
            <div className="flex justify-center items-center space-x-2 mb-4">
                 <LogoIcon className="h-6 w-6 text-gray-400" />
                 <span className="text-lg font-semibold text-gray-600">LReg</span>
            </div>
            <div className="flex justify-center space-x-6 mb-4">
                <a href="#" className="hover:text-primary">About</a>
                <a href="#" className="hover:text-primary">Terms</a>
                <a href="#" className="hover:text-primary">Privacy</a>
                <a href="#" className="hover:text-primary">Contact</a>
            </div>
            <p>&copy; {new Date().getFullYear()} LReg. All rights reserved.</p>
        </div>
    </footer>
);

const LandingPage: React.FC = () => {
    const app = useContext(AppContext);

    return (
        <div className="bg-white">
            <Header />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="py-20 md:py-32 bg-gray-50">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                                Give everyone a voice.
                            </h1>
                            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
                                LReg helps speech-impaired users communicate with friends in natural language using AI.
                            </p>
                            <div className="mt-8 flex justify-center md:justify-start">
                                <button onClick={() => app?.navigateTo(Page.MainApp)} className="bg-primary text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-primary-hover transition shadow-lg w-full sm:w-auto">
                                    Launch App
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <VideoDemo />
                        </div>
                    </div>
                </section>
                
                {/* How It Works Section */}
                <section id="howitworks" className="py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How it works</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            A simple, three-step process to seamless communication.
                        </p>
                        <div className="mt-12 grid md:grid-cols-3 gap-8">
                            <div className="bg-gray-50 p-8 rounded-xl">
                                <div className="bg-primary-light text-primary-text inline-flex p-4 rounded-full mb-4">
                                    <VideoIcon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">1. Record or Upload</h3>
                                <p className="mt-2 text-gray-600">Record or upload a short video or audio clip of what you want to communicate.</p>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-xl">
                                <div className="bg-primary-light text-primary-text inline-flex p-4 rounded-full mb-4">
                                    <BrainCircuitIcon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">2. AI Interpretation</h3>
                                <p className="mt-2 text-gray-600">Our AI understands gestures and speech, converting them into clear text.</p>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-xl">
                                <div className="bg-primary-light text-primary-text inline-flex p-4 rounded-full mb-4">
                                    <MessageSquareIcon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800">3. Communicate</h3>
                                <p className="mt-2 text-gray-600">Use the generated text to communicate clearly and effectively.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features Section */}
                <section id="features" className="py-20 bg-gray-50">
                     <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">Key Features</h2>
                        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
                                <div className="bg-primary-light text-primary-text flex-shrink-0 p-3 rounded-full"><BrainCircuitIcon className="h-6 w-6" /></div>
                                <div><h3 className="font-semibold text-gray-800">AI Video & Audio Interpretation</h3><p className="text-gray-600 text-sm mt-1">State-of-the-art AI to translate visual and auditory cues into text.</p></div>
                            </div>
                             <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
                                <div className="bg-primary-light text-primary-text flex-shrink-0 p-3 rounded-full"><MessageSquareIcon className="h-6 w-6" /></div>
                                <div><h3 className="font-semibold text-gray-800">Real-time Text Generation</h3><p className="text-gray-600 text-sm mt-1">Convert your intent into clear, natural language instantly.</p></div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
                                <div className="bg-primary-light text-primary-text flex-shrink-0 p-3 rounded-full"><SparklesIcon className="h-6 w-6" /></div>
                                <div><h3 className="font-semibold text-gray-800">AI-Assisted Rephrasing</h3><p className="text-gray-600 text-sm mt-1">Get intelligent suggestions to refine your message.</p></div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
                                <div className="bg-primary-light text-primary-text flex-shrink-0 p-3 rounded-full"><HistoryIcon className="h-6 w-6" /></div>
                                <div><h3 className="font-semibold text-gray-800">Temporary Session History</h3><p className="text-gray-600 text-sm mt-1">Keep track of your generated messages during your session.</p></div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
                                <div className="bg-primary-light text-primary-text flex-shrink-0 p-3 rounded-full"><MicIcon className="h-6 w-6" /></div>
                                <div><h3 className="font-semibold text-gray-800">Voice ↔ Text Conversion</h3><p className="text-gray-600 text-sm mt-1">Seamlessly convert text to speech and speech to text.</p></div>
                            </div>
                             <div className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4">
                                <div className="bg-primary-light text-primary-text flex-shrink-0 p-3 rounded-full"><svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
                                <div><h3 className="font-semibold text-gray-800">Accessible by Design</h3><p className="text-gray-600 text-sm mt-1">High contrast, large controls, and simple flows for everyone.</p></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Accessibility & Privacy Section */}
                <section className="py-20">
                    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                             <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Accessibility and Privacy First</h2>
                             <p className="mt-4 text-lg text-gray-600">We are committed to building a platform that is not only powerful but also inclusive and secure for all our users.</p>
                             <ul className="mt-6 space-y-4 text-gray-700">
                                <li className="flex items-start"><span className="text-accent mr-3 mt-1">&#10003;</span>Large buttons, big icons, and simple workflows for ease of use.</li>
                                <li className="flex items-start"><span className="text-accent mr-3 mt-1">&#10003;</span>High contrast and readable fonts to ensure clarity for visually impaired users.</li>
                                <li className="flex items-start"><span className="text-accent mr-3 mt-1">&#10003;</span>Your privacy is respected. No data is stored without an account.</li>
                             </ul>
                        </div>
                         <div className="flex justify-center">
                            <img src="https://picsum.photos/500/300?grayscale" alt="Abstract representation of security" className="rounded-lg shadow-xl"/>
                         </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20 bg-primary-light">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-primary-text">Ready to start communicating?</h2>
                        <p className="mt-2 text-lg text-gray-700">Try LReg's AI assistant now.</p>
                        <div className="mt-8 flex justify-center">
                            <button onClick={() => app?.navigateTo(Page.MainApp)} className="bg-primary text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-primary-hover transition shadow-lg">Launch App</button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
