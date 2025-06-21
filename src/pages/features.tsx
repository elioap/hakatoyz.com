import React from 'react';
import Layout from '@/components/Layout';

const FeaturesPage: React.FC = () => {
  return (
    <Layout
      title="产品特点 - Haka Toyz"
      description="Haka Toyz产品特点介绍，了解我们的优势和特色服务"
    >
      {/* 特色頁面標題 */}
      <section className="page-header">
        <div className="container">
          <h1 className="lang-en">Our Features</h1>
          <h1 className="lang-zh">我們的特色</h1>
          <p className="lang-en">What makes Haka Toyz unique</p>
          <p className="lang-zh">Haka Toyz的獨特之處</p>
        </div>
      </section>

      {/* 特色內容 */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-shipping-fast" />
              <h3 className="lang-en">Fast Shipping</h3>
              <h3 className="lang-zh">快速配送</h3>
              <p className="lang-en">
                Direct shipping from USA within 3-5 business days
              </p>
              <p className="lang-zh">美國直郵，3-5個工作日送達</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-shield-alt" />
              <h3 className="lang-en">Authentic Products</h3>
              <h3 className="lang-zh">正品保證</h3>
              <p className="lang-en">
                100% authentic products from authorized retailers
              </p>
              <p className="lang-zh">100%正品，來自授權零售商</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-hand-holding-usd" />
              <h3 className="lang-en">Best Price</h3>
              <h3 className="lang-zh">優惠價格</h3>
              <p className="lang-en">Competitive prices with regular promotions</p>
              <p className="lang-zh">具有競爭力的價格和定期促銷</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-headset" />
              <h3 className="lang-en">24/7 Support</h3>
              <h3 className="lang-zh">全天候支援</h3>
              <p className="lang-en">
                Professional customer service team at your service
              </p>
              <p className="lang-zh">專業的客服團隊為您服務</p>
            </div>
          </div>
          <div className="service-details">
            <div className="service-item">
              <h2 className="lang-en">Premium Shopping Experience</h2>
              <h2 className="lang-zh">優質購物體驗</h2>
              <ul>
                <li className="lang-en">Exclusive early access to new releases</li>
                <li className="lang-zh">新品發售搶先體驗</li>
                <li className="lang-en">VIP member benefits and rewards</li>
                <li className="lang-zh">VIP會員優惠和獎勵</li>
                <li className="lang-en">Personalized shopping recommendations</li>
                <li className="lang-zh">個性化購物推薦</li>
              </ul>
            </div>
            <div className="service-item">
              <h2 className="lang-en">Quality Assurance</h2>
              <h2 className="lang-zh">品質保證</h2>
              <ul>
                <li className="lang-en">Strict quality inspection process</li>
                <li className="lang-zh">嚴格的質量檢查流程</li>
                <li className="lang-en">Secure packaging for safe delivery</li>
                <li className="lang-zh">安全的包裝確保配送</li>
                <li className="lang-en">Easy returns and refunds</li>
                <li className="lang-zh">簡單的退換貨流程</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FeaturesPage;
