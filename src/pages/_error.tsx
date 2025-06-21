import React from 'react';
import { NextPage, NextPageContext } from 'next';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  
  const errorMessage = statusCode
    ? isEnglish
      ? `An error ${statusCode} occurred on the server`
      : `伺服器發生錯誤 ${statusCode}`
    : isEnglish
      ? 'An error occurred on the client'
      : '客戶端發生錯誤';
  
  const goBackText = isEnglish ? 'Return to Home' : '返回首頁';
  const tryAgainText = isEnglish ? 'Try Again' : '重試';
  
  return (
    <Layout title={`Error ${statusCode || ''} - Haka Toyz`}>
      <section className="error-page">
        <div className="container">
          <div className="error-content">
            <h1 className="neon-text-primary">{statusCode || 'Error'}</h1>
            <p className="error-message">{errorMessage}</p>
            <div className="error-actions">
              <Link href="/" className="btn-primary">
                {goBackText}
              </Link>
              <button onClick={() => router.reload()} className="btn-secondary">
                {tryAgainText}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext): { statusCode?: number } => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : undefined;
  return { statusCode };
};

export default Error; 