import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';

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

interface StripeCheckoutProps {
  clientSecret: string;
  orderData: OrderData;
  onSuccess: () => void;
  onError: (errorMessage: string) => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  clientSecret,
  orderData,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // 文字翻譯
  const t = {
    payNow: isEnglish ? 'Pay Now' : '立即付款',
    processing: isEnglish ? 'Processing Payment...' : '處理付款中...',
    paymentSuccess: isEnglish ? 'Payment Successful!' : '付款成功！',
    redirecting: isEnglish ? 'Redirecting...' : '正在跳轉...',
    paymentFailed: isEnglish ? 'Payment Failed' : '付款失敗',
    tryAgain: isEnglish ? 'Please try again.' : '請重試。',
    stripeNotLoaded: isEnglish ? 'Stripe not loaded. Please refresh the page.' : 'Stripe 未加載，請刷新頁面。',
    missingPaymentInfo: isEnglish ? 'Please complete payment information.' : '請完善付款信息。',
    total: isEnglish ? 'Total' : '總金額',
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      onError(t.stripeNotLoaded);
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setPaymentMessage(t.processing);

    try {
      // 確認支付
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation?payment=success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Stripe支付錯誤:', error);
        setPaymentStatus('error');
        setPaymentMessage(`${t.paymentFailed}: ${error.message}`);
        onError(error.message || t.tryAgain);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('支付成功:', paymentIntent);
        setPaymentStatus('success');
        setPaymentMessage(t.paymentSuccess);
        
        // 延遲一下讓用戶看到成功消息
        setTimeout(() => {
          setPaymentMessage(t.redirecting);
          onSuccess();
        }, 1500);
      } else {
        console.log('支付狀態未知:', paymentIntent);
        setPaymentStatus('error');
        setPaymentMessage(t.tryAgain);
        onError(t.tryAgain);
      }
    } catch (error) {
      console.error('支付處理錯誤:', error);
      setPaymentStatus('error');
      setPaymentMessage(t.paymentFailed);
      onError(error instanceof Error ? error.message : t.tryAgain);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="stripe-checkout">
      {/* 支付金額顯示 */}
      <div className="payment-amount">
        <div className="amount-row">
          <span>{t.total}:</span>
          <span className="amount">¥{orderData.pricing.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Stripe支付表單 */}
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="payment-element-container">
          <PaymentElement 
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
            }}
          />
        </div>
        
        {/* 支付狀態消息 */}
        {paymentMessage && (
          <div className={`payment-message ${paymentStatus}`}>
            {paymentStatus === 'processing' && <i className="fas fa-spinner fa-spin"></i>}
            {paymentStatus === 'success' && <i className="fas fa-check-circle"></i>}
            {paymentStatus === 'error' && <i className="fas fa-exclamation-circle"></i>}
            <span>{paymentMessage}</span>
          </div>
        )}
        
        {/* 提交按鈕 */}
        <button 
          type="submit" 
          disabled={!stripe || !elements || isProcessing}
          className={`pay-button ${isProcessing ? 'processing' : ''} ${paymentStatus === 'success' ? 'success' : ''}`}
        >
          {paymentStatus === 'processing' ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              {t.processing}
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <i className="fas fa-check"></i>
              {t.paymentSuccess}
            </>
          ) : (
            <>
              <i className="fas fa-lock"></i>
              {t.payNow} - ¥{orderData.pricing.total.toLocaleString()}
            </>
          )}
        </button>
      </form>

      <style jsx>{`
        .stripe-checkout {
          width: 100%;
        }
        
        .payment-amount {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .amount-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        .amount {
          color: #ff6b6b;
        }
        
        .payment-form {
          width: 100%;
        }
        
        .payment-element-container {
          margin-bottom: 1.5rem;
        }
        
        .payment-element-container :global(.StripeElement) {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .payment-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .payment-message.processing {
          background-color: rgba(25, 118, 210, 0.1);
          color: #1976d2;
          border: 1px solid rgba(25, 118, 210, 0.3);
        }
        
        .payment-message.success {
          background-color: rgba(76, 175, 80, 0.1);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .payment-message.error {
          background-color: rgba(244, 67, 54, 0.1);
          color: #f44336;
          border: 1px solid rgba(244, 67, 54, 0.3);
        }
        
        .pay-button {
          width: 100%;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #ff6b6b, #ff5252);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .pay-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff5252, #ff1744);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }
        
        .pay-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .pay-button.processing {
          background: linear-gradient(135deg, #2196f3, #1976d2);
        }
        
        .pay-button.success {
          background: linear-gradient(135deg, #4caf50, #388e3c);
        }
        
        .pay-button i {
          font-size: 1rem;
        }
        
        .fa-spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* 響應式設計 */
        @media (max-width: 480px) {
          .payment-amount {
            padding: 0.75rem;
          }
          
          .amount-row {
            font-size: 1.1rem;
          }
          
          .pay-button {
            padding: 0.875rem 1rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StripeCheckout; 