"use client"; // Next.js App Router requires this for client-side functionality

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CourseList from '../components/CourseList';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Course, ApiResponse } from '../types/course';
import { FileText, BookOpen, Users, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HomePage: React.FC = () => {
    const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMenu, setSelectedMenu] = useState<string>('');
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    
    useEffect(() => {
        const fetchCourses = async () => {
            try {                
                console.log('Fetching courses from:', `${API_URL}/api/courses`);
                const response = await fetch(`${API_URL}/api/courses`);
                
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseData = await response.json();
                console.log('API Response:', responseData);
                
                // 处理两种格式：ApiResponse 包装格式或直接数组格式
                let coursesData: Course[] = [];
                if (Array.isArray(responseData)) {
                    // 直接数组格式
                    coursesData = responseData;
                } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
                    // ApiResponse 包装格式
                    coursesData = responseData.data;
                } else {
                    console.warn('Unexpected response format:', responseData);
                }
                
                console.log('Courses data:', coursesData);
                console.log('Number of courses:', coursesData.length);
                
                setCourses(coursesData);
                if (coursesData.length > 0) {
                    // Default to the first course title
                    setSelectedMenu(coursesData[0].title);
                    // Default to the first course being selected
                    setSelectedCourseId(coursesData[0].id);
                } else {
                    console.warn('No courses found in response');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(errorMessage);
                console.error("Failed to fetch courses:", err);
                console.error("Error details:", {
                    message: errorMessage,
                    apiUrl: `${API_URL}/api/courses`
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [API_URL]);

    const mainCourse = courses.find(c => c.title === selectedMenu) || (courses.length > 0 ? courses[0] : null);

    return (
        // flex-col ensures the header, main content, and footer stack vertically
        <div className="flex min-h-screen bg-gray-900 font-inter">
            {/* 1. Left Sidebar - fixed position is needed for full screen height */}
            <div className="sticky top-0 h-screen">
                <Sidebar />
            </div>

            {/* 2. Right Main Content Area */}
            <div className="flex flex-col flex-1">
                {/* 2A. Sticky Top Navigation Header */}
                <Header 
                    leftContent={
                        <>
                            <span className="text-2xl font-black text-yellow-400 md:hidden mr-4">WSA</span>                                                
                            <select
                                value={selectedMenu}
                                onChange={(e) => setSelectedMenu(e.target.value)}
                                className="bg-gray-700 text-white p-2 rounded-lg border-none focus:ring-yellow-500 focus:border-yellow-500 text-sm cursor-pointer"
                                disabled={loading || !!error || courses.length === 0}
                            >
                                {loading ? (
                                    <option>Loading courses...</option>
                                ) : error ? (
                                    <option>Error loading courses</option>
                                ) : (
                                    courses.map(c => (
                                        <option key={c.id} value={c.title}>{c.title}</option>
                                    ))
                                )}
                            </select>
                        </>
                    }
                />

                {/* 2B. Scrollable Main Content */}
                <main className="flex-1 p-6 md:p-8 bg-gray-900">
                    
                    {/* Error/Loading Messages */}
                    {loading && (
                        <div className="text-yellow-400 text-lg mb-4">Loading course data from backend...</div>
                    )}
                    {error && (
                        <div className="text-red-500 text-lg mb-4">
                            Error: {error}. Please check if the Spring Boot backend is running on {API_URL}.
                        </div>
                    )}

                    {mainCourse && (
                        <>
                            {/* Top Announcement/Discount Message */}
                            <div className="bg-[#1c1f2e] text-white p-4 rounded-lg border border-gray-400 flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm md:text-base">
                                    <Link href="/courses/1" className="hover:underline">
                                        將軟體設計精通之旅體驗課程的全部影片看完就可以獲得 3000 元課程折價券！
                                    </Link>
                                </p>
                                <Link href="/courses/1">
                                    <button className="ml-4 px-4 py-3 bg-[#ffd700] text-gray-900 text-sm font-bold rounded-lg hover:bg-yellow-400 transition-colors shrink-0">
                                        前往
                                    </button>
                                </Link>
                            </div>

                        </>
                    )}

                    {/* Course Card Grid Layout */}
                    {courses.length === 0 && !loading && !error && (
                        <div className="text-yellow-400 text-lg mb-4">
                            沒有找到課程資料。請確認後端是否正常運行，並且資料庫中是否有課程資料。
                        </div>
                    )}
                    {/* Big Card Container with yellow top border */}
                    <div className="bg-[#1c1f2e] rounded-xl overflow-hidden p-6 mb-12 relative">
                        {/* Yellow top border with rounded corners */}
                        <div className="absolute top-0 left-0 right-0 h-[8px] bg-[#ffd700] rounded-t"></div>
                        
                        {/* Title and Description inside the card */}
                        <div className="mb-8 pt-4">
                            <h1 className="text-3xl font-bold text-white mb-6">
                                歡迎來到水球軟體學院
                            </h1>
                            <div className="text-white max-w-4xl space-y-4">
                                <p>
                                    水球軟體學院提供最先進的軟體設計思路教材，並透過線上 Code Review 來帶你掌握進階軟體架構能力。
                                </p>
                                <p>
                                    只要每週投資 5 小時，就能打造不平等的優勢，成為硬核的 Coding 實戰高手。
                                </p>
                            </div>
                        </div>

                        {/* Course Cards - Display only 3 cards */}
                        <CourseList 
                            courses={courses} 
                            limit={3} 
                            showSelection={true}
                            loading={loading}
                            error={error}
                        />
                    </div>

                    {/* Information Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card 1: 軟體設計模式之旅課程 */}
                        <div className="bg-[#1c1f2e] rounded-lg p-6 flex flex-col">
                            <div className="flex items-center mb-4">
                                <FileText className="text-white w-8 h-8 mr-3" />
                                <h3 className="text-xl font-bold text-white">軟體設計模式之旅課程</h3>
                            </div>
                            <p className="text-gray-300 mb-6 grow">
                                「用一趟旅程的時間，成為硬核的 Coding 高手」—精通一套高效率的 OOAD 思路。
                            </p>
                            <Link 
                                href="/units"
                                className="bg-[#ffd700] text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center w-fit"
                            >
                                查看課程 <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>

                        {/* Card 2: 水球潘的部落格 */}
                        <div className="bg-[#1c1f2e] rounded-lg p-6 flex flex-col">
                            <div className="flex items-center mb-4">
                                <BookOpen className="text-white w-8 h-8 mr-3" />
                                <h3 className="text-xl font-bold text-white">水球潘的部落格</h3>
                            </div>
                            <p className="text-gray-300 mb-6 grow">
                                觀看水球撰寫的軟體工程師職涯、軟體設計模式及架構學問，以及領域驅動設計等公開文章。
                            </p>
                            <a 
                                href="https://world.waterballsa.tw/journeys/software-design-pattern"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#ffd700] text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center w-fit"
                            >
                                閱讀文章 <ArrowRight className="ml-2 w-5 h-5" />
                            </a>
                        </div>

                        {/* Card 3: 直接與老師或是其他工程師交流 */}
                        <div className="bg-[#1c1f2e] rounded-lg p-6 flex flex-col">
                            <div className="flex items-center mb-4">
                                <Users className="text-white w-8 h-8 mr-3" />
                                <h3 className="text-xl font-bold text-white">直接與老師或是其他工程師交流</h3>
                            </div>
                            <p className="text-gray-300 mb-6 grow">
                                加入水球成立的工程師 Discord 社群，與水球以及其他工程師線上交流，培養學習習慣及樂趣。
                            </p>
                            <div className="flex space-x-3">
                                <a 
                                    href="https://www.facebook.com/groups/waterballsa.tw"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#ffd700] text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center w-fit"
                                >
                                    加入 Facebook 社團 <ArrowRight className="ml-2 w-5 h-5" />
                                </a>
                                <a 
                                    href="https://discord.com/invite/PAtkRHSmKp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#ffd700] text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center w-fit"
                                >
                                    加入 Discord <ArrowRight className="ml-2 w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Card 4: 技能評級及證書系統 */}
                        <div className="bg-[#1c1f2e] rounded-lg p-6 flex flex-col">
                            <div className="flex items-center mb-4">
                                <Star className="text-white w-8 h-8 mr-3" />
                                <h3 className="text-xl font-bold text-white">技能評級及證書系統</h3>
                            </div>
                            <p className="text-gray-300 mb-6 grow">
                                通過技能評級、獲取證書，打造你的職涯籌碼，讓你在就業市場上脫穎而出。
                            </p>
                            <a 
                                href="https://world.waterballsa.tw/skills-intro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#ffd700] text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors inline-flex items-center w-fit"
                            >
                                了解更多 <ArrowRight className="ml-2 w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </main>
                
                {/* 2C. Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default HomePage;