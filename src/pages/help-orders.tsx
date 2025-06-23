import React from 'react';
import Layout from '@/components/Layout';

const HelpOrdersPage: React.FC = () => {
  return (
    <Layout
      title="帮助中心 - 订单问题 - Haka Toyz"
      description="Haka Toyz帮助中心订单相关问题解答"
    >
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title lang-en">Order Help</h1>
          <h1 className="page-title lang-zh">訂單幫助</h1>
          <div className="breadcrumb">
            <span className="current lang-en">Help Center - Orders</span>
            <span className="current lang-zh">幫助中心 - 訂單問題</span>
          </div>
        </div>
      </div>

      {/* 訂單幫助內容 */}
      <section className="help-section">
        <div className="container">
          <div className="help-content">
            <h2 className="lang-en">Understanding Your Orders</h2>
            <h2 className="lang-zh">了解您的訂單</h2>
            
            <div className="help-item">
              <h3 className="lang-en">How to Check Your Order Status</h3>
              <h3 className="lang-zh">如何檢查訂單狀態</h3>
              <p className="lang-en">
                You can check your order status by logging into your account and navigating to the &quot;Orders&quot; section.
                Here you will see all your past and current orders with their current status.
              </p>
              <p className="lang-zh">
                您可以通過登錄您的帳戶並導航到&quot;訂單&quot;部分來檢查訂單狀態。
                在這裡，您將看到所有過去和當前訂單及其當前狀態。
              </p>
            </div>
            
            <div className="help-item">
              <h3 className="lang-en">Understanding Order Statuses</h3>
              <h3 className="lang-zh">了解訂單狀態</h3>
              <ul className="lang-en">
                <li><strong>Pending</strong> - Your order has been received but not yet processed</li>
                <li><strong>Processing</strong> - Your order is being prepared for shipment</li>
                <li><strong>Shipped</strong> - Your order is on its way to you</li>
                <li><strong>Delivered</strong> - Your order has been delivered</li>
                <li><strong>Cancelled</strong> - Your order has been cancelled</li>
              </ul>
              <ul className="lang-zh">
                <li><strong>等待中</strong> - 您的訂單已收到但尚未處理</li>
                <li><strong>處理中</strong> - 您的訂單正在準備發貨</li>
                <li><strong>已發貨</strong> - 您的訂單正在運送中</li>
                <li><strong>已送達</strong> - 您的訂單已送達</li>
                <li><strong>已取消</strong> - 您的訂單已取消</li>
              </ul>
            </div>
            
            <div className="help-item">
              <h3 className="lang-en">How to Cancel an Order</h3>
              <h3 className="lang-zh">如何取消訂單</h3>
              <p className="lang-en">
                You can cancel an order as long as it has not been shipped yet. To cancel, go to your order details 
                and click the &quot;Cancel Order&quot; button. If your order has already been shipped, you will need to 
                contact our customer support team.
              </p>
              <p className="lang-zh">
                只要訂單尚未發貨，您就可以取消訂單。要取消，請轉到您的訂單詳情並點擊&quot;取消訂單&quot;按鈕。
                如果您的訂單已經發貨，您需要聯繫我們的客戶支援團隊。
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HelpOrdersPage;
