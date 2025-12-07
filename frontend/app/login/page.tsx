"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-inter flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Waterball Logo at the top */}
        <div className="flex items-center justify-center mb-8">
          <img
            src="/images/waterball-logo.png"
            alt="Waterball Logo"
            className="w-[41.82px] h-[41.82px]"
          />
          <div className="flex flex-col leading-none m-0.5 ml-2">
            <span className="text-sm font-bold text-sky-200">
              水球軟體學院
            </span>
            <span className="text-sm font-bold tracking-wide text-sky-200 -mt-0.5">
              WATERBALLSA.TW
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#1c1f2e] rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">登入帳號</h1>

          {success && (
            <div className="mb-4 p-4 bg-green-500 text-white rounded-lg">
              登入成功！正在跳轉...
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-500 text-white rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-white mb-2">
                帳號
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                data-testid="login-username-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white mb-2">
                密碼
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                data-testid="login-password-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[#ffd700] text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="login-submit-button"
            >
              {loading ? '登入中...' : '登入'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/register"
              className="text-yellow-400 hover:text-yellow-300 underline"
            >
              還沒有帳號？前往註冊
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
