import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';

  // 計算運費（簡單示例）
  const shippingFee = cartItems.length > 0 ? 100 : 0;
  
  // 計算稅費（簡單示例）
  const taxRate = 0.1; // 10% 稅率
  const taxFee = Math.round(totalPrice * taxRate);
  
  // 訂單總額
  const orderTotal = totalPrice + shippingFee + taxFee;

  // 文字翻譯
  const t = {
    shoppingCart: isEnglish ? 'Shopping Cart' : '購物車',
    home: isEnglish ? 'Home' : '首頁',
    cart: isEnglish ? 'Cart' : '購物車',
    emptyCart: isEnglish ? 'Your Cart is Empty' : '您的購物車是空的',
    emptyCartMessage: isEnglish ? 'Looks like you haven\'t added anything to your cart yet.' : '看起來您還沒有添加任何商品到購物車。',
    continueShopping: isEnglish ? 'Continue Shopping' : '繼續購物',
    cartItems: isEnglish ? 'Cart Items' : '購物車商品',
    orderSummary: isEnglish ? 'Order Summary' : '訂單摘要',
    subtotal: isEnglish ? 'Subtotal' : '小計',
    shipping: isEnglish ? 'Shipping' : '運費',
    tax: isEnglish ? 'Tax' : '稅費',
    total: isEnglish ? 'Total' : '總計',
    promoCode: isEnglish ? 'Promo Code' : '優惠碼',
    enterPromoCode: isEnglish ? 'Enter promo code' : '輸入優惠碼',
    apply: isEnglish ? 'Apply' : '使用',
    proceedToCheckout: isEnglish ? 'Proceed to Checkout' : '去結帳',
    youMightAlsoLike: isEnglish ? 'You Might Also Like' : '您可能也喜歡',
    popularItems: isEnglish ? 'Popular items chosen for you' : '為您精選的熱門商品',
    remove: isEnglish ? 'Remove' : '移除',
    quantity: isEnglish ? 'Quantity' : '數量',
    price: isEnglish ? 'Price' : '價格',
    itemsInCart: isEnglish ? 'Items in Cart' : '購物車商品',
  };

  return (
    <Layout title={`${t.shoppingCart} - Haka Toyz`} description="購物車頁面 - Haka Toyz">
      {/* 頁面頭部 */}
      <header className="page-header">
        <div className="container">
          <h1>{t.shoppingCart}</h1>
          <div className="breadcrumb">
            <Link href="/">{t.home}</Link>
            <span className="separator">/</span>
            <span className="current">{t.cart}</span>
          </div>
        </div>
      </header>

      {/* 購物車區域 */}
      <section className="cart-section">
        <div className="container">
          {/* 空購物車提示 */}
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <i className="fas fa-shopping-cart empty-cart-icon" />
              <h2>{t.emptyCart}</h2>
              <p>{t.emptyCartMessage}</p>
              <Link href="/products" className="btn-primary">
                {t.continueShopping}
              </Link>
            </div>
          ) : (
            <div className="cart-content">
              <div className="checkout-container">
                {/* 購物車商品列表 */}
                <div className="cart-items-section">
                  <h2 className="section-title">
                    <span>{t.cartItems}</span>
                    <span className="item-count">({totalItems})</span>
                  </h2>
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="item-image">
                          <img 
                            src={item.image || "/images/placeholder.jpg"} 
                            alt={item.name} 
                            width={80} 
                            height={80} 
                            loading="lazy"
                          />
                        </div>
                        <div className="item-details">
                          <div className="item-header">
                            <h3>{item.name}</h3>
                            <div className="item-price mobile-only">
                              <span className="currency">$</span>
                              <span className="amount">{item.price.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="item-meta">
                            <span className="item-category">{item.category}</span>
                          </div>
                          <div className="item-actions">
                            <div className="quantity-controls">
                              <label className="desktop-only">{t.quantity}</label>
                              <div className="quantity-wrapper">
                                <button 
                                  className="qty-btn" 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <input 
                                  type="number" 
                                  min="1" 
                                  value={item.quantity} 
                                  onChange={(e) => {
                                    const newQty = parseInt(e.target.value);
                                    if (!isNaN(newQty) && newQty > 0) {
                                      updateQuantity(item.id, newQty);
                                    }
                                  }} 
                                  aria-label="Quantity"
                                />
                                <button 
                                  className="qty-btn" 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <button 
                              className="remove-item"
                              onClick={() => removeFromCart(item.id)}
                              aria-label={`Remove ${item.name}`}
                            >
                              <i className="fas fa-trash-alt"></i>
                              <span className="desktop-only">{t.remove}</span>
                            </button>
                          </div>
                        </div>
                        <div className="item-price desktop-only">
                          <span className="currency">$</span>
                          <span className="amount">{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 結帳表單 */}
                <div className="checkout-form-section">
                  <h2 className="section-title">{t.orderSummary}</h2>
                  <div className="summary-row">
                    <span>{t.subtotal}</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>{t.shipping}</span>
                    <span>${shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>{t.tax}</span>
                    <span>${taxFee.toLocaleString()}</span>
                  </div>
                  <div className="summary-row total">
                    <span>{t.total}</span>
                    <span>${orderTotal.toLocaleString()}</span>
                  </div>
                  <div className="promo-code">
                    <h3>{t.promoCode}</h3>
                    <div className="promo-form">
                      <input
                        type="text"
                        placeholder={t.enterPromoCode}
                        aria-label="Promo code"
                      />
                      <button className="btn-primary" aria-label="Apply promo code">{t.apply}</button>
                    </div>
                  </div>
                  <Link 
                    href="/checkout" 
                    className="btn-primary checkout-btn"
                    aria-label="Proceed to checkout"
                  >
                    {t.proceedToCheckout}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 響應式樣式 */}
      <style jsx>{`
        .section-title {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .item-count {
          font-size: 0.9rem;
          opacity: 0.7;
        }
        
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .cart-item {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          padding: 1.5rem;
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        
        .cart-item:hover {
          border-color: rgba(255, 255, 255, 0.1);
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .item-image {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: 0.5rem;
          overflow: hidden;
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .item-details {
          flex: 1;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        
        .item-details h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        
        .item-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .item-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .quantity-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
          overflow: hidden;
        }
        
        .qty-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.05);
          border: none;
          color: var(--color-text);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .qty-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .quantity-wrapper input {
          width: 40px;
          height: 32px;
          text-align: center;
          border: none;
          background-color: transparent;
          color: var(--color-text);
          font-size: 0.9rem;
        }
        
        .remove-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.2);
          color: rgba(255, 100, 100, 0.8);
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .remove-item:hover {
          background-color: rgba(255, 0, 0, 0.2);
        }
        
        .item-price {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--color-accent);
          min-width: 100px;
          text-align: right;
        }
        
        .currency {
          margin-right: 0.25rem;
          font-size: 0.9em;
        }
        
        /* 響應式調整 */
        @media (max-width: 768px) {
          .cart-item {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          
          .item-image {
            width: 100%;
            height: 160px;
          }
          
          .item-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
          
          .quantity-controls {
            width: 100%;
            justify-content: space-between;
          }
          
          .remove-item {
            width: 100%;
            justify-content: center;
          }
          
          .item-price.mobile-only {
            font-size: 1rem;
            text-align: right;
          }
          
          .checkout-container {
            flex-direction: column;
          }
          
          .cart-items-section,
          .checkout-form-section {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default CartPage;
