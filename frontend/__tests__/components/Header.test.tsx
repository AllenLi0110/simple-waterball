import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';
import { describe, test, expect } from '@jest/globals';
import '@testing-library/jest-dom';

describe('Header Component', () => {
  test('should render with default title', () => {
    render(<Header title="測試標題" />);
    expect(screen.getByText('測試標題')).toBeInTheDocument();
  });

  test('should render with left content', () => {
    render(<Header leftContent={<div>左側內容</div>} />);
    expect(screen.getByText('左側內容')).toBeInTheDocument();
  });

  test('should render with right content', () => {
    render(<Header rightContent={<button>右側按鈕</button>} />);
    expect(screen.getByText('右側按鈕')).toBeInTheDocument();
  });

  test('should render default login button when no right content provided', () => {
    render(<Header />);
    expect(screen.getByText('登入')).toBeInTheDocument();
  });

  test('should apply custom className', () => {
    const { container } = render(<Header className="custom-class" />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('custom-class');
  });

  test('should have sticky positioning', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
  });
});
