import React from 'react';
import { LogoIcon } from '../common/Icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div className="flex items-center space-x-3 mb-6 md:mb-0">
                        <LogoIcon className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">LReg</span>
                    </div>
                    <div className="flex space-x-8">
                        <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                        <a href="#user-guide" className="text-gray-600 hover:text-blue-600 transition-colors">Guide</a>
                        <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} LReg. Naver Hackathon Project.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
