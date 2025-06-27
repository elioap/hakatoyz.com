# 支付系統設置指南

## 概述
已成功集成 Stripe 和 PayPal 支付系統到您的結帳頁面。

## 環境變量配置

請在項目根目錄創建或更新 `.env.local` 文件，添加以下環境變量：

```env
# Stripe 配置
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51R8L3LLihhSffOmm2tJoxFCt8jG0PsRIJknJxvITTuelhDZzCP0HNAyeLmOmh0ro7ZMtkE3Gkigixb4bHB6AvXtI00pD4lZqhS

# PayPal 配置
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# 網站基礎URL
NEXT_PUBLIC_BASE_URL=https://hakatoyz.com
```

## Stripe 設置

1. **獲取 Stripe 密鑰**：
   - 登錄到 [Stripe Dashboard](https://dashboard.stripe.com/)
   - 進入 "Developers" > "API keys"
   - 複製 "Secret key" 並設置為 `STRIPE_SECRET_KEY`
   - 公鑰已經在代碼中設置

2. **Webhook 設置** (可選但推薦)：
   - 在 Stripe Dashboard 中設置 webhook
   - 端點URL: `https://yourdomain.com/api/stripe/webhook`
   - 選擇事件: `payment_intent.succeeded`, `payment_intent.payment_failed`

## PayPal 設置

1. **創建 PayPal 應用**：
   - 登錄到 [PayPal Developer](https://developer.paypal.com/)
   - 創建新應用
   - 獲取 Client ID 和 Client Secret

2. **配置環境**：
   - 開發環境使用 Sandbox 憑證
   - 生產環境使用 Live 憑證

## 已實現的功能

### ✅ Stripe 信用卡支付
- 支持所有主要信用卡
- 實時卡片驗證
- 安全的 3D Secure 驗證
- 多幣種支持（默認人民幣 CNY）

### ✅ PayPal 支付
- PayPal 賬戶支付
- PayPal Credit 支付
- 客戶友好的支付體驗
- 自動貨幣轉換（USD）

### ✅ 支付寶和微信支付佔位符
- 為未來集成預留了位置
- 目前顯示為模擬支付流程

## 安全注意事項

1. **永遠不要在前端暴露密鑰**
2. **使用 HTTPS** 進行所有支付處理
3. **定期更新依賴包**
4. **實施適當的錯誤處理**
5. **記錄支付事件**用於審計

## 測試

### Stripe 測試卡號
- 成功: `4242424242424242`
- 失敗: `4000000000000002`
- 3D Secure: `4000000000003220`

### PayPal 測試
- 使用 PayPal Sandbox 賬戶進行測試
- 確保在 `.env.local` 中設置正確的 Sandbox 憑證

## 部署檢查清單

- [ ] 設置生產環境變量
- [ ] 更新 Stripe 密鑰為生產密鑰
- [ ] 更新 PayPal 憑證為生產憑證
- [ ] 測試支付流程
- [ ] 設置監控和日誌
- [ ] 配置 Webhook 端點

## 故障排除

### 常見問題

1. **Stripe 支付失敗**
   - 檢查 `STRIPE_SECRET_KEY` 是否正確
   - 確認網絡連接
   - 查看瀏覽器控制台錯誤

2. **PayPal 按鈕不顯示**
   - 檢查 `NEXT_PUBLIC_PAYPAL_CLIENT_ID` 是否設置
   - 確認 PayPal SDK 正確加載

3. **環境變量問題**
   - 重啟開發服務器
   - 檢查 `.env.local` 文件位置和語法

## 支持和文檔

- [Stripe 文檔](https://stripe.com/docs)
- [PayPal 開發者文檔](https://developer.paypal.com/docs/)
- [Next.js 環境變量](https://nextjs.org/docs/basic-features/environment-variables)

## 下一步

1. 配置環境變量
2. 測試支付流程
3. 設置生產環境
4. 監控支付成功率
5. 可選：添加支付寶和微信支付集成 