import React, { useEffect, useState } from 'react';
import { apiService } from '../utils/api';

interface OrderNotificationProps {
  onNewOrder?: (order: any) => void;
}

const OrderNotification: React.FC<OrderNotificationProps> = ({ onNewOrder }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lastOrderCount, setLastOrderCount] = useState<number>(0);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  // 請求瀏覽器通知權限
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setIsEnabled(permission === 'granted');
      return permission === 'granted';
    }
    return false;
  };

  // 發送瀏覽器通知
  const sendBrowserNotification = (title: string, options: NotificationOptions) => {
    if (isEnabled && 'Notification' in window) {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  };

  // 檢查新訂單
  const checkNewOrders = async () => {
    try {
      const response = await apiService.getOrders();
      const orders = response.data.data || [];
      const currentOrderCount = orders.length;

      // 如果有新訂單
      if (lastOrderCount > 0 && currentOrderCount > lastOrderCount) {
        const newOrdersCount = currentOrderCount - lastOrderCount;
        const latestOrders = orders.slice(0, newOrdersCount);

        // 為每個新訂單發送通知
        latestOrders.forEach((order: any) => {
          const notification = {
            id: order.id,
            title: `新訂單 #${order.attributes.orderNumber}`,
            message: `客戶: ${order.attributes.customerName}`,
            amount: order.attributes.totalAmount,
            timestamp: new Date(),
            read: false
          };

          setNotifications(prev => [notification, ...prev]);

          // 發送瀏覽器通知
          sendBrowserNotification(
            `🔔 新訂單通知`,
            {
              body: `訂單號: ${order.attributes.orderNumber}\n客戶: ${order.attributes.customerName}\n金額: $${order.attributes.totalAmount}`,
              tag: `order-${order.id}`,
              requireInteraction: true
            }
          );

          // 觸發回調
          if (onNewOrder) {
            onNewOrder(order);
          }
        });

        // 播放通知音效（如果支持）
        if ('Audio' in window) {
          try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => {
              // 忽略音頻播放錯誤
            });
          } catch (error) {
            // 忽略音頻創建錯誤
          }
        }
      }

      setLastOrderCount(currentOrderCount);
    } catch (error) {
      console.error('檢查新訂單失敗:', error);
    }
  };

  // 標記通知為已讀
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // 清除所有通知
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // 初始化和定期檢查
  useEffect(() => {
    // 請求通知權限
    requestNotificationPermission();

    // 初始化訂單數量
    checkNewOrders();

    // 每10秒檢查一次新訂單
    const interval = setInterval(checkNewOrders, 10000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* 通知按鈕 */}
      <button
        onClick={() => setNotifications([])}
        className="relative p-2 text-gray-600 hover:text-gray-900"
        title="訂單通知"
      >
        <div className="w-6 h-6">
          🔔
        </div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 通知面板 */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
          {notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`bg-white border rounded-lg shadow-lg p-4 transition-all duration-300 ${
                notification.read ? 'opacity-75' : 'border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-sm font-medium text-green-600 mt-1">
                    金額: ${notification.amount}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex space-x-1 ml-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-500 hover:text-blue-700 text-xs"
                      title="標記為已讀"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setNotifications(prev => 
                        prev.filter(n => n.id !== notification.id)
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                    title="關閉"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {notifications.length > 5 && (
            <div className="text-center">
              <button
                onClick={clearAllNotifications}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                清除所有通知 ({notifications.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* 通知設置 */}
      <div className="mt-2">
        <label className="flex items-center text-sm text-gray-600">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={requestNotificationPermission}
            className="mr-2"
          />
          啟用瀏覽器通知
        </label>
      </div>
    </div>
  );
};

export default OrderNotification; 