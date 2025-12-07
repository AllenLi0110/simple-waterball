// Order type definitions
export interface Order {
    id: number;
    orderNumber: string;
    userId: number;
    userName: string;
    courseId: number;
    courseTitle: string;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    paymentDeadline: string; // ISO date string
    paymentDate?: string; // ISO date string
    remarks?: string;
    createdAt: string; // ISO date string
}

export interface CreateOrderRequest {
    userId: number;
    courseId: number;
}

