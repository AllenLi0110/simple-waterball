import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CourseCard from '../../components/CourseCard';
import { Course } from '../../types/course';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';

// Extend Jest matchers with jest-dom matchers
declare module '@jest/expect' {
  interface Matchers<R = void> {
    toBeInTheDocument(): R;
    toHaveClass(className: string): R;
    toHaveAttribute(attr: string, value?: string): R;
  }
}

// Get the shared mock push function from jest.setup.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPush = (global as any).mockRouterPush || jest.fn();

describe('CourseCard Component', () => {
  const mockCourse: Course = {
    id: 1,
    title: '測試課程',
    subtitle: '測試副標題',
    description: '測試描述',
    priceText: 'NT$ 3,000',
    buttonLabel: '立即購買',
    imageUrl: '/images/test-course.png',
    imageSubtitle: '測試圖片',
    isFeatured: true,
  };

  beforeEach(() => {
    if (mockPush && typeof mockPush.mockClear === 'function') {
      mockPush.mockClear();
    }
  });

  test('should render course title', () => {
    render(<CourseCard data={mockCourse} />);
    expect(screen.getByText('測試課程')).toBeInTheDocument();
  });

  test('should render course subtitle', () => {
    render(<CourseCard data={mockCourse} />);
    expect(screen.getByText('測試副標題')).toBeInTheDocument();
  });

  test('should render price information', () => {
    render(<CourseCard data={mockCourse} />);
    expect(screen.getByText('NT$ 3,000')).toBeInTheDocument();
  });

  test('should render button label', () => {
    render(<CourseCard data={mockCourse} />);
    expect(screen.getByText('立即購買')).toBeInTheDocument();
  });

  test('should display course image', () => {
    render(<CourseCard data={mockCourse} />);
    const image = screen.getByAltText('測試課程');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/test-course.png');
  });

  test('should have special styling for featured courses', () => {
    const { container } = render(<CourseCard data={mockCourse} />);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-yellow-600/20');
  });

  test('should have default styling for non-featured courses', () => {
    const nonFeaturedCourse = { ...mockCourse, isFeatured: false };
    const { container } = render(<CourseCard data={nonFeaturedCourse} />);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-gray-800');
  });

  test('should navigate to course detail page when clicking course card', () => {
    render(<CourseCard data={mockCourse} />);
    const card = screen.getByText('測試課程').closest('div');
    if (card) {
      fireEvent.click(card);
      expect(mockPush).toHaveBeenCalledWith('/courses/1');
    }
  });

  test('should navigate to order creation page when clicking purchase button', () => {
    render(<CourseCard data={mockCourse} />);
    const button = screen.getByText('立即購買');
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/orders/create/1');
  });

  test('should display fallback content when image fails to load', () => {
    render(<CourseCard data={mockCourse} />);
    const image = screen.getByAltText('測試課程');
    fireEvent.error(image);
    // Fallback content should be displayed after image load failure
    expect(screen.getByText('測試圖片')).toBeInTheDocument();
  });

  test('should display fallback content when image URL is empty', () => {
    const courseWithoutImage = { ...mockCourse, imageUrl: '' };
    render(<CourseCard data={courseWithoutImage} />);
    expect(screen.getByText('測試圖片')).toBeInTheDocument();
  });
});
