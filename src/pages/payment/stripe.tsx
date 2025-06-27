import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise, stripeOptions, createPaymentIntent } from '@/utils/stripe';
import StripeCheckout from '@/components/StripeCheckout';
import { useCart } from '@/contexts/CartContext';

interface OrderData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const StripePaymentPage: React.FC = () => {
  const router = useRouter();
  const { locale } = router;
  const { clearCart } = useCart();
  const isEnglish = locale === 'en';
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // 文字翻譯
  const t = {
    payment: isEnglish ? 'Payment' : '付款',
    stripePayment: isEnglish ? 'Stripe Payment' : 'Stripe 付款',
    orderSummary: isEnglish ? 'Order Summary' : '訂單摘要',
    customerInfo: isEnglish ? 'Customer Information' : '客戶信息',
    shippingInfo: isEnglish ? 'Shipping Information' : '收貨信息',
    items: isEnglish ? 'Items' : '商品',
    subtotal: isEnglish ? 'Subtotal' : '小計',
    shipping: isEnglish ? 'Shipping' : '運費',
    tax: isEnglish ? 'Tax' : '稅費',
    total: isEnglish ? 'Total' : '總計',
    loading: isEnglish ? 'Loading payment...' : '正在加載付款頁面...',
    error: isEnglish ? 'Error' : '錯誤',
    noOrderData: isEnglish ? 'No order data found. Please go back to checkout.' : '未找到訂單數據，請返回結帳頁面。',
    backToCheckout: isEnglish ? 'Back to Checkout' : '返回結帳',
    paymentInitError: isEnglish ? 'Failed to initialize payment. Please try again.' : '支付初始化失敗，請重試。',
  };

  // 從 sessionStorage 獲取訂單數據並初始化支付
  useEffect(() => {
    const initializePayment = async () => {
      try {
        // 從 sessionStorage 獲取訂單數據
        const storedOrderData = sessionStorage.getItem('pendingOrder');
        if (!storedOrderData) {
          setError(t.noOrderData);
          setIsLoading(false);
          return;
        }

        const parsedOrderData: OrderData = JSON.parse(storedOrderData);
        setOrderData(parsedOrderData);

        // 創建 Stripe 支付意圖
        console.log('正在為訂單創建支付意圖，金額:', parsedOrderData.pricing.total);
        const paymentIntent = await createPaymentIntent(parsedOrderData.pricing.total);
        setClientSecret(paymentIntent.client_secret);
        
        setIsLoading(false);
      } catch (error) {
        console.error('初始化支付失敗:', error);
        setError(t.paymentInitError);
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [t.noOrderData, t.paymentInitError]);

  // 支付成功處理
  const handlePaymentSuccess = () => {
    console.log('支付成功，正在清理數據...');
    
    // 清空購物車
    clearCart();
    
    // 清除 sessionStorage 中的訂單數據
    sessionStorage.removeItem('pendingOrder');
    
    // 跳轉到訂單確認頁面
    router.push('/order-confirmation?payment=success');
  };

  // 支付錯誤處理
  const handlePaymentError = (errorMessage: string) => {
    console.error('支付錯誤:', errorMessage);
    setError(errorMessage);
  };

  // 如果正在加載
  if (isLoading) {
    return (
      <Layout title={t.payment} description={`${t.stripePayment} - Haka Toyz`}>
        <div className="page-header">
          <div className="container">
            <h1>{t.stripePayment}</h1>
          </div>
        </div>
        <section className="payment-section">
          <div className="container">
            <div className="loading-container">
              <i className="fas fa-spinner fa-spin"></i>
              <p>{t.loading}</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // 如果有錯誤或沒有訂單數據
  if (error || !orderData) {
    return (
      <Layout title={t.error} description={`${t.error} - Haka Toyz`}>
        <div className="page-header">
          <div className="container">
            <h1>{t.error}</h1>
          </div>
        </div>
        <section className="error-section">
          <div className="container">
            <div className="error-container">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error || t.noOrderData}</p>
              <button 
                onClick={() => router.push('/checkout')}
                className="btn-primary"
              >
                {t.backToCheckout}
              </button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout title={t.stripePayment} description={`${t.stripePayment} - Haka Toyz`}>
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1>{t.stripePayment}</h1>
        </div>
      </div>

      {/* 支付頁面內容 */}
      <section className="payment-section">
        <div className="container">
          <div className="payment-columns">
            {/* 左列：訂單信息 */}
            <div className="payment-column">
              {/* 客戶信息 */}
              <div className="info-block">
                <h2>{t.customerInfo}</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>{isEnglish ? 'Name' : '姓名'}:</strong>
                    <span>{orderData.customer.firstName} {orderData.customer.lastName}</span>
                  </div>
                  <div className="info-item">
                    <strong>{isEnglish ? 'Email' : '郵箱'}:</strong>
                    <span>{orderData.customer.email}</span>
                  </div>
                  <div className="info-item">
                    <strong>{isEnglish ? 'Phone' : '電話'}:</strong>
                    <span>{orderData.customer.phone}</span>
                  </div>
                </div>
              </div>

              {/* 收貨信息 */}
              <div className="info-block">
                <h2>{t.shippingInfo}</h2>
                <div className="address-info">
                  <p>{orderData.shipping.address}</p>
                  <p>{orderData.shipping.city}, {orderData.shipping.zipCode}</p>
                  <p>{orderData.shipping.country}</p>
                </div>
              </div>

              {/* 訂單項目 */}
              <div className="info-block">
                <h2>{t.orderSummary}</h2>
                <div className="items-list">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                      </div>
                      <div className="item-price">
                        ¥{item.total.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="order-totals">
                  <div className="total-row">
                    <span>{t.subtotal}</span>
                    <span>¥{orderData.pricing.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="total-row">
                    <span>{t.shipping}</span>
                    <span>¥{orderData.pricing.shipping.toLocaleString()}</span>
                  </div>
                  <div className="total-row">
                    <span>{t.tax}</span>
                    <span>¥{orderData.pricing.tax.toLocaleString()}</span>
                  </div>
                  <div className="total-row final-total">
                    <span>{t.total}</span>
                    <span>¥{orderData.pricing.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 右列：Stripe 支付表單 */}
            <div className="payment-column">
              <div className="payment-block">
                <h2>{isEnglish ? 'Payment Details' : '支付詳情'}</h2>
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ ...stripeOptions, clientSecret }}>
                    <StripeCheckout
                      clientSecret={clientSecret}
                      orderData={orderData}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .payment-section {
          padding: 2rem 0;
        }
        
        .payment-columns {
          display: flex;
          gap: 2rem;
        }
        
        .payment-column {
          flex: 1;
        }
        
        .info-block, .payment-block {
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .info-block h2, .payment-block h2 {
          margin-bottom: 1rem;
          font-size: 1.2rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .info-grid {
          display: grid;
          gap: 0.75rem;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .address-info p {
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        
        .items-list {
          margin-bottom: 1rem;
        }
        
        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .item-row:last-child {
          border-bottom: none;
        }
        
        .item-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .item-name {
          font-weight: 500;
        }
        
        .item-quantity {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .order-totals {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1rem;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
        }
        
        .final-total {
          font-size: 1.1rem;
          font-weight: 600;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 0.75rem;
          margin-top: 0.5rem;
        }
        
        .loading-container, .error-container {
          text-align: center;
          padding: 4rem 2rem;
        }
        
        .loading-container i {
          font-size: 3rem;
          color: #ff6b6b;
          margin-bottom: 1rem;
        }
        
        .error-container i {
          font-size: 3rem;
          color: #ffc107;
          margin-bottom: 1rem;
        }
        
        .loading-container p, .error-container p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        
        /* 響應式設計 */
        @media (max-width: 768px) {
          .payment-columns {
            flex-direction: column;
          }
        }
      `}</style>
    </Layout>
  );
};

export default StripePaymentPage; 