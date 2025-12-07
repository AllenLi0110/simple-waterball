#!/bin/bash

# 運行所有 CI/CD 測試的腳本
# 確保所有測試在本地通過，以便 CI/CD 也能通過

set -e  # 遇到錯誤立即退出

# 顏色輸出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 記錄開始時間
START_TIME=$(date +%s)

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}開始運行所有 CI/CD 測試${NC}"
echo -e "${GREEN}========================================${NC}\n"

# 檢查必要的工具
echo -e "${YELLOW}檢查環境...${NC}"
command -v node >/dev/null 2>&1 || { echo -e "${RED}錯誤: 需要安裝 Node.js${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}錯誤: 需要安裝 npm${NC}"; exit 1; }
command -v java >/dev/null 2>&1 || { echo -e "${RED}錯誤: 需要安裝 Java${NC}"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${YELLOW}警告: Docker 未安裝，E2E 和 BDD 測試可能需要手動啟動服務${NC}"; }

echo -e "${GREEN}✓ 環境檢查完成${NC}\n"

# 測試計數器
PASSED=0
FAILED=0

# 測試函數
run_test() {
    local test_name=$1
    local test_command=$2
    local test_dir=$3
    
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}運行測試: ${test_name}${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    
    if [ -n "$test_dir" ]; then
        cd "$test_dir" || exit 1
    fi
    
    if eval "$test_command"; then
        echo -e "\n${GREEN}✓ ${test_name} 通過${NC}\n"
        ((PASSED++))
    else
        echo -e "\n${RED}✗ ${test_name} 失敗${NC}\n"
        ((FAILED++))
        if [ "$FAILED" -eq 1 ]; then
            echo -e "${YELLOW}繼續運行其他測試...${NC}\n"
        fi
    fi
    
    if [ -n "$test_dir" ]; then
        cd - > /dev/null || exit 1
    fi
}

# 1. 前端單元測試
run_test "前端單元測試 (Jest)" "npm run test -- --coverage --ci" "frontend"

# 2. 後端測試
run_test "後端測試 (Gradle)" "./gradlew test" "backend"

# 3. 前端 Lint 檢查
run_test "前端 Lint 檢查" "npm run lint" "frontend"

# 4. 前端建置檢查
run_test "前端建置檢查" "npm run build" "frontend"

# 5. 後端建置檢查
run_test "後端建置檢查" "./gradlew build -x test" "backend"

# 6. 檢查 PostgreSQL 是否運行
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}檢查 PostgreSQL 服務...${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

POSTGRES_RUNNING=false
if command -v pg_isready >/dev/null 2>&1; then
    if pg_isready -h localhost -p 5432 -U waterball_simple_user >/dev/null 2>&1; then
        POSTGRES_RUNNING=true
        echo -e "${GREEN}✓ PostgreSQL 正在運行${NC}\n"
    fi
elif command -v docker >/dev/null 2>&1; then
    if docker ps | grep -q postgres; then
        POSTGRES_RUNNING=true
        echo -e "${GREEN}✓ PostgreSQL Docker 容器正在運行${NC}\n"
    fi
fi

if [ "$POSTGRES_RUNNING" = false ]; then
    echo -e "${YELLOW}⚠ PostgreSQL 未運行${NC}"
    echo -e "${YELLOW}E2E 和 BDD 測試需要 PostgreSQL${NC}"
    echo -e "${YELLOW}請使用以下命令啟動 PostgreSQL:${NC}"
    echo -e "${YELLOW}  docker-compose up -d postgres${NC}"
    echo -e "${YELLOW}  或${NC}"
    echo -e "${YELLOW}  確保本地 PostgreSQL 運行在 localhost:5432${NC}\n"
    read -p "是否繼續運行 E2E 和 BDD 測試？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}跳過 E2E 和 BDD 測試${NC}\n"
        SKIP_E2E=true
    fi
fi

# 7. 前端 E2E 測試（需要後端和前端服務器）
if [ "$SKIP_E2E" != true ]; then
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}準備 E2E 測試環境...${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    
    # 檢查後端是否運行
    BACKEND_RUNNING=false
    if curl -f http://localhost:8080/api/courses >/dev/null 2>&1; then
        BACKEND_RUNNING=true
        echo -e "${GREEN}✓ 後端服務正在運行${NC}\n"
    else
        echo -e "${YELLOW}⚠ 後端服務未運行${NC}"
        echo -e "${YELLOW}請在另一個終端啟動後端:${NC}"
        echo -e "${YELLOW}  cd backend && ./gradlew bootRun${NC}\n"
        read -p "是否繼續運行 E2E 測試？(y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            SKIP_E2E=true
        fi
    fi
    
    # 檢查前端是否運行
    FRONTEND_RUNNING=false
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        FRONTEND_RUNNING=true
        echo -e "${GREEN}✓ 前端服務正在運行${NC}\n"
    else
        echo -e "${YELLOW}⚠ 前端服務未運行${NC}"
        echo -e "${YELLOW}請在另一個終端啟動前端:${NC}"
        echo -e "${YELLOW}  cd frontend && npm run start${NC}\n"
        read -p "是否繼續運行 E2E 測試？(y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            SKIP_E2E=true
        fi
    fi
    
    if [ "$SKIP_E2E" != true ]; then
        run_test "前端 E2E 測試 (Playwright)" "npx playwright test --project=chromium" "frontend"
    fi
fi

# 8. 前端 BDD 測試（需要後端和前端服務器）
if [ "$SKIP_E2E" != true ]; then
    if [ -d "frontend/reports" ]; then
        mkdir -p frontend/reports
    fi
    run_test "前端 BDD 測試 (Cucumber)" "npx cucumber-js" "frontend"
fi

# 計算總時間
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

# 顯示總結
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}測試總結${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "通過: ${GREEN}${PASSED}${NC}"
echo -e "失敗: ${RED}${FAILED}${NC}"
echo -e "總時間: ${MINUTES}分 ${SECONDS}秒\n"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ 所有測試通過！${NC}\n"
    exit 0
else
    echo -e "${RED}✗ 有 ${FAILED} 個測試失敗${NC}\n"
    exit 1
fi
