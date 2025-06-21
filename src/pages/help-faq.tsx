import React from 'react';
import Layout from '@/components/Layout';

const HelpFAQPage: React.FC = () => {
  return (
    <Layout
      title="帮助中心 - 常见问题 - Haka Toyz"
      description="Haka Toyz帮助中心常见问题解答"
    >
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1 className="lang-en">Frequently Asked Questions</h1>
          <h1 className="lang-zh">常見問題</h1>
          <div className="breadcrumb">
            <span className="current lang-en">Help Center - FAQ</span>
            <span className="current lang-zh">幫助中心 - 常見問題</span>
          </div>
        </div>
      </div>

      {/* FAQ 內容 */}
      <section className="faq-section">
        <div className="container">
          <div className="faq-content">
            <div className="faq-item">
              <h3 className="faq-question lang-en">How do I track my order?</h3>
              <h3 className="faq-question lang-zh">如何追蹤我的訂單？</h3>
              <div className="faq-answer">
                <p className="lang-en">
                  You can track your order by logging into your account and viewing the order details, 
                  or by clicking the tracking link in your shipping confirmation email.
                </p>
                <p className="lang-zh">
                  您可以登錄您的帳戶並查看訂單詳情，或點擊發貨確認郵件中的追蹤鏈接來追蹤您的訂單。
                </p>
              </div>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question lang-en">What payment methods do you accept?</h3>
              <h3 className="faq-question lang-zh">你們接受哪些付款方式？</h3>
              <div className="faq-answer">
                <p className="lang-en">
                  We accept credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, 
                  and various local payment methods for international customers.
                </p>
                <p className="lang-zh">
                  我們接受信用卡（Visa、MasterCard、American Express）、PayPal、Apple Pay，
                  以及為國際客戶提供的各種當地支付方式。
                </p>
              </div>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question lang-en">How long does shipping take?</h3>
              <h3 className="faq-question lang-zh">運送需要多長時間？</h3>
              <div className="faq-answer">
                <p className="lang-en">
                  Standard shipping typically takes 3-5 business days within the continental US, 
                  and 7-14 business days for international orders, depending on the destination country.
                </p>
                <p className="lang-zh">
                  標準運送在美國大陸境內通常需要3-5個工作日，國際訂單則需要7-14個工作日，具體取決於目的地國家。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HelpFAQPage;
