# Railway Strapi 部署問題診斷清單

## 🚨 當前問題
- **502 Bad Gateway**: Application failed to respond
- **URL**: https://hakatoyz.up.railway.app
- **狀態**: Strapi 服務未正確響應

## 🔍 診斷步驟

### 1. 檢查 Railway 部署日誌
**前往 Railway Dashboard:**
1. 登入 Railway.app
2. 選擇您的專案
3. 點擊 Strapi 服務
4. 查看 **"Deployments"** 標籤
5. 點擊最新的部署查看詳細日誌

**尋找以下錯誤：**
- `Error: connect ECONNREFUSED` (資料庫連接失敗)
- `Module not found` (依賴安裝失敗)
- `Port 1337 is already in use` (端口衝突)
- `BUILD FAILED` (構建失敗)

### 2. 驗證環境變數設置
**在 Railway Dashboard → Variables 檢查:**

✅ **必需變數:**
```
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
ADMIN_JWT_SECRET=您的密鑰
JWT_SECRET=您的密鑰
API_TOKEN_SALT=您的密鑰
APP_KEYS=您的4個密鑰
```

❌ **常見錯誤:**
- `DATABASE_URL` 沒有使用 `${{Postgres.DATABASE_URL}}`
- 密鑰含有特殊字符或換行
- 變數名拼寫錯誤

### 3. 確認 PostgreSQL 服務
**檢查資料庫:**
1. 確保已添加 PostgreSQL 服務
2. PostgreSQL 服務狀態為 "Running"
3. DATABASE_URL 變數自動生成

### 4. 檢查根目錄設置
**確認部署配置:**
- Root Directory: `my-project`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`

### 5. 驗證檔案結構
**確保 GitHub 倉庫包含:**
```
my-project/
├── Dockerfile
├── railway.toml
├── package.json
├── src/
│   ├── index.js
│   └── api/
└── config/
    └── database.js
```

## 🔄 重新部署步驟

### 如果找到問題，執行重新部署：

1. **修復環境變數**
2. **在 Railway 中點擊 "Redeploy"**
3. **等待 5-10 分鐘**
4. **查看新的部署日誌**

### 如果問題持續存在：

1. **刪除現有服務**
2. **重新創建專案**
3. **確保所有設置正確**

## 🧪 測試重新部署

**部署成功的指標:**
- 日誌顯示: `Strapi started on port 1337`
- HTTP 狀態碼: 200
- 可以訪問 `/admin` 路徑

## 💡 快速修復建議

**最常見的修復:**
1. **檢查 DATABASE_URL 格式**
2. **重新生成安全密鑰**
3. **確認根目錄設置**
4. **檢查 PostgreSQL 服務狀態** 