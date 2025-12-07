import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentPage from '../../../../../app/orders/payment/[orderNumber]/page';
import { AuthProvider } from '../../../../../contexts/AuthContext';
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
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Helper function to render PaymentPage with AuthProvider
const renderWithAuth = (ui: React.ReactElement) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe('PaymentPage', () => {
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
    
    // Reset fetch mock
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockReset();
  });

  test('should show loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves to keep loading state
    );

    renderWithAuth(<PaymentPage />);
    expect(screen.getByText('載入中...')).toBeInTheDocument();
  });

  test('should render payment page component', () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves to keep loading state
    );

    const { container } = renderWithAuth(<PaymentPage />);
    expect(container).toBeInTheDocument();
  });
});
