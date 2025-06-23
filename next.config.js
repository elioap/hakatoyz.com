/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除靜態導出配置，啟用伺服器端功能
  reactStrictMode: true,
  eslint: {
    // 在生產構建期間忽略ESLint錯誤
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在生產構建期間忽略TypeScript錯誤
    ignoreBuildErrors: false,
  },
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
    domains: ['localhost'],
  },
  // 添加環境變量配置
  env: {
    RAILWAY_API_URL: process.env.RAILWAY_API_URL,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig; 