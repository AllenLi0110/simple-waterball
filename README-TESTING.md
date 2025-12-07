# 測試和 CI/CD 說明

## 專案測試架構

本專案採用 **BDD/SDD (Behavior-Driven Development / Specification-Driven Development)** 方法，完整實現了：

### 1. Formulation (規格化) ✅

規格文件位於 `frontend/specs/` 目錄：

- **Gherkin 規格文件** (`features/`)
  - `course-list.feature` - 課程列表功能規格
  - `course-detail.feature` - 課程詳情頁功能規格
  
- **使用者故事** (`user-stories/`)
  - `course-list.md` - 課程列表使用者故事和驗收標準
  - `course-detail.md` - 課程詳情頁使用者故事和驗收標準

- **Release 規劃** (`release-plan.md`)

### 2. Automation (自動化) ✅

#### 單元測試 (Unit Tests)

使用 **Jest** + **React Testing Library**：

- `__tests__/components/CourseCard.test.tsx` - 課程卡片組件測試
- `__tests__/utils/formatDuration.test.ts` - 工具函數測試
- `__tests__/types/course.test.ts` - 類型定義測試

**執行方式：**
```bash
cd frontend
npm run test              # 執行所有單元測試
npm run test:watch        # 監聽模式
npm run test:coverage     # 生成覆蓋率報告
```

#### E2E 測試 (End-to-End Tests)

使用 **Playwright**：

- `tests/course-list.spec.ts` - 課程列表 E2E 測試
- `tests/course-detail.spec.ts` - 課程詳情頁 E2E 測試

**執行方式：**
```bash
cd frontend
npm run test:e2e          # 執行所有 E2E 測試
npm run test:e2e:ui       # UI 模式執行
```

### 3. CI/CD ✅

GitHub Actions 工作流程位於 `.github/workflows/`：

- **`ci.yml`** - 完整的 CI/CD Pipeline
  - 前端單元測試
  - 前端 E2E 測試
  - 後端測試
  - Lint 檢查
  - 建置檢查

- **`frontend-unit-tests.yml`** - 前端單元測試專用工作流

- **`frontend/.github/workflows/playwright.yml`** - Playwright E2E 測試工作流

## 測試覆蓋範圍

### 單元測試覆蓋
- ✅ CourseCard 組件渲染
- ✅ 課程卡片互動（點擊、導航）
- ✅ 推薦課程樣式
- ✅ 圖片載入錯誤處理
- ✅ 工具函數（時長格式化）
- ✅ 類型定義驗證

### E2E 測試覆蓋
- ✅ 課程列表顯示
- ✅ 課程卡片點擊跳轉
- ✅ 推薦課程樣式驗證
- ✅ 載入狀態顯示
- ✅ 錯誤處理
- ✅ 課程詳情頁顯示
- ✅ 章節列表互動
- ✅ 影片播放功能
- ✅ 返回導航功能

## 如何運行測試

### 本地開發

1. **安裝依賴**
   ```bash
   cd frontend
   npm install
   ```

2. **執行單元測試**
   ```bash
   npm run test
   ```

3. **執行 E2E 測試**
   ```bash
   # 確保後端和前端都在運行
   npm run dev  # 終端 1
   
   # 另一個終端執行測試
   npm run test:e2e
   ```

### CI/CD 自動執行

當你推送代碼到 GitHub 時，所有測試會自動執行：
- 單元測試
- E2E 測試
- Lint 檢查
- 建置檢查

## 測試報告

- **單元測試覆蓋率報告**：執行 `npm run test:coverage` 後查看 `coverage/` 目錄
- **Playwright 測試報告**：執行 `npm run test:e2e` 後查看 `playwright-report/` 目錄
- **CI/CD 測試結果**：在 GitHub Actions 頁面查看

## 規格驅動開發流程

1. **Discovery** - 研究產品功能（已完成）
2. **Formulation** - 撰寫規格文件（✅ 已完成）
3. **Automation** - 撰寫測試並實現功能（✅ 已完成）

## 注意事項

- 所有測試都應該在 CI/CD 中通過
- 新增功能時，請先更新規格文件，再撰寫測試，最後實現功能
- 保持測試覆蓋率在合理範圍內（建議 > 70%）
