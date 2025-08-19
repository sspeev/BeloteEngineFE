import React from "react";
import './Welcome.css';

export default function Welcome() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Top section - Dark Gray */}
            <div className="bg-gray-800 text-white relative flex-grow pt-2 pb-24 overflow-hidden">
                {/* Version number */}
                <div className="absolute left-4 top-2 text-lg font-semibold">
                    ALFA 0.0.1
                </div>

                {/* Decorative spade in top right */}
                <div className="absolute right-0 top-0 w-64 h-64 opacity-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M50 0 L75 40 Q100 80 50 100 Q0 80 25 40 Z" fill="gray" />
                    </svg>
                </div>

                {/* Decorative club in left */}
                <div className="absolute left-0 bottom-0 w-48 h-48 transform rotate-12 -translate-x-12 translate-y-12 opacity-70">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="25" r="25" fill="#00c000" />
                        <circle cx="25" cy="60" r="25" fill="#00c000" />
                        <circle cx="75" cy="60" r="25" fill="#00c000" />
                        <path d="M50 40 L50 100" stroke="#00c000" strokeWidth="25" />
                    </svg>
                </div>

                {/* Main content */}
                <div className="container mx-auto flex flex-col items-center justify-center mt-20">
                    <h1 className="text-5xl md:text-7xl font-bold text-center">
                        Play <span className="text-green-500">Belote</span> online free
                        <br />with friends
                    </h1>

                    <div className="flex space-x-12 mt-12">
                        <button className="px-8 py-3 rounded-full bg-gray-700 text-white font-medium border border-green-500 shadow-lg shadow-green-500/20 hover:bg-gray-600 transition-all">
                            Create game
                        </button>
                        <button className="px-8 py-3 rounded-full bg-gray-700 text-white font-medium border border-green-500 shadow-lg shadow-green-500/20 hover:bg-gray-600 transition-all">
                            Join game
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom section - Green */}
            <div className="bg-green-600 text-white relative flex-grow overflow-hidden">
                {/* Decorative spade in bottom right */}
                <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M50 0 L75 40 Q100 80 50 100 Q0 80 25 40 Z" fill="gray" />
                    </svg>
                </div>

                <div className="container mx-auto py-12 flex flex-wrap">
                    {/* Cards display */}
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div className="relative h-80 w-64">
                            {/* Multiple stacked cards effect */}
                            <div className="absolute top-0 left-0 h-72 w-56 bg-white rounded-lg shadow-lg transform -rotate-12"></div>
                            <div className="absolute top-0 left-0 h-72 w-56 bg-white rounded-lg shadow-lg transform -rotate-6"></div>
                            <div className="absolute top-0 left-0 h-72 w-56 bg-white rounded-lg shadow-lg transform rotate-0"></div>
                            <div className="absolute top-0 left-0 h-72 w-56 bg-white rounded-lg shadow-lg transform rotate-6"></div>
                            {/* Jack card showing on top */}
                            <div className="absolute top-0 left-0 h-72 w-56 bg-white rounded-lg shadow-lg flex flex-col p-2 transform rotate-6 border border-gray-300">
                                <div className="text-xl font-bold text-red-600 self-start">J</div>
                                <div className="text-xl text-red-600 self-start">♥</div>
                                <div className="flex-grow flex items-center justify-center">
                                    <div className="bg-gray-200 w-36 h-48 rounded"></div>
                                </div>
                                <div className="text-xl font-bold text-red-600 self-end transform rotate-180">J</div>
                                <div className="text-xl text-red-600 self-end transform rotate-180">♥</div>
                            </div>
                        </div>
                    </div>

                    {/* Text description */}
                    <div className="w-full md:w-2/3 text-white text-center flex items-center">
                        <p className="text-2xl px-8 leading-relaxed">
                            Az shte sum konkurentsiq na Belot.bg. Ako ne vi se davat pari i vi se tsuka s priqteli ste na pravilnoto mqsto! Are mazna i priqtna igra!
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 text-white text-center py-2">
                © Stoyan Peev 2025
            </div>
        </div>
    );
}