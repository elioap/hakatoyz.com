import React from 'react';
import Layout from '@/components/Layout';

const HelpShippingPage: React.FC = () => {
  return (
    <Layout
      title="帮助中心 - 配送信息 - Haka Toyz"
      description="Haka Toyz帮助中心配送相关信息说明"
    >
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title lang-en">Shipping Information</h1>
          <h1 className="page-title lang-zh">配送信息</h1>
          <div className="breadcrumb">
            <span className="current lang-en">Help Center - Shipping</span>
            <span className="current lang-zh">幫助中心 - 配送信息</span>
          </div>
        </div>
      </div>

      {/* 配送信息內容 */}
      <section className="shipping-section">
        <div className="container">
          <div className="shipping-content">
            <div className="shipping-item">
              <h2 className="lang-en">Shipping Methods</h2>
              <h2 className="lang-zh">配送方式</h2>
              <div className="methods-grid">
                <div className="method-card">
                  <h3 className="lang-en">Standard Shipping</h3>
                  <h3 className="lang-zh">標準配送</h3>
                  <p className="lang-en">7-14 business days</p>
                  <p className="lang-zh">7-14個工作日</p>
                  <span className="price">$5.99</span>
                </div>
                
                <div className="method-card">
                  <h3 className="lang-en">Express Shipping</h3>
                  <h3 className="lang-zh">快速配送</h3>
                  <p className="lang-en">3-5 business days</p>
                  <p className="lang-zh">3-5個工作日</p>
                  <span className="price">$12.99</span>
                </div>
                
                <div className="method-card">
                  <h3 className="lang-en">Priority Shipping</h3>
                  <h3 className="lang-zh">優先配送</h3>
                  <p className="lang-en">1-2 business days</p>
                  <p className="lang-zh">1-2個工作日</p>
                  <span className="price">$19.99</span>
                </div>
              </div>
            </div>
            
            <div className="shipping-item">
              <h2 className="lang-en">International Shipping</h2>
              <h2 className="lang-zh">國際配送</h2>
              <p className="lang-en">
                We ship to most countries worldwide. International shipping times vary by location, 
                typically ranging from 10-21 business days. Additional customs duties and taxes may 
                apply depending on your country&apos;s regulations.
              </p>
              <p className="lang-zh">
                我們提供全球大多數國家的配送服務。國際配送時間因地區而異，通常在10-21個工作日範圍內。
                根據您所在國家的規定，可能需要支付額外的關稅和稅費。
              </p>
            </div>
            
            <div className="shipping-item">
              <h2 className="lang-en">Tracking Your Order</h2>
              <h2 className="lang-zh">追蹤您的訂單</h2>
              <p className="lang-en">
                Once your order ships, you&apos;ll receive a confirmation email with tracking information. 
                You can also track your order by logging into your account and viewing your order history.
              </p>
              <p className="lang-zh">
                訂單發貨後，您將收到一封帶有追蹤信息的確認郵件。
                您也可以通過登錄帳戶並查看訂單歷史來追蹤訂單。
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HelpShippingPage;
