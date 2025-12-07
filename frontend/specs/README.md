# 規格文件 (Specifications)

本目錄包含所有功能的規格文件，採用 BDD/SDD 方法編寫。

## 目錄結構

- `features/` - Gherkin 格式的功能規格文件
- `user-stories/` - 使用者故事文件
- `release-plan.md` - Release 規劃

## 規格文件說明

### Gherkin 格式 (.feature 文件)

`.feature` 文件使用標準的 **Gherkin 語法**：
- **關鍵字**：`Feature`, `Scenario`, `Given`, `When`, `Then`, `And`, `But`
- **描述內容**：場景描述、步驟說明等

這樣做的好處：
1. ✅ 符合 Gherkin 標準，可以被 BDD 工具（Cucumber, SpecFlow 等）正確解析
2. ✅ 可以被 AI 工具正確理解
3. ✅ 可以被自動化測試框架使用
4. ✅ 描述內容用中文，更符合團隊溝通需求

### 使用者故事格式 (.md 文件)

使用者故事文件使用繁體中文撰寫，包含：
- 使用者故事描述
- 驗收標準 (Acceptance Criteria)
- 技術規格

## 如何使用

### 完整 BDD 集成（當前使用）⭐

本專案使用 **Cucumber** 來直接執行 `.feature` 文件，實現真正的「規格即測試」。

#### 工作流程

1. **寫規格文件** - `specs/features/*.feature`
2. **寫 Step Definitions** - `tests/step-definitions/*.steps.ts`
3. **執行測試** - 直接運行 `.feature` 文件

#### 執行測試

```bash
# 執行所有 BDD 測試
npm run test:bdd

# 監聽模式
npm run test:bdd:watch

# 生成 HTML 報告
npm run test:bdd:html
```

#### 專案結構

```
frontend/
├── specs/
│   └── features/           # Gherkin 規格文件
│       ├── course-list.feature
│       └── course-detail.feature
├── tests/
│   ├── step-definitions/   # Step Definitions
│   │   ├── course-list.steps.ts
│   │   └── course-detail.steps.ts
│   └── support/            # 測試支援文件
│       ├── world.ts        # Playwright World
│       └── hooks.ts        # Before/After Hooks
└── cucumber.config.js       # Cucumber 配置
```

#### 優點

- ✅ 規格文件可以直接執行
- ✅ 規格即測試，完全自動化
- ✅ 符合完整 BDD 流程
- ✅ 測試報告清晰易懂

### 給團隊溝通
- 所有文件都可以作為團隊溝通的依據
- 規格文件是「可執行的規格」（Executable Specifications）
