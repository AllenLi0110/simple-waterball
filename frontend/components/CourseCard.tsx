"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '../types/course';

interface CourseCardProps {
    data: Course;
    isSelected?: boolean;
    onSelect?: (courseId: number) => void;
    isPurchased?: boolean; // Whether the user has purchased this course
}

const CourseCard: React.FC<CourseCardProps> = ({ data, isSelected = false, onSelect, isPurchased = false }) => {    
    const router = useRouter();
    const [imageError, setImageError] = React.useState(false);

    const handleClick = () => {
        if (onSelect) {
            onSelect(data.id);
        }
        // If purchased, go to course chapters
        if (isPurchased) {
            router.push(`/courses/${data.id}`);
        } 
        // If not purchased, go to order page
        else {
            router.push(`/orders/create/${data.id}`);
        }
    };
    
    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // If purchased, go to course chapters
        if (isPurchased) {
            router.push(`/courses/${data.id}`);
        } 
        // Check if button label indicates purchase
        else if (data.buttonLabel && (data.buttonLabel.includes('購買') || data.buttonLabel.includes('购买'))) {
            router.push(`/orders/create/${data.id}`);
        } else {
            handleClick();
        }
    };
    
    // Determine button label
    const buttonLabel = isPurchased ? '開始上課' : data.buttonLabel;
    
    // Debug log
    React.useEffect(() => {
        if (isPurchased) {
            console.log(`Course ${data.id} (${data.title}) is purchased, showing "開始上課"`);
        } else {
            console.log(`Course ${data.id} (${data.title}) is NOT purchased, showing "${data.buttonLabel}"`);
        }
    }, [isPurchased, data.id, data.title, data.buttonLabel]);

    return (
        <div 
            data-testid="course-card"
            className={`flex flex-col h-full rounded-xl overflow-hidden p-0 transition-all duration-300 cursor-pointer shadow-xl border-2 relative ${
                data.isFeatured 
                    ? 'bg-yellow-600/20 border-yellow-500/50' 
                    : 'bg-gray-800'
            } ${
                isSelected 
                    ? 'border-[#ffd700] hover:border-yellow-200 hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:scale-[1.05] hover:bg-gray-700' 
                    : 'border-white hover:border-gray-300 hover:shadow-white/30 hover:shadow-2xl hover:scale-[1.02]'
            }`}
            onClick={handleClick}
            onMouseEnter={() => {
                // Trigger selection on hover if not already selected
                if (!isSelected && onSelect) {
                    onSelect(data.id);
                }
            }}
        >
            {/* Yellow top border with rounded corners for selected card */}
            {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-[8px] bg-[#ffd700] rounded-t-xl z-20"></div>
            )}
            
            {/* Image Area */}
            <div className={`h-48 relative overflow-hidden bg-gray-800 rounded-t-xl transition-all duration-300 ${
                isSelected ? 'hover:brightness-110' : ''
            }`}>                
                {/* Course Image */}
                {data.imageUrl && !imageError ? (
                    <img 
                        src={data.imageUrl} 
                        alt={data.title}
                        className="w-full h-full object-cover"
                        onError={() => {
                            setImageError(true);
                        }}
                    />
                ) : null}
                {/* Fallback content when image is missing or fails to load */}
                {(!data.imageUrl || imageError) && data.imageSubtitle && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                        {data.imageSubtitle}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className={`p-6 flex flex-col flex-1 bg-gray-800 transition-all duration-300 ${
                isSelected ? 'hover:bg-gray-700' : ''
            }`}>
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                    isSelected ? 'text-white hover:text-yellow-300' : 'text-white'
                }`}>
                    {data.title}
                </h3>
                {/* Author/Instructor name - yellow when selected */}
                <p className={`text-sm mb-2 transition-colors duration-300 ${
                    isSelected ? 'text-[#ffd700]' : 'text-gray-400'
                }`}>
                    水球潘
                </p>
                <p className="text-gray-400 text-sm mb-4 flex-1">{data.subtitle}</p>

                {/* Price/Value */}
                <div className="text-xs text-white mb-4">
                    {data.priceText}
                </div>

                {/* Button */}
                <button 
                    onClick={handleButtonClick}
                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 transform ${
                        isSelected 
                            ? 'bg-[#1c1f2e] text-white border-2 border-[#ffd700] hover:bg-[#353a4f] hover:border-yellow-200 hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(255,215,0,0.7)]' 
                            : 'bg-[#ffd700] text-gray-900 shadow-lg hover:bg-yellow-400 hover:scale-[1.03] hover:shadow-yellow-500/50'
                    }`}
                >
                    {buttonLabel}
                </button>
            </div>
        </div>
    );
}

export default CourseCard;
