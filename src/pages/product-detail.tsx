import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: string;
  brand: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { locale } = router;
  const isEnglish = locale === 'en';
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // 模擬產品數據
  useEffect(() => {
    if (id) {
      setTimeout(() => {
        const productId = parseInt(id as string) || 1;
        setProduct({
          id: productId,
          name: isEnglish ? 'Premium Gaming Headset' : '高級遊戲耳機',
          price: 129.99,
          originalPrice: 159.99,
          description: isEnglish 
            ? 'High-quality gaming headset with surround sound and noise cancellation.'
            : '高品質遊戲耳機，具有環繞音效和降噪功能。',
          images: [
            '/api/placeholder/500/500',
            '/api/placeholder/500/500',
            '/api/placeholder/500/500'
          ],
          category: isEnglish ? 'Gaming' : '遊戲',
          brand: 'TechBrand',
          inStock: true,
          rating: 4.5,
          reviews: 128
        });
        setLoading(false);
      }, 1000);
    }
  }, [id, isEnglish]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category
      }, quantity);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
        inStock: product.inStock
      };
      
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(wishlistItem);
      }
    }
  };

  const t = {
    loading: isEnglish ? 'Loading...' : '載入中...',
    productNotFound: isEnglish ? 'Product not found' : '找不到商品',
    addToCart: isEnglish ? 'Add to Cart' : '加入購物車',
    addToWishlist: isEnglish ? 'Add to Wishlist' : '加入收藏',
    removeFromWishlist: isEnglish ? 'Remove from Wishlist' : '移除收藏',
    quantity: isEnglish ? 'Quantity' : '數量',
    inStock: isEnglish ? 'In Stock' : '有庫存',
    outOfStock: isEnglish ? 'Out of Stock' : '缺貨',
    rating: isEnglish ? 'Rating' : '評分',
    reviews: isEnglish ? 'reviews' : '評價',
    description: isEnglish ? 'Description' : '商品描述',
    specifications: isEnglish ? 'Specifications' : '規格'
  };

  if (loading) {
    return (
      <Layout
        title={isEnglish ? "Product Details - Haka Toyz" : "商品詳情 - Haka Toyz"}
        description="Loading product details"
      >
        <div className="page-header">
          <div className="container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t.loading}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout
        title={isEnglish ? "Product Not Found - Haka Toyz" : "找不到商品 - Haka Toyz"}
        description="Product not found"
      >
        <div className="page-header">
          <div className="container">
            <h1>{t.productNotFound}</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${product.name} - Haka Toyz`}
      description={product.description}
    >
      {/* 商品詳情內容 */}
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail-grid">
            {/* 商品圖片 */}
            <div className="product-images">
              <div className="main-image">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjMjEyMTIxIi8+Cjx0ZXh0IHg9IjI1MCIgeT0iMjUwIiBmaWxsPSIjNzU3NTc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCI+SW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
                  }}
                />
              </div>
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMjEyMTIxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZmlsbD0iIzc1NzU3NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuM2VtIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiPkltZzwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 商品資訊 */}
            <div className="product-info">
              <div className="product-meta">
                <span className="category">{product.category}</span>
                <span className="brand">{product.brand}</span>
              </div>
              
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {product.rating} ({product.reviews} {t.reviews})
                </span>
              </div>

              <div className="product-price">
                <span className="current-price">${product.price}</span>
                {product.originalPrice && (
                  <span className="original-price">${product.originalPrice}</span>
                )}
              </div>

              <div className="product-stock">
                <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {product.inStock ? t.inStock : t.outOfStock}
                </span>
              </div>

              <div className="product-description">
                <h3>{t.description}</h3>
                <p>{product.description}</p>
              </div>

              <div className="product-actions">
                <div className="quantity-selector">
                  <label>{t.quantity}:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={!product.inStock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    className="btn-primary add-to-cart"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    {t.addToCart}
                  </button>
                  
                  <button 
                    className={`btn-secondary wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                    onClick={handleWishlistToggle}
                  >
                    <i className={`fas fa-heart ${isInWishlist(product.id) ? 'filled' : ''}`}></i>
                    {isInWishlist(product.id) ? t.removeFromWishlist : t.addToWishlist}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetailPage;
