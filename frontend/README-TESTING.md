# 測試文件說明

## 測試架構

本專案採用 BDD/SDD 方法，包含以下測試層級：

1. **規格文件 (Specifications)** - `specs/` 目錄
2. **單元測試 (Unit Tests)** - `__tests__/` 目錄
3. **E2E 測試 (E2E Tests)** - `tests/` 目錄

## 執行測試

### 單元測試 (Jest)

```bash
# 執行所有單元測試
npm run test

# 監聽模式
npm run test:watch

# 生成覆蓋率報告
npm run test:coverage
```

### E2E 測試 (Playwright)

```bash
# 執行所有 E2E 測試
npm run test:e2e

# UI 模式執行
npm run test:e2e:ui
```

## 測試覆蓋範圍

### 單元測試
- ✅ CourseCard 組件
- ✅ 工具函數 (formatDuration)
- ✅ 類型定義驗證

### E2E 測試
- ✅ 課程列表顯示
- ✅ 課程卡片互動
- ✅ 課程詳情頁
- ✅ 章節和影片播放

## CI/CD

所有測試會在 GitHub Actions 中自動執行：
- 推送代碼時
- 創建 Pull Request 時
- 手動觸發時

查看 `.github/workflows/` 目錄了解詳細配置。
