"use client";

import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave }) => {
  const { user, updateUser } = useAuth();

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

  useEffect(() => {
    if (isOpen && user) {
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
      } else {
        setAvatarPreview('');
      }
      setError(null);
    }
  }, [isOpen, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const compressImage = (file: File, maxSizeKB: number = 200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions (max 800x800)
          let width = img.width;
          let height = img.height;
          const maxDimension = 800;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          // Create canvas and compress
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('無法創建畫布'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Try different quality levels to get under maxSizeKB
          let quality = 0.9;
          const tryCompress = () => {
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            const sizeKB = (dataUrl.length * 3) / 4 / 1024; // Approximate size
            
            if (sizeKB <= maxSizeKB || quality <= 0.1) {
              resolve(dataUrl);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          };
          
          tryCompress();
        };
        img.onerror = () => reject(new Error('圖片載入失敗'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('檔案讀取失敗'));
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB before compression)
      if (file.size > 5 * 1024 * 1024) {
        setError('圖片檔案太大，請選擇小於 5MB 的圖片');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('請選擇圖片檔案');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Compress image to max 200KB
        const compressedDataUrl = await compressImage(file, 200);
        setAvatarPreview(compressedDataUrl);
        setFormData(prev => ({
          ...prev,
          avatarUrl: compressedDataUrl,
        }));
      } catch (err) {
        console.error('Error compressing image:', err);
        setError(err instanceof Error ? err.message : '圖片處理失敗');
      } finally {
        setLoading(false);
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate name
    if (!formData.name || !formData.name.trim()) {
      setError('姓名為必填欄位');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (!user) {
        throw new Error('用戶未登入');
      }

      const updateData: any = {
        name: formData.name.trim(),
        gender: formData.gender && formData.gender.trim() ? formData.gender.trim() : null,
        nickname: formData.nickname && formData.nickname.trim() ? formData.nickname.trim() : null,
        occupation: formData.occupation && formData.occupation.trim() ? formData.occupation.trim() : null,
        location: formData.location && formData.location.trim() ? formData.location.trim() : null,
        githubLink: formData.githubLink && formData.githubLink.trim() ? formData.githubLink.trim() : null,
        avatarUrl: formData.avatarUrl && formData.avatarUrl.trim() ? formData.avatarUrl.trim() : null,
      };

      if (formData.birthday) {
        updateData.birthday = formData.birthday;
      } else {
        updateData.birthday = null;
      }

      console.log('Updating user with data:', updateData);
      await updateUser(user.id, updateData);
      console.log('User updated successfully');
      onSave();
      onClose();
    } catch (err) {
      console.error('Error updating user:', err);
      const errorMessage = err instanceof Error ? err.message : '更新失敗，請稍後再試';
      setError(errorMessage);
      // Keep modal open so user can see the error
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1c1f2e] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">編輯個人檔案</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
            <strong>錯誤：</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <button
              type="button"
              onClick={() => document.getElementById('avatarFile')?.click()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[#ffd700] text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              {loading ? '處理中...' : '更換頭像'}
            </button>
            <input
              id="avatarFile"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />            
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-white mb-2">
              姓名
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
              <option value="">選擇性別</option>
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
            <div className="relative">
              <input
                id="birthday"
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none pr-10"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                📅
              </span>
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-white mb-2">
              所在地區
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            >
              <option value="">選擇地區</option>
              <option value="台北市">台北市</option>
              <option value="新北市">新北市</option>
              <option value="桃園市">桃園市</option>
              <option value="台中市">台中市</option>
              <option value="台南市">台南市</option>
              <option value="高雄市">高雄市</option>
              <option value="基隆市">基隆市</option>
              <option value="新竹市">新竹市</option>
              <option value="嘉義市">嘉義市</option>
              <option value="新竹縣">新竹縣</option>
              <option value="苗栗縣">苗栗縣</option>
              <option value="彰化縣">彰化縣</option>
              <option value="南投縣">南投縣</option>
              <option value="雲林縣">雲林縣</option>
              <option value="嘉義縣">嘉義縣</option>
              <option value="屏東縣">屏東縣</option>
              <option value="宜蘭縣">宜蘭縣</option>
              <option value="花蓮縣">花蓮縣</option>
              <option value="台東縣">台東縣</option>
              <option value="澎湖縣">澎湖縣</option>
              <option value="金門縣">金門縣</option>
              <option value="連江縣">連江縣</option>
            </select>
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
              placeholder="https://github.com/{username}"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors mr-3"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="px-6 py-2 bg-[#ffd700] text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '儲存中...' : '儲存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
