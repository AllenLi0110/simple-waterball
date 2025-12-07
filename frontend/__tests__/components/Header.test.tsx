import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';
import { AuthProvider } from '../../contexts/AuthContext';
import { describe, test, expect } from '@jest/globals';
import '@testing-library/jest-dom';

// Helper function to render Header with AuthProvider
const renderWithAuth = (ui: React.ReactElement) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe('Header Component', () => {
  test('should render with default title', () => {
    renderWithAuth(<Header title="測試標題" />);
    expect(screen.getByText('測試標題')).toBeInTheDocument();
  });

  test('should render with left content', () => {
    renderWithAuth(<Header leftContent={<div>左側內容</div>} />);
    expect(screen.getByText('左側內容')).toBeInTheDocument();
  });

  test('should render with right content', () => {
    renderWithAuth(<Header rightContent={<button>右側按鈕</button>} />);
    expect(screen.getByText('右側按鈕')).toBeInTheDocument();
  });

  test('should render default login button when no right content provided and user not logged in', () => {
    renderWithAuth(<Header />);
    expect(screen.getByText('登入')).toBeInTheDocument();
  });

  test('should apply custom className', () => {
    const { container } = renderWithAuth(<Header className="custom-class" />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('custom-class');
  });

  test('should have sticky positioning', () => {
    const { container } = renderWithAuth(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
  });
});
