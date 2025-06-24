import React, { useState } from 'react';
import { apiService } from '../../utils/api';

interface OrderData {
  name: string;
  price: number;
  status: string;
}

const TestAPI: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData>({
    name: 'Zizi Toy',
    price: 599,
    status: 'Paid'
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  // 創建新訂單
  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const response = await apiService.createOrder(orderData);
      setResult(response.data);
      alert('訂單創建成功！');
      await fetchOrders(); // 重新獲取訂單列表
    } catch (error: any) {
      console.error('創建訂單失敗:', error);
      setResult(error.response?.data || error.message);
      alert('創建訂單失敗: ' + (error.response?.data?.error?.message || error.message));
    }
    setLoading(false);
  };

  // 獲取所有訂單
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiService.getOrders();
      setOrders(response.data.data || []);
    } catch (error: any) {
      console.error('獲取訂單失敗:', error);
      alert('獲取訂單失敗: ' + (error.response?.data?.error?.message || error.message));
    }
    setLoading(false);
  };

  // 測試連接
  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/orders');
      const data = await response.json();
      setResult(data);
      alert('連接測試完成，請查看結果');
    } catch (error: any) {
      console.error('連接測試失敗:', error);
      alert('連接測試失敗: ' + error.message);
    }
  };

  const handleInputChange = (field: keyof OrderData, value: string | number) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Strapi API 測試</h1>
      
      {/* 測試連接 */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">1. 測試連接</h2>
        <button
          onClick={testConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          測試 Strapi 連接
        </button>
      </div>

      {/* 創建訂單表單 */}
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">2. 創建新訂單</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">商品名稱</label>
            <input
              type="text"
              value={orderData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="商品名稱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">價格</label>
            <input
              type="number"
              value={orderData.price}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              className="w-full p-2 border rounded"
              placeholder="價格"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">狀態</label>
            <select
              value={orderData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleCreateOrder}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? '創建中...' : '創建訂單'}
        </button>
      </div>

      {/* 獲取訂單列表 */}
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">3. 獲取訂單列表</h2>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          {loading ? '獲取中...' : '獲取所有訂單'}
        </button>
        
        {orders.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">訂單列表:</h3>
            <div className="grid gap-2">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-3 rounded border">
                  <p><strong>ID:</strong> {order.id}</p>
                  <p><strong>名稱:</strong> {order.attributes.name}</p>
                  <p><strong>價格:</strong> ${order.attributes.price}</p>
                  <p><strong>狀態:</strong> {order.attributes.status}</p>
                  <p><strong>創建時間:</strong> {new Date(order.attributes.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* API 響應結果 */}
      {result && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">API 響應結果</h2>
          <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* cURL 示例 */}
      <div className="bg-purple-50 p-4 rounded-lg mt-6">
        <h2 className="text-xl font-semibold mb-4">4. cURL 示例</h2>
        <div className="bg-gray-800 text-green-400 p-4 rounded overflow-auto text-sm">
          <p className="mb-2"># 創建訂單的 cURL 請求:</p>
          <code>
{`curl -X POST http://localhost:1337/api/orders \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": {
      "name": "Zizi Toy",
      "price": 599,
      "status": "Paid"
    }
  }'`}
          </code>
        </div>
      </div>
    </div>
  );
};

export default TestAPI; 