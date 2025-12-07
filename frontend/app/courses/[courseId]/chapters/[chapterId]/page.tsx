"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Hls from 'hls.js';
import Sidebar from '../../../../../components/Sidebar';
import Header from '../../../../../components/Header';
import { Course, Chapter, Video, ApiResponse } from '../../../../../types/course';

const ChapterDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const courseId = params?.courseId as string;
    const chapterId = params?.chapterId as string;
    const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    
    const isInitialLoadRef = useRef(true); 
    
    // Reset isInitialLoadRef when chapterId changes
    useEffect(() => {
        isInitialLoadRef.current = true;
    }, [chapterId]);
        
    useEffect(() => {
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
                
                if (courseData.chapters && courseData.chapters.length > 0) {
                    const chapterIdNum = parseInt(chapterId);
                    const foundChapter = courseData.chapters.find(
                        ch => ch.id === chapterIdNum
                    );
                    
                    if (foundChapter) {
                        setSelectedChapter(foundChapter);
                        
                        if (foundChapter.videos && foundChapter.videos.length > 0) {
                            setSelectedVideo(foundChapter.videos[0]);
                        }
                    } else {
                        const firstChapter = courseData.chapters[0];
                        router.replace(`/courses/${courseId}/chapters/${firstChapter.id}`);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                console.error("Failed to fetch course:", err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCourse();
    }, [courseId, chapterId, API_URL, router]);
    
    const handleChapterClick = (chapter: Chapter) => {
        router.push(`/courses/${courseId}/chapters/${chapter.id}`);
    };
    
    const handleVideoClick = (video: Video) => {
        setSelectedVideo(video);
    };
    
    const formatDuration = (seconds?: number): string => {
        if (!seconds) return '';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };
    
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !selectedVideo) {
            setVideoError(null);
            return;
        }

        setVideoError(null);
        const videoUrl = selectedVideo.videoUrl;
        const isHLS = videoUrl.endsWith('.m3u8');
        
        console.log('Video URL:', videoUrl);
        console.log('Is HLS:', isHLS);
        
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }
        
        const handleError = () => {
            const error = video.error;
            if (error) {
                const errorMsg = error.message || '';
                if (errorMsg.includes('Empty src') || errorMsg.includes('Empty src attribute')) {
                    return;
                }
                
                // 這是原生播放失敗時的處理，但由於我們現在優先使用 HLS.js，這裡主要用於非 HLS 錯誤
                let errorMsgText = '原生視頻加載失敗: ';
                switch (error.code) {
                    case error.MEDIA_ERR_ABORTED:
                        errorMsgText += '用戶中止';
                        break;
                    case error.MEDIA_ERR_NETWORK:
                        errorMsgText += '網絡錯誤';
                        break;
                    case error.MEDIA_ERR_DECODE:
                        errorMsgText += '解碼錯誤';
                        break;
                    case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMsgText += '格式不支持';
                        break;
                    default:
                        errorMsgText += `錯誤代碼: ${error.code}`;
                }
                // 僅在非 HLS 情況下顯示原生錯誤，或作為備註。
                if (!isHLS) {
                   setVideoError(`${errorMsgText}\nURL: ${videoUrl}`);
                } else {
                   console.error(`Native HLS playback failed, relying on HLS.js or CORS error: ${errorMsgText}`);
                }
            }
        };
        
        video.addEventListener('error', handleError);
        
        // --- 延遲邏輯核心 ---
        
        const previousSrc = video.src;
        let delayDuration = 100;

        if (!isInitialLoadRef.current && previousSrc && previousSrc !== videoUrl) {
            // 切換影片：增加延遲並清理
            delayDuration = 500;
            console.log(`Video switch detected. Applying cleanup delay of ${delayDuration}ms.`);
            video.pause();
            video.src = ''; 
        } else if (isInitialLoadRef.current) {
            // 首次加載
            console.log('Initial video load, ensuring video element is ready');
            delayDuration = 300; 
            isInitialLoadRef.current = false;
        } else {
            // 同一個視頻重新加載
            video.pause();
        }
        
        // --- 延遲後加載 ---

        const timeoutId = setTimeout(() => {
            const finalVideo = videoRef.current;
            if (!finalVideo || finalVideo !== video) {
                return;
            }
            
            requestAnimationFrame(() => {
                if (!finalVideo || finalVideo !== video) {
                    return;
                }
                
                if (isHLS) {
                    // **修正點 1: HLS 播放邏輯**
                    // 檢查瀏覽器是否原生支持 HLS (主要是 Safari)
                    const supportsNativeHLS = finalVideo.canPlayType('application/vnd.apple.mpegurl') || 
                                              finalVideo.canPlayType('application/x-mpegURL');
                    
                    if (supportsNativeHLS) {
                        console.log('Using native HLS support');
                        finalVideo.src = videoUrl;
                        finalVideo.load();
                        // 讓原生錯誤處理器 (handleError) 處理原生播放的格式錯誤
                    } 
                    // 優先使用 HLS.js (包括在原生支持但不可靠的 Chrome/Edge 等環境)
                    else if (Hls.isSupported()) {
                        console.log('Using HLS.js for HLS playback fallback/primary load');
                        
                        const hls = new Hls({
                            enableWorker: false, 
                            lowLatencyMode: false,
                            xhrSetup: (xhr, url) => {
                                // 避免發送憑證，減少 CORS 複雜性
                                xhr.withCredentials = false;
                            },
                            debug: true, 
                        });
                        
                        hls.loadSource(videoUrl);
                        hls.attachMedia(finalVideo);
                        hlsRef.current = hls;

                        hls.on(Hls.Events.MANIFEST_PARSED, () => {
                            console.log('HLS manifest parsed successfully by HLS.js');
                            setVideoError(null);
                            finalVideo.play().catch(err => {
                                console.error('Error playing video (HLS.js):', err);
                                setVideoError(`播放錯誤 (HLS.js): ${err.message}`);
                            });
                        });

                        hls.on(Hls.Events.ERROR, (event, data) => {
                            const errorInfo = {
                                type: data?.type,
                                details: data?.details,
                                fatal: data?.fatal,
                                response: data?.response,
                            };
                            console.error('HLS Error (HLS.js):', errorInfo, data);

                            if (data?.fatal) {
                                let errorMsg = `HLS.js 致命錯誤: ${data?.details || '未知錯誤'}\n類型: ${data?.type}`;
                                
                                if (data.type === Hls.ErrorTypes.NETWORK_ERROR && data.details === 'manifestLoadError') {
                                    // **修正點 2: 明確提示 CORS/網絡錯誤**
                                    const statusText = data?.response?.code === 0 ? 'CORS/網絡被阻止' : `HTTP Status ${data?.response?.code}`;
                                    errorMsg = `🚨 視頻流加載失敗 (Manifest)：\n**原因可能是 CORS 策略限制或網絡連接問題。**\n請確認影片伺服器 (${new URL(videoUrl).host}) 已配置 'Access-Control-Allow-Origin' 允許您的網域 (http://localhost:3000)。\n狀態: ${statusText}\nURL: ${videoUrl}`;
                                }
                                
                                setVideoError(errorMsg);
                                hls.destroy();
                            } else {
                                console.warn('Non-fatal HLS.js error:', errorInfo);
                            }
                        });
                    } else {
                        const errorMsg = `您的瀏覽器不支持HLS視頻播放或HLS.js加載失敗。`;
                        setVideoError(errorMsg);
                    }

                } else {
                    // 常規影片文件
                    console.log('Loading regular video:', videoUrl);
                    finalVideo.src = videoUrl;
                    finalVideo.load();
                }
            });
        }, delayDuration);

        return () => {
            clearTimeout(timeoutId);
            video.removeEventListener('error', handleError); 
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [selectedVideo]);
    
    // --- 渲染邏輯 (不變) ---
    return (
        <div className="flex min-h-screen bg-gray-900 font-inter">
            {/* Left Sidebar */}
            <div className="sticky top-0 h-screen">
                <Sidebar 
                    course={course}
                    selectedChapter={selectedChapter}
                    selectedVideo={selectedVideo}
                    onChapterClick={handleChapterClick}
                    onVideoClick={handleVideoClick}
                    loading={loading}
                    error={error}
                />
            </div>
            
            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
                {/* Header */}
                <Header 
                    leftContent={
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                ← 
                            </button>
                            <h1 className="text-xl font-bold text-white">
                                {course?.title || '課程詳情'}
                            </h1>
                        </div>
                    }
                    rightContent={
                        <div className="flex space-x-3">
                            <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-md">
                                前往挑戰
                            </button>
                            <button className="px-4 py-2 bg-[#ffd700] text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-md">
                                登入
                            </button>
                        </div>
                    }
                />
                
                {/* Main Content */}
                <main className="flex-1 flex overflow-hidden">
                    {/* Video Player */}
                    <div className="flex-1 flex flex-col bg-gray-900">
                        {selectedVideo ? (
                            <>
                                {/* Video Player */}
                                <div className="flex-1 flex items-center justify-center bg-black p-4">
                                    <div className="w-full max-w-6xl aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
                                        {videoError && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 z-10 p-4">
                                                <div className="text-center">
                                                    <p className="text-red-200 font-bold mb-2">視頻加載錯誤</p>
                                                    <p className="text-red-300 text-sm whitespace-pre-line">{videoError}</p>
                                                    <button
                                                        onClick={() => {
                                                            setVideoError(null);
                                                            // 觸發 useEffect 重新運行
                                                            setSelectedVideo({...selectedVideo}); 
                                                        }}
                                                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                                    >
                                                        重試
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <video
                                            ref={videoRef}
                                            key={selectedVideo.videoUrl}
                                            controls
                                            className="w-full h-full"
                                            playsInline
                                            preload="metadata"
                                            // 不再在 JSX 上處理 onError，而是依賴 useEffect 內部的 handleError
                                        >
                                            您的瀏覽器不支援影片播放。
                                        </video>
                                    </div>
                                </div>
                                
                                {/* Video Info */}
                                <div className="bg-gray-800 border-t border-gray-700 p-6">
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        {selectedVideo.title}
                                    </h2>
                                    {selectedVideo.description && (
                                        <p className="text-gray-400 mb-4">
                                            {selectedVideo.description}
                                        </p>
                                    )}
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        {selectedVideo.duration && (
                                            <span>時長: {formatDuration(selectedVideo.duration)}</span>
                                        )}
                                        {selectedChapter && (
                                            <span>章節: {selectedChapter.title}</span>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-gray-500 text-lg mb-4">
                                        載入中...
                                    </div>
                                    {course && (
                                        <div className="text-gray-400">
                                            <p className="text-xl font-bold mb-2">{course.title}</p>
                                            <p className="text-sm">{course.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ChapterDetailPage;