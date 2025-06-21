import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  total: number;
  items: number;
}

export default function UserOrdersPage() {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const { user, isAuthenticated, loading } = useAuth();
  
  // 示例訂單數據
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-2023-0001',
      date: '2023-06-15',
      status: 'delivered',
      total: 899.99,
      items: 3
    },
    {
      id: 'ORD-2023-0002',
      date: '2023-08-22',
      status: 'shipped',
      total: 499.50,
      items: 2
    },
    {
      id: 'ORD-2023-0003',
      date: '2023-11-03',
      status: 'processing',
      total: 1299.75,
      items: 4
    }
  ]);
  
  // 如果未登入，重定向到登入頁面
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);
  
  // 訂單狀態文本國際化
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return isEnglish ? 'Pending' : '待處理';
      case 'processing':
        return isEnglish ? 'Processing' : '處理中';
      case 'shipped':
        return isEnglish ? 'Shipped' : '已發貨';
      case 'delivered':
        return isEnglish ? 'Delivered' : '已送達';
      case 'canceled':
        return isEnglish ? 'Canceled' : '已取消';
      default:
        return status;
    }
  };
  
  // 訂單狀態樣式
  const getStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-500';
      case 'processing':
        return 'bg-blue-900/50 text-blue-300 border-blue-500';
      case 'shipped':
        return 'bg-purple-900/50 text-purple-300 border-purple-500';
      case 'delivered':
        return 'bg-green-900/50 text-green-300 border-green-500';
      case 'canceled':
        return 'bg-red-900/50 text-red-300 border-red-500';
      default:
        return 'bg-gray-900/50 text-gray-300 border-gray-500';
    }
  };
  
  // 國際化文本
  const t = {
    title: isEnglish ? 'My Orders - Haka Toyz' : '我的訂單 - Haka Toyz',
    pageHeading: isEnglish ? 'My Orders' : '我的訂單',
    noOrders: isEnglish ? 'You have no orders yet.' : '您還沒有任何訂單。',
    orderNumber: isEnglish ? 'Order #' : '訂單號 #',
    date: isEnglish ? 'Date' : '日期',
    status: isEnglish ? 'Status' : '狀態',
    total: isEnglish ? 'Total' : '總計',
    items: isEnglish ? 'Items' : '商品',
    actions: isEnglish ? 'Actions' : '操作',
    viewDetails: isEnglish ? 'View Details' : '查看詳情',
    back: isEnglish ? 'Back to Account' : '返回帳戶',
    shopNow: isEnglish ? 'Shop Now' : '立即購物',
    loading: isEnglish ? 'Loading...' : '載入中...'
  };
  
  if (loading) {
    return (
      <Layout title={t.title}>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl neon-text-primary">{t.loading}</div>
        </div>
      </Layout>
    );
  }
  
  // 如果不通過useEffect重定向，這裡也可以直接檢查
  if (!isAuthenticated) {
    return null; // 會通過useEffect重定向，這裡不需要渲染任何內容
  }

  return (
    <Layout title={t.title}>
      {/* 頁面標題 */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold neon-text-primary">{t.pageHeading}</h1>
          <Link href="/user" className="flex items-center text-gray-400 hover:neon-text-secondary transition-colors">
            <i className="fas fa-arrow-left mr-2"></i>
            {t.back}
          </Link>
        </div>

        {/* 訂單列表 */}
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">{t.noOrders}</p>
              <Link 
                href="/products" 
                className="inline-block px-6 py-2 bg-pink-700 hover:bg-pink-600 rounded-md transition-colors"
              >
                {t.shopNow}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">{t.orderNumber}</th>
                    <th className="px-4 py-3 text-left">{t.date}</th>
                    <th className="px-4 py-3 text-left">{t.status}</th>
                    <th className="px-4 py-3 text-right">{t.total}</th>
                    <th className="px-4 py-3 text-center">{t.items}</th>
                    <th className="px-4 py-3 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-4 font-medium neon-text-secondary">
                        {order.id}
                      </td>
                      <td className="px-4 py-4 text-gray-300">
                        {new Date(order.date).toLocaleDateString(
                          isEnglish ? 'en-US' : 'zh-TW',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs border ${getStatusClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {order.items}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link 
                          href={`/user/order-detail?id=${order.id}`} 
                          className="inline-block px-3 py-1 bg-cyan-800/50 text-cyan-300 border border-cyan-700 rounded-md hover:bg-cyan-700/50 transition-colors text-sm"
                        >
                          {t.viewDetails}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 