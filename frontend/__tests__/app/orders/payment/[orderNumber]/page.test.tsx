import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PaymentPage from '../../../../../app/orders/payment/[orderNumber]/page';
import { AuthProvider } from '../../../../../contexts/AuthContext';
import { Order } from '../../../../../types/order';
import { Course } from '../../../../../types/course';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock Next.js navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockUseParams = jest.fn(() => ({ orderNumber: '202512072056476it3' }));

// Override the mock from jest.setup.js for this test file
jest.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: mockPush,
      replace: mockReplace,
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }),
    useParams: mockUseParams,
    usePathname: () => '/orders/payment/123456789012345678',
    useSearchParams: () => new URLSearchParams(),
  };
});

// Mock fetch globally
global.fetch = jest.fn();

// Helper function to render PaymentPage with AuthProvider
const renderWithAuth = (ui: React.ReactElement) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe('PaymentPage', () => {
  const mockOrder: Order = {
    id: 1,
    orderNumber: '202512072056476it3',
    userId: 1,
    userName: 'Test User',
    courseId: 1,
    courseTitle: 'Test Course',
    status: 'PENDING',
    paymentDeadline: '2025-12-10T20:56:00Z',
    createdAt: '2025-12-07T20:56:00Z',
  };

  const mockCourse: Course = {
    id: 1,
    title: 'Test Course',
    subtitle: 'Test Subtitle',
    description: 'Test Description',
    priceText: 'NT$ 3,000',
    buttonLabel: '立即購買',
    imageUrl: '/images/test.png',
    chapters: [
      {
        id: 1,
        title: 'Chapter 1',
        videos: [
          {
            id: 1,
            title: 'Video 1',
            url: 'https://example.com/video1.m3u8',
            duration: 300,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockReplace.mockClear();
    
    // Reset useParams mock
    mockUseParams.mockReturnValue({ orderNumber: '202512072056476it3' });
    
    // Mock localStorage to return a logged-in user
    const mockUser = { id: 1, name: 'Test User', username: 'testuser' };
    Storage.prototype.getItem = jest.fn((key: string) => {
      if (key === 'user') {
        return JSON.stringify(mockUser);
      }
      return null;
    });
    
    // Reset fetch mock - it will be set per test
    (global.fetch as jest.Mock).mockClear();
  });

  test('should show loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves to keep loading state
    );

    renderWithAuth(<PaymentPage />);
    expect(screen.getByText('載入中...')).toBeInTheDocument();
  });

  test('should display order details when order is loaded', async () => {
    // Mock fetch to return order and course data
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: async () => ({ data: mockOrder }),
        })
      )
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: async () => ({ data: mockCourse }),
        })
      );

    renderWithAuth(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    }, { timeout: 10000 });
    
    await waitFor(() => {
      expect(screen.getByText('202512072056476it3')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('should display payment deadline', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockOrder }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCourse }),
      });

    renderWithAuth(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText(/付款截止時間/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('should display payment instructions', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockOrder }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCourse }),
      });

    renderWithAuth(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText('付款說明')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('should display payment methods', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockOrder }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCourse }),
      });

    renderWithAuth(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText('付款方式')).toBeInTheDocument();
      expect(screen.getByText('ATM 匯款')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('should display payment button', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockOrder }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCourse }),
      });

    renderWithAuth(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText('進行支付')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('should show error message when order fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to load order'));

    renderWithAuth(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText(/錯誤/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('should show error message when order is not found', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    renderWithAuth(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText(/錯誤/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('should disable payment button when order status is not PENDING', async () => {
    const cancelledOrder = { ...mockOrder, status: 'CANCELLED' as const };
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: cancelledOrder }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCourse }),
      });

    renderWithAuth(<PaymentPage />);

    await waitFor(() => {
      const paymentButton = screen.getByText('進行支付');
      expect(paymentButton).toBeDisabled();
    }, { timeout: 5000 });
  });

  test('should handle payment success and redirect', async () => {
    jest.useFakeTimers();
    
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockOrder }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockCourse }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { ...mockOrder, status: 'PAID' } }),
      });

    renderWithAuth(<PaymentPage />);

    await waitFor(() => {
      expect(screen.getByText('進行支付')).toBeInTheDocument();
    }, { timeout: 5000 });

    const paymentButton = screen.getByText('進行支付');
    fireEvent.click(paymentButton);

    await waitFor(() => {
      expect(screen.getByText('付款成功！')).toBeInTheDocument();
    }, { timeout: 5000 });

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/courses/1/chapters/1');
    }, { timeout: 1000 });

    jest.useRealTimers();
  });
});
