"use client";

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

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
    const router = useRouter();
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

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
                <div className="flex items-center space-x-3">
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                                data-testid="logout-button"
                            >
                                登出
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => router.push('/login')}
                            className="px-4 py-2 bg-[#ffd700] text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-md"
                        >
                            登入
                        </button>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
