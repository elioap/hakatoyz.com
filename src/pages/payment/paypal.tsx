import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import PayPalCheckout from '@/components/PayPalCheckout';
import { useCart } from '@/contexts/CartContext';

interface OrderData {
  customer: { firstName: string; lastName: string; email: string; phone: string; };
  shipping: { address: string; city: string; zipCode: string; country: string; };
  items: Array<{ id: string; name: string; price: number; quantity: number; total: number; }>;
  pricing: { subtotal: number; shipping: number; tax: number; total: number; };
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const PayPalPaymentPage: React.FC = () => {
  const router = useRouter();
  const { locale } = router;
  const { clearCart } = useCart();
  const isEnglish = locale === 'en';
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // PayPal配置
  const paypalInitialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    currency: 'USD',
    intent: 'capture',
  };

  const t = {
    payment: isEnglish ? 'Payment' : '付款',
    paypalPayment: isEnglish ? 'PayPal Payment' : 'PayPal 付款',
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
  };

  useEffect(() => {
    const storedOrderData = sessionStorage.getItem('pendingOrder');
    if (!storedOrderData) {
      setError(t.noOrderData);
      setIsLoading(false);
      return;
    }

    const parsedOrderData: OrderData = JSON.parse(storedOrderData);
    setOrderData(parsedOrderData);
    setIsLoading(false);
  }, [t.noOrderData]);

  const handlePaymentSuccess = () => {
    clearCart();
    sessionStorage.removeItem('pendingOrder');
    router.push('/order-confirmation?payment=success');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (isLoading) {
    return (
      <Layout title={t.payment} description={`${t.paypalPayment} - Haka Toyz`}>
        <div className="page-header">
          <div className="container">
            <h1>{t.paypalPayment}</h1>
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
              <button onClick={() => router.push('/checkout')} className="btn-primary">
                {t.backToCheckout}
              </button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout title={t.paypalPayment} description={`${t.paypalPayment} - Haka Toyz`}>
      <div className="page-header">
        <div className="container">
          <h1>{t.paypalPayment}</h1>
        </div>
      </div>

      <section className="payment-section">
        <div className="container">
          <div className="payment-columns">
            <div className="payment-column">
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
                </div>
              </div>

              <div className="info-block">
                <h2>{t.orderSummary}</h2>
                <div className="items-list">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                      </div>
                      <div className="item-price">¥{item.total.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                
                <div className="order-totals">
                  <div className="total-row final-total">
                    <span>{t.total}</span>
                    <span>¥{orderData.pricing.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-column">
              <div className="payment-block">
                <h2>{isEnglish ? 'PayPal Payment' : 'PayPal 付款'}</h2>
                <PayPalScriptProvider options={paypalInitialOptions}>
                  <PayPalCheckout
                    orderData={orderData}
                    totalAmount={orderData.pricing.total}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .payment-section { padding: 2rem 0; }
        .payment-columns { display: flex; gap: 2rem; }
        .payment-column { flex: 1; }
        .info-block, .payment-block {
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .info-block h2, .payment-block h2 {
          margin-bottom: 1rem; font-size: 1.2rem; padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .info-grid { display: grid; gap: 0.75rem; }
        .info-item { display: flex; justify-content: space-between; align-items: center; }
        .items-list { margin-bottom: 1rem; }
        .item-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.75rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .item-row:last-child { border-bottom: none; }
        .item-info { display: flex; flex-direction: column; gap: 0.25rem; }
        .item-name { font-weight: 500; }
        .item-quantity { font-size: 0.85rem; color: rgba(255, 255, 255, 0.6); }
        .order-totals { border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 1rem; }
        .total-row { display: flex; justify-content: space-between; padding: 0.5rem 0; }
        .final-total { font-size: 1.1rem; font-weight: 600; }
        .loading-container, .error-container { text-align: center; padding: 4rem 2rem; }
        .loading-container i, .error-container i { font-size: 3rem; margin-bottom: 1rem; }
        .loading-container i { color: #ff6b6b; }
        .error-container i { color: #ffc107; }
        .loading-container p, .error-container p { font-size: 1.1rem; margin-bottom: 2rem; }
        @media (max-width: 768px) { .payment-columns { flex-direction: column; } }
      `}</style>
    </Layout>
  );
};

 