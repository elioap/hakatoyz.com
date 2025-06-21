/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除靜態導出配置，啟用伺服器端功能
  reactStrictMode: true,
  i18n: {
    // 支持的語言列表
    locales: ['en', 'zh'],
    // 默認語言
    defaultLocale: 'en',
    // 設置語言檢測
    localeDetection: false,
  },
  images: {
    unoptimized: true, // 關閉圖片優化，解決顯示問題
    domains: [], // 暫時保持空，等有Railway域名後再添加
  },
  // 添加環境變量配置
  env: {
    RAILWAY_API_URL: process.env.RAILWAY_API_URL,
  }
};

module.exports = nextConfig; 