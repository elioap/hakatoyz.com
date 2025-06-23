import React from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';

const FAQPage: React.FC = () => {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';

  const t = {
    title: isEnglish ? 'FAQ - Haka Toyz' : '常見問題 - Haka Toyz',
    pageHeading: isEnglish ? 'Frequently Asked Questions' : '常見問題',
    breadcrumb: isEnglish ? 'FAQ' : '常見問題',
    q1: isEnglish ? 'How do I place an order?' : '如何下訂單？',
    a1: isEnglish 
      ? 'You can place an order by browsing our products, adding items to your cart, and proceeding to checkout.'
      : '您可以瀏覽我們的商品，將商品加入購物車，然後進行結帳來下訂單。',
    q2: isEnglish ? 'What payment methods do you accept?' : '你們接受哪些付款方式？',
    a2: isEnglish
      ? 'We accept credit cards, PayPal, Alipay, and WeChat Pay.'
      : '我們接受信用卡、PayPal、支付寶和微信支付。',
    q3: isEnglish ? 'How long does shipping take?' : '運送需要多長時間？',
    a3: isEnglish
      ? 'Shipping typically takes 7-14 business days for international orders.'
      : '國際訂單通常需要7-14個工作日。',
    q4: isEnglish ? 'Can I cancel my order?' : '我可以取消訂單嗎？',
    a4: isEnglish
      ? 'You can cancel your order within 24 hours of placing it, as long as it has not been shipped.'
      : '您可以在下訂單後24小時內取消訂單，前提是商品尚未發貨。',
    q5: isEnglish ? 'Are all products authentic?' : '所有商品都是正品嗎？',
    a5: isEnglish
      ? 'Yes, all our products are 100% authentic and purchased directly from official sources.'
      : '是的，我們所有商品都是100%正品，直接從官方渠道採購。'
  };

  return (
    <Layout
      title={t.title}
      description={isEnglish ? 'Frequently asked questions about Haka Toyz services' : 'Haka Toyz 服務常見問題解答'}
    >
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1>{t.pageHeading}</h1>
          <div className="breadcrumb">
            <span className="current">{t.breadcrumb}</span>
          </div>
        </div>
      </div>

      {/* FAQ 內容 */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-content">
            <div className="faq-item">
              <h3 className="faq-question">{t.q1}</h3>
              <p className="faq-answer">{t.a1}</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">{t.q2}</h3>
              <p className="faq-answer">{t.a2}</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">{t.q3}</h3>
              <p className="faq-answer">{t.a3}</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">{t.q4}</h3>
              <p className="faq-answer">{t.a4}</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">{t.q5}</h3>
              <p className="faq-answer">{t.a5}</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQPage; 