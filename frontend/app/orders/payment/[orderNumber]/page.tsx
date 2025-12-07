"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import { Order } from '../../../../types/order';
import { Course } from '../../../../types/course';

const PaymentPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const orderNumber = params?.orderNumber as string;
    const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    const [order, setOrder] = useState<Order | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        
        const fetchOrder = async () => {
            if (!orderNumber) return;
            
            try {
                const response = await fetch(`${API_URL}/api/orders/number/${orderNumber}`);
                if (!response.ok) {
                    throw new Error('Failed to load order');
                }
                
                const responseData = await response.json();
                if (responseData && responseData.data) {
                    setOrder(responseData.data);
                    
                    // Fetch course details
                    const courseResponse = await fetch(`${API_URL}/api/courses/${responseData.data.courseId}`);
                    if (courseResponse.ok) {
                        const courseData = await courseResponse.json();
                        if (courseData && courseData.data) {
                            setCourse(courseData.data);
                        } else {
                            setCourse(courseData as Course);
                        }
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                console.error("Failed to fetch order:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrder();
    }, [orderNumber, isAuthenticated, router, API_URL]);
    
    const handlePayment = async () => {
        if (!order || !orderNumber) return;
        
        setIsProcessingPayment(true);
        
        try {
            const response = await fetch(`${API_URL}/api/orders/${orderNumber}/complete-payment`, {
                method: 'POST',
            });
            
            if (!response.ok) {
                throw new Error('Payment failed');
            }
            
            // Show success message for 3 seconds
            setShowSuccess(true);
            
            // Redirect to first chapter after 3 seconds
            setTimeout(() => {
                if (course && course.chapters && course.chapters.length > 0) {
                    const firstChapter = course.chapters[0];
                    router.push(`/courses/${course.id}/chapters/${firstChapter.id}`);
                } else {
                    router.push(`/courses/${order.courseId}`);
                }
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setIsProcessingPayment(false);
            console.error("Payment failed:", err);
        }
    };
    
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    };
    
    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-900 items-center justify-center">
                <div className="text-yellow-400 text-lg">載入中...</div>
            </div>
        );
    }
    
    if (error || !order) {
        return (
            <div className="flex min-h-screen bg-gray-900 items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-4">錯誤: {error || '無法載入訂單資訊'}</div>
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
                    <div className="w-16 h-1 bg-blue-600 mx-4"></div>
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                            2
                        </div>
                        <div className="ml-2 text-white font-semibold">完成支付</div>
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
                {course && <h1 className="text-3xl font-bold mb-6">{course.title}</h1>}
                
                {/* Order Details */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="mb-4">
                        <span className="text-gray-400">訂單編號：</span>
                        <span className="text-white font-mono">{order.orderNumber}</span>
                    </div>
                    <div className="mb-4">
                        <span className="text-gray-400">付款截止時間：</span>
                        <span className="text-white">{formatDate(order.paymentDeadline)}</span>
                    </div>
                </div>
                
                {/* Payment Instructions */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">付款說明</h2>
                    <p className="text-gray-300">恭喜你，訂單已建立完成，請你於三日內付款。</p>
                </div>
                
                {/* Payment Methods */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">付款方式</h2>
                    <p className="text-gray-400 mb-4">選取付款方式</p>
                    <div className="space-y-4">
                        <div className="border-2 border-gray-600 rounded-lg p-4 bg-gray-700 opacity-50 cursor-not-allowed">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-2xl">💳</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-400">ATM 匯款</div>
                                </div>
                            </div>
                        </div>
                        <div className="border-2 border-gray-600 rounded-lg p-4 bg-gray-700 opacity-50 cursor-not-allowed">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-2xl">💳</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-400">信用卡（一次付清）</div>
                                </div>
                            </div>
                        </div>
                        <div className="border-2 border-gray-600 rounded-lg p-4 bg-gray-700 opacity-50 cursor-not-allowed">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-400">銀角零卡分期</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>        
                
                {/* Payment Button */}
                <div className="flex justify-center">
                    {showSuccess ? (
                        <div className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-bold">
                            付款成功！
                        </div>
                    ) : (
                        <button
                            onClick={handlePayment}
                            disabled={isProcessingPayment || order.status !== 'PENDING'}
                            className={`px-8 py-4 rounded-lg text-lg font-bold ${
                                isProcessingPayment || order.status !== 'PENDING'
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-500'
                            }`}
                        >
                            {isProcessingPayment ? '處理中...' : '進行支付'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;

