"use client";

import React, { ReactNode } from 'react';

interface HeaderProps {
    leftContent?: ReactNode;
    title?: string;
    rightContent?: ReactNode;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
    leftContent, 
    title, 
    rightContent,
    className = ""
}) => {
    return (
        <header className={`bg-[#1c1f2e] p-4 shadow-xl flex items-center justify-between sticky top-0 z-10 shrink-0 ${className}`}>
            {/* Left Content */}
            <div className="flex items-center ml-8">
                {leftContent || (title && (
                    <h1 className="text-xl font-bold text-white">{title}</h1>
                ))}
            </div>

            {/* Right Content */}
            {rightContent || (
                <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-[#ffd700] text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-md">
                        登入
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
