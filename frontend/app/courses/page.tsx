"use client";

import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import CourseList from '../../components/CourseList';
import AllOrderHistory from '../../components/AllOrderHistory';

const CoursesPage: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-900 font-inter">
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>

            <div className="flex flex-col flex-1">
                <Header title="課程" />

                <main className="flex-1 p-6 md:p-8 bg-gray-900">
                    <CourseList showSelection={true} />
                    <AllOrderHistory />
                </main>
            </div>
        </div>
    );
};

export default CoursesPage;
