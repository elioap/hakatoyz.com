import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';

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

const OrderConfirmationPage: React.FC = () => {
  const router = useRouter();
  const { locale, query } = router;
  const isEnglish = locale === 'en';
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // 文字翻譯
  const t = {
    orderConfirmation: isEnglish ? 'Order Confirmation' : '訂單確認',
    thankYou: isEnglish ? 'Thank you for your order!' : '感謝您的訂購！',
    orderPlaced: isEnglish ? 'Your order has been successfully placed and payment confirmed.' : '您的訂單已成功提交並確認付款。',
    orderPending: isEnglish ? 'Your order has been placed and is pending payment.' : '您的訂單已提交，等待付款確認。',
    orderDetails: isEnglish ? 'Order Details' : '訂單詳情',
    orderNumber: isEnglish ? 'Order Number' : '訂單號',
    paymentMethod: isEnglish ? 'Payment Method' : '付款方式',
    customerInfo: isEnglish ? 'Customer Information' : '客戶信息',
    shippingAddress: isEnglish ? 'Shipping Address' : '收貨地址',
    orderItems: isEnglish ? 'Order Items' : '訂單商品',
    subtotal: isEnglish ? 'Subtotal' : '小計',
    shipping: isEnglish ? 'Shipping' : '運費',
    tax: isEnglish ? 'Tax' : '稅費',
    total: isEnglish ? 'Total' : '總計',
    emailSent: isEnglish ? 'A confirmation email has been sent to your registered email address.' : '訂單確認郵件已發送到您註冊的電子郵件地址。',
    viewOrders: isEnglish ? 'View My Orders' : '查看我的訂單',
    continueShopping: isEnglish ? 'Continue Shopping' : '繼續購物',
    creditCard: isEnglish ? 'Credit Card' : '信用卡',
    paypal: isEnglish ? 'PayPal' : 'PayPal',
    paymentSuccessful: isEnglish ? 'Payment Successful' : '付款成功',
    paymentPending: isEnglish ? 'Payment Pending' : '等待付款',
  };

  useEffect(() => {
    // 檢查是否從支付成功跳轉過來
    if (query.payment === 'success') {
      setPaymentSuccess(true);
    }

    // 生成訂單號（實際應用中應該從後端獲取）
    const generateOrderNumber = () => {
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `ORD${timestamp.slice(-6)}${random}`;
    };

    setOrderNumber(generateOrderNumber());

    // 嘗試從 sessionStorage 獲取最近的訂單數據
    // 注意：在實際應用中，訂單數據應該從後端 API 獲取
    const storedOrderData = sessionStorage.getItem('completedOrder') || sessionStorage.getItem('pendingOrder');
    if (storedOrderData) {
      try {
        const parsedOrderData: OrderData = JSON.parse(storedOrderData);
        setOrderData(parsedOrderData);
        
        // 如果是已完成的訂單數據，清除 sessionStorage
        if (sessionStorage.getItem('completedOrder')) {
          sessionStorage.removeItem('completedOrder');
        }
      } catch (error) {
        console.error('解析訂單數據失敗:', error);
      }
    }
  }, [query.payment]);

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'credit-card':
        return t.creditCard;
      case 'paypal':
        return t.paypal;
      case 'alipay':
        return isEnglish ? 'Alipay' : '支付寶';
      case 'wechat-pay':
        return isEnglish ? 'WeChat Pay' : '微信支付';
      default:
        return method;
    }
  };

  return (
    <Layout
      title={`${t.orderConfirmation} - Haka Toyz`}
      description={`${t.orderConfirmation} - Haka Toyz`}
    >
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1>{t.orderConfirmation}</h1>
        </div>
      </div>

      {/* 訂單確認內容 */}
      <section className="order-confirmation-section">
        <div className="container">
          <div className="confirmation-content">
            {/* 成功消息 */}
            <div className={`success-message ${paymentSuccess ? 'payment-success' : 'payment-pending'}`}>
              <i className={`fas ${paymentSuccess ? 'fa-check-circle' : 'fa-clock'}`}></i>
              <h2>{t.thankYou}</h2>
              <p>{paymentSuccess ? t.orderPlaced : t.orderPending}</p>
              
              {/* 支付狀態 */}
              <div className="payment-status">
                <span className={`status-badge ${paymentSuccess ? 'success' : 'pending'}`}>
                  {paymentSuccess ? t.paymentSuccessful : t.paymentPending}
                </span>
              </div>
            </div>
            
            {/* 訂單詳情 */}
            <div className="order-details">
              <h3>{t.orderDetails}</h3>
              
              <div className="order-summary">
                <div className="order-info-row">
                  <span>{t.orderNumber}:</span>
                  <strong>#{orderNumber}</strong>
                </div>
                
                {orderData && (
                  <div className="order-info-row">
                    <span>{t.paymentMethod}:</span>
                    <span>{getPaymentMethodName(orderData.paymentMethod)}</span>
                  </div>
                )}
              </div>

              {/* 客戶信息 */}
              {orderData && (
                <div className="order-sections">
                  <div className="order-section">
                    <h4>{t.customerInfo}</h4>
                    <div className="info-grid">
                      <p><strong>{isEnglish ? 'Name' : '姓名'}:</strong> {orderData.customer.firstName} {orderData.customer.lastName}</p>
                      <p><strong>{isEnglish ? 'Email' : '郵箱'}:</strong> {orderData.customer.email}</p>
                      <p><strong>{isEnglish ? 'Phone' : '電話'}:</strong> {orderData.customer.phone}</p>
                    </div>
                  </div>

                  <div className="order-section">
                    <h4>{t.shippingAddress}</h4>
                    <div className="address-info">
                      <p>{orderData.shipping.address}</p>
                      <p>{orderData.shipping.city}, {orderData.shipping.zipCode}</p>
                      <p>{orderData.shipping.country}</p>
                    </div>
                  </div>

                  <div className="order-section">
                    <h4>{t.orderItems}</h4>
                    <div className="items-list">
                      {orderData.items.map((item, index) => (
                        <div key={index} className="item-row">
                          <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                          </div>
                          <div className="item-price">${item.total.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="order-totals">
                      <div className="total-row">
                        <span>{t.subtotal}</span>
                        <span>${orderData.pricing.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="total-row">
                        <span>{t.shipping}</span>
                        <span>${orderData.pricing.shipping.toLocaleString()}</span>
                      </div>
                      <div className="total-row">
                        <span>{t.tax}</span>
                        <span>${orderData.pricing.tax.toLocaleString()}</span>
                      </div>
                      <div className="total-row final-total">
                        <span>{t.total}</span>
                        <span>${orderData.pricing.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="email-notice">{t.emailSent}</p>
            </div>
            
            {/* 操作按鈕 */}
            <div className="action-buttons">
              <Link href="/user/orders" className="btn-primary">
                {t.viewOrders}
              </Link>
              <Link href="/products" className="btn-secondary">
                {t.continueShopping}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .order-confirmation-section {
          padding: 2rem 0;
        }
        
        .confirmation-content {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .success-message {
          text-align: center;
          padding: 3rem 2rem;
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .success-message.payment-success {
          border-color: rgba(76, 175, 80, 0.3);
          background-color: rgba(76, 175, 80, 0.05);
        }
        
        .success-message.payment-pending {
          border-color: rgba(255, 193, 7, 0.3);
          background-color: rgba(255, 193, 7, 0.05);
        }
        
        .success-message i {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        
        .payment-success i {
          color: #4caf50;
        }
        
        .payment-pending i {
          color: #ffc107;
        }
        
        .success-message h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--color-text);
        }
        
        .success-message p {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .payment-status {
          margin-top: 1rem;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .status-badge.success {
          background-color: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .status-badge.pending {
          background-color: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }
        
        .order-details {
          background-color: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .order-details h3 {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.5rem;
        }
        
        .order-summary {
          margin-bottom: 2rem;
        }
        
        .order-info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .order-sections {
          display: grid;
          gap: 2rem;
        }
        
        .order-section h4 {
          margin-bottom: 1rem;
          font-size: 1.2rem;
          color: #ff6b6b;
        }
        
        .info-grid p {
          margin-bottom: 0.5rem;
          line-height: 1.4;
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
          margin-top: 1rem;
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
        
        .email-notice {
          margin-top: 2rem;
          padding: 1rem;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        .action-buttons .btn-primary,
        .action-buttons .btn-secondary {
          padding: 1rem 2rem;
          font-size: 1rem;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .action-buttons .btn-primary {
          background: linear-gradient(135deg, #ff6b6b, #ff5252);
          color: white;
        }
        
        .action-buttons .btn-primary:hover {
          background: linear-gradient(135deg, #ff5252, #ff1744);
          transform: translateY(-2px);
        }
        
        .action-buttons .btn-secondary {
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .action-buttons .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        /* 響應式設計 */
        @media (max-width: 768px) {
          .confirmation-content {
            padding: 0 1rem;
          }
          
          .success-message {
            padding: 2rem 1rem;
          }
          
          .success-message h2 {
            font-size: 1.5rem;
          }
          
          .action-buttons {
            flex-direction: column;
          }
          
          .action-buttons .btn-primary,
          .action-buttons .btn-secondary {
            padding: 0.875rem 1.5rem;
          }
        }
      `}</style>
    </Layout>
  );
};

export default OrderConfirmationPage;
