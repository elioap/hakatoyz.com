import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function Custom404() {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  
  return (
    <Layout 
      title={isEnglish ? '404 - Page Not Found | Haka Toyz' : '404 - 頁面未找到 | Haka Toyz'}
      description={isEnglish ? 'Page not found - Haka Toyz' : '頁面未找到 - Haka Toyz'}
    >
      <section className="error-section">
        <div className="container">
          <div className="error-content">
            <div className="error-code neon-text-primary">404</div>
            <h1>{isEnglish ? 'Page Not Found' : '找不到頁面'}</h1>
            <p>
              {isEnglish
                ? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
                : '您所尋找的頁面可能已被移除、名稱已更改或暫時無法使用。'}
            </p>
            <Link href="/" className="btn-primary">
              {isEnglish ? 'Back to Home' : '返回首頁'}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
