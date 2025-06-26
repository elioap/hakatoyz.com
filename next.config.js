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
    locales: ['zh', 'en'],
    // 默認語言
    defaultLocale: 'zh',
    // 設置語言檢測
    localeDetection: true,
  },
  images: {
    unoptimized: true, // 關閉圖片優化，解決顯示問題
    domains: ['localhost', 'hakatoyz.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24小時
  },
  // 添加環境變量配置
  env: {
    RAILWAY_API_URL: process.env.RAILWAY_API_URL,
    NEXT_PUBLIC_SITE_URL: 'https://hakatoyz.com',
    NEXT_PUBLIC_SITE_NAME: 'Haka Toyz',
    NEXT_PUBLIC_SITE_DESCRIPTION: '專業美國代購平台！提供最新潮物、帥氣玩具、cool公仔、吉依卡娃等新品',
  },
  swcMinify: true,
  
  // SEO 優化配置
  generateEtags: true,
  compress: true,
  
  // SEO 友好的 URL 重寫
  async rewrites() {
    return [
      {
        source: '/潮物',
        destination: '/products?category=trendy',
      },
      {
        source: '/新品',
        destination: '/products?category=new',
      },
      {
        source: '/玩具',
        destination: '/products?category=toys',
      },
      {
        source: '/公仔',
        destination: '/products?category=figures',
      },
      {
        source: '/代購',
        destination: '/products',
      },
    ];
  },
  
  // 安全標頭
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  },
  
  // 實驗性功能
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // 靜態文件優化
  trailingSlash: false,
};

module.exports = nextConfig; 