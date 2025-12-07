// Course type definitions
export interface Video {
    id: number;
    title: string;
    description: string;
    videoUrl: string;
    orderIndex: number;
    duration?: number;
}

export interface Chapter {
    id: number;
    title: string;
    description: string;
    orderIndex: number;
    videos: Video[];
}

export interface Course {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    priceText: string;
    buttonLabel: string;
    imageUrl: string;
    imageSubtitle: string;
    isFeatured: boolean;
    chapters?: Chapter[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
