import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CourseList from '../../components/CourseList';
import { Course } from '../../types/course';
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

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
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should display loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise(() => {
          // Never resolves to keep loading state
        })
    );

    render(<CourseList />);
    expect(screen.getByText(/Loading course data from backend/)).toBeInTheDocument();
  });

  test('should display courses after successful fetch', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockCourses,
      }),
    });

    render(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText('測試課程 1')).toBeInTheDocument();
    });
    expect(screen.getByText('測試課程 2')).toBeInTheDocument();
  });

  test('should handle array response format', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCourses,
    });

    render(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText('測試課程 1')).toBeInTheDocument();
    });
  });

  test('should display error message on fetch failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
    });
  });

  test('should display error message on HTTP error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  test('should display empty state when no courses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    render(<CourseList />);

    await waitFor(() => {
      expect(screen.getByText(/沒有找到課程資料/)).toBeInTheDocument();
    });
  });

  test('should limit courses when limit prop is provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockCourses,
      }),
    });

    render(<CourseList limit={1} />);

    await waitFor(() => {
      expect(screen.getByText('測試課程 1')).toBeInTheDocument();
    });
    expect(screen.queryByText('測試課程 2')).not.toBeInTheDocument();
  });

  test('should apply custom container className', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockCourses,
      }),
    });

    const { container } = render(<CourseList containerClassName="custom-class" />);

    await waitFor(() => {
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('custom-class');
    });
  });
});
