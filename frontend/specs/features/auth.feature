Feature: 用戶註冊、登入、登出功能

  身為一名用戶
  我想要能夠註冊、登入和登出
  這樣就能使用系統的功能

  Background:
    Given 後端 API 正常運行

  # 1. 核心場景：用戶註冊
  Scenario: 成功註冊新用戶
    Given 我訪問註冊頁面
    When 我輸入名字 "張三"
    And 我輸入帳號 "zhangsan"
    And 我輸入密碼 "password123"
    And 我點擊註冊按鈕
    Then 我應該看到註冊成功訊息
    And 我應該被導航到登入頁面

  # 2. 核心場景：用戶登入
  Scenario: 成功登入
    Given 我已經註冊了帳號 "zhangsan" 密碼 "password123"
    And 我訪問登入頁面
    When 我輸入帳號 "zhangsan"
    And 我輸入密碼 "password123"
    And 我點擊登入按鈕
    Then 我應該看到登入成功訊息
    And 我應該被導航到首頁

  # 3. 核心場景：用戶登出
  Scenario: 成功登出
    Given 我已經登入系統
    When 我點擊登出按鈕
    Then 我應該看到登出成功訊息
    And 我應該被導航到登入頁面

  # 4. 核心場景：登入失敗（錯誤密碼）
  Scenario: 登入失敗 - 錯誤密碼
    Given 我已經註冊了帳號 "zhangsan" 密碼 "password123"
    And 我訪問登入頁面
    When 我輸入帳號 "zhangsan"
    And 我輸入密碼 "wrongpassword"
    And 我點擊登入按鈕
    Then 我應該看到登入失敗訊息

  # 5. 核心場景：註冊失敗（帳號已存在）
  Scenario: 註冊失敗 - 帳號已存在
    Given 我已經註冊了帳號 "zhangsan" 密碼 "password123"
    And 我訪問註冊頁面
    When 我輸入名字 "李四"
    And 我輸入帳號 "zhangsan"
    And 我輸入密碼 "password456"
    And 我點擊註冊按鈕
    Then 我應該看到帳號已存在錯誤訊息
