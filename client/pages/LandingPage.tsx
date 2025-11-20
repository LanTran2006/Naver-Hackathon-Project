import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { Page } from '../types';
import { LogoIcon } from '../components/common/Icons';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import UserGuide from '../components/landing/UserGuide';
import About from '../components/landing/About';
import Footer from '../components/landing/Footer';

const Header: React.FC = () => {
    const app = useContext(AppContext);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-4 sm:py-5'}`}>
            <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <LogoIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">LReg</span>
                </div>
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition">Features</a>
                    <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium transition">How it Works</a>
                    <a href="#user-guide" className="text-gray-600 hover:text-blue-600 font-medium transition">Setup Guide</a>
                    <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium transition">About</a>
                </nav>
                <button
                    onClick={() => app?.navigateTo(Page.MainApp)}
                    className={`font-semibold px-4 py-2 sm:px-6 sm:py-2.5 text-sm sm:text-base rounded-full transition shadow-sm ${scrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-gray-50'}`}
                >
                    Launch App
                </button>
            </div>
        </header>
    );
};

const LandingPage: React.FC = () => {
    return (
        <div className="bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <UserGuide />
                <About />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
