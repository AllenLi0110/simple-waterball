import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CourseList from '../../components/CourseList';
import { Course } from '../../types/course';
import { AuthProvider } from '../../contexts/AuthContext';
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Helper function to render CourseList with AuthProvider
const renderWithAuth = (ui: React.ReactElement) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe('CourseList Component', () => {
  const mockCourses: Course[] = [
    {
      id: 1,
      title: '測試課程 1',
      subtitle: '副標題 1',
      description: '描述 1',
      priceText: 'NT$ 1,000',
      buttonLabel: '購買',
      imageUrl: '/images/course1.png',
      imageSubtitle: '圖片 1',
      isFeatured: true,
    },
    {
      id: 2,
      title: '測試課程 2',
      subtitle: '副標題 2',
      description: '描述 2',
      priceText: 'NT$ 2,000',
      buttonLabel: '購買',
      imageUrl: '/images/course2.png',
      imageSubtitle: '圖片 2',
      isFeatured: false,
    },
  ];

  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockClear();
    
    // Mock localStorage to return a logged-in user
    const mockUser = { id: 1, name: 'Test User', username: 'testuser' };
    Storage.prototype.getItem = jest.fn((key: string) => {
      if (key === 'user') {
        return JSON.stringify(mockUser);
      }
      return null;
    });
    
    // Mock fetch for orders API (used by CourseList to check purchased courses)
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/api/orders/user/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [] }),
        } as Response);
      }
      // Return undefined for other URLs to let individual tests override
      return undefined as any;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should display loading state initially', () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/api/orders/user/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [] }),
        } as Response);
      }
      return new Promise(() => {
        // Never resolves to keep loading state
      });
    });

    renderWithAuth(<CourseList />);
    expect(screen.getByText(/Loading course data from backend/)).toBeInTheDocument();
  });

  test('should display courses after successful fetch', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/api/orders/user/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [] }),
        } as Response);
      }
      if (url.includes('/api/courses')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: mockCourses,
          }),
        } as Response);
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    renderWithAuth(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText('測試課程 1')).toBeInTheDocument();
    });
    expect(screen.getByText('測試課程 2')).toBeInTheDocument();
  });

  test('should handle array response format', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/api/orders/user/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [] }),
        } as Response);
      }
      if (url.includes('/api/courses')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockCourses,
        } as Response);
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    renderWithAuth(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText('測試課程 1')).toBeInTheDocument();
    });
  });

  test('should display error message on fetch failure', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/api/orders/user/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [] }),
        } as Response);
      }
      if (url.includes('/api/courses')) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    renderWithAuth(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
    });
  });

  test('should display error message on HTTP error', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/api/orders/user/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [] }),
        } as Response);
      }
      if (url.includes('/api/courses')) {
        return Promise.resolve({
          ok: false,
          status: 500,
        } as Response);
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    renderWithAuth(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  test('should display empty state when no courses', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/api/orders/user/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [] }),
        } as Response);
      }
      if (url.includes('/api/courses')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: [],
          }),
        } as Response);
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    renderWithAuth(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText(/沒有找到課程資料/)).toBeInTheDocument();
    });
  });

  test('should limit courses when limit prop is provided', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/api/orders/user/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [] }),
        } as Response);
      }
      if (url.includes('/api/courses')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: mockCourses,
          }),
        } as Response);
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    renderWithAuth(<CourseList limit={1} />);

    await waitFor(() => {
      expect(screen.getByText('測試課程 1')).toBeInTheDocument();
    });
    expect(screen.queryByText('測試課程 2')).not.toBeInTheDocument();
  });

  test('should apply custom container className', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/api/orders/user/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ data: [] }),
        } as Response);
      }
      if (url.includes('/api/courses')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            success: true,
            data: mockCourses,
          }),
        } as Response);
      }
      return Promise.reject(new Error('Unexpected URL'));
    });

    const { container } = renderWithAuth(<CourseList containerClassName="custom-class" />);

    await waitFor(() => {
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('custom-class');
    });
  });
});
