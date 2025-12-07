"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Course } from '../../../types/course';
import { useAuth } from '../../../contexts/AuthContext';
import { Order } from '../../../types/order';

const CourseDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const courseId = params?.courseId as string;
    const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); 
    
    useEffect(() => {
        const fetchCourseAndRedirect = async () => {
            if (!courseId) return;
            
            try {
                // Check if user has purchased this course
                let isPurchased = false;
                if (user) {
                    try {
                        const ordersResponse = await fetch(`${API_URL}/api/orders/user/${user.id}`, {
                            credentials: 'include',
                        });
                        if (ordersResponse.ok) {
                            const ordersData = await ordersResponse.json();
                            if (ordersData && ordersData.data) {
                                const orders: Order[] = ordersData.data;
                                const courseIdNum = Number(courseId);
                                // Check if there's a PAID order for this course
                                isPurchased = orders.some(
                                    order => order.courseId === courseIdNum && order.status === 'PAID'
                                );
                            }
                        }
                    } catch (err) {
                        console.error("Failed to fetch orders:", err);
                        // Continue with course fetch even if orders fetch fails
                    }
                }
                
                // If not purchased, redirect to order page
                if (!isPurchased) {
                    router.replace(`/orders/create/${courseId}`);
                    return;
                }
                
                // If purchased, fetch course and redirect to first chapter
                const response = await fetch(`${API_URL}/api/courses/${courseId}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const responseData = await response.json();
                
                // 处理两种格式：ApiResponse 包装格式或直接对象格式
                let courseData: Course;
                if (responseData && responseData.data) {
                    courseData = responseData.data;
                } else {
                    courseData = responseData as Course;
                }
                
                // Redirect to first chapter if available
                if (courseData.chapters && courseData.chapters.length > 0) {
                    const firstChapter = courseData.chapters[0];
                    router.replace(`/courses/${courseId}/chapters/${firstChapter.id}`);
                } else {
                    setError('此課程沒有章節');
                    setLoading(false);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                console.error("Failed to fetch course:", err);
                setLoading(false);
            }
        };
        
        fetchCourseAndRedirect();
    }, [courseId, API_URL, router, user]);
    
    // Show loading or error state while redirecting
    return (
        <div className="flex min-h-screen bg-gray-900 font-inter items-center justify-center">
            {loading && (
                <div className="text-center">
                    <div className="text-yellow-400 text-lg mb-4">載入中...</div>
                </div>
            )}
            {error && (
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-4">錯誤: {error}</div>
                    <button
                        onClick={() => router.push('/courses')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                        返回課程列表
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseDetailPage;