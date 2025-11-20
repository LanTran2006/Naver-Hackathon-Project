import React from 'react';

const Step: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="flex gap-6">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-200">
            {number}
        </div>
        <div className="flex-1 pb-10 border-l border-gray-200 ml-5 pl-8 last:border-0 last:pb-0">
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <div className="text-gray-600 leading-relaxed">
                {children}
            </div>
        </div>
    </div>
);

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
    <div className="mt-4 bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm text-gray-300 font-mono">
            <code>{code}</code>
        </pre>
    </div>
);

const UserGuide: React.FC = () => {
    return (
        <section id="user-guide" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="lg:w-1/3">
                        <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Get Started</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Setup in minutes.
                        </h3>
                        <p className="text-xl text-gray-600 mb-8">
                            Follow these simple steps to get LReg running locally on your machine.
                        </p>
                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                            <h4 className="font-bold text-blue-900 mb-2">Prerequisites</h4>
                            <ul className="space-y-2 text-blue-800">
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Node.js installed
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Git (optional)
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:w-2/3">
                        <div className="space-y-2">
                            <Step number="1" title="Install Dependencies">
                                <p>Open your terminal in the project directory and run:</p>
                                <CodeBlock code="npm install" />
                            </Step>

                            <Step number="2" title="Configure Environment">
                                <p>Create a file named <code>.env</code> in the root directory and add your API keys. This is crucial for AI features.</p>
                                <CodeBlock code={`# .env file
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_APYHUB_API_KEY=your_apyhub_key_here`} />
                                <p className="mt-2 text-sm text-gray-500 italic">
                                    Note: You can get a Gemini API key from Google AI Studio and ApyHub key from ApyHub.
                                </p>
                            </Step>

                            <Step number="3" title="Run the App">
                                <p>Start the development server:</p>
                                <CodeBlock code="npm run dev" />
                                <p className="mt-2">The app will open in your default browser at <code>http://localhost:5173</code>.</p>
                            </Step>

                            <Step number="4" title="Using Voice Features">
                                <p>
                                    To use the Voice UX, ensure you are using a supported browser (Chrome, Edge).
                                    Click the microphone icon to start voice input, and enable the "AI Voice" toggle to hear responses read aloud.
                                </p>
                            </Step>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserGuide;
