"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const EditUserProfilePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.userId as string);
  const { user, updateUser, refreshUser } = useAuth();
  const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    nickname: '',
    occupation: '',
    birthday: '',
    location: '',
    githubLink: '',
    avatarUrl: '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = user;
        if (!currentUser || currentUser.id !== userId) {
          // If user is not loaded or doesn't match, fetch user data
          await refreshUser(userId);
          // After refresh, user will be updated, so we need to wait for next render
          return;
        }
        
        // Load user data into form
        setFormData({
          name: currentUser.name || '',
          gender: currentUser.gender || '',
          nickname: currentUser.nickname || '',
          occupation: currentUser.occupation || '',
          birthday: currentUser.birthday ? currentUser.birthday.split('T')[0] : '',
          location: currentUser.location || '',
          githubLink: currentUser.githubLink || '',
          avatarUrl: currentUser.avatarUrl || '',
        });
        if (currentUser.avatarUrl) {
          setAvatarPreview(currentUser.avatarUrl);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        router.push('/login');
      }
    };

    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  
  // Update form when user changes
  useEffect(() => {
    if (user && user.id === userId) {
      setFormData({
        name: user.name || '',
        gender: user.gender || '',
        nickname: user.nickname || '',
        occupation: user.occupation || '',
        birthday: user.birthday ? user.birthday.split('T')[0] : '',
        location: user.location || '',
        githubLink: user.githubLink || '',
        avatarUrl: user.avatarUrl || '',
      });
      if (user.avatarUrl) {
        setAvatarPreview(user.avatarUrl);
      }
    }
  }, [user, userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For simplicity, we'll use a URL input for now
      // In production, you'd upload to a server and get the URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData(prev => ({
          ...prev,
          avatarUrl: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      avatarUrl: url,
    }));
    setAvatarPreview(url);
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Format birthday as yyyy-MM-dd for backend
      const updateData: {
        name: string;
        gender?: string;
        nickname?: string;
        occupation?: string;
        location?: string;
        githubLink?: string;
        avatarUrl?: string;
        birthday?: string;
      } = {
        name: formData.name.trim(),
        ...(formData.gender && formData.gender.trim() && { gender: formData.gender.trim() }),
        ...(formData.nickname && formData.nickname.trim() && { nickname: formData.nickname.trim() }),
        ...(formData.occupation && formData.occupation.trim() && { occupation: formData.occupation.trim() }),
        ...(formData.location && formData.location.trim() && { location: formData.location.trim() }),
        ...(formData.githubLink && formData.githubLink.trim() && { githubLink: formData.githubLink.trim() }),
        ...(formData.avatarUrl && formData.avatarUrl.trim() && { avatarUrl: formData.avatarUrl.trim() }),
        ...(formData.birthday && { birthday: formData.birthday }),
      };

      await updateUser(userId, updateData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-inter">
      <Header title="編輯使用者資料" />
      
      <div className="max-w-2xl mx-auto p-6 mt-8">
        <div className="bg-[#1c1f2e] rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">編輯使用者資料</h1>

          {success && (
            <div className="mb-4 p-4 bg-green-500 text-white rounded-lg">
              更新成功！正在跳轉...
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 mb-4 bg-gray-700 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-4xl">👤</div>
                )}
              </div>
              <div className="w-full space-y-2">
                <label htmlFor="avatarFile" className="block text-white mb-2">
                  上傳頭像
                </label>
                <input
                  id="avatarFile"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-white mb-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-white mb-2">
                心理性別
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              >
                <option value="">請選擇</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>

            {/* Nickname */}
            <div>
              <label htmlFor="nickname" className="block text-white mb-2">
                暱稱
              </label>
              <input
                id="nickname"
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* Occupation */}
            <div>
              <label htmlFor="occupation" className="block text-white mb-2">
                職業
              </label>
              <input
                id="occupation"
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* Birthday */}
            <div>
              <label htmlFor="birthday" className="block text-white mb-2">
                生日
              </label>
              <input
                id="birthday"
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
              {formData.birthday && (
                <div className="text-gray-400 text-sm mt-1">
                  顯示格式: {formatDateForDisplay(formData.birthday)}
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-white mb-2">
                所在地區
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* Github Link */}
            <div>
              <label htmlFor="githubLink" className="block text-white mb-2">
                Github 連結
              </label>
              <input
                id="githubLink"
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-[#ffd700] text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '更新中...' : '儲存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserProfilePage;
