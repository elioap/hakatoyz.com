# Railway 部署指南

## 📋 概述

本指南將幫助您將 hakatoyz.com 部署到 Railway 平台，啟用完整的後端功能。

## 🚀 部署步驟

### 1. 準備工作

確保您的項目已經完成以下調整：

- ✅ API路由結構已創建 (`src/pages/api/`)
- ✅ 環境變量已配置 (`.env.local`)
- ✅ 依賴包已安裝 (`axios`, `bcryptjs`, `jsonwebtoken`)
- ✅ `next.config.js` 已更新（移除靜態導出）
- ✅ `railway.json` 配置文件已創建
- ✅ `package.json` 腳本已更新

### 2. 註冊 Railway 帳戶

1. 前往 [railway.app](https://railway.app)
2. 點擊 **"Start a New Project"**
3. 選擇註冊方式：
   - GitHub帳戶登入（推薦）
   - Discord帳戶登入
   - 電子郵件註冊

### 3. 創建新專案

#### 方式A：從GitHub倉庫部署（推薦）

1. 點擊 **"New Project"**
2. 選擇 **"Deploy from GitHub repo"**
3. 授權Railway訪問您的GitHub
4. 選擇您的 `hakatoyz.com` 倉庫
5. 點擊 **"Deploy Now"**

#### 方式B：空白專案開始

1. 點擊 **"New Project"**
2. 選擇 **"Empty Project"**
3. 在專案設置中連接GitHub倉庫

### 4. 配置環境變量

在Railway專案設置中配置以下環境變量：

```env
# 基本配置
NODE_ENV=production
PORT=3000

# API配置
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app/api
JWT_SECRET=your-secure-jwt-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-railway-url.railway.app

# 資料庫配置（如果需要）
# DATABASE_URL=your-database-connection-string

# 其他配置
# RAILWAY_API_URL=https://your-backend.railway.app
```

### 5. 獲取專案URL

部署完成後，Railway會自動生成URL：

```
https://your-project-name-production-xxxx.up.railway.app
```

### 6. 更新配置

獲取Railway URL後，更新以下配置：

#### 更新 `next.config.js`：

```javascript
images: {
  domains: ['your-railway-url.railway.app'], // 替換為實際的Railway URL
  unoptimized: false,
},
```

#### 更新環境變量：

```env
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app/api
```

### 7. 重新部署

更新配置後，推送代碼到GitHub觸發自動重新部署：

```bash
git add .
git commit -m "Update Railway configuration"
git push origin main
```

## 🔧 驗證部署

### 1. 檢查健康狀態

訪問您的Railway URL，確認網站正常載入。

### 2. 測試API端點

測試以下API端點是否正常工作：

```bash
# 獲取所有產品
curl https://your-railway-url.railway.app/api/products

# 獲取特定產品
curl https://your-railway-url.railway.app/api/products/1

# 搜索產品
curl https://your-railway-url.railway.app/api/products/search?q=科技

# 用戶登入
curl -X POST https://your-railway-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hakatoyz.com","password":"password123"}'
```

### 3. 檢查功能

確認以下功能正常工作：

- ✅ 產品列表頁面
- ✅ 產品詳情頁面
- ✅ 購物車功能
- ✅ 用戶認證
- ✅ 多語言支持
- ✅ 響應式設計

## 🛠️ 故障排除

### 常見問題

#### 1. 部署失敗

**問題**：構建失敗
**解決方案**：
- 檢查 `package.json` 中的依賴是否正確
- 確認 `railway.json` 配置是否正確
- 查看Railway部署日誌

#### 2. API路由不工作

**問題**：API端點返回404
**解決方案**：
- 確認API路由文件位置正確 (`src/pages/api/`)
- 檢查環境變量配置
- 確認Next.js配置已更新

#### 3. 圖片無法載入

**問題**：圖片顯示破損
**解決方案**：
- 更新 `next.config.js` 中的 `domains` 配置
- 確認圖片路徑正確
- 檢查Railway URL是否正確

#### 4. 環境變量未生效

**問題**：環境變量無法讀取
**解決方案**：
- 確認環境變量名稱正確
- 重新部署專案
- 檢查Railway環境變量設置

### 查看日誌

在Railway專案頁面中：
1. 點擊 **"Deployments"** 標籤
2. 選擇最新的部署
3. 查看構建和運行日誌

## 📞 支援

如果遇到問題：

1. 查看Railway文檔：https://docs.railway.app
2. 檢查Next.js文檔：https://nextjs.org/docs
3. 查看專案GitHub Issues

## 🎉 完成

恭喜！您的 hakatoyz.com 現在已經成功部署到 Railway，具備完整的後端功能。

### 下一步

- 配置自定義域名（可選）
- 設置資料庫（如需要）
- 配置CDN（如需要）
- 設置監控和日誌 