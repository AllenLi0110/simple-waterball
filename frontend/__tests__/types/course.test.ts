import { Course, Chapter, Video } from '../../types/course';
import { describe, test, expect } from '@jest/globals';

describe('Course Type Definitions', () => {
  test('should contain all required fields in Course type', () => {
    const course: Course = {
      id: 1,
      title: '測試課程',
      subtitle: '測試副標題',
      description: '測試描述',
      priceText: 'NT$ 3,000',
      buttonLabel: '立即購買',
      imageUrl: '/images/test.png',
      imageSubtitle: '測試圖片',
      isFeatured: true,
    };

    expect(course.id).toBe(1);
    expect(course.title).toBe('測試課程');
    expect(course.isFeatured).toBe(true);
  });

  test('should allow Course to contain optional chapters', () => {
    const chapter: Chapter = {
      id: 1,
      title: '測試章節',
      description: '章節描述',
      orderIndex: 1,
      videos: [],
    };

    const course: Course = {
      id: 1,
      title: '測試課程',
      subtitle: '測試副標題',
      description: '測試描述',
      priceText: 'NT$ 3,000',
      buttonLabel: '立即購買',
      imageUrl: '/images/test.png',
      imageSubtitle: '測試圖片',
      isFeatured: true,
      chapters: [chapter],
    };

    expect(course.chapters).toBeDefined();
    expect(course.chapters?.length).toBe(1);
  });

  test('should allow Chapter to contain videos', () => {
    const video: Video = {
      id: 1,
      title: '測試影片',
      description: '影片描述',
      videoUrl: 'https://example.com/video.mp4',
      orderIndex: 1,
      duration: 600,
    };

    const chapter: Chapter = {
      id: 1,
      title: '測試章節',
      description: '章節描述',
      orderIndex: 1,
      videos: [video],
    };

    expect(chapter.videos.length).toBe(1);
    expect(chapter.videos[0].videoUrl).toBe('https://example.com/video.mp4');
  });
});
