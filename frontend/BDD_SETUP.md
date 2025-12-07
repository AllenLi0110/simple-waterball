# BDD 完整集成設置說明

## 問題修復

### 錯誤：`Class 'PlaywrightWorld' incorrectly implements interface 'CustomWorld'`

**原因：**
- `PlaywrightWorld` 只實現了 `CustomWorld` 接口，但沒有繼承 `World` 類
- `World` 類提供了 `attach`, `log`, `link`, `parameters` 等必要屬性

**修復：**
將 `PlaywrightWorld` 改為繼承 `World` 類：

```typescript
// ❌ 錯誤：只實現接口
export class PlaywrightWorld implements CustomWorld {
  // ...
}

// ✅ 正確：繼承 World 類
export class PlaywrightWorld extends World {
  // ...
}
```

## 完整 BDD 設置

### 已安裝的套件

```json
{
  "@cucumber/cucumber": "^12.3.0",
  "@cucumber/gherkin": "^37.0.0",
  "@cucumber/html-formatter": "^22.2.0",
  "@cucumber/messages": "^31.0.0",
  "ts-node": "^10.9.2"
}
```

### 專案結構

```
frontend/
├── specs/
│   └── features/              # Gherkin 規格文件
│       ├── course-list.feature
│       └── course-detail.feature
├── tests/
│   ├── step-definitions/      # Step Definitions
│   │   ├── course-list.steps.ts
│   │   └── course-detail.steps.ts
│   └── support/               # 測試支援
│       ├── world.ts           # Playwright World
│       └── hooks.ts            # Before/After Hooks
├── cucumber.config.js         # Cucumber 配置
└── tsconfig.cucumber.json     # TypeScript 配置（Cucumber）
```

### 執行測試

```bash
# 執行所有 BDD 測試
npm run test:bdd

# 監聽模式
npm run test:bdd:watch

# 生成 HTML 報告
npm run test:bdd:html
```

### CI/CD 集成

已在 `.github/workflows/ci.yml` 中添加 `frontend-bdd-tests` job，會自動執行 Cucumber 測試並上傳報告。

## 工作流程

1. **寫規格** - `specs/features/*.feature`
2. **寫 Step Definitions** - `tests/step-definitions/*.steps.ts`
3. **執行測試** - `npm run test:bdd`
4. **查看報告** - `reports/cucumber-report.html`

## 優勢

- ✅ 規格文件可以直接執行
- ✅ 規格即測試，完全自動化
- ✅ 符合完整 BDD 流程
- ✅ 測試報告清晰易懂
- ✅ CI/CD 自動化驗證
