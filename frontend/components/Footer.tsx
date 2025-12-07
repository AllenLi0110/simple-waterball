import React from 'react';
import { Instagram, Facebook, Youtube, Share2, Mail, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const LineIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.348 0 .63.285.63.63 0 .349-.282.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.27l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.766.062 1.08-.015.174-.011.347.01.521.022.26.133.405.273.405h.002c.135-.001.29-.154.38-.351.155-.331.237-.763.29-1.099.062-.389.162-.883.162-.883s.92.112 2.04.166c.26.012.52.02.78.02 6.615 0 12-4.371 12-9.743"/>
    </svg>
);

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Teacher Profile Group */}
                <div className="bg-[#1c1f2e] rounded-lg p-6 mb-8 md:mb-12">
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Avatar Section */}
                        <div className="shrink-0 flex justify-center md:justify-start items-center">
                            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-gray-700 flex items-center justify-center">
                                <Image
                                    src="/images/avatar.webp"
                                    alt="水球潘"
                                    width={192}
                                    height={192}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-3">水球潘</h3>
                            <p className="text-gray-300 mb-6">
                                七年程式教育者&軟體設計學講師，致力於將複雜的軟體設計概念轉化為易於理解和實踐的教學內容。
                            </p>
                            
                            {/* Achievement Points */}
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-[#ffd700] flex items-center justify-center mr-3 mt-0.5">
                                        <CheckCircle className="w-4 h-4 text-gray-900" />
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                        主修 Christopher Alexander 設計模式、軟體架構、分散式系統架構、Clean Architecture、領域驅動設計等領域
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-[#ffd700] flex items-center justify-center mr-3 mt-0.5">
                                        <CheckCircle className="w-4 h-4 text-gray-900" />
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                        過去40多場 Talk 平均93位觀眾參與
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-[#ffd700] flex items-center justify-center mr-3 mt-0.5">
                                        <CheckCircle className="w-4 h-4 text-gray-900" />
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                        主辦的學院社群一年內成長超過6000位成員
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-[#ffd700] flex items-center justify-center mr-3 mt-0.5">
                                        <CheckCircle className="w-4 h-4 text-gray-900" />
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                        帶領軟體工程方法論學習組織「GaaS」超過200多位成員，引領30組自組織團隊
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-[#ffd700] flex items-center justify-center mr-3 mt-0.5">
                                        <CheckCircle className="w-4 h-4 text-gray-900" />
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                        領域驅動設計社群核心志工&講師
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upper Section: Left (Social + Legal + Email) and Right (Logo) */}                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-700 mt-3 pt-6">
                    {/* Left Section */}
                    <div className="flex flex-col space-y-4 mb-6 md:mb-0 ">
                        {/* Social Media Icons */}
                        <div className="flex space-x-4 text-gray-400">
                            <a href="https://line.me/R/ti/p/@180cljxx?oat__id=5828034" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors" aria-label="LINE">
                                <LineIcon size={24} />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61577878447296#" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors" aria-label="Facebook">
                                <Facebook size={24} />
                            </a>
                            <a href="https://www.instagram.com/waterballsa.tw/#" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors" aria-label="Instagram">
                                <Instagram size={24} />
                            </a>
                            <a href="https://www.youtube.com/@waterball-software-academy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors" aria-label="YouTube">
                                <Youtube size={24} />
                            </a>
                            <a href="https://linkgoods.com/wsa" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors" aria-label="Linkgoods">
                                <Share2 size={24} />
                            </a>
                        </div>
                        <br />
                        {/* Legal Links */}
                        <div className="flex space-x-6 text-sm mb-2">
                            <a href="https://world.waterballsa.tw/terms/privacy" className="hover:text-gray-300 hover:underline transition-colors">隱私權政策</a>
                            <a href="https://world.waterballsa.tw/terms/service" className="hover:text-gray-300 hover:underline transition-colors">服務條款</a>
                        </div>

                        {/* Customer Service Email */}
                        <div className="flex items-center space-x-2 text-sm">
                            <Mail size={16} className="text-gray-400" />
                            <span>客服信箱: <a href="mailto:support@waterballsa.tw" className="hover:text-gray-300 hover:underline transition-colors">support@waterballsa.tw</a></span>
                        </div>
                    </div>

                    {/* Right Section - Logo */}
                    <div className="flex items-center">
                        <Image 
                            src="/images/waterball-course-logo.png" 
                            alt="WaterBall Logo" 
                            width={234.66} 
                            height={64} 
                        />
                    </div>
                </div>

                {/* Lower Section: Copyright */}
                <div className="text-center text-sm text-white-500 pt-6">
                    © 2025 水球球特務有限公司
                </div>
            </div>
        </footer>
    );
}

export default Footer;