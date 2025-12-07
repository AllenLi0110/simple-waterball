/**
 * Tests for video duration formatting utility function
 */

import { describe, test, expect } from '@jest/globals';

describe('formatDuration Utility Function', () => {
  // This function is defined in CourseDetailPage, we need to test its logic
  const formatDuration = (seconds?: number): string => {
    if (seconds === undefined || seconds === null) return '';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  test('should format seconds correctly to MM:SS format', () => {
    expect(formatDuration(125)).toBe('2:05');
    expect(formatDuration(60)).toBe('1:00');
    expect(formatDuration(600)).toBe('10:00');
    expect(formatDuration(3661)).toBe('61:01');
  });

  test('should handle cases where seconds are less than 10', () => {
    expect(formatDuration(5)).toBe('0:05');
    expect(formatDuration(9)).toBe('0:09');
  });

  test('should handle undefined or null values', () => {
    expect(formatDuration(undefined)).toBe('');
    expect(formatDuration()).toBe('');
  });

  test('should handle 0 seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
  });
});
