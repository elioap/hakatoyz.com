import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-TW">
      <Head>
        {/* 基本 Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Haka Toyz" />
        
        {/* SEO 關鍵字優化 */}
        <meta name="keywords" content="潮物,新品,玩具,帥,cool,代購,吉依卡娃,公仔,美國代購,潮流玩具,限量手辦,設計師玩具,KAWS,BE@RBRICK,Supreme,Nike,Jordan,Off-White,時尚潮牌,收藏品,藝術玩具,潮玩,手辦模型,限定商品,正品保證,全球直郵,trendy toys,designer toys,collectibles,figures,kawaii,cool stuff,hypebeast,streetwear,sneakers,luxury toys" />
        
        {/* Open Graph 社交媒體優化 */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Haka Toyz" />
        <meta property="og:locale" content="zh_TW" />
        <meta property="og:locale:alternate" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hakatoyz" />
        
        {/* 網站圖標 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Audiowide&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* 公共 CSS */}
        <link rel="stylesheet" href="/css/styles.css" />
        
        {/* 結構化數據 - 網站資訊 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Haka Toyz",
              "alternateName": ["哈卡玩具", "美國代購潮物"],
              "url": "https://hakatoyz.com",
              "description": "專業美國代購平台，提供潮物、新品玩具、帥氣公仔、吉依卡娃等cool潮流商品，正品保證全球直郵",
              "keywords": "潮物,新品,玩具,帥,cool,代購,吉依卡娃,公仔,KAWS,BE@RBRICK,潮流玩具",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://hakatoyz.com/products?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* 結構化數據 - 組織資訊 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Haka Toyz",
              "description": "專業美國代購服務，專注潮物、新品玩具、帥氣公仔代購",
              "url": "https://hakatoyz.com",
              "logo": "https://hakatoyz.com/images/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-0123",
                "contactType": "customer service",
                "availableLanguage": ["Chinese", "English"]
              },
              "sameAs": [
                "https://www.instagram.com/hakatoyz",
                "https://www.facebook.com/hakatoyz"
              ]
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
