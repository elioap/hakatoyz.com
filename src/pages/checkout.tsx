import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

const CheckoutPage: React.FC = () => {
  const { cartItems, getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  
  // 計算費用
  const shippingFee = cartItems.length > 0 ? 100 : 0;
  const taxRate = 0.1; // 10% 稅率
  const taxFee = Math.round(totalPrice * taxRate);
  const orderTotal = totalPrice + shippingFee + taxFee;
  
  // 結帳表單狀態
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit-card',
  });

  // 表單驗證狀態
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 處理表單變更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除該字段的錯誤
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // 驗證表單
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // 必填字段
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode', 'country'];
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = isEnglish ? 'This field is required' : '此字段為必填項';
      }
    });
    
    // 郵箱格式
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = isEnglish ? 'Invalid email format' : '郵箱格式無效';
    }
    
    // 電話號碼格式
    if (formData.phone && !/^\d{6,}$/.test(formData.phone)) {
      newErrors.phone = isEnglish ? 'Invalid phone number' : '電話號碼格式無效';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 處理表單提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // 模擬提交過程
      setTimeout(() => {
        setIsSubmitting(false);
        router.push('/order-confirmation');
      }, 1500);
    } else {
      // 滾動到第一個錯誤
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  // 文字翻譯
  const t = {
    checkout: isEnglish ? 'Checkout' : '結帳',
    shippingAddress: isEnglish ? 'Shipping Address' : '收貨地址',
    firstName: isEnglish ? 'First Name' : '名字',
    lastName: isEnglish ? 'Last Name' : '姓氏',
    email: isEnglish ? 'Email' : '電子郵件',
    phone: isEnglish ? 'Phone' : '電話',
    address: isEnglish ? 'Address' : '地址',
    city: isEnglish ? 'City' : '城市',
    zipCode: isEnglish ? 'ZIP/Postal Code' : '郵政編碼',
    country: isEnglish ? 'Country' : '國家/地區',
    paymentMethod: isEnglish ? 'Payment Method' : '付款方式',
    creditCard: isEnglish ? 'Credit Card' : '信用卡',
    paypal: isEnglish ? 'PayPal' : 'PayPal',
    alipay: isEnglish ? 'Alipay' : '支付寶',
    wechatPay: isEnglish ? 'WeChat Pay' : '微信支付',
    orderSummary: isEnglish ? 'Order Summary' : '訂單摘要',
    items: isEnglish ? 'Items' : '商品',
    subtotal: isEnglish ? 'Subtotal' : '小計',
    shipping: isEnglish ? 'Shipping' : '運費',
    tax: isEnglish ? 'Tax' : '稅費',
    total: isEnglish ? 'Total' : '總計',
    placeOrder: isEnglish ? 'Place Order' : '提交訂單',
    emptyCart: isEnglish ? 'Your cart is empty' : '您的購物車是空的',
    backToShop: isEnglish ? 'Back to Shop' : '返回商店',
    submitting: isEnglish ? 'Submitting...' : '提交中...',
    processingPayment: isEnglish ? 'Processing Payment...' : '處理付款中...',
    required: isEnglish ? 'Required' : '必填',
  };
  
  // 如果購物車為空，提示用戶
  if (cartItems.length === 0) {
    return (
      <Layout title={t.checkout} description={`${t.checkout} - Haka Toyz`}>
        <div className="page-header">
          <div className="container">
            <h1>{t.checkout}</h1>
          </div>
        </div>
        <section className="empty-checkout-section">
          <div className="container">
            <div className="empty-checkout">
              <i className="fas fa-shopping-cart empty-cart-icon" />
              <h2>{t.emptyCart}</h2>
              <Link href="/products" className="btn-primary">
                {t.backToShop}
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
  
  return (
    <Layout title={t.checkout} description={`${t.checkout} - Haka Toyz`}>
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1>{t.checkout}</h1>
        </div>
      </div>

      {/* 結帳頁面內容 */}
      <section className="checkout-section">
        <div className="container">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-columns">
              {/* 左列：收貨地址和付款方式 */}
              <div className="checkout-column">
                <div className="checkout-block">
                  <h2>{t.shippingAddress}</h2>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">
                        {t.firstName}
                        <span className="required-mark">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'error' : ''}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.firstName}
                      />
                      {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">
                        {t.lastName}
                        <span className="required-mark">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? 'error' : ''}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.lastName}
                      />
                      {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">
                      {t.email}
                      <span className="required-mark">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">
                      {t.phone}
                      <span className="required-mark">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">
                      {t.address}
                      <span className="required-mark">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? 'error' : ''}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.address}
                    />
                    {errors.address && <div className="error-message">{errors.address}</div>}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">
                        {t.city}
                        <span className="required-mark">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'error' : ''}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.city}
                      />
                      {errors.city && <div className="error-message">{errors.city}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="zipCode">
                        {t.zipCode}
                        <span className="required-mark">*</span>
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={errors.zipCode ? 'error' : ''}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.zipCode}
                      />
                      {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">
                      {t.country}
                      <span className="required-mark">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={errors.country ? 'error' : ''}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.country}
                    >
                      <option value="">-- {t.country} --</option>
                      <option value="China">中國 (China)</option>
                      <option value="Hong Kong">香港 (Hong Kong)</option>
                      <option value="Taiwan">台灣 (Taiwan)</option>
                      <option value="Japan">日本 (Japan)</option>
                      <option value="USA">美國 (USA)</option>
                      <option value="Canada">加拿大 (Canada)</option>
                    </select>
                    {errors.country && <div className="error-message">{errors.country}</div>}
                  </div>
                </div>
                
                {/* 付款方式 */}
                <div className="checkout-block">
                  <h2>{t.paymentMethod}</h2>
                  <div className="payment-methods">
                    <div className="payment-method">
                      <input
                        type="radio"
                        id="credit-card"
                        name="paymentMethod"
                        value="credit-card"
                        checked={formData.paymentMethod === 'credit-card'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="credit-card">
                        <i className="fas fa-credit-card"></i>
                        {t.creditCard}
                      </label>
                    </div>
                    <div className="payment-method">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="paypal">
                        <i className="fab fa-paypal"></i>
                        {t.paypal}
                      </label>
                    </div>
                    <div className="payment-method">
                      <input
                        type="radio"
                        id="alipay"
                        name="paymentMethod"
                        value="alipay"
                        checked={formData.paymentMethod === 'alipay'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="alipay">
                        <i className="fab fa-alipay"></i>
                        {t.alipay}
                      </label>
                    </div>
                    <div className="payment-method">
                      <input
                        type="radio"
                        id="wechat-pay"
                        name="paymentMethod"
                        value="wechat-pay"
                        checked={formData.paymentMethod === 'wechat-pay'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="wechat-pay">
                        <i className="fab fa-weixin"></i>
                        {t.wechatPay}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 右列：訂單摘要 */}
              <div className="checkout-column">
                <div className="checkout-block order-summary">
                  <h2>{t.orderSummary}</h2>
                  <div className="order-items">
                    <div className="order-item-header">
                      <span>{t.items} ({totalItems})</span>
                    </div>
                    
                    <div className="order-items-list">
                      {cartItems.map((item) => (
                        <div key={item.id} className="order-item">
                          <div className="order-item-info">
                            <span className="item-name">
                              {item.name} <span className="item-quantity">x{item.quantity}</span>
                            </span>
                          </div>
                          <div className="order-item-price">
                            <span>¥{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="order-totals">
                    <div className="order-total-row">
                      <span>{t.subtotal}</span>
                      <span>¥{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="order-total-row">
                      <span>{t.shipping}</span>
                      <span>¥{shippingFee.toLocaleString()}</span>
                    </div>
                    <div className="order-total-row">
                      <span>{t.tax}</span>
                      <span>¥{taxFee.toLocaleString()}</span>
                    </div>
                    <div className="order-total-row final-total">
                      <span>{t.total}</span>
                      <span>¥{orderTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className={`btn-primary checkout-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        {t.processingPayment}
                      </>
                    ) : (
                      t.placeOrder
                    )}
                  </button>
                </div>

                {/* 行動裝置版的購物車總覽 */}
                <div className="mobile-cart-summary">
                  <button 
                    type="submit" 
                    className={`btn-primary checkout-btn ${isSubmitting ? 'submitting' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t.processingPayment : t.placeOrder} - ¥{orderTotal.toLocaleString()}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 響應式樣式 */}
      <style jsx>{`
        .checkout-section {
          padding: 2rem 0;
        }
        
        .checkout-form {
          width: 100%;
        }
        
        .checkout-columns {
          display: flex;
          gap: 2rem;
        }
        
        .checkout-column {
          flex: 1;
        }
        
        .checkout-block {
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .checkout-block h2 {
          margin-bottom: 1.5rem;
          font-size: 1.3rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .form-row {
          display: flex;
          gap: 1rem;
        }
        
        .form-group {
          margin-bottom: 1.25rem;
          flex: 1;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        
        .required-mark {
          color: var(--color-error);
          margin-left: 0.25rem;
        }
        
        input, select {
          width: 100%;
          padding: 0.75rem;
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          color: var(--color-text);
          transition: all 0.3s ease;
        }
        
        input:focus, select:focus {
          border-color: var(--color-accent);
          outline: none;
        }
        
        input.error, select.error {
          border-color: var(--color-error);
        }
        
        .error-message {
          color: var(--color-error);
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }
        
        .payment-methods {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        
        .payment-method {
          background-color: rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .payment-method:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .payment-method input {
          margin-right: 0.5rem;
          width: auto;
        }
        
        .payment-method label {
          display: flex;
          align-items: center;
          margin-bottom: 0;
          cursor: pointer;
          width: 100%;
        }
        
        .payment-method i {
          margin-right: 0.5rem;
          font-size: 1.1rem;
        }
        
        .order-items {
          margin-bottom: 1.5rem;
        }
        
        .order-item-header {
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .order-items-list {
          max-height: 240px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        
        .order-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .order-item:last-child {
          border-bottom: none;
        }
        
        .item-name {
          font-size: 0.9rem;
        }
        
        .item-quantity {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
        }
        
        .order-totals {
          margin-top: 1.5rem;
        }
        
        .order-total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 0.9rem;
        }
        
        .final-total {
          font-size: 1.2rem;
          font-weight: 600;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1rem;
          margin-top: 0.5rem;
        }
        
        .checkout-btn {
          width: 100%;
          padding: 1rem;
          margin-top: 1.5rem;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .submitting {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .mobile-cart-summary {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: var(--color-bg-dark);
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 100;
        }
        
        /* 響應式設計 */
        @media (max-width: 768px) {
          .checkout-columns {
            flex-direction: column;
          }
          
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          
          .payment-methods {
            grid-template-columns: 1fr;
          }
          
          .checkout-section {
            padding-bottom: 5rem;
          }
          
          .mobile-cart-summary {
            display: block;
          }
          
          .checkout-column:last-child .checkout-btn {
            display: none;
          }
        }
      `}</style>
    </Layout>
  );
};

export default CheckoutPage;
