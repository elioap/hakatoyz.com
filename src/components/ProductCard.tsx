import React from 'react'
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import WishlistButton from '@/components/WishlistButton';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  tag?: 'hot' | 'new' | 'limited' | null;
}

export default function ProductCard({ id, name, price, image, category = '未分類', tag = null }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const { addToCart, isInCart } = useCart();
  const { isInWishlist } = useWishlist();
  
  // 檢查是否已加入願望清單
  const inWishlist = isInWishlist(id);
  
  // 檢查是否已加入購物車
  const inCart = isInCart(id);
  
  // 標籤文本
  const tagText = {
    hot: isEnglish ? 'HOT' : '熱賣',
    new: isEnglish ? 'NEW' : '新品',
    limited: isEnglish ? 'LIMITED' : '限量'
  };
  
  // 按鈕文本
  const addToCartText = isEnglish ? 'Add to Cart' : '加入購物車';
  const viewDetailsText = isEnglish ? 'View Details' : '查看詳情';
  const viewCartText = isEnglish ? 'View Cart' : '查看購物車';
  const addingText = isEnglish ? 'Adding...' : '添加中...';
  
  // 添加到購物車處理函數
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCart) {
      router.push('/cart');
      return;
    }
    
    setIsAdding(true);
    addToCart({
      id,
      name,
      price,
      image,
      category
    });
    
    // 顯示添加成功提示
    const message = document.createElement('div');
    message.className = 'fixed bottom-5 right-5 bg-green-900/80 border border-green-600 text-green-300 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in-out';
    message.innerHTML = `
      <i class="fas fa-check-circle mr-2"></i>
      ${isEnglish ? 'Added to cart successfully!' : '成功加入購物車！'}
    `;
    document.body.appendChild(message);
    
    // 隱藏添加中狀態
    setTimeout(() => {
      setIsAdding(false);
      message.classList.add('animate-fade-out');
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 1000);
  };
  
  return (
    <div 
      className="product-card fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image">
        <Link href={`/product/${id}`}>
          <img 
            src={image || "/images/placeholder.jpg"} 
            alt={name} 
            className="transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        
        <div className="product-badges">
          {tag && (
            <div className={`product-tag ${tag}`}>
              {tagText[tag]}
            </div>
          )}
          <WishlistButton 
            product={{id, name, image, price, category}} 
            size="sm" 
            className="wishlist-badge"
          />
        </div>
      </div>
      
      <div className="product-info">
        <div>
          <Link href={`/product/${id}`}>
            <h3 className="product-title">{name}</h3>
          </Link>
          <p className="product-price">
            <span className="currency">¥</span>
            <span className="amount">{price.toLocaleString()}</span>
          </p>
        </div>
        
        <div className="product-actions">
          <button 
            className={`btn-add-cart ${inCart ? 'in-cart' : ''} ${isAdding ? 'adding' : ''}`}
            data-product-id={id}
            aria-label={inCart ? viewCartText : addToCartText}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <i className="fas fa-spinner fa-spin" />
                <span className="desktop-only">{addingText}</span>
              </>
            ) : inCart ? (
              <>
                <i className="fas fa-shopping-cart" />
                <span className="desktop-only">{viewCartText}</span>
              </>
            ) : (
              <>
                <i className="fas fa-shopping-cart" />
                <span className="desktop-only">{addToCartText}</span>
              </>
            )}
          </button>
          
          <Link href={`/product/${id}`} className="view-detail">
            <span className="desktop-only">{viewDetailsText}</span>
            <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </div>
      
      {/* 響應式CSS */}
      <style jsx>{`
        .product-badges {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 2;
        }
        
        .wishlist-badge {
          padding: 8px;
          border-radius: 50%;
        }
        
        @media (max-width: 640px) {
          .product-title {
            font-size: 0.95rem;
            -webkit-line-clamp: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .product-actions {
            margin-top: 0.5rem;
          }
          
          .btn-add-cart {
            flex: 1;
            padding: 0.5rem;
          }
          
          .view-detail {
            padding: 0.5rem;
          }
        }
        
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        
        @media (hover: hover) {
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-color: rgba(255, 255, 255, 0.1);
          }
        }
        
        /* 添加中動畫 */
        .adding {
          background-color: rgba(33, 150, 243, 0.3) !important;
          cursor: not-allowed;
        }
        
        /* 已加入購物車樣式 */
        .in-cart {
          background-color: rgba(76, 175, 80, 0.3) !important;
        }
      `}</style>
    </div>
  );
} 