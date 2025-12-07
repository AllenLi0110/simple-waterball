'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Trophy, Album, Map, BookText, Gift, SquareChartGantt } from 'lucide-react';
import { Course, Chapter, Video } from '../types/course';

interface SidebarItem {
    icon: React.ElementType; 
    label: string;
    path: string;
    dividerBefore?: boolean; // Add divider before this item
}

interface SidebarProps {
    course?: Course | null;
    selectedChapter?: Chapter | null;
    selectedVideo?: Video | null;
    onChapterClick?: (chapter: Chapter) => void;
    onVideoClick?: (video: Video) => void;
    loading?: boolean;
    error?: string | null;
}

const sidebarItems: SidebarItem[] = [
    { icon: Home, label: '首頁', path: '/' },
    { icon: LayoutDashboard, label: '課程', path: '/courses' },
    { icon: Trophy, label: '排行榜', path: '/rankings', dividerBefore: true },
    { icon: Gift, label: '獎勵任務', path: '/rewards-tasks' },
    { icon: SquareChartGantt, label: '挑戰歷程', path: '/challenge-journey' },
    { icon: Album, label: '所有單元', path: '/units', dividerBefore: true },
    { icon: Map, label: '挑戰地圖', path: '/challenge-map' },
    { icon: BookText, label: 'SOP 寶典', path: '/sop' },
];

const Sidebar: React.FC<SidebarProps> = ({
    course,
    selectedChapter,
    selectedVideo,
    onChapterClick,
    onVideoClick,
    loading = false,
    error = null,
}) => {
    const pathname = usePathname();
    
    const formatDuration = (seconds?: number): string => {
        if (!seconds) return '';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Check if we're on a course detail page
    const isCourseDetailPage = course !== undefined;
    
    return (
    // w-56: Fixed width sidebar
    // flex-shrink-0: Prevents sidebar from shrinking when main content is tight
    // hidden md:flex: Hide on mobile, show on tablet and desktop
    <div className="w-58 bg-[#1c1f2e] text-gray-400 h-full shadow-2xl hidden md:flex md:flex-col shrink-0 sticky top-0 overflow-y-auto">
        {/* Logo Section */}
        <Link href="/" className="flex items-end space-x-2 mb-1 p-[10px] cursor-pointer hover:opacity-80 transition-opacity shrink-0">
            {/* Waterball Logo Image */}
            <img
                src="/images/waterball-logo.png"
                alt="Waterball Logo"
                className="w-[41.82px] h-[41.82px]"
            />
            {/* Logo Text */}
            <div className="flex flex-col leading-none m-0.5">
                <span className="text-sm font-bold text-sky-200">
                    水球軟體學院
                </span>
                <span className="text-sm font-bold tracking-wide text-sky-200 -mt-0.5">
                    WATERBALLSA.TW
                </span>
            </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto">
            {isCourseDetailPage ? (
                /* Course Navigation */
                <div className="p-4">
                    {loading && (
                        <div className="p-4 text-yellow-400">載入中...</div>
                    )}
                    {error && (
                        <div className="p-4 text-red-500">錯誤: {error}</div>
                    )}
                    {course && course.chapters && (
                        <div>
                            <h2 className="text-lg font-bold text-white mb-4">課程介紹&試聽</h2>
                            <div className="space-y-2">
                                {course.chapters
                                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                                    .map((chapter) => (
                                        <div
                                            key={chapter.id}
                                            onClick={() => onChapterClick?.(chapter)}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                                selectedChapter?.id === chapter.id
                                                    ? 'bg-[#ffd700] text-gray-900'
                                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                            }`}
                                        >
                                            <div className="flex items-start space-x-2">
                                                <div className="shrink-0 mt-1">
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm">
                                                        {chapter.title}
                                                    </div>
                                                    {chapter.videos && chapter.videos.length > 0 && (
                                                        <div className="text-xs mt-1 opacity-75">
                                                            {chapter.videos.length} 個影片
                                                        </div>
                                                    )}
                                                </div>
                                                {selectedChapter?.id === chapter.id && (
                                                    <div className="shrink-0">
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Video list for selected chapter */}
                                            {selectedChapter?.id === chapter.id && chapter.videos && chapter.videos.length > 0 && (
                                                <div className="mt-2 ml-7 space-y-1">
                                                    {chapter.videos
                                                        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                                                        .map((video) => (
                                                            <div
                                                                key={video.id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onVideoClick?.(video);
                                                                }}
                                                                className={`p-2 rounded text-xs cursor-pointer transition-colors ${
                                                                    selectedVideo?.id === video.id
                                                                        ? 'bg-yellow-600 text-gray-900'
                                                                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="truncate">{video.title}</span>
                                                                    {video.duration && (
                                                                        <span className="ml-2 text-xs opacity-75">
                                                                            {formatDuration(video.duration)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Regular Navigation */
                <>
                    {/* First Group: Home and Courses */}
                    <div className="relative flex w-full min-w-0 flex-col p-[15px]">
                        <div className="w-full text-sm">
                            <ul className="flex w-full min-w-0 flex-col gap-1">
                                {sidebarItems.slice(0, 2).map((item, index) => {
                                    const isActive = pathname === item.path;
                                    return (
                                        <li key={index} className="group/menu-item relative">
                                            <Link
                                                href={item.path}
                                                className={`peer/menu-button flex w-full items-center gap-[15px] overflow-hidden rounded-[20px] py-[12px] px-[10px] text-left outline-none transition-[width,height,padding] cursor-pointer h-8 text-sm ${
                                                    isActive 
                                                        ? 'bg-[#ffd700] text-gray-900 font-medium' 
                                                        : 'hover:bg-gray-800 text-white'
                                                }`}
                                            >
                                                <item.icon className={`size-4 shrink-0 ${isActive ? 'text-gray-900' : 'text-white'}`} />
                                                <span className={`truncate ${isActive ? 'text-gray-900' : 'text-white'}`}>{item.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    
                    {/* Divider after first group - full width */}
                    <div className="border-t border-gray-700 w-full my-2"></div>

                    {/* Second Group: Rankings, Rewards Tasks, Challenge Journey */}
                    <div className="p-[15px] space-y-1">
                        {sidebarItems.slice(2, 5).map((item, index) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={index + 2}
                                    href={item.path}
                                    className={`flex items-center py-[12px] px-[10px] rounded-[20px] cursor-pointer transition-colors h-8 text-sm gap-[15px] ${
                                        isActive 
                                            ? 'bg-[#ffd700] text-gray-900 font-medium' 
                                            : 'hover:bg-gray-800 text-white'
                                    }`}
                                >
                                    <item.icon className={`size-4 shrink-0 ${isActive ? 'text-gray-900' : 'text-white'}`} />
                                    <span className={`truncate ${isActive ? 'text-gray-900' : 'text-white'}`}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Divider between Rankings and Third Group - with 4px margin top and bottom */}
                    <div className="border-t border-gray-700 my-2"></div>

                    {/* Third Group: All Units, Challenge Map, SOP Encyclopedia */}
                    <div className="p-[15px] space-y-1">
                        {sidebarItems.slice(5).map((item, index) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={index + 5}
                                    href={item.path}
                                    className={`flex items-center py-[12px] px-[10px] rounded-[20px] cursor-pointer transition-colors h-8 text-sm gap-[15px] ${
                                        isActive 
                                            ? 'bg-[#ffd700] text-gray-900 font-medium' 
                                            : 'hover:bg-gray-800 text-white'
                                    }`}
                                >
                                    <item.icon className={`size-4 shrink-0 ${isActive ? 'text-gray-900' : 'text-white'}`} />
                                    <span className={`truncate ${isActive ? 'text-gray-900' : 'text-white'}`}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}
        </nav>
    </div>
    );
};

export default Sidebar;