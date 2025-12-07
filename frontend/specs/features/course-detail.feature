Feature: 課程詳情頁

  身為一名學生
  我想要查看課程詳情和章節
  這樣就能了解課程內容和觀看影片

  Background:
    Given 後端 API 正常運行
    And 資料庫中有課程資料
    And 課程包含章節和影片

  # 1. 核心場景：顯示課程詳情
  Scenario: 顯示課程詳情
    Given 我訪問課程詳情頁
    When 頁面載入完成
    Then 我應該看到課程標題
    And 我應該看到章節列表

  # 2. 核心場景：章節互動
  Scenario: 章節列表互動
    Given 我訪問課程詳情頁
    And 頁面顯示章節列表
    When 我點擊一個章節
    Then 該章節應該被高亮顯示
    And 該章節的影片列表應該展開

  # 3. 核心場景：影片播放
  Scenario: 影片播放
    Given 我訪問課程詳情頁
    And 我選擇了一個章節
    When 我點擊一個影片
    Then 影片播放器應該顯示
