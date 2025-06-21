import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAllProducts, getHotProducts } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

export default function HomeFeaturedProducts() {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const lang = isEnglish ? 'en' : 'zh';
  const { addToCart } = useCart();
  
  // 獲取熱門商品(取前6個)
  const featuredProducts = getHotProducts().length >= 6 
    ? getHotProducts().slice(0, 6) 
    : getAllProducts().slice(0, 6);
    
  // 狀態跟踪哪些商品正在添加到購物車
  const [addingToCart, setAddingToCart] = useState<Record<number, boolean>>({});
  
  // 處理添加到購物車
  const handleAddToCart = (productId: number) => {
    // 設置商品添加中狀態
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    // 獲取商品信息
    const product = featuredProducts.find(p => p.id === productId);
    if (!product) return;
    
    // 添加到購物車
    addToCart({
      id: product.id,
      name: product.name[lang],
      image: product.image,
      price: product.price,
      category: product.category[lang]
    });
    
    // 顯示成功消息
    const message = document.createElement('div');
    message.className = 'fixed bottom-5 right-5 bg-green-900/80 border border-green-600 text-green-300 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in-out';
    message.innerHTML = `
      <i class="fas fa-check-circle mr-2"></i>
      ${isEnglish ? 'Added to cart successfully!' : '成功加入購物車！'}
    `;
    document.body.appendChild(message);
    
    // 3秒後清除狀態
    setTimeout(() => {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
      message.classList.add('animate-fade-out');
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 3000);
  };
  
  return (
    <section id="products" className="featured">
      <div className="container">
        <div className="section-header">
          <h2>{isEnglish ? 'Featured Products' : '熱門商品'}</h2>
          <p>{isEnglish ? 'Hand-picked popular items for you' : '精選最受歡迎的代購商品'}</p>
        </div>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div className="product-card" key={product.id} data-product-id={`p${product.id}`}>
              <div className="product-image">
                <Link href={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name[lang]} />
                  {product.tag && (
                    <div className={`product-tag ${product.tag}`}>
                      {product.tag === 'hot' && (isEnglish ? 'Hot' : '熱賣')}
                      {product.tag === 'new' && (isEnglish ? 'New' : '新品')}
                      {product.tag === 'limited' && (isEnglish ? 'Limited' : '限量')}
                    </div>
                  )}
                </Link>
              </div>
              <div className="product-info">
                <h3>
                  <Link href={`/product/${product.id}`}>
                    {product.name[lang]}
                  </Link>
                </h3>
                <p className="product-price">¥{product.price.toLocaleString()}</p>
                <Link 
                  href={`/product/${product.id}`} 
                  className="btn-secondary view-detail"
                >
                  {isEnglish ? 'View Details' : '查看詳情'}
                </Link>
                <button 
                  className={`btn-add-cart ${addingToCart[product.id] ? 'adding' : ''}`}
                  data-product-id={`p${product.id}`}
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingToCart[product.id]}
                >
                  {addingToCart[product.id] ? (
                    <>
                      <i className="fas fa-spinner fa-spin" />
                      <span>{isEnglish ? 'Adding...' : '添加中...'}</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-cart" />
                      <span>{isEnglish ? 'Add to Cart' : '加入購物車'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="view-more">
          <Link href="/products" className="btn-secondary">
            {isEnglish ? 'View More Products' : '查看更多商品'}
          </Link>
        </div>
      </div>
    </section>
  );
} 