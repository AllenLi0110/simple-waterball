Feature: 課程詳情頁 # Title

  身為一名學生 # Description

  我想要查看課程詳情和章節

  這樣就能了解課程內容和觀看影片

  Background:
    Given 後端 API 正常運行
    And 資料庫中有課程資料
    And 課程包含章節和影片

  Scenario: 顯示課程詳情

    Given 我訪問課程詳情頁

    When 頁面載入完成

    Then 我應該看到課程標題

    And 我應該看到課程描述

    And 我應該看到章節列表

    And 第一個章節應該被自動選中

  Scenario: 章節列表互動

    Given 我訪問課程詳情頁

    And 頁面顯示章節列表

    When 我點擊一個章節

    Then 該章節應該被高亮顯示

    And 該章節的影片列表應該展開

    And 第一個影片應該被自動選中

  Scenario: 影片播放

    Given 我訪問課程詳情頁

    And 我選擇了一個章節

    When 我點擊一個影片

    Then 影片播放器應該顯示

    And 影片播放器應該載入正確的影片 URL

    And 影片資訊應該顯示（標題、描述、時長）

  Scenario: 影片列表顯示

    Given 我訪問課程詳情頁

    And 我點擊了一個章節

    Then 我應該看到該章節的影片列表

    And 每個影片應該顯示標題

    And 每個影片應該顯示時長（如果有）

  Scenario: 返回按鈕功能

    Given 我在課程詳情頁

    When 我點擊返回按鈕

    Then 我應該被導航回上一頁

  Scenario: 課程不存在處理

    Given 我訪問不存在的課程 ID

    When 頁面嘗試載入

    Then 我應該看到錯誤提示資訊
