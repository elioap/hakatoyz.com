import React from 'react';
import {
  PayPalButtons,
  usePayPalScriptReducer,
  PayPalButtonsComponentProps,
} from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';

interface PayPalCheckoutProps {
  orderData: any;
  totalAmount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({
  orderData,
  totalAmount,
  onSuccess,
  onError: onErrorProp,
}) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';

  // 文字翻譯
  const t = {
    paymentSuccessful: isEnglish ? 'Payment successful!' : '付款成功！',
    paymentFailed: isEnglish ? 'Payment failed' : '付款失敗',
    paymentCancelled: isEnglish ? 'Payment cancelled' : '付款已取消',
    processingPayment: isEnglish ? 'Processing payment...' : '處理付款中...',
  };

  const createOrder: PayPalButtonsComponentProps['createOrder'] = async () => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'USD', // PayPal通常使用USD
          orderData,
        }),
      });

      if (!response.ok) {
        throw new Error('創建PayPal訂單失敗');
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('創建PayPal訂單錯誤:', error);
      onErrorProp(t.paymentFailed);
      throw error;
    }
  };

  const onApprove: PayPalButtonsComponentProps['onApprove'] = async (data) => {
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      if (!response.ok) {
        throw new Error('捕獲PayPal付款失敗');
      }

      const orderData = await response.json();
      
      if (orderData.status === 'COMPLETED') {
        onSuccess();
        
        // 跳轉到訂單確認頁面
        setTimeout(() => {
          router.push('/order-confirmation');
        }, 1500);
      } else {
        onErrorProp(t.paymentFailed);
      }
    } catch (error) {
      console.error('PayPal付款錯誤:', error);
      onErrorProp(t.paymentFailed);
    }
  };

  const onCancel: PayPalButtonsComponentProps['onCancel'] = () => {
    console.log('PayPal付款已取消');
    onErrorProp(t.paymentCancelled);
  };

  const onError: PayPalButtonsComponentProps['onError'] = (err) => {
    console.error('PayPal錯誤:', err);
    onErrorProp(t.paymentFailed);
  };

  if (isPending) {
    return (
      <div className="paypal-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>{t.processingPayment}</span>
        
        <style jsx>{`
          .paypal-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 20px;
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="paypal-checkout">
      <PayPalButtons
        style={{
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 45,
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancel}
        onError={onError}
      />
      
      <style jsx>{`
        .paypal-checkout {
          max-width: 500px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default PayPalCheckout; 