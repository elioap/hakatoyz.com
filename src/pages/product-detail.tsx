import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout
      title="商品详情 - Haka Toyz"
      description="Haka Toyz商品详细信息，查看产品规格、价格和库存情况"
    >
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1 className="lang-en">Product Details</h1>
          <h1 className="lang-zh">商品詳情</h1>
          <div className="breadcrumb">
            <span className="current lang-en">Product #{id}</span>
            <span className="current lang-zh">商品 #{id}</span>
          </div>
        </div>
      </div>
      
      {/* 商品詳情內容 */}
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail-content">
            <p>商品ID: {id}</p>
            {/* 這裡添加商品詳情頁面的內容 */}
            <h2>商品詳情頁面開發中...</h2>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetailPage;
