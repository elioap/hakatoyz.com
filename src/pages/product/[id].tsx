import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import WishlistButton from '@/components/WishlistButton';
import { useCart } from '@/contexts/CartContext';
import { getProductById } from '@/data/products';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { locale } = router;
  const isEnglish = locale === 'en';
  const lang = isEnglish ? 'en' : 'zh';
  const { addToCart, isInCart } = useCart();
  
  // 所有的 useState hooks 必須在組件頂部
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [notification, setNotification] = useState('');
  
  // 如果頁面正在加載或id不是字符串，顯示加載狀態
  if (router.isFallback || typeof id !== 'string') {
    return (
      <Layout>
        <div className="loading-section">
          <div className="container">
            <div className="loading-spinner"></div>
            <p className="neon-text-primary">{isEnglish ? 'Loading...' : '載入中...'}</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // 從數據源獲取商品
  const product = getProductById(parseInt(id));
  
  // 如果商品不存在，顯示錯誤頁面
  if (!product) {
    return (
      <Layout>
        <div className="error-section">
          <div className="container">
            <div className="error-content">
              <i className="fas fa-exclamation-triangle error-icon"></i>
              <h2 className="neon-text-primary">{isEnglish ? 'Product Not Found' : '找不到商品'}</h2>
              <p>{isEnglish ? 'The product you are looking for does not exist.' : '您查找的商品不存在。'}</p>
              <Link href="/products" className="btn-primary">
                {isEnglish ? 'Back to Products' : '返回商品列表'}
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };
  
  // 處理添加到購物車
  const handleAddToCart = () => {
    setAddingToCart(true);
    
    // 添加到購物車
    addToCart({
      id: product.id,
      name: product.name[lang],
      image: product.images[0],
      price: product.price,
      category: product.category[lang]
    }, quantity);
    
    // 顯示成功通知
    setNotification(isEnglish ? 'Added to cart successfully!' : '成功加入購物車！');
    
    setTimeout(() => {
      setAddingToCart(false);
      setNotification('');
    }, 2000);
  };
  
  // 立即購買
  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      router.push('/cart');
    }, 500);
  };

  // 國際化文本
  const t = {
    backToProducts: isEnglish ? 'Back to Products' : '返回商品列表',
    category: isEnglish ? 'Category' : '分類',
    quantity: isEnglish ? 'Quantity' : '數量',
    addToCart: isEnglish ? 'Add to Cart' : '加入購物車',
    buyNow: isEnglish ? 'Buy Now' : '立即購買',
    description: isEnglish ? 'Description' : '商品描述',
    specs: isEnglish ? 'Specifications' : '規格參數',
    reviews: isEnglish ? 'Reviews' : '用戶評價',
    shipping: isEnglish ? 'Shipping' : '配送信息',
    inStock: isEnglish ? 'In Stock' : '有庫存',
    outOfStock: isEnglish ? 'Out of Stock' : '無庫存',
    adding: isEnglish ? 'Adding...' : '加入中...',
    relatedProducts: isEnglish ? 'Related Products' : '相關商品',
    productDetails: isEnglish ? 'Product Details' : '商品詳情',
    features: isEnglish ? 'Key Features' : '主要特色',
    guarantee: isEnglish ? '100% Authentic Guarantee' : '100% 正品保證',
    freeShipping: isEnglish ? 'Free Worldwide Shipping' : '全球免費配送',
    support: isEnglish ? '24/7 Customer Support' : '24/7 客戶支援',
    returns: isEnglish ? '30-Day Easy Returns' : '30天輕鬆退貨',
    share: isEnglish ? 'Share' : '分享',
    sku: isEnglish ? 'SKU' : '商品編號',
    brand: isEnglish ? 'Brand' : '品牌',
    availability: isEnglish ? 'Availability' : '庫存狀態'
  };

  return (
    <Layout 
      title={`${product.name[lang]} - Haka Toyz`}
      description={product.description[lang]}
    >
      {/* 通知消息 */}
      {notification && (
        <div className="notification show success">
          <i className="fas fa-check-circle"></i>
          {notification}
        </div>
      )}

      {/* 麵包屑導航 */}
      <section className="breadcrumb-section">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/" className="breadcrumb-link">
              <span className="lang-en">Home</span>
              <span className="lang-zh">首頁</span>
            </Link>
            <span className="separator">/</span>
            <Link href="/products" className="breadcrumb-link">
              <span className="lang-en">Products</span>
              <span className="lang-zh">商品</span>
            </Link>
            <span className="separator">/</span>
            <Link href={`/categories/${product.category.en}`} className="breadcrumb-link">
              {product.category[lang]}
            </Link>
            <span className="separator">/</span>
            <span className="current">{product.name[lang]}</span>
          </div>
        </div>
      </section>

      {/* 商品詳情主要內容 */}
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail-grid">
            {/* 左側：商品圖片 */}
            <div className="product-images">
              <div className="main-image-container">
                <div className="main-image" onClick={() => setShowImageModal(true)}>
                  <img 
                    src={product.images[activeImage]} 
                    alt={product.name[lang]}
                    className="main-product-image"
                  />
                  <div className="image-zoom-hint">
                    <i className="fas fa-search-plus"></i>
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div className="product-badges">
                      {product.tags.map((tag, index) => (
                        <span key={index} className={`product-badge ${tag.toLowerCase()}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="thumbnail-images">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={image} alt={`${product.name[lang]} - ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* 右側：商品信息 */}
            <div className="product-info">
              <div className="product-header">
                <div className="product-title-section">
                  <h1 className="product-title">{product.name[lang]}</h1>
                  <div className="product-meta">
                    <span className="product-sku">{t.sku}: {product.id.toString().padStart(6, '0')}</span>
                    <span className="product-category">
                      {t.category}: <Link href={`/categories/${product.category.en}`}>{product.category[lang]}</Link>
                    </span>
                  </div>
                </div>
                
                <div className="product-actions-top">
                  <WishlistButton 
                    product={{
                      id: product.id,
                      name: product.name[lang],
                      image: product.images[0],
                      price: product.price,
                      category: product.category[lang],
                      inStock: product.inStock
                    }}
                    size="lg"
                  />
                  <button className="share-btn" title={t.share}>
                    <i className="fas fa-share-alt"></i>
                  </button>
                </div>
              </div>
              
              <div className="price-section">
                <div className="price-main">
                  <span className="currency">$</span>
                  <span className="amount">{product.price.toLocaleString()}</span>
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="price-original">
                    <span className="currency">$</span>
                    <span className="amount">{product.originalPrice.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <div className="stock-section">
                <div className="stock-status">
                  {product.inStock ? (
                    <span className="in-stock">
                      <i className="fas fa-check-circle"></i>
                      {t.inStock}
                    </span>
                  ) : (
                    <span className="out-of-stock">
                      <i className="fas fa-times-circle"></i>
                      {t.outOfStock}
                    </span>
                  )}
                </div>
              </div>

              <div className="product-features">
                <div className="feature-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>{t.guarantee}</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-shipping-fast"></i>
                  <span>{t.freeShipping}</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-headset"></i>
                  <span>{t.support}</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-undo-alt"></i>
                  <span>{t.returns}</span>
                </div>
              </div>
              
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>{t.quantity}:</label>
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn minus"
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                      className="qty-input"
                    />
                    <button 
                      className="qty-btn plus"
                      onClick={() => updateQuantity(quantity + 1)}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <button 
                    onClick={handleAddToCart}
                    disabled={addingToCart || !product.inStock}
                    className={`btn-add-to-cart ${addingToCart ? 'adding' : ''} ${isInCart(product.id) ? 'in-cart' : ''}`}
                  >
                    {addingToCart ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        {t.adding}
                      </>
                    ) : isInCart(product.id) ? (
                      <>
                        <i className="fas fa-check"></i>
                        <span className="lang-en">In Cart</span>
                        <span className="lang-zh">已在購物車</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-shopping-cart"></i>
                        {t.addToCart}
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={handleBuyNow}
                    disabled={addingToCart || !product.inStock}
                    className="btn-buy-now"
                  >
                    <i className="fas fa-bolt"></i>
                    {t.buyNow}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 商品詳細信息標籤 */}
      <section className="product-tabs-section">
        <div className="container">
          <div className="product-tabs">
            <div className="tab-headers">
              <button
                className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                <i className="fas fa-align-left"></i>
                {t.description}
              </button>
              <button
                className={`tab-header ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                <i className="fas fa-list-ul"></i>
                {t.specs}
              </button>
              <button
                className={`tab-header ${activeTab === 'shipping' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                <i className="fas fa-truck"></i>
                {t.shipping}
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="tab-pane description-pane">
                  <h3>{t.productDetails}</h3>
                  <div className="description-content">
                    {product.description[lang]}
                  </div>
                  
                  {product.features && (
                    <div className="features-section">
                      <h4>{t.features}</h4>
                      <ul className="features-list">
                        {product.features.map((feature, index) => (
                          <li key={index}>
                            <i className="fas fa-check"></i>
                            {feature[lang]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'specs' && (
                <div className="tab-pane specs-pane">
                  <h3>{t.specs}</h3>
                  <div className="specs-table">
                    {product.specs?.map((spec, index) => (
                      <div key={index} className="spec-row">
                        <div className="spec-label">{spec.key[lang]}</div>
                        <div className="spec-value">{spec.value[lang]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'shipping' && (
                <div className="tab-pane shipping-pane">
                  <h3>{t.shipping}</h3>
                  <div className="shipping-info">
                    <div className="shipping-method">
                      <h4>
                        <span className="lang-en">Standard Shipping</span>
                        <span className="lang-zh">標準配送</span>
                      </h4>
                      <p>
                        <span className="lang-en">Free worldwide shipping on all orders. Delivery time: 7-14 business days.</span>
                        <span className="lang-zh">所有訂單免費全球配送。配送時間：7-14個工作日。</span>
                      </p>
                    </div>
                    <div className="shipping-method">
                      <h4>
                        <span className="lang-en">Express Shipping</span>
                        <span className="lang-zh">快速配送</span>
                      </h4>
                      <p>
                        <span className="lang-en">Express delivery available for $19.99. Delivery time: 3-5 business days.</span>
                        <span className="lang-zh">快速配送服務，費用$19.99。配送時間：3-5個工作日。</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 圖片放大模態框 */}
      {showImageModal && (
        <div className="image-modal" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content">
            <button className="modal-close" onClick={() => setShowImageModal(false)}>
              <i className="fas fa-times"></i>
            </button>
            <img src={product.images[activeImage]} alt={product.name[lang]} />
          </div>
        </div>
      )}
    </Layout>
  );
} 