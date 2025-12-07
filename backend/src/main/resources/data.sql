-- Spring Boot Data Initialization Script
-- This script runs automatically when the application starts
-- It initializes course data for the platform

-- Clear existing data (only recommended for development)
DELETE FROM videos;
DELETE FROM chapters;
DELETE FROM courses;

-- Reset sequences (PostgreSQL)
ALTER SEQUENCE IF EXISTS courses_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS chapters_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS videos_id_seq RESTART WITH 1;

-- Insert Course 1: 軟體設計模式精通之旅
INSERT INTO courses (title, subtitle, description, price_text, button_label, image_url, image_subtitle, is_featured) VALUES
('軟體設計模式精通之旅', 
 '用一趟旅程,精通一套能落地的高效率設計思路', 
 E'水球軟體學院提供最先進的軟體設計思路教材，並透過線上 Code Review 來帶你掌握進階軟體架構能力。\n\n只要每週投資 5 小時，就能打造不平等的優勢，成為硬核的 Coding 實戰高手。', 
 '看完課程介紹,立刻折價 3,000元', 
 '立刻體驗', 
 '/images/course_0.png', 
 '軟體設計模式', 
 TRUE);

-- Insert Course 2: AI x BDD
INSERT INTO courses (title, subtitle, description, price_text, button_label, image_url, image_subtitle, is_featured) VALUES
('AI x BDD: 規格驅動全自動開發術', 
 '善用軟工實踐,做到 100% 全自動化、高精準度的 Vibe Coding', 
 'AI Top 1% 工程師必修課,掌握規格驅動的全自動化開發。學習如何結合 AI 與 BDD (Behavior-Driven Development) 來實現完全自動化的開發流程。', 
 'NT$ 4,500', 
 '立刻購買', 
 '/images/course_4.png', 
 'AI x BDD 開發', 
 TRUE);

-- Insert Chapters for Course 1
INSERT INTO chapters (title, description, order_index, course_id) VALUES
('課程介紹: 這門課手把手帶你成為架構設計的高手', '了解這門課程如何幫助你成為架構設計的高手', 1, 1),
('你該知道: 在 AI 的時代下, 只會下 prompt 絕對寫不出好 Code', '了解在 AI 時代下，為什麼只會下 prompt 無法寫出好程式碼', 2, 1),
('課程試聽: 架構師該學的 C.A. 模式六大要素及模式思維', '深入了解 C.A. 模式的六大要素和模式思維', 3, 1),
('入學之後: 憑什麼這門課能保證你的學習成效?', '了解這門課程如何保證你的學習成效', 4, 1),
('Code Review 服務: 你不夠強, 我不會讓你畢業', '了解 Code Review 服務如何幫助你成長', 5, 1),
('學員訪談: 他是如何靠這門課, 成功錄取 Nvidia 軟體實戰職位的?', '聽聽學員分享如何透過這門課程成功錄取 Nvidia', 6, 1);

-- Insert Videos for Course 1 Chapters
-- Using public HLS test streams for demo purposes (original Waterball CDN requires authentication)
-- Chapter 1 videos
INSERT INTO videos (title, description, video_url, duration, order_index, chapter_id) VALUES
('課程介紹影片', '課程介紹: 這門課手把手帶你成為架構設計的高手', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 600, 1, 1);

-- Chapter 2 videos
INSERT INTO videos (title, description, video_url, duration, order_index, chapter_id) VALUES
('AI 時代下的程式設計思維', '你該知道: 在 AI 的時代下, 只會下 prompt 絕對寫不出好 Code', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 900, 1, 2);

-- Chapter 3 videos
INSERT INTO videos (title, description, video_url, duration, order_index, chapter_id) VALUES
('C.A. 模式六大要素', '課程試聽: 架構師該學的 C.A. 模式六大要素及模式思維', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 1200, 1, 3);

-- Chapter 4 videos
INSERT INTO videos (title, description, video_url, duration, order_index, chapter_id) VALUES
('學習成效保證', '入學之後: 憑什麼這門課能保證你的學習成效?', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 720, 1, 4);

-- Chapter 5 videos
INSERT INTO videos (title, description, video_url, duration, order_index, chapter_id) VALUES
('Code Review 服務介紹', 'Code Review 服務: 你不夠強, 我不會讓你畢業', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 600, 1, 5);

-- Chapter 6 videos
INSERT INTO videos (title, description, video_url, duration, order_index, chapter_id) VALUES
('Nvidia 成功案例訪談', '學員訪談: 他是如何靠這門課, 成功錄取 Nvidia 軟體實戰職位的?', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 1800, 1, 6);

-- Insert Chapters for Course 2
INSERT INTO chapters (title, description, order_index, course_id) VALUES
('課程介紹: AI x BDD 全自動開發', '了解 AI 與 BDD 結合的全自動開發方法', 1, 2),
('BDD 基礎: Cucumber 與規格驅動開發', '學習如何使用 Cucumber 進行規格驅動開發', 2, 2);

-- Insert Videos for Course 2 Chapters
-- Using public HLS test streams for demo purposes
-- Chapter 1 videos
INSERT INTO videos (title, description, video_url, duration, order_index, chapter_id) VALUES
('AI x BDD 課程介紹', '課程介紹: AI x BDD 全自動開發', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 600, 1, 7);

-- Chapter 2 videos
INSERT INTO videos (title, description, video_url, duration, order_index, chapter_id) VALUES
('Cucumber BDD 入門', 'BDD 基礎: Cucumber 與規格驅動開發', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 1800, 1, 8);
