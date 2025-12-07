Feature: 課程列表顯示

  身為一名學生
  我想要查看所有可用的課程
  這樣就能選擇我想學習的課程

  Background:
    Given 後端 API 正常運行
    And 資料庫中有課程資料

  # 1. 核心場景：顯示課程列表
  Scenario: 顯示所有課程列表
    Given 我訪問首頁
    When 頁面載入完成
    Then 我應該看到課程列表
    And 每個課程卡片應該顯示標題

  # 2. 核心場景：點擊跳轉
  Scenario: 課程卡片點擊跳轉
    Given 我訪問首頁
    And 頁面顯示課程列表
    When 我點擊一個課程卡片
    Then 我應該被導航到課程詳情頁

  # 3. 核心場景：錯誤處理
  Scenario: 錯誤處理
    Given 後端 API 不可用
    When 我訪問首頁
    Then 我應該看到錯誤提示資訊
