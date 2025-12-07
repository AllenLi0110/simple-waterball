import React from 'react';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';

export const metadata = {
  title: '水球軟體學院： 軟體設計模式精通之旅',
  description: '掌握頂級軟體架構能力的線上教學平台',
  icons: {
    icon: '/images/waterball-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      {/* Set the Inter font as default */}
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
        `}</style>
      </head>
      {/* bg-gray-900 sets the dark background for the entire application */}
      <body className="bg-gray-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}