# Strapi Railway 部署指南

## 🚀 部署步驟

### 1. GitHub 準備
確保你的 Strapi 專案已推送到 GitHub

### 2. Railway 設置
1. 前往 [Railway.app](https://railway.app)
2. 使用 GitHub 登入
3. 點擊 "New Project"
4. 選擇 "Deploy from GitHub repo"
5. 選擇你的 `my-project` 資料夾

### 3. 環境變數設置（重要！）
在 Railway 專案設置中添加以下環境變數：

```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=postgres

# Strapi 安全密鑰（Railway 會自動生成）
ADMIN_JWT_SECRET=你的管理員JWT密鑰
JWT_SECRET=你的JWT密鑰
API_TOKEN_SALT=你的API令牌鹽
APP_KEYS=你的應用密鑰（用逗號分隔的4個密鑰）

# 資料庫 URL（Railway PostgreSQL 會自動提供）
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### 4. 添加 PostgreSQL 服務
1. 在 Railway 專案中點擊 "Add Service"
2. 選擇 "PostgreSQL"
3. Railway 會自動創建資料庫並設置 DATABASE_URL

### 5. 部署配置
- Railway 會自動檢測到 `railway.toml` 配置
- 構建命令：`npm install && npm run build`
- 啟動命令：`npm run start`
- 健康檢查：`/admin`

### 6. 域名配置
部署完成後，你會得到一個類似這樣的 URL：
`https://my-project-production.up.railway.app`

### 7. 前端配置更新
在你的 Next.js 專案中，更新環境變數：

```bash
NEXT_PUBLIC_STRAPI_URL=https://你的railway域名.railway.app
```

## 🔧 故障排除

### 常見問題：
1. **構建失敗**：檢查 Node.js 版本是否在 18-20 之間
2. **資料庫連接失敗**：確保 DATABASE_URL 正確設置
3. **管理員無法訪問**：檢查 ADMIN_JWT_SECRET 是否設置

### 日誌查看：
在 Railway 控制台可以查看即時日誌來診斷問題

## ✅ 部署成功確認

部署成功後，你應該能夠：
1. 訪問 `https://你的域名.railway.app/admin` 看到 Strapi 管理界面
2. 訪問 `https://你的域名.railway.app/api/content-types` 看到 API 文檔
3. 在前端應用中成功調用 Strapi API 