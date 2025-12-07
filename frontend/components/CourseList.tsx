"use client";

import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import { Course } from '../types/course';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types/order';

interface CourseListProps {
    courses?: Course[]; // Optional: courses data passed from parent
    limit?: number; // Optional limit for number of courses to display
    showSelection?: boolean; // Whether to show selection state
    containerClassName?: string; // Optional container styling
    loading?: boolean; // Optional: loading state from parent
    error?: string | null; // Optional: error state from parent
    selectedCourseId?: number | null; // Optional: controlled selected course ID from parent
    onCourseSelect?: (courseId: number) => void; // Optional: callback when course is selected
}

const CourseList: React.FC<CourseListProps> = ({ 
    courses: coursesProp,
    limit, 
    showSelection = false,
    containerClassName = "",
    loading: loadingProp,
    error: errorProp,
    selectedCourseId: selectedCourseIdProp,
    onCourseSelect
}) => {
    const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [purchasedCourseIds, setPurchasedCourseIds] = useState<Set<number>>(new Set());
    
    // Use controlled selectedCourseId if provided, otherwise use internal state
    const effectiveSelectedCourseId = selectedCourseIdProp !== undefined ? selectedCourseIdProp : selectedCourseId;
    
    const handleCourseSelect = (courseId: number) => {
        if (onCourseSelect) {
            onCourseSelect(courseId);
        } else {
            setSelectedCourseId(courseId);
        }
    };
    
    // Use props if provided, otherwise fetch data
    const isControlled = coursesProp !== undefined;
    const displayCourses = isControlled ? coursesProp : courses;
    const displayLoading = isControlled ? (loadingProp ?? false) : loading;
    const displayError = isControlled ? errorProp : error;
    
    // Handle controlled mode: set selected course when courses prop changes
    useEffect(() => {
        if (isControlled && coursesProp && coursesProp.length > 0 && showSelection) {
            if (selectedCourseIdProp === undefined) {
                // Only set internal state if not controlled
                setSelectedCourseId(coursesProp[0].id);
            }
        }
    }, [isControlled, coursesProp, showSelection, selectedCourseIdProp]);
    
    // Sync internal state with controlled prop
    useEffect(() => {
        if (selectedCourseIdProp !== undefined) {
            setSelectedCourseId(selectedCourseIdProp);
        }
    }, [selectedCourseIdProp]);

    // Handle uncontrolled mode: fetch courses
    useEffect(() => {
        // Only fetch if courses are not provided as props
        if (isControlled) {
            return;
        }

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
                if (coursesData.length > 0 && showSelection && selectedCourseIdProp === undefined) {
                    // Default to the first course being selected (only if not controlled)
                    setSelectedCourseId(coursesData[0].id);
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
    }, [API_URL, showSelection, isControlled, selectedCourseIdProp]);
    
    // Fetch user's purchased courses
    useEffect(() => {
        if (!user) {
            setPurchasedCourseIds(new Set());
            return;
        }
        
        const fetchPurchasedCourses = async () => {
            try {
                const response = await fetch(`${API_URL}/api/orders/user/${user.id}`, {
                    credentials: 'include',
                });
                if (!response.ok) {
                    return; // Silently fail if orders can't be fetched
                }
                
                const responseData = await response.json();
                if (responseData && responseData.data) {
                    const orders: Order[] = responseData.data;
                    console.log('All orders:', orders);
                    // Get course IDs that have PAID status
                    const paidOrders = orders.filter(order => {
                        const isPaid = order.status === 'PAID';
                        console.log(`Order ${order.orderNumber}: status=${order.status}, courseId=${order.courseId}, isPaid=${isPaid}`);
                        return isPaid;
                    });
                    console.log('Paid orders:', paidOrders);
                    const paidCourseIds = new Set(
                        paidOrders.map(order => Number(order.courseId)) // Ensure it's a number
                    );
                    console.log('Purchased course IDs:', Array.from(paidCourseIds));
                    setPurchasedCourseIds(paidCourseIds);
                }
            } catch (err) {
                console.error("Failed to fetch purchased courses:", err);
            }
        };
        
        fetchPurchasedCourses();
    }, [user, API_URL]);

    const finalDisplayCourses = limit ? displayCourses.slice(0, limit) : displayCourses;

    if (displayLoading) {
        return (
            <div className="text-yellow-400 text-lg mb-4">
                Loading course data from backend...
            </div>
        );
    }

    if (displayError) {
        return (
            <div className="text-red-500 text-lg mb-4">
                Error: {displayError}. Please check if the Spring Boot backend is running on {API_URL}.
            </div>
        );
    }

    if (displayCourses.length === 0) {
        return (
            <div className="text-yellow-400 text-lg mb-4">
                沒有找到課程資料。請確認後端是否正常運行，並且資料庫中是否有課程資料。
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${containerClassName}`}>
            {finalDisplayCourses.map(course => {
                const courseIdNum = Number(course.id);
                const isPurchased = purchasedCourseIds.has(courseIdNum);
                const isSelected = showSelection && effectiveSelectedCourseId === course.id;
                console.log(`Course ${course.id} (${course.title}): courseIdNum=${courseIdNum}, isPurchased=${isPurchased}, isSelected=${isSelected}, effectiveSelectedCourseId=${effectiveSelectedCourseId}`);
                return (
                    <div key={course.id} className="col-span-1 h-full">
                        <CourseCard 
                            data={course} 
                            isSelected={isSelected}
                            onSelect={() => handleCourseSelect(course.id)}
                            isPurchased={isPurchased}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default CourseList;
