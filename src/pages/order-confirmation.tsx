import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

const OrderConfirmationPage: React.FC = () => {
  return (
    <Layout
      title="订单确认 - Haka Toyz"
      description="Haka Toyz订单确认页面，确认您的订单详情"
    >
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1 className="lang-en">Order Confirmation</h1>
          <h1 className="lang-zh">訂單確認</h1>
          <div className="breadcrumb">
            <span className="current lang-en">Order Confirmation</span>
            <span className="current lang-zh">訂單確認</span>
          </div>
        </div>
      </div>

      {/* 訂單確認內容 */}
      <section className="order-confirmation-section">
        <div className="container">
          <div className="confirmation-content">
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <h2 className="lang-en">Thank you for your order!</h2>
              <h2 className="lang-zh">感謝您的訂購！</h2>
              <p className="lang-en">Your order has been successfully placed.</p>
              <p className="lang-zh">您的訂單已成功提交。</p>
            </div>
            
            <div className="order-details">
              <h3 className="lang-en">Order Details</h3>
              <h3 className="lang-zh">訂單詳情</h3>
              <div className="order-number">
                <span className="lang-en">Order Number:</span>
                <span className="lang-zh">訂單號:</span>
                <strong>#ORD12345</strong>
              </div>
              <p className="lang-en">
                A confirmation email has been sent to your registered email address.
              </p>
              <p className="lang-zh">
                訂單確認郵件已發送到您註冊的電子郵件地址。
              </p>
            </div>
            
            <div className="action-buttons">
              <Link href="/user" className="btn-primary">
                <span className="lang-en">View My Orders</span>
                <span className="lang-zh">查看我的訂單</span>
              </Link>
              <Link href="/" className="btn-secondary">
                <span className="lang-en">Continue Shopping</span>
                <span className="lang-zh">繼續購物</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrderConfirmationPage;
