"use client";

import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const ChallengeJourneyPage: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-900 font-inter">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>

            <div className="flex flex-col flex-1">
                <Header title="挑戰歷程" />

                <main className="flex-1 p-6 md:p-8 bg-gray-900">
                    <h1 className="text-3xl font-bold text-white mb-6">挑戰歷程</h1>
                    <p className="text-gray-400">這裡將顯示挑戰歷程內容...</p>
                </main>
            </div>
        </div>
    );
};

export default ChallengeJourneyPage;

