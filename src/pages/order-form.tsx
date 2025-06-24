import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../contexts/CartContext';
import { apiService } from '../utils/api';

const OrderForm: React.FC = () => {
  const router = useRouter();
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: 'Credit Card',
    notes: ''
  });

  // 生成訂單號
  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `ORD${year}${month}${day}${random}`;
  };

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('購物車為空，請先添加商品！');
      return;
    }

    setLoading(true);

    try {
      // 準備訂單數據
      const orderData = {
        orderNumber: generateOrderNumber(),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone || null,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddress || formData.shippingAddress,
                 products: cartItems.map(item => ({
           id: item.id,
           title: item.name,
           price: item.price,
           quantity: item.quantity,
           subtotal: item.price * item.quantity
         })),
         totalAmount: getTotalPrice(),
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'Pending',
        status: 'Pending',
        notes: formData.notes || null
      };

      // 提交訂單到 Strapi
      const response = await apiService.createOrder(orderData);
      
      if (response.data) {
        // 清空購物車
        clearCart();
        
        // 顯示成功訊息
        alert(`訂單提交成功！\n訂單號: ${orderData.orderNumber}\n我們會盡快與您聯繫。`);
        
        // 跳轉到訂單確認頁面
        router.push(`/order-confirmation?orderNumber=${orderData.orderNumber}`);
      }
    } catch (error: any) {
      console.error('提交訂單失敗:', error);
      const errorMessage = error.response?.data?.error?.message || error.message || '未知錯誤';
      alert(`訂單提交失敗: ${errorMessage}\n\n請檢查網絡連接或聯繫客服。`);
    }
    
    setLoading(false);
  };

  // 處理輸入變化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 如果購物車為空，顯示提示
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">📦 下單</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">您的購物車是空的！</p>
          <button
            onClick={() => router.push('/products')}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            前往購物 🛍️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">📦 確認訂單</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 訂單表單 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📝 訂單資訊</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 客戶資訊 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="請輸入您的姓名"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電子郵箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                聯繫電話
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>

            {/* 地址資訊 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                收貨地址 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="請輸入詳細的收貨地址"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                帳單地址（如與收貨地址不同）
              </label>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="留空則使用收貨地址"
              />
            </div>

            {/* 付款方式 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                付款方式
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Credit Card">信用卡</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">銀行轉帳</option>
                <option value="Cash on Delivery">貨到付款</option>
              </select>
            </div>

            {/* 備註 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                訂單備註
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="有什麼特殊要求請在這裡說明"
              />
            </div>

            {/* 提交按鈕 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '提交中...' : '🚀 提交訂單'}
            </button>
          </form>
        </div>

        {/* 訂單摘要 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📋 訂單摘要</h2>
          
          <div className="space-y-4">
            {/* 商品列表 */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                                 <div key={item.id} className="flex justify-between items-center py-2 border-b">
                   <div className="flex-1">
                     <h4 className="font-medium text-gray-900">{item.name}</h4>
                     <p className="text-sm text-gray-500">數量: {item.quantity}</p>
                   </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">${item.price} 每件</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 費用明細 */}
            <div className="border-t pt-4 space-y-2">
                             <div className="flex justify-between">
                 <span>商品小計:</span>
                 <span>${getTotalPrice().toFixed(2)}</span>
               </div>
               <div className="flex justify-between">
                 <span>運費:</span>
                 <span className="text-green-600">免費</span>
               </div>
               <div className="flex justify-between">
                 <span>稅費:</span>
                 <span>$0.00</span>
               </div>
               <div className="flex justify-between text-lg font-bold border-t pt-2">
                 <span>總計:</span>
                 <span className="text-green-600">${getTotalPrice().toFixed(2)}</span>
               </div>
            </div>

            {/* 政策提醒 */}
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
              <p className="font-medium mb-2">📋 訂單說明:</p>
              <ul className="space-y-1">
                <li>• 提交訂單後我們會盡快與您聯繫確認</li>
                <li>• 訂單確認後 3-5 個工作日內發貨</li>
                <li>• 支持 7 天無理由退換貨</li>
                <li>• 如有問題請聯繫客服</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm; 