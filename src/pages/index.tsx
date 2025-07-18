import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BrandsIconCloud } from '@/components/IconCloud';
import { useCart } from '@/contexts/CartContext';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { locale } = router;
  const { addToCart } = useCart();
  
  // 品牌狀態管理
  const [featuredBrands, setFeaturedBrands] = useState<any[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  
  // 判斷當前語言
  const isEnglish = locale === 'en';
  
  // 獲取特色品牌數據
  useEffect(() => {
    const fetchFeaturedBrands = async () => {
      try {
        setBrandsLoading(true);
        const response = await fetch('/api/brands?featured=true');
        const data = await response.json();
        
        if (data.success) {
          setFeaturedBrands(data.data);
        } else {
          console.warn('Failed to fetch featured brands from API');
        }
      } catch (error) {
        console.error('Error fetching featured brands:', error);
      } finally {
        setBrandsLoading(false);
      }
    };

    fetchFeaturedBrands();
  }, []);
  
  // 根據當前語言選擇內容
  const t = {
    heroTitle: isEnglish ? 'Trendy Cool Toys from USA' : '美國時尚潮物',
    heroDescription: isEnglish
      ? 'Discover unique trendy toys, cool figures, kawaii collectibles and designer products from the USA. We bring the latest cool stuff and trendy products to your doorstep worldwide with authentic guarantee.'
      : '探索美國獨特的時尚潮物、帥氣玩具、cool公仔、吉依卡娃收藏品。我們將最新潮流商品和帥氣新品帶到全球各地，正品保證，讓您輕鬆擁有最酷的潮流玩具。',
    shopNow: isEnglish ? 'SHOP COOL STUFF NOW' : '立即選購潮物',
    trendingTitle: isEnglish ? 'Trending Cool Toys Now' : '人氣爆款潮物',
    trendingDescription: isEnglish ? 'Most popular cool figures and trendy toys this week' : '本週最熱門的帥氣玩具和潮流公仔',
    kawsCompanion: isEnglish ? 'KAWS Companion Cool Figure' : 'KAWS 帥氣公仔',
    supremeHoodie: isEnglish ? 'Supreme Cool Hoodie' : 'Supreme 潮流衛衣',
    nikeOffWhite: 'Nike x Off-White',
    quickOrder: isEnglish ? 'Quick Order' : '快速下單',
    featuredBrandsTitle: isEnglish ? 'Featured Cool Brands' : '熱門潮流代購品牌',
    featuredBrandsDesc: isEnglish ? 'We partner with the coolest and trendiest brands from USA' : '我們與美國最帥氣的潮流品牌合作',
    featuredProductsTitle: isEnglish ? 'Featured Cool Products' : '熱門潮物商品',
    featuredProductsDesc: isEnglish ? 'Hand-picked trendy and cool collectibles for you' : '精選最受歡迎的帥氣代購潮物',
    viewDetails: isEnglish ? 'View Details' : '查看詳情',
    addToCart: isEnglish ? 'Add to Cart' : '加入購物車',
    hot: isEnglish ? 'Hot' : '熱賣',
    new: isEnglish ? 'New' : '新品',
    limited: isEnglish ? 'Limited' : '限量',
    cyberMechaFigure: isEnglish ? 'Cool Cyber Mecha Figure' : 'Cool Cyber Mecha 帥氣機甲模型',
    retroSynthwaveCar: isEnglish ? 'Retro Cool Synthwave Car' : '復古帥氣賽博跑車模型',
    viewMoreProducts: isEnglish ? 'View More Cool Products' : '查看更多潮物商品',
    categoriesTitle: isEnglish ? 'Cool Categories' : '潮物分類',
    categoriesDesc: isEnglish ? 'Browse different types of trendy and cool products' : '瀏覽不同類別的帥氣潮流商品',
    designerToys: isEnglish ? 'Designer Cool Toys' : '設計師潮玩手辦',
    fashionApparel: isEnglish ? 'Cool Fashion Apparel' : '帥氣時尚服飾',
    limitedSneakers: isEnglish ? 'Limited Cool Sneakers' : '限量帥氣球鞋',
    artCollectibles: isEnglish ? 'Cool Art Collectibles' : '帥氣藝術收藏',
    viewProducts: isEnglish ? 'View Products' : '查看商品',
    whyChooseUsTitle: isEnglish ? 'Why Choose Our Cool Service' : '為什麼選擇我們的潮物服務',
    whyChooseUsDesc: isEnglish ? 'The Haka Toyz Cool Advantage' : 'Haka Toyz 的潮流服務優勢',
    authenticProducts: isEnglish ? 'Authentic Cool Products' : '正品帥氣商品保證',
    authenticProductsDesc: isEnglish 
      ? 'All cool toys and trendy items are purchased directly from official US sources with proof of authenticity'
      : '所有帥氣玩具和潮物均從美國官方渠道直接採購，100% 正品保證，提供購買憑證',
    globalShipping: isEnglish ? 'Global Cool Shipping' : '全球潮物直郵',
    globalShippingDesc: isEnglish
      ? 'Professional international shipping of cool toys and trendy products from the US to your doorstep'
      : '專業國際物流團隊，提供從美國到中國的安全快速潮物直郵服務',
    expertSupport: isEnglish ? 'Expert Cool Support' : '專業潮物客服',
    expertSupportDesc: isEnglish
      ? 'Bilingual customer service team available 24/7 to assist with your cool toy and trendy product needs'
      : '提供全中文專業客服團隊，7x24小時在線解答您的潮物和帥氣玩具問題',
    transparentPricing: isEnglish ? 'Transparent Cool Pricing' : '潮物價格透明',
    transparentPricingDesc: isEnglish
      ? 'Clear fee structure for cool toys with no hidden costs and multiple payment methods'
      : '所有潮物費用清晰標註，無隱藏收費，支持多種付款方式',
    customerReviewsTitle: isEnglish ? 'Cool Customer Reviews' : '潮物客戶評價',
    customerReviewsDesc: isEnglish ? 'What our customers say about our cool products and service' : '聽聽我們的潮物客戶怎麼說',
    review1: isEnglish
      ? '"I\'ve made multiple purchases of cool toys through Haka Toyz and every time I\'ve been completely satisfied. The trendy products are authentic, well-packaged, and they arrived earlier than expected! The customer service team was very professional and helpful with my cool collectibles."'
      : '"已經通過 Haka Toyz 購買了多次帥氣潮物，每次都非常滿意。商品是正品，包裝也很完好，而且比預計時間提前到貨！客服小姐姐服務態度非常好，解答潮物問題很專業。"',
    review2: isEnglish
      ? '"Haka Toyz helped me get a limited edition cool BE@RBRICK that sold out instantly on the official website. I\'m so grateful! They had connections to source trendy collectibles, and their price was better than other proxy services. The process was smooth and the staff was very professional with cool toys."'
      : '"Haka Toyz 幫我買到了限量版的超帥氣 BE@RBRICK 手辦，真的太感謝了！當時官網秒沒，但他們有渠道拿到這些潮物，價格也比其他代購便宜，客服非常專業，整個潮流玩具購買過程很順利。"',
    contactUsTitle: isEnglish ? 'Contact Us for Cool Stuff' : '聯絡我們購買潮物',
    contactUsDesc: isEnglish
      ? 'For any inquiries about cool toys or trendy product purchasing requests, please get in touch'
      : '有任何帥氣潮物問題或代購需求，請隨時聯絡我們',
    email: isEnglish ? 'Email' : '郵箱',
    phone: isEnglish ? 'Phone' : '電話',
    name: isEnglish ? 'Name' : '姓名',
    message: isEnglish ? 'Message' : '留言',
    sendMessage: isEnglish ? 'Send Message' : '發送消息',
    newsletterTitle: isEnglish ? 'Subscribe for Cool Updates' : '訂閱我們的潮物資訊',
    newsletterDesc: isEnglish
      ? 'Get instant updates on limited cool releases and exclusive trendy offers'
      : '第一時間獲取限量潮物發售信息和獨家帥氣商品優惠',
    emailPlaceholder: isEnglish ? 'Enter your email for cool updates' : '請輸入您的郵箱獲取潮物資訊',
    subscribe: isEnglish ? 'Subscribe' : '訂閱',
  };
  
  // 处理快速添加到购物车
  const handleQuickAddToCart = (productId: string, name: string, price: number, image: string) => {
    addToCart({
      id: parseInt(productId.replace('p', '')), // 将p001转换为数字ID
      name,
      price,
      image,
      category: isEnglish ? 'Featured Products' : '熱門商品'
    });
    
    // 显示添加成功提示
    const message = document.createElement('div');
    message.className = 'fixed bottom-5 right-5 bg-green-900/80 border border-green-600 text-green-300 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in-out';
    message.innerHTML = `
      <i class="fas fa-check-circle mr-2"></i>
      ${isEnglish ? 'Added to cart successfully!' : '成功加入購物車！'}
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.classList.add('animate-fade-out');
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 1000);
  };
  
  return (
    <Layout
      title={isEnglish ? 'Haka Toyz - Trendy Cool Toys from USA' : 'Haka Toyz - 美國代購潮物'}
      description={isEnglish 
        ? 'Discover trendy and exclusive items from the USA at Haka Toyz. We ship worldwide.'
        : '在Haka Toyz發現來自美國的時尚獨家商品。我們提供全球配送服務。'
      }
    >
      {/* 英雄區域 */}
      <section className="hero">
        <div className="container">
          <div className="hero-flex">
            <div className="hero-content">
              <h2>
                {isEnglish ? (
                  <>Discover <span>Trendy</span> Cool Toys from USA</>
                ) : (
                  <>探索美國<span>時尚潮物</span></>
                )}
              </h2>
              <p>{t.heroDescription}</p>
              <div className="hero-buttons">
                <Link href="/products" className="btn-primary">
                  {t.shopNow}
                  <i className="fas fa-arrow-right"></i>
                </Link>
                <Link href="/categories" className="btn-secondary">
                  {isEnglish ? 'Browse Categories' : '瀏覽分類'}
                </Link>
              </div>
            </div>
            <div className="hero-brands desktop-only">
              <BrandsIconCloud />
            </div>
            
            {/* 手機版品牌展示 */}
            <div className="mobile-brands mobile-only">
              <div className="mobile-brands-grid">
                {['Supreme', 'Nike', 'KAWS', 'Off-White', 'Jordan', 'Apple'].map((brand, index) => (
                  <div key={index} className="mobile-brand-item">
                    <span>{brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 熱門商品快速購買區 */}
      <section className="trending-products">
        <div className="container">
          <div className="section-header">
            <h2>{t.trendingTitle}</h2>
            <p>{t.trendingDescription}</p>
          </div>
          <div className="trending-grid">
            <div className="trending-item" data-product-id="p001">
              <div className="trending-image">
                <img src="/images/product1.jpg" alt="KAWS Companion" />
              </div>
              <div className="trending-info">
                <h3>{t.kawsCompanion}</h3>
                <p className="trending-price">$399.99</p>
                <div className="trending-actions">
                  <button className="btn-add-cart" data-product-id="p001" onClick={() => handleQuickAddToCart('p001', t.kawsCompanion, 399.99, '/images/product1.jpg')}>
                    <i className="fas fa-shopping-cart" />
                    <span>{t.quickOrder}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="trending-item" data-product-id="p002">
              <div className="trending-image">
                <img src="/images/product2.jpg" alt="Supreme Hoodie" />
              </div>
              <div className="trending-info">
                <h3>{t.supremeHoodie}</h3>
                <p className="trending-price">$499.99</p>
                <div className="trending-actions">
                  <button className="btn-add-cart" data-product-id="p002" onClick={() => handleQuickAddToCart('p002', t.supremeHoodie, 499.99, '/images/product2.jpg')}>
                    <i className="fas fa-shopping-cart" />
                    <span>{t.quickOrder}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="trending-item" data-product-id="p003">
              <div className="trending-image">
                <img src="/images/product3.jpg" alt="Nike x Off-White" />
              </div>
              <div className="trending-info">
                <h3>{t.nikeOffWhite}</h3>
                <p className="trending-price">$899.99</p>
                <div className="trending-actions">
                  <button className="btn-add-cart" data-product-id="p003" onClick={() => handleQuickAddToCart('p003', t.nikeOffWhite, 899.99, '/images/product3.jpg')}>
                    <i className="fas fa-shopping-cart" />
                    <span>{t.quickOrder}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 品牌展示 */}
      <section className="brands-showcase">
        <div className="container">
          <div className="section-header">
            <h2>{t.featuredBrandsTitle}</h2>
            <p>{t.featuredBrandsDesc}</p>
          </div>
        </div>
        <div className="brands-marquee">
          <div className="marquee-content">
            {brandsLoading ? (
              // 加載中的佔位符
              Array.from({ length: 6 }).map((_, index) => (
                <div key={`loading-${index}`} className="marquee-item">
                  <div className="brand-logo">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredBrands.slice(0, 6).map((brand, index) => (
                <div key={`brand-${brand.id}-${index}`} className="marquee-item">
                  <div className="brand-logo">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} />
                    ) : (
                      <span className="brand-text">{brand.name}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {brandsLoading ? (
              // 加載中的佔位符
              Array.from({ length: 6 }).map((_, index) => (
                <div key={`loading-dup-${index}`} className="marquee-item">
                  <div className="brand-logo">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredBrands.slice(0, 6).map((brand, index) => (
                <div key={`brand-dup-${brand.id}-${index}`} className="marquee-item">
                  <div className="brand-logo">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} />
                    ) : (
                      <span className="brand-text">{brand.name}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="brands-marquee reverse">
          <div className="marquee-content">
            {brandsLoading ? (
              // 加載中的佔位符
              Array.from({ length: 6 }).map((_, index) => (
                <div key={`loading-reverse-${index}`} className="marquee-item">
                  <div className="brand-logo">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredBrands.slice(6, 12).map((brand, index) => (
                <div key={`brand-reverse-${brand.id}-${index}`} className="marquee-item">
                  <div className="brand-logo">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} />
                    ) : (
                      <span className="brand-text">{brand.name}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {brandsLoading ? (
              // 加載中的佔位符
              Array.from({ length: 6 }).map((_, index) => (
                <div key={`loading-reverse-dup-${index}`} className="marquee-item">
                  <div className="brand-logo">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredBrands.slice(6, 12).map((brand, index) => (
                <div key={`brand-reverse-dup-${brand.id}-${index}`} className="marquee-item">
                  <div className="brand-logo">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} />
                    ) : (
                      <span className="brand-text">{brand.name}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="featured">
        <div className="container">
          <div className="section-header">
            <h2>{t.featuredProductsTitle}</h2>
            <p>{t.featuredProductsDesc}</p>
          </div>
          <div className="products-grid">
            <div className="product-card" data-product-id="p001">
              <div className="product-image">
                <Link href="/product-detail?id=p001">
                  <img src="/images/product1.jpg" alt="Limited Edition Toy" />
                  <div className="product-tag hot">{t.hot}</div>
                </Link>
              </div>
              <div className="product-info">
                <h3><Link href="/product-detail?id=p001">KAWS Companion Limited Edition</Link></h3>
                <p className="product-price">$399.99</p>
                <Link href="/product-detail?id=p001" className="btn-secondary view-detail">{t.viewDetails}</Link>
                <button className="btn-add-cart" data-product-id="p001" onClick={() => handleQuickAddToCart('p001', t.kawsCompanion, 399.99, '/images/product1.jpg')}>{t.addToCart}</button>
              </div>
            </div>
            
            <div className="product-card" data-product-id="p002">
              <div className="product-image">
                <Link href="/product-detail?id=p002">
                  <img src="/images/product2.jpg" alt="Trendy Fashion" />
                  <div className="product-tag preorder">{t.new}</div>
                </Link>
              </div>
              <div className="product-info">
                <h3><Link href="/product-detail?id=p002">Supreme Box Logo Hoodie</Link></h3>
                <p className="product-price">$499.99</p>
                <Link href="/product-detail?id=p002" className="btn-secondary view-detail">{t.viewDetails}</Link>
                <button className="btn-add-cart" data-product-id="p002" onClick={() => handleQuickAddToCart('p002', t.supremeHoodie, 499.99, '/images/product2.jpg')}>{t.addToCart}</button>
              </div>
            </div>
            
            <div className="product-card" data-product-id="p003">
              <div className="product-image">
                <Link href="/product-detail?id=p003">
                  <img src="/images/product3.jpg" alt="Limited Sneakers" />
                  <div className="product-tag limited">{t.limited}</div>
                </Link>
              </div>
              <div className="product-info">
                <h3><Link href="/product-detail?id=p003">Nike x Off-White Collaboration</Link></h3>
                <p className="product-price">$899.99</p>
                <Link href="/product-detail?id=p003" className="btn-secondary view-detail">{t.viewDetails}</Link>
                <button className="btn-add-cart" data-product-id="p003" onClick={() => handleQuickAddToCart('p003', t.nikeOffWhite, 899.99, '/images/product3.jpg')}>{t.addToCart}</button>
              </div>
            </div>
            
            <div className="product-card" data-product-id="p004">
              <div className="product-image">
                <Link href="/product-detail?id=p004">
                  <img src="/images/product4.jpg" alt="Art Collectible" />
                  <div className="product-tag limited">{t.limited}</div>
                </Link>
              </div>
              <div className="product-info">
                <h3><Link href="/product-detail?id=p004">BE@RBRICK 1000% Artist Collaboration</Link></h3>
                <p className="product-price">$1,899.99</p>
                <Link href="/product-detail?id=p004" className="btn-secondary view-detail">{t.viewDetails}</Link>
                <button className="btn-add-cart" data-product-id="p004" onClick={() => handleQuickAddToCart('p004', 'BE@RBRICK 1000% Artist Collaboration', 1899.99, '/images/product4.jpg')}>{t.addToCart}</button>
              </div>
            </div>
            
            <div className="product-card" data-product-id="p005">
              <div className="product-image">
                <Link href="/product-detail?id=p005">
                  <img src="/images/product5.jpg" alt="Cyber Mecha Figure" />
                  <div className="product-tag limited">{t.limited}</div>
                </Link>
              </div>
              <div className="product-info">
                <h3><Link href="/product-detail?id=p005">{t.cyberMechaFigure}</Link></h3>
                <p className="product-price">$1,990</p>
                <Link href="/product-detail?id=p005" className="btn-secondary view-detail">{t.viewDetails}</Link>
                <button className="btn-add-cart" data-product-id="p005" onClick={() => handleQuickAddToCart('p005', t.cyberMechaFigure, 1990, '/images/product5.jpg')}>{t.addToCart}</button>
              </div>
            </div>
            
            <div className="product-card" data-product-id="p006">
              <div className="product-image">
                <Link href="/product-detail?id=p006">
                  <img src="/images/product6.jpg" alt="Retro Synthwave Car" />
                  <div className="product-tag hot">{t.hot}</div>
                </Link>
              </div>
              <div className="product-info">
                <h3><Link href="/product-detail?id=p006">{t.retroSynthwaveCar}</Link></h3>
                <p className="product-price">$1,490</p>
                <Link href="/product-detail?id=p006" className="btn-secondary view-detail">{t.viewDetails}</Link>
                <button className="btn-add-cart" data-product-id="p006" onClick={() => handleQuickAddToCart('p006', t.retroSynthwaveCar, 1490, '/images/product6.jpg')}>{t.addToCart}</button>
              </div>
            </div>
          </div>
          <div className="view-more">
            <Link href="/products" className="btn-secondary">{t.viewMoreProducts}</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="categories">
        <div className="container">
          <div className="section-header">
            <h2>{t.categoriesTitle}</h2>
            <p>{t.categoriesDesc}</p>
          </div>
          <div className="categories-grid">
            <div className="category-card">
              <img src="/images/category1.jpg" alt="Designer Toys" />
              <h3>{t.designerToys}</h3>
              <Link href="/categories?category=toys" className="btn-category">{t.viewProducts}</Link>
            </div>
            <div className="category-card">
              <img src="/images/category2.jpg" alt="Fashion Apparel" />
              <h3>{t.fashionApparel}</h3>
              <Link href="/categories?category=fashion" className="btn-category">{t.viewProducts}</Link>
            </div>
            <div className="category-card">
              <img src="/images/category3.jpg" alt="Limited Sneakers" />
              <h3>{t.limitedSneakers}</h3>
              <Link href="/categories?category=shoes" className="btn-category">{t.viewProducts}</Link>
            </div>
            <div className="category-card">
              <img src="/images/category4.jpg" alt="Art Collectibles" />
              <h3>{t.artCollectibles}</h3>
              <Link href="/categories?category=art" className="btn-category">{t.viewProducts}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>{t.whyChooseUsTitle}</h2>
            <p>{t.whyChooseUsDesc}</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>{t.authenticProducts}</h3>
              <p>{t.authenticProductsDesc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h3>{t.globalShipping}</h3>
              <p>{t.globalShippingDesc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>{t.expertSupport}</h3>
              <p>{t.expertSupportDesc}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-hand-holding-usd"></i>
              </div>
              <h3>{t.transparentPricing}</h3>
              <p>{t.transparentPricingDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>{t.customerReviewsTitle}</h2>
            <p>{t.customerReviewsDesc}</p>
          </div>
          <div className="testimonials-slider">
            <div className="testimonial">
              <div className="testimonial-content">
                <p>{t.review1}</p>
                <div className="testimonial-author">
                  <img src="/images/customer1.jpg" alt="Customer Avatar" />
                  <div className="author-info">
                    <h4>Sarah L.</h4>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                <p>{t.review2}</p>
                <div className="testimonial-author">
                  <img src="/images/customer2.jpg" alt="Customer Avatar" />
                  <div className="author-info">
                    <h4>Michael W.</h4>
                    <div className="rating">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2>{t.contactUsTitle}</h2>
            <p>{t.contactUsDesc}</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <h3>{t.email}</h3>
                <p>info@hakatoyz.com</p>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <h3>{t.phone}</h3>
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="contact-item">
                <i className="fab fa-weixin"></i>
                <h3>WeChat</h3>
                <p>HakaToyz_Official</p>
              </div>
            </div>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">{t.name}</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">{t.email}</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">{t.message}</label>
                <textarea id="message" name="message" rows={5} required></textarea>
              </div>
              <button type="submit" className="btn-primary">{t.sendMessage}</button>
            </form>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>{t.newsletterTitle}</h2>
            <p>{t.newsletterDesc}</p>
            <form className="newsletter-form">
              <input type="email" placeholder={t.emailPlaceholder} required />
              <button type="submit" className="btn-primary">{t.subscribe}</button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
