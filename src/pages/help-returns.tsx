import React from 'react';
import Layout from '@/components/Layout';

const HelpReturnsPage: React.FC = () => {
  return (
    <Layout
      title="帮助中心 - 退货政策 - Haka Toyz"
      description="Haka Toyz帮助中心退货政策说明"
    >
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title lang-en">Returns & Refunds</h1>
          <h1 className="page-title lang-zh">退貨與退款</h1>
          <div className="breadcrumb">
            <span className="current lang-en">Help Center - Returns</span>
            <span className="current lang-zh">幫助中心 - 退貨政策</span>
          </div>
        </div>
      </div>

      {/* 退貨政策內容 */}
      <section className="returns-section">
        <div className="container">
          <div className="returns-content">
            <div className="policy-section">
              <h2 className="lang-en">Return Policy</h2>
              <h2 className="lang-zh">退貨政策</h2>
              <p className="lang-en">
                We want you to be completely satisfied with your purchase. If you&apos;re not, 
                you may return most items purchased directly from Haka Toyz within 30 days of 
                delivery for a full refund or exchange.
              </p>
              <p className="lang-zh">
                我們希望您對購買的商品完全滿意。如果您不滿意，您可以在收到商品後30天內
                退回直接從Haka Toyz購買的大多數商品，以獲得全額退款或換貨。
              </p>
              
              <h3 className="lang-en">Items must be:</h3>
              <h3 className="lang-zh">商品必須：</h3>
              <ul className="lang-en">
                <li>In original, undamaged condition</li>
                <li>Complete with all accessories and packaging</li>
                <li>Accompanied by the original receipt or proof of purchase</li>
              </ul>
              <ul className="lang-zh">
                <li>處於原始、未損壞的狀態</li>
                <li>包含所有配件和包裝</li>
                <li>附有原始收據或購買證明</li>
              </ul>
            </div>
            
            <div className="policy-section">
              <h2 className="lang-en">How to Return</h2>
              <h2 className="lang-zh">如何退貨</h2>
              <ol className="lang-en">
                <li>Contact our customer service team to initiate your return</li>
                <li>Fill out the return form we&apos;ll provide</li>
                <li>Pack the item securely with all original packaging</li>
                <li>Ship the item using our provided return label</li>
              </ol>
              <ol className="lang-zh">
                <li>聯繫我們的客戶服務團隊啟動您的退貨</li>
                <li>填寫我們提供的退貨表格</li>
                <li>使用所有原始包裝安全地包裝商品</li>
                <li>使用我們提供的退貨標籤發貨</li>
              </ol>
            </div>
            
            <div className="policy-section">
              <h2 className="lang-en">Refund Process</h2>
              <h2 className="lang-zh">退款流程</h2>
              <p className="lang-en">
                Once we receive your returned item, we&apos;ll inspect it and process your refund. 
                Refunds are typically issued within 5-7 business days to your original payment method.
              </p>
              <p className="lang-zh">
                一旦我們收到您退回的商品，我們將檢查並處理您的退款。
                退款通常在5-7個工作日內退回到您的原始付款方式。
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HelpReturnsPage;
