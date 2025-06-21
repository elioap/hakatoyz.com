import React from 'react';
import Layout from '@/components/Layout';

const AboutPage: React.FC = () => {
  return (
    <Layout
      title="关于我们 - Haka Toyz"
      description="关于Haka Toyz的介绍，我们的故事，使命和价值观"
    >
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title lang-en">About Haka Toyz</h1>
          <h1 className="page-title lang-zh">關於我們</h1>
          <div className="breadcrumb">
            <span className="current lang-en">About</span>
            <span className="current lang-zh">關於</span>
          </div>
        </div>
      </div>

      {/* 關於我們內容 */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            {/* 公司介紹 */}
            <div className="about-company">
              <h2 className="lang-en">Our Story</h2>
              <h2 className="lang-zh">品牌故事</h2>
              <p className="lang-en">
                Founded in 2024, Haka Toyz has grown from a small collector&apos;s shop
                to a leading destination for premium collectibles, designer toys,
                and limited-edition sneakers. Our passion for quality and
                authenticity drives everything we do.
              </p>
              <p className="lang-zh">
                成立於2024年，Haka
                Toyz從一家小型收藏品商店發展成為高端收藏品、設計師玩具和限量版球鞋的領先目的地。我們對品質和真實性的熱情驅動著我們所做的一切。
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
