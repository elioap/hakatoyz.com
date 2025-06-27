import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';

interface OrderData {
  customer: { firstName: string; lastName: string; email: string; phone: string; };
  pricing: { total: number; };
  paymentMethod: string;
}

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('credit-card');

  const t = {
    payment: isEnglish ? 'Payment' : '付款',
    choosePayment: isEnglish ? 'Choose Payment Method' : '選擇付款方式',
    creditCard: isEnglish ? 'Credit Card (Stripe)' : '信用卡 (Stripe)',
    paypal: isEnglish ? 'PayPal' : 'PayPal',
    alipay: isEnglish ? 'Alipay' : '支付寶',
    wechatPay: isEnglish ? 'WeChat Pay' : '微信支付',
    proceedToPayment: isEnglish ? 'Proceed to Payment' : '前往付款',
    total: isEnglish ? 'Total' : '總計',
    noOrderData: isEnglish ? 'No order data found. Please go back to checkout.' : '未找到訂單數據，請返回結帳頁面。',
    backToCheckout: isEnglish ? 'Back to Checkout' : '返回結帳',
    comingSoon: isEnglish ? 'Coming Soon' : '即將推出',
  };

  useEffect(() => {
    const storedOrderData = sessionStorage.getItem('pendingOrder');
    if (storedOrderData) {
      const parsedOrderData: OrderData = JSON.parse(storedOrderData);
      setOrderData(parsedOrderData);
      setSelectedMethod(parsedOrderData.paymentMethod || 'credit-card');
    }
  }, []);

  const handleProceedToPayment = () => {
    if (selectedMethod === 'credit-card') {
      router.push('/payment/stripe');
    } else if (selectedMethod === 'paypal') {
      router.push('/payment/paypal');
    } else {
      alert(t.comingSoon);
    }
  };

  if (!orderData) {
    return (
      <Layout title={t.payment} description={`${t.payment} - Haka Toyz`}>
        <div className="page-header">
          <div className="container">
            <h1>{t.payment}</h1>
          </div>
        </div>
        <section className="error-section">
          <div className="container">
            <div className="error-container">
              <p>{t.noOrderData}</p>
              <Link href="/checkout" className="btn-primary">
                {t.backToCheckout}
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout title={t.payment} description={`${t.payment} - Haka Toyz`}>
      <div className="page-header">
        <div className="container">
          <h1>{t.choosePayment}</h1>
        </div>
      </div>

      <section className="payment-section">
        <div className="container">
          <div className="payment-container">
            <div className="payment-options">
              <h2>{t.choosePayment}</h2>
              <div className="payment-methods">
                <div className={`payment-method ${selectedMethod === 'credit-card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    id="credit-card"
                    name="paymentMethod"
                    value="credit-card"
                    checked={selectedMethod === 'credit-card'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                  />
                  <label htmlFor="credit-card">
                    <i className="fas fa-credit-card"></i>
                    {t.creditCard}
                  </label>
                </div>

                <div className={`payment-method ${selectedMethod === 'paypal' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={selectedMethod === 'paypal'}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                  />
                  <label htmlFor="paypal">
                    <i className="fab fa-paypal"></i>
                    {t.paypal}
                  </label>
                </div>

                <div className={`payment-method disabled`}>
                  <input type="radio" disabled />
                  <label>
                    <i className="fab fa-alipay"></i>
                    {t.alipay} <span className="coming-soon">({t.comingSoon})</span>
                  </label>
                </div>

                <div className={`payment-method disabled`}>
                  <input type="radio" disabled />
                  <label>
                    <i className="fab fa-weixin"></i>
                    {t.wechatPay} <span className="coming-soon">({t.comingSoon})</span>
                  </label>
                </div>
              </div>

              <div className="order-total">
                <div className="total-row">
                  <span>{t.total}</span>
                  <span>¥{orderData.pricing.total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleProceedToPayment}
                className="btn-primary proceed-btn"
              >
                {t.proceedToPayment}
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .payment-section { padding: 2rem 0; }
        .payment-container { max-width: 600px; margin: 0 auto; }
        .payment-options {
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 8px; padding: 2rem; border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .payment-options h2 {
          margin-bottom: 2rem; font-size: 1.5rem; text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 1rem;
        }
        .payment-methods { display: grid; gap: 1rem; margin-bottom: 2rem; }
        .payment-method {
          display: flex; align-items: center; padding: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 8px;
          cursor: pointer; transition: all 0.3s ease;
        }
        .payment-method:not(.disabled):hover { border-color: #ff6b6b; background-color: rgba(255, 107, 107, 0.1); }
        .payment-method.selected { border-color: #ff6b6b; background-color: rgba(255, 107, 107, 0.1); }
        .payment-method.disabled { opacity: 0.5; cursor: not-allowed; }
        .payment-method input[type="radio"] { margin-right: 1rem; }
        .payment-method label {
          display: flex; align-items: center; cursor: pointer; font-weight: 500; margin-bottom: 0;
        }
        .payment-method i { margin-right: 0.5rem; font-size: 1.2rem; width: 24px; }
        .coming-soon { font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); margin-left: 0.5rem; }
        .order-total {
          border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;
          padding: 1rem; margin-bottom: 2rem; background-color: rgba(0, 0, 0, 0.2);
        }
        .total-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 1.2rem; font-weight: 600;
        }
        .proceed-btn { width: 100%; padding: 1rem; font-size: 1.1rem; }
        .error-container { text-align: center; padding: 4rem 2rem; }
        .error-container p { font-size: 1.1rem; margin-bottom: 2rem; }
      `}</style>
    </Layout>
  );
};

export default PaymentPage; 