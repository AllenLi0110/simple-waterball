# CI/CD 測試流程

當建立 Pull Request 時，GitHub Actions 會自動執行以下測試：

## 前端單元測試 (Jest)
- 執行所有 Jest 單元測試
- 產生程式碼覆蓋率報告

## 前端 E2E 測試 (Playwright)
- 啟動後端伺服器
- 執行 Playwright E2E 測試（Chromium, Firefox, WebKit）
- 產生測試報告

## 前端 BDD 測試 (Cucumber)
- 啟動後端伺服器
- 執行 Cucumber BDD 測試
- 產生 HTML 測試報告

## 後端測試 (Gradle)
- 使用 PostgreSQL 服務
- 執行所有 Spring Boot 測試

## Lint 檢查
- 執行 ESLint 檢查程式碼品質

## 建置檢查
- 建置前端 Next.js 應用
- 建置後端 Spring Boot 應用

## 所有測試通過檢查
- 彙總所有測試結果
- 確保所有測試都通過
