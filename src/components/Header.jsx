import React from 'react';

const Header = () => {
    return (
        <header className="bg-slate-800 p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {/* Simple sun icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                    </svg>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
                        WeatherRegist
                    </h1>
                </div>
                <nav>
                    {/* Placeholder for future nav items */}
                </nav>
            </div>
        </header>
    );
};

export default Header;
