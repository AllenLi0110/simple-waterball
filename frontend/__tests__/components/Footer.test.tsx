import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';
import { describe, test, expect } from '@jest/globals';
import '@testing-library/jest-dom';

describe('Footer Component', () => {
  test('should render teacher profile section', () => {
    render(<Footer />);
    expect(screen.getByText('水球潘')).toBeInTheDocument();
  });

  test('should render social media links', () => {
    render(<Footer />);
    const lineLink = screen.getByLabelText('LINE');
    const facebookLink = screen.getByLabelText('Facebook');
    const instagramLink = screen.getByLabelText('Instagram');
    const youtubeLink = screen.getByLabelText('YouTube');

    expect(lineLink).toBeInTheDocument();
    expect(facebookLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
    expect(youtubeLink).toBeInTheDocument();
  });

  test('should render legal links', () => {
    render(<Footer />);
    expect(screen.getByText('隱私權政策')).toBeInTheDocument();
    expect(screen.getByText('服務條款')).toBeInTheDocument();
  });

  test('should render customer service email', () => {
    render(<Footer />);
    expect(screen.getByText(/客服信箱/)).toBeInTheDocument();
    expect(screen.getByText('support@waterballsa.tw')).toBeInTheDocument();
  });

  test('should render copyright information', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 水球球特務有限公司/)).toBeInTheDocument();
  });

  test('should render achievement points', () => {
    render(<Footer />);
    // Check for achievement content
    expect(screen.getByText(/主修 Christopher Alexander/)).toBeInTheDocument();
    expect(screen.getByText(/過去40多場 Talk/)).toBeInTheDocument();
  });

  test('should have correct link attributes', () => {
    render(<Footer />);
    const lineLink = screen.getByLabelText('LINE');
    expect(lineLink).toHaveAttribute('target', '_blank');
    expect(lineLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
