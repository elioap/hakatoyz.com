import React, { useState } from 'react';
import { useWishlist, WishlistItem } from '@/contexts/WishlistContext';

interface NotifyModalProps {
  product: WishlistItem;
  isOpen: boolean;
  onClose: () => void;
}

const NotifyModal: React.FC<NotifyModalProps> = ({ product, isOpen, onClose }) => {
  const { subscribeNotification } = useWishlist();
  const [email, setEmail] = useState('');
  const [line, setLine] = useState('');
  const [notifyMethod, setNotifyMethod] = useState<'email' | 'line' | 'both'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // 表單驗證
    if (notifyMethod === 'email' && !email) {
      setError('請輸入有效的電子郵件地址');
      setIsSubmitting(false);
      return;
    }

    if (notifyMethod === 'line' && !line) {
      setError('請輸入有效的Line ID');
      setIsSubmitting(false);
      return;
    }

    if (notifyMethod === 'both' && (!email || !line)) {
      setError('請同時輸入電子郵件和Line ID');
      setIsSubmitting(false);
      return;
    }

    try {
      // 根據選擇的通知方式設置通知
      const emailToUse = notifyMethod === 'email' || notifyMethod === 'both' ? email : undefined;
      const lineToUse = notifyMethod === 'line' || notifyMethod === 'both' ? line : undefined;
      
      // 保存通知設置
      subscribeNotification(product.id, emailToUse, lineToUse);
      
      // 模擬API請求
      setTimeout(() => {
        setSuccess(true);
        setIsSubmitting(false);
        
        // 3秒後關閉模態窗口
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setEmail('');
          setLine('');
        }, 3000);
      }, 1000);
    } catch (err) {
      setError('設置通知時發生錯誤，請稍後再試');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md p-6 relative">
        {/* 關閉按鈕 */}
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>

        <h2 className="text-2xl font-bold neon-text-primary mb-1">到貨通知</h2>
        <h3 className="text-lg text-gray-300 mb-4">{product.name}</h3>
        
        {success ? (
          <div className="text-center py-6">
            <div className="inline-block mb-4 bg-green-800/30 p-4 rounded-full">
              <i className="fas fa-check text-green-400 text-3xl"></i>
            </div>
            <p className="text-lg font-medium text-green-400 mb-2">通知設置成功</p>
            <p className="text-gray-400">商品到貨時您將收到通知</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 通知方式選擇 */}
            <div className="space-y-2">
              <label className="block text-gray-300 mb-2">選擇通知方式</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  className={`px-4 py-2 border rounded-md flex-1 transition-colors ${notifyMethod === 'email' 
                    ? 'border-purple-500 bg-purple-900/30 text-purple-300' 
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setNotifyMethod('email')}
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Email
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 border rounded-md flex-1 transition-colors ${notifyMethod === 'line' 
                    ? 'border-green-500 bg-green-900/30 text-green-300' 
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setNotifyMethod('line')}
                >
                  <i className="fab fa-line mr-2"></i>
                  Line
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 border rounded-md flex-1 transition-colors ${notifyMethod === 'both' 
                    ? 'border-cyan-500 bg-cyan-900/30 text-cyan-300' 
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  onClick={() => setNotifyMethod('both')}
                >
                  <i className="fas fa-bell mr-2"></i>
                  兩者都要
                </button>
              </div>
            </div>

            {/* 電子郵件輸入 */}
            {(notifyMethod === 'email' || notifyMethod === 'both') && (
              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-300">電子郵件地址</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="your.email@example.com"
                />
              </div>
            )}

            {/* Line ID輸入 */}
            {(notifyMethod === 'line' || notifyMethod === 'both') && (
              <div className="space-y-2">
                <label htmlFor="line" className="block text-gray-300">Line ID</label>
                <input
                  type="text"
                  id="line"
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="您的Line ID"
                />
              </div>
            )}

            {/* 錯誤消息 */}
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-700">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                {error}
              </div>
            )}

            {/* 提交按鈕 */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 rounded-md bg-purple-700 text-white font-medium transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-600'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    處理中...
                  </span>
                ) : (
                  <span>設置到貨通知</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default NotifyModal; 