"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '../types/course';

interface CourseCardProps {
    data: Course;
    isSelected?: boolean;
    onSelect?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ data, isSelected = false, onSelect }) => {    
    const router = useRouter();

    const handleClick = () => {
        if (onSelect) {
            onSelect();
        }
        router.push(`/courses/${data.id}`);
    };

    return (
        <div 
            data-testid="course-card"
            className={`flex flex-col h-full rounded-xl overflow-hidden p-0 transition-all duration-300 cursor-pointer bg-gray-800 shadow-xl border-2 relative ${
                isSelected 
                    ? 'border-[#ffd700] hover:border-yellow-200 hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:scale-[1.05] hover:bg-gray-700' 
                    : 'border-white hover:border-gray-300 hover:shadow-white/30 hover:shadow-2xl hover:scale-[1.02]'
            }`}
            onClick={handleClick}
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
                {data.imageUrl ? (
                    <img 
                        src={data.imageUrl} 
                        alt={data.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                ) : null}
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
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 transform ${
                        isSelected 
                            ? 'bg-[#1c1f2e] text-white border-2 border-[#ffd700] hover:bg-[#353a4f] hover:border-yellow-200 hover:scale-[1.05] hover:shadow-[0_0_20px_rgba(255,215,0,0.7)]' 
                            : 'bg-[#ffd700] text-gray-900 shadow-lg hover:bg-yellow-400 hover:scale-[1.03] hover:shadow-yellow-500/50'
                    }`}
                >
                    {data.buttonLabel}
                </button>
            </div>
        </div>
    );
}

export default CourseCard;
