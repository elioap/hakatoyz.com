import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CategoriesPage: React.FC = () => {
  const router = useRouter();
  const { locale } = router;
  
  // 判斷當前語言
  const isEnglish = locale === 'en';
  
  return (
    <Layout
      title={isEnglish ? 'Categories - Haka Toyz' : '分類 - Haka Toyz'}
      description={isEnglish 
        ? 'Browse product categories at Haka Toyz - Your source for trendy items from USA.'
        : '瀏覽Haka Toyz的商品分類 - 您的美國潮流商品來源。'
      }
    >
      {/* 分類頁面標題 */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{isEnglish ? 'Product Categories' : '商品分類'}</h1>
          <p className="page-description">{isEnglish 
            ? 'Explore our diverse collection of trending items'
            : '探索我們多樣化的潮流商品'
          }</p>
        </div>
      </section>

      {/* 分類列表 */}
      <section className="categories-section">
        <div className="container">
          <div className="categories-grid">
            <div className="category-card">
              <img src="images/category1.jpg" alt="Designer Toys" />
              <div className="category-content">
                <h3>{isEnglish ? 'Designer Toys' : '潮玩手辦'}</h3>
                <p>
                  {isEnglish
                    ? 'Exclusive collectible figures and limited edition toys'
                    : '獨家收藏手辦和限量版玩具'
                  }
                </p>
                <Link
                  href="/products?category=toys"
                  className="border-beam-button"
                >
                  {isEnglish ? 'View Products' : '查看商品'}
                  <div className="beam" />
                </Link>
              </div>
            </div>
            <div className="category-card">
              <img src="images/category2.jpg" alt="Fashion Apparel" />
              <div className="category-content">
                <h3>{isEnglish ? 'Fashion Apparel' : '時尚服飾'}</h3>
                <p>
                  {isEnglish
                    ? 'Trendy clothing and accessories from top brands'
                    : '頂級品牌的時尚服飾與配件'
                  }
                </p>
                <Link
                  href="/products?category=fashion"
                  className="border-beam-button"
                >
                  {isEnglish ? 'View Products' : '查看商品'}
                  <div className="beam" />
                </Link>
              </div>
            </div>
            <div className="category-card">
              <img src="images/category3.jpg" alt="Limited Sneakers" />
              <div className="category-content">
                <h3>{isEnglish ? 'Limited Sneakers' : '限量球鞋'}</h3>
                <p>
                  {isEnglish
                    ? 'Rare and exclusive sneaker releases'
                    : '稀有限定球鞋發售'
                  }
                </p>
                <Link
                  href="/products?category=sneakers"
                  className="border-beam-button"
                >
                  {isEnglish ? 'View Products' : '查看商品'}
                  <div className="beam" />
                </Link>
              </div>
            </div>
            <div className="category-card">
              <img src="images/category4.jpg" alt="Art Collectibles" />
              <div className="category-content">
                <h3>{isEnglish ? 'Art Collectibles' : '藝術收藏'}</h3>
                <p>
                  {isEnglish
                    ? 'Unique art pieces and collectible items'
                    : '獨特藝術品和收藏品'
                  }
                </p>
                <Link 
                  href="/products?category=art" 
                  className="border-beam-button"
                >
                  {isEnglish ? 'View Products' : '查看商品'}
                  <div className="beam" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CategoriesPage;
