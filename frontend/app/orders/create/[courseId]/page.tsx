"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import { Course, Chapter } from '../../../../types/course';

// Chapter Accordion Component
const ChapterAccordion: React.FC<{ chapters: Chapter[] }> = ({ chapters }) => {
    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
    
    const toggleChapter = (chapterId: number) => {
        const newExpanded = new Set(expandedChapters);
        if (newExpanded.has(chapterId)) {
            newExpanded.delete(chapterId);
        } else {
            newExpanded.add(chapterId);
        }
        setExpandedChapters(newExpanded);
    };
    
    // Calculate estimated start date (3 months from now, or use a fixed date)
    const getEstimatedDate = (orderIndex: number): string => {
        const baseDate = new Date('2025-09-29');
        const monthsToAdd = (orderIndex - 1) * 1; // Each chapter is 1 month apart
        const estimatedDate = new Date(baseDate);
        estimatedDate.setMonth(estimatedDate.getMonth() + monthsToAdd);
        const year = estimatedDate.getFullYear();
        const month = String(estimatedDate.getMonth() + 1).padStart(2, '0');
        const day = String(estimatedDate.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };
    
    return (
        <div className="space-y-2">
            {chapters.map((chapter) => {
                const isExpanded = expandedChapters.has(chapter.id);
                // const totalVideos = chapter.videos ? chapter.videos.length : 0;
                
                return (
                    <div key={chapter.id} className="bg-gray-700 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleChapter(chapter.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-600 transition-colors"
                        >
                            <div className="flex-1 text-left">
                                <div className="font-semibold text-white mb-1">{chapter.title}</div>
                                <div className="text-sm text-gray-400">
                                    本章節預計開課時間 {getEstimatedDate(chapter.orderIndex || 1)}
                                </div>
                            </div>
                            <div className="ml-4 text-gray-400">
                                {isExpanded ? '▼' : '▶'}
                            </div>
                        </button>
                        
                        {isExpanded && chapter.videos && chapter.videos.length > 0 && (
                            <div className="px-4 pb-4 border-t border-gray-600">
                                <ul className="mt-3 space-y-2">
                                    {chapter.videos
                                        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                                        .map((video) => (
                                            <li key={video.id} className="text-gray-300 text-sm flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>{video.title}</span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const CreateOrderPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const courseId = params?.courseId as string;
    const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        
        const fetchCourse = async () => {
            if (!courseId) return;
            
            try {
                const response = await fetch(`${API_URL}/api/courses/${courseId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const responseData = await response.json();
                let courseData: Course;
                if (responseData && responseData.data) {
                    courseData = responseData.data;
                } else {
                    courseData = responseData as Course;
                }
                
                setCourse(courseData);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                console.error("Failed to fetch course:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCourse();
    }, [courseId, isAuthenticated, router, API_URL]);
    
    const handleNextStep = async () => {
        if (!user || !course) return;
        
        try {
            // Create order
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    courseId: course.id
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create order');
            }
            
            const responseData = await response.json();
            if (responseData && responseData.data) {
                // Redirect to payment page with order number
                router.push(`/orders/payment/${responseData.data.orderNumber}`);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            console.error("Failed to create order:", err);
        }
    };
    
    const extractPrice = (priceText: string): { original?: number; current?: number } => {
        // Try to extract prices from text like "NT$ 7,999" or "現在購買僅需 NT$7,999 (原價 NT$15,999)"
        let original: number | undefined;
        let current: number | undefined;
        
        // Find original price (原價) - should be in parentheses
        const originalMatch = priceText.match(/原價[\s]*NT\$[\s]*([\d,]+)/);
        if (originalMatch) {
            original = parseInt(originalMatch[1].replace(/,/g, ''));
        }
        
        // Find current price - usually comes before 原價 or is the first price
        // Look for pattern like "NT$7,999" or "僅需 NT$7,999"
        const currentMatch = priceText.match(/(?:僅需|現在購買僅需|NT\$)[\s]*NT\$[\s]*([\d,]+)/);
        if (currentMatch) {
            current = parseInt(currentMatch[1].replace(/,/g, ''));
        } else {
            // Fallback: find first price that's not the original
            const allPrices = Array.from(priceText.matchAll(/NT\$[\s]*([\d,]+)/g));
            if (allPrices.length > 0) {
                const firstPrice = parseInt(allPrices[0][1].replace(/,/g, ''));
                // If we have original and first price is different, use first as current
                if (original && firstPrice !== original) {
                    current = firstPrice;
                } else if (!original) {
                    // No original price, use first as current
                    current = firstPrice;
                }
            }
        }
        
        return { original, current };
    };
    
    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-900 items-center justify-center">
                <div className="text-yellow-400 text-lg">載入中...</div>
            </div>
        );
    }
    
    if (error || !course) {
        return (
            <div className="flex min-h-screen bg-gray-900 items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-4">錯誤: {error || '無法載入課程資訊'}</div>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                        返回首頁
                    </button>
                </div>
            </div>
        );
    }
    
    const prices = extractPrice(course.priceText || '');
    
    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                            1
                        </div>
                        <div className="ml-2 text-white font-semibold">建立訂單</div>
                    </div>
                    <div className="w-16 h-1 bg-gray-600 mx-4"></div>
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 text-white font-bold">
                            2
                        </div>
                        <div className="ml-2 text-gray-400 font-semibold">完成支付</div>
                    </div>
                    <div className="w-16 h-1 bg-gray-600 mx-4"></div>
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 text-white font-bold">
                            3
                        </div>
                        <div className="ml-2 text-gray-400 font-semibold">開始上課!</div>
                    </div>
                </div>
                
                {/* Course Title */}
                <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
                
                {/* Course Description */}
                {course.description && (
                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                        <div className="text-gray-300 whitespace-pre-line">{course.description}</div>
                    </div>
                )}
                
                {/* Discount Notice */}
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6 flex items-start">
                    <span className="text-yellow-400 text-xl mr-2">⚠️</span>
                    <p className="text-yellow-200 text-sm">
                        若你曾購買過《軟體設計模式精通之旅》或者《AI x BDD 行為驅動開發工作坊》,請私訊 LINE 客服,索取課程折價券。
                    </p>
                </div>
                
                {/* Curriculum/Material Guarantee */}
                {course.chapters && course.chapters.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center">
                                <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">i</span>
                                教材保證: 八大章節 x 78 個單元 x 5 道實戰題目
                            </h2>
                            <a href="#" className="text-blue-400 hover:text-blue-300 text-sm">
                                詳細開課時程承諾
                            </a>
                        </div>
                        <ChapterAccordion chapters={course.chapters} />
                    </div>
                )}
                
                {/* Pricing Section */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400">售價</span>
                        <div className="flex items-center space-x-3">
                            {prices.original && (
                                <span className="text-gray-500 line-through">NT$ {prices.original.toLocaleString()}</span>
                            )}
                            {prices.current && (
                                <span className="text-green-400 text-2xl font-bold">NT$ {prices.current.toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                        使用銀角零卡分期付款,最低每期只需付 383元
                    </p>
                </div>
                
                {/* Next Step Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleNextStep}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg text-lg font-bold transition-colors"
                    >
                        下一步:選取付款方式
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderPage;

