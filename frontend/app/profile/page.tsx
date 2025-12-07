"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import EditProfileModal from '../../components/EditProfileModal';
import { Pencil } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, refreshUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'basic' | 'badges' | 'skills' | 'certificates'>('basic');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for AuthContext to finish loading from localStorage
    if (authLoading) {
      return;
    }

    // If not authenticated after loading, redirect to login
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // User is authenticated, stop loading
    setLoading(false);
  }, [user, isAuthenticated, authLoading, router]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '尚未設定';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    } catch (e) {
      return '尚未設定';
    }
  };

  const handleEditSave = () => {
    if (user) {
      refreshUser(user.id);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 font-inter">
      <Sidebar />
      
      <div className="flex flex-col flex-1">
        <Header title="個人檔案" />
        
        <main className="flex-1 p-6 md:p-8 bg-gray-900">
          {/* Profile Header */}
          <div className="bg-[#1c1f2e] rounded-xl p-6 mb-6">
            <div className="flex items-center gap-6 mb-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 bg-gray-700 flex items-center justify-center shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-5xl">👤</div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">
                  {user.name} #{user.id}
                </h1>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-700">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'basic'
                    ? 'text-[#ffd700] border-b-2 border-[#ffd700]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                基本資料
              </button>             
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-[#1c1f2e] rounded-xl p-6">
            {activeTab === 'basic' && (
              <div>
                {/* Section Header with Edit Button */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#ffd700]">基本資料</h2>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[#ffd700] text-[#ffd700] font-medium rounded-lg hover:bg-[#ffd700] hover:text-gray-900 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    編輯資料
                  </button>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">暱稱</label>
                      <div className="text-white text-lg mt-1">
                        {user.nickname || user.name || '尚未設定'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-sm">等級</label>
                      <div className="text-white text-lg mt-1">1</div>
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <div className="text-white text-lg mt-1">
                        {user.username || '尚未設定'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-sm">性別</label>
                      <div className="text-white text-lg mt-1">
                        {user.gender || '尚未設定'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-sm">Github 連結</label>
                      <div className="text-white text-lg mt-1 break-all">
                        {user.githubLink ? (
                          <a
                            href={user.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            {user.githubLink.length > 30 ? `${user.githubLink.substring(0, 30)}...` : user.githubLink}
                          </a>
                        ) : (
                          '尚未設定'
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">職業</label>
                      <div className="text-white text-lg mt-1">
                        {user.occupation || '尚未設定'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-sm">突破道館數</label>
                      <div className="text-white text-lg mt-1">0</div>
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-sm">生日</label>
                      <div className="text-white text-lg mt-1">
                        {formatDate(user.birthday)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-gray-400 text-sm">地區</label>
                      <div className="text-white text-lg mt-1">
                        {user.location || '尚未設定'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}           
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default ProfilePage;
