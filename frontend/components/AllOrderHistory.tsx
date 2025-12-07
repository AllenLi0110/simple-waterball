"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types/order';

const AllOrderHistory: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        
        const fetchAllOrders = async () => {
            try {
                const response = await fetch(`${API_URL}/api/orders/user/${user.id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const responseData = await response.json();
                if (responseData && responseData.data) {
                    setOrders(responseData.data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAllOrders();
    }, [user, API_URL]);
    
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };
    
    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'PENDING':
                return { text: '待付款', color: 'bg-blue-500', icon: '⏰' };
            case 'PAID':
                return { text: '已付款', color: 'bg-green-500', icon: '✓' };
            case 'CANCELLED':
                return { text: '已取消', color: 'bg-red-500', icon: '✗' };
            default:
                return { text: status, color: 'bg-gray-500', icon: '?' };
        }
    };
    
    const handleCompleteOrder = (orderNumber: string) => {
        router.push(`/orders/payment/${orderNumber}`);
    };
    
    if (!user) {
        return null;
    }
    
    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg p-6 mt-8">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="mr-2">📋</span>
                    訂單紀錄
                </h2>
                <div className="text-gray-400">載入中...</div>
            </div>
        );
    }
    
    if (error || orders.length === 0) {
        return null; // Don't show anything if no orders
    }
    
    return (
        <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">📋</span>
                訂單紀錄
            </h2>
            
            <div className="space-y-4">
                {orders.map((order) => {
                    const statusDisplay = getStatusDisplay(order.status);
                    const isPending = order.status === 'PENDING';
                    const isCancelled = order.status === 'CANCELLED';
                    
                    return (
                        <div key={order.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold flex items-center ${statusDisplay.color}`}>
                                    <span className="mr-1">{statusDisplay.icon}</span>
                                    {statusDisplay.text}
                                </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-400">訂單編號：</span>
                                    <span className="text-white font-mono">{order.orderNumber}</span>
                                </div>
                                
                                {isPending && order.paymentDeadline && (
                                    <div>
                                        <span className="text-gray-400">付款截止日期：</span>
                                        <span className="text-white">{formatDate(order.paymentDeadline)}</span>
                                    </div>
                                )}
                                
                                {order.paymentDate && (
                                    <div>
                                        <span className="text-gray-400">付款日期：</span>
                                        <span className="text-white">{formatDate(order.paymentDate)}</span>
                                    </div>
                                )}
                                
                                <div>
                                    <span className="text-gray-400">課程名稱：</span>
                                    <span className="text-white">{order.courseTitle}</span>
                                </div>
                                
                                {order.remarks && (
                                    <div>
                                        <span className="text-gray-400">備註：</span>
                                        <span className="text-white">{order.remarks}</span>
                                    </div>
                                )}
                            </div>
                            
                            {isPending && !isCancelled && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => handleCompleteOrder(order.orderNumber)}
                                        className="px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                                    >
                                        立即完成訂單
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AllOrderHistory;
