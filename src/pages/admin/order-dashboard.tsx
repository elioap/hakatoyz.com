import React, { useState, useEffect } from 'react';
import { apiService } from '../../utils/api';

interface Order {
  id: number;
  attributes: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress: string;
    billingAddress?: string;
    products: any[];
    totalAmount: number;
    status: string;
    paymentMethod?: string;
    paymentStatus: string;
    notes?: string;
    trackingNumber?: string;
    createdAt: string;
    updatedAt: string;
  };
}

const OrderDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [newOrders, setNewOrders] = useState<number>(0);

  // 獲取所有訂單
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiService.getOrders();
      const orderData = response.data.data || [];
      setOrders(orderData);
      
      // 計算新訂單數量（今天的訂單）
      const today = new Date().toDateString();
      const todayOrders = orderData.filter((order: Order) => 
        new Date(order.attributes.createdAt).toDateString() === today
      );
      setNewOrders(todayOrders.length);
      
    } catch (error: any) {
      console.error('獲取訂單失敗:', error);
      alert('獲取訂單失敗: ' + (error.response?.data?.error?.message || error.message));
    }
    setLoading(false);
  };

  // 更新訂單狀態
  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await apiService.updateOrder(orderId, { status });
      alert('訂單狀態更新成功！');
      await fetchOrders();
    } catch (error: any) {
      console.error('更新訂單狀態失敗:', error);
      alert('更新失敗: ' + (error.response?.data?.error?.message || error.message));
    }
  };

  // 過濾訂單
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.attributes.status.toLowerCase() === filter.toLowerCase();
  });

  // 格式化金額
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // 獲取狀態顏色
  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-purple-100 text-purple-800',
      'Shipped': 'bg-indigo-100 text-indigo-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Refunded': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    fetchOrders();
    // 每30秒自動刷新訂單
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📦 訂單管理儀表板</h1>
        <div className="flex items-center space-x-4">
          {newOrders > 0 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              🔔 {newOrders} 新訂單
            </div>
          )}
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '刷新中...' : '🔄 刷新'}
          </button>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">總訂單數</h3>
          <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">待處理</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.attributes.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">處理中</h3>
          <p className="text-2xl font-bold text-purple-600">
            {orders.filter(o => o.attributes.status === 'Processing').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">今日收入</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(
              orders
                .filter(o => new Date(o.attributes.createdAt).toDateString() === new Date().toDateString())
                .reduce((sum, o) => sum + o.attributes.totalAmount, 0)
            )}
          </p>
        </div>
      </div>

      {/* 過濾器 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">📊 訂單過濾</h3>
        <div className="flex flex-wrap gap-2">
          {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === status 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? '全部' : status}
              {status !== 'all' && (
                <span className="ml-1">
                  ({orders.filter(o => o.attributes.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 訂單列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">📋 訂單列表 ({filteredOrders.length})</h3>
        </div>
        
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">訂單號</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">客戶</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">狀態</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">建立時間</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {order.attributes.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{order.attributes.customerName}</p>
                        <p className="text-gray-500">{order.attributes.customerEmail}</p>
                        {order.attributes.customerPhone && (
                          <p className="text-gray-500">{order.attributes.customerPhone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatCurrency(order.attributes.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.attributes.status)}`}>
                        {order.attributes.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(order.attributes.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          👁️ 查看
                        </button>
                        <select
                          value={order.attributes.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs border rounded px-1 py-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            📭 暫無訂單
          </div>
        )}
      </div>

      {/* 訂單詳情彈窗 */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">📦 訂單詳情</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">訂單資訊</h4>
                  <p><strong>訂單號:</strong> {selectedOrder.attributes.orderNumber}</p>
                  <p><strong>狀態:</strong> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.attributes.status)}`}>
                      {selectedOrder.attributes.status}
                    </span>
                  </p>
                  <p><strong>總金額:</strong> {formatCurrency(selectedOrder.attributes.totalAmount)}</p>
                  <p><strong>付款方式:</strong> {selectedOrder.attributes.paymentMethod || 'N/A'}</p>
                  <p><strong>付款狀態:</strong> {selectedOrder.attributes.paymentStatus}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700">客戶資訊</h4>
                  <p><strong>姓名:</strong> {selectedOrder.attributes.customerName}</p>
                  <p><strong>郵箱:</strong> {selectedOrder.attributes.customerEmail}</p>
                  <p><strong>電話:</strong> {selectedOrder.attributes.customerPhone || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700">配送地址</h4>
                <p className="text-sm bg-gray-50 p-2 rounded">{selectedOrder.attributes.shippingAddress}</p>
              </div>
              
              {selectedOrder.attributes.notes && (
                <div>
                  <h4 className="font-semibold text-gray-700">備註</h4>
                  <p className="text-sm bg-gray-50 p-2 rounded">{selectedOrder.attributes.notes}</p>
                </div>
              )}
              
              {selectedOrder.attributes.trackingNumber && (
                <div>
                  <h4 className="font-semibold text-gray-700">追蹤號碼</h4>
                  <p className="text-sm bg-green-50 p-2 rounded">{selectedOrder.attributes.trackingNumber}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-gray-700">商品清單</h4>
                <div className="text-sm bg-gray-50 p-2 rounded">
                  <pre>{JSON.stringify(selectedOrder.attributes.products, null, 2)}</pre>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                <p>建立時間: {new Date(selectedOrder.attributes.createdAt).toLocaleString()}</p>
                <p>更新時間: {new Date(selectedOrder.attributes.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDashboard; 