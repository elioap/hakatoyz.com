import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useWishlist, WishlistItem } from '@/contexts/WishlistContext';

interface WishlistButtonProps {
  product: Omit<WishlistItem, 'inStock'> & { inStock?: boolean };
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  product, 
  size = 'md', 
  showText = false, 
  className = ''
}) => {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 檢查商品是否在願望清單中
  const inWishlist = isInWishlist(product.id);
  
  // 處理點擊事件
  const handleClick = () => {
    if (inWishlist) {
      // 從願望清單移除
      removeFromWishlist(product.id);
    } else {
      // 添加到願望清單
      addToWishlist({
        ...product,
        inStock: product.inStock !== undefined ? product.inStock : true // 默認為有庫存
      });
      
      // 運行添加動畫
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };
  
  // 按鈕大小樣式
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };
  
  return (
    <button
      onClick={handleClick}
      className={`
        wishlist-btn
        ${sizeClasses[size]} 
        ${inWishlist ? 'in-wishlist' : 'not-in-wishlist'}
        ${isAnimating ? 'animating' : ''}
        ${className}
      `}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <div className="flex items-center justify-center">
        <i className={`${inWishlist ? 'fas' : 'far'} fa-heart heart-icon`}></i>
        
        {showText && (
          <span className="ml-2 wishlist-text">
            {inWishlist 
              ? (isEnglish ? 'Saved' : '已收藏') 
              : (isEnglish ? 'Add to wishlist' : '加入收藏')}
          </span>
        )}
      </div>
      
      <style jsx>{`
        .wishlist-btn {
          position: relative;
          border-radius: 50%;
          border: 2px solid transparent;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .wishlist-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .not-in-wishlist {
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.6);
        }
        
        .not-in-wishlist:hover {
          border-color: #ff0066;
          color: #ff0066;
          background: rgba(255, 0, 102, 0.1);
          box-shadow: 
            0 0 15px rgba(255, 0, 102, 0.4),
            inset 0 0 15px rgba(255, 0, 102, 0.1);
          transform: translateY(-2px) scale(1.05);
        }
        
        .not-in-wishlist:hover::before {
          opacity: 1;
        }
        
        .in-wishlist {
          border-color: #ff0066;
          color: #ff0066;
          background: rgba(255, 0, 102, 0.2);
          box-shadow: 
            0 0 20px rgba(255, 0, 102, 0.5),
            inset 0 0 20px rgba(255, 0, 102, 0.1);
        }
        
        .in-wishlist:hover {
          border-color: #ff3388;
          color: #ff3388;
          background: rgba(255, 51, 136, 0.3);
          box-shadow: 
            0 0 25px rgba(255, 51, 136, 0.6),
            inset 0 0 25px rgba(255, 51, 136, 0.2);
          transform: translateY(-2px) scale(1.05);
        }
        
        .in-wishlist::before {
          opacity: 1;
          background: linear-gradient(45deg, rgba(255, 0, 102, 0.3), rgba(255, 255, 255, 0.2), rgba(255, 0, 102, 0.3));
        }
        
        .heart-icon {
          transition: all 0.3s ease;
          filter: drop-shadow(0 0 5px currentColor);
        }
        
        .animating {
          animation: heartBeat 0.6s ease-in-out;
        }
        
        .animating .heart-icon {
          animation: heartPulse 0.6s ease-in-out;
        }
        
        .wishlist-text {
          font-weight: 600;
          text-shadow: 0 0 10px currentColor;
          letter-spacing: 0.5px;
        }
        
        @keyframes heartBeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1.1); }
          75% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        
        @keyframes heartPulse {
          0% { 
            transform: scale(1);
            filter: drop-shadow(0 0 5px currentColor);
          }
          50% { 
            transform: scale(1.3);
            filter: drop-shadow(0 0 15px currentColor);
          }
          100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 5px currentColor);
          }
        }
        
        /* 中文版調整 */
        :global(body.zh-mode) .wishlist-text {
          font-family: 'Noto Sans TC', sans-serif;
          letter-spacing: 1px;
        }
        
        /* 響應式調整 */
        @media (max-width: 768px) {
          .wishlist-btn:hover {
            transform: translateY(-1px) scale(1.03);
          }
        }
        
        /* 無障礙支持 */
        .wishlist-btn:focus {
          outline: none;
          border-color: #00ffff;
          box-shadow: 
            0 0 20px rgba(0, 255, 255, 0.5),
            inset 0 0 20px rgba(0, 255, 255, 0.1);
        }
        
        .wishlist-btn:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>
    </button>
  );
};

export default WishlistButton; 