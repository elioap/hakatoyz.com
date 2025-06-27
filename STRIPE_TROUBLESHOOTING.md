# Stripe 支付問題故障排除指南

## 問題描述
選擇結帳後沒有跳出輸入信用卡號的 Stripe 頁面

## 可能原因和解決方案

### 1. 環境變量未設置

**檢查步驟：**
1. 打開瀏覽器開發者工具（F12）
2. 查看 Console 標籤頁
3. 尋找以下錯誤信息：
   - "錯誤: STRIPE_SECRET_KEY 環境變量未設置"
   - "Stripe配置錯誤，請檢查環境變量"

**解決方案：**
在項目根目錄創建 `.env.local` 文件：

```env
# Stripe 配置 - 請替換為您的實際密鑰
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51R8L3LLihhSffOmm2tJoxFCt8jG0PsRIJknJxvITTuelhDZzCP0HNAyeLmOmh0ro7ZMtkE3Gkigixb4bHB6AvXtI00pD4lZqhS

# 開發環境測試用（可選）
# STRIPE_SECRET_KEY=sk_test_your_test_secret_key
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
```

### 2. 重啟開發服務器

設置環境變量後，必須重啟開發服務器：

```bash
# 停止當前服務器 (Ctrl+C)
# 然後重新啟動
npm run dev
```

### 3. 檢查網絡連接

**測試 Stripe API 連接：**
1. 打開 `http://localhost:3000/checkout`
2. 添加商品到購物車
3. 填寫必填的收貨信息
4. 選擇信用卡支付方式
5. 查看瀏覽器控制台是否有以下信息：
   - "開始初始化Stripe支付意圖，金額: XXX"
   - "正在創建支付意圖，金額: XXX"
   - "支付意圖創建成功"

### 4. 常見錯誤信息

| 錯誤信息 | 原因 | 解決方案 |
|---------|------|---------|
| "Payment initialization failed" | Stripe API 調用失敗 | 檢查密鑰和網絡連接 |
| "Stripe認證失敗" | 密鑰錯誤 | 確認 STRIPE_SECRET_KEY 正確 |
| "初始化支付中..." 一直顯示 | API 請求掛起 | 檢查網絡連接和服務器狀態 |

### 5. 調試步驟

**步驟 1：檢查瀏覽器控制台**
```
1. 打開開發者工具 (F12)
2. 選擇 Console 標籤頁
3. 查看是否有錯誤信息
4. 查看 Network 標籤頁中的 API 請求
```

**步驟 2：檢查 API 端點**
```
1. 查看 /api/stripe/create-payment-intent 請求
2. 檢查請求狀態碼（應該是 200）
3. 查看回應內容
```

**步驟 3：檢查環境變量**
在 `src/pages/api/stripe/create-payment-intent.ts` 中臨時添加：
```javascript
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '已設置' : '未設置');
```

### 6. 測試環境配置

**使用 Stripe 測試密鑰：**
```env
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

**測試卡號：**
- 成功：4242424242424242
- 失敗：4000000000000002

### 7. 檢查代碼邏輯

確認以下條件：
1. ✅ 購物車中有商品
2. ✅ 選擇了信用卡支付方式
3. ✅ `orderTotal > 0`
4. ✅ `clientSecret` 已生成

### 8. 如果仍然無法解決

**聯繫支持時請提供：**
1. 瀏覽器控制台的完整錯誤信息
2. Network 標籤頁中的 API 請求詳情
3. 您的 Node.js 和 npm 版本
4. 操作系統信息

**常用調試命令：**
```bash
# 檢查 Node.js 版本
node --version

# 檢查 npm 版本
npm --version

# 清除 npm 緩存
npm cache clean --force

# 重新安裝依賴
rm -rf node_modules package-lock.json
npm install
```

## 快速檢查清單

- [ ] 已創建 `.env.local` 文件
- [ ] 已設置正確的 Stripe 密鑰
- [ ] 已重啟開發服務器
- [ ] 購物車中有商品
- [ ] 填寫了必填的收貨信息
- [ ] 選擇了信用卡支付方式
- [ ] 瀏覽器控制台沒有錯誤信息

如果以上步驟都完成但仍有問題，請檢查 STRIPE_TROUBLESHOOTING.md 文件中的詳細指南。 