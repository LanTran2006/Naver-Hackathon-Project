

import React, { useState, useContext } from 'react';
// FIX: Import AppContext as AuthContext to fix missing export error.
// App.tsx exports AppContext, but this file uses AuthContext.
import { AppContext as AuthContext } from '../App';
import { Page, User } from '../types';
import { LogoIcon } from '../components/common/Icons';

const LoginForm: React.FC = () => {
    const auth = useContext(AuthContext);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder login
        const user: User = { name: 'Demo User', email: 'demo@lreg.com', avatarUrl: 'https://picsum.photos/seed/user/100/100' };
        auth?.login(user);
    };

    return (
        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
                <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div>
                 <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
                <input type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>
                <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:text-primary-hover">Forgot password?</a>
                </div>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-hover transition">
                Log in
            </button>
        </form>
    );
};


const RegisterForm: React.FC = () => {
    const auth = useContext(AuthContext);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder register
        const user: User = { name: 'Demo User', email: 'demo@lreg.com', avatarUrl: 'https://picsum.photos/seed/user/100/100' };
        auth?.login(user);
    };

    return (
        <form onSubmit={handleRegister} className="space-y-6">
            <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Full name</label>
                <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>
             <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
                <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div>
                 <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
                <input type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div>
                 <label className="text-sm font-medium text-gray-700 block mb-2">I am a</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white">
                    <option>Speech-impaired user</option>
                    <option>Family or Friend</option>
                    <option>Professional</option>
                </select>
            </div>
            <div className="flex items-center">
                <input id="terms" type="checkbox" required className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">I agree to the <a href="#" className="font-medium text-primary hover:text-primary-hover">Terms & Privacy</a></label>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-hover transition">
                Create account
            </button>
        </form>
    );
};


const AuthPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
    const auth = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <a onClick={() => auth?.navigateTo(Page.Landing)} className="absolute top-4 left-4 text-sm text-gray-600 hover:text-primary cursor-pointer">&larr; Back to home</a>
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <LogoIcon className="mx-auto h-12 w-auto text-primary" />
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome to LReg</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('login')}
                                className={`${activeTab === 'login' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
                            >
                                Log in
                            </button>
                            <button
                                onClick={() => setActiveTab('signup')}
                                className={`${activeTab === 'signup' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
                            >
                                Sign up
                            </button>
                        </nav>
                    </div>

                    {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">or</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path>
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                         <div className="mt-6 text-center text-sm text-gray-600">
                            {activeTab === 'login' ? (
                                <p>Don't have an account? <button onClick={() => setActiveTab('signup')} className="font-medium text-primary hover:text-primary-hover">Sign up</button></p>
                            ) : (
                                <p>Already have an account? <button onClick={() => setActiveTab('login')} className="font-medium text-primary hover:text-primary-hover">Log in</button></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
