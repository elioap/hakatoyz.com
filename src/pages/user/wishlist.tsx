import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useWishlist, WishlistItem } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import NotifyModal from '@/components/NotifyModal';

export default function UserWishlistPage() {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const { user, isAuthenticated, loading } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  
  // 模態窗口狀態
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<WishlistItem | null>(null);
  
  // 如果未登入，重定向到登入頁面
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);
  
  // 處理添加到購物車
  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      category: item.category
    });
    
    // 顯示成功消息
    const message = document.createElement('div');
    message.className = 'fixed bottom-5 right-5 bg-green-900/80 border border-green-600 text-green-300 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in-out';
    message.innerHTML = `
      <i class="fas fa-check-circle mr-2"></i>
      ${isEnglish ? 'Added to cart successfully!' : '成功加入購物車！'}
    `;
    document.body.appendChild(message);
    
    // 3秒後移除消息
    setTimeout(() => {
      message.classList.add('animate-fade-out');
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 3000);
  };
  
  // 處理到貨通知
  const handleNotifyMe = (item: WishlistItem) => {
    setSelectedProduct(item);
    setNotifyModalOpen(true);
  };
  
  // 國際化文本
  const t = {
    title: isEnglish ? 'My Wishlist - Haka Toyz' : '我的收藏 - Haka Toyz',
    pageHeading: isEnglish ? 'My Wishlist' : '我的收藏',
    noItems: isEnglish ? 'Your wishlist is empty.' : '您的收藏清單是空的。',
    inStock: isEnglish ? 'In Stock' : '有庫存',
    outOfStock: isEnglish ? 'Out of Stock' : '無庫存',
    addToCart: isEnglish ? 'Add to Cart' : '加入購物車',
    viewCart: isEnglish ? 'View Cart' : '查看購物車',
    notifyMe: isEnglish ? 'Notify Me' : '到貨通知',
    remove: isEnglish ? 'Remove' : '移除',
    product: isEnglish ? 'Product' : '商品',
    price: isEnglish ? 'Price' : '價格',
    status: isEnglish ? 'Status' : '狀態',
    actions: isEnglish ? 'Actions' : '操作',
    category: isEnglish ? 'Category' : '分類',
    back: isEnglish ? 'Back to Account' : '返回帳戶',
    exploreCatalog: isEnglish ? 'Explore Catalog' : '瀏覽商品',
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

        {/* 願望清單 */}
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">{t.noItems}</p>
              <Link 
                href="/products" 
                className="inline-block px-6 py-2 bg-pink-700 hover:bg-pink-600 rounded-md transition-colors"
              >
                {t.exploreCatalog}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">{t.product}</th>
                    <th className="px-4 py-3 text-left">{t.category}</th>
                    <th className="px-4 py-3 text-right">{t.price}</th>
                    <th className="px-4 py-3 text-center">{t.status}</th>
                    <th className="px-4 py-3 text-right">{t.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {wishlistItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-800 rounded overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                              width={64}
                              height={64}
                            />
                          </div>
                          <div>
                            <Link 
                              href={`/product/${item.id}`} 
                              className="font-medium neon-text-secondary hover:underline"
                            >
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-300">
                        {item.category}
                      </td>
                      <td className="px-4 py-4 text-right font-medium">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {item.inStock ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs bg-green-900/50 text-green-300 border border-green-600">
                            {t.inStock}
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs bg-red-900/50 text-red-300 border border-red-600">
                            {t.outOfStock}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          {item.inStock ? (
                            isInCart(item.id) ? (
                              <Link
                                href="/cart"
                                className="px-3 py-1 bg-cyan-800/50 text-cyan-300 border border-cyan-700 rounded-md hover:bg-cyan-700/50 transition-colors text-sm"
                              >
                                {t.viewCart}
                              </Link>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="px-3 py-1 bg-pink-800/50 text-pink-300 border border-pink-700 rounded-md hover:bg-pink-700/50 transition-colors text-sm"
                              >
                                {t.addToCart}
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => handleNotifyMe(item)}
                              className="px-3 py-1 bg-purple-800/50 text-purple-300 border border-purple-700 rounded-md hover:bg-purple-700/50 transition-colors text-sm"
                            >
                              {t.notifyMe}
                            </button>
                          )}
                          <button 
                            onClick={() => removeFromWishlist(item.id)}
                            className="px-3 py-1 bg-gray-700/50 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-600/50 transition-colors text-sm"
                          >
                            {t.remove}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* 到貨通知模態窗口 */}
      {selectedProduct && (
        <NotifyModal 
          product={selectedProduct} 
          isOpen={notifyModalOpen} 
          onClose={() => {
            setNotifyModalOpen(false);
            setSelectedProduct(null);
          }} 
        />
      )}
      
      {/* 添加CSS動畫 */}
      <style jsx global>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        .animate-fade-in-out {
          animation: fadeInOut 3.3s ease-in-out;
        }
        
        .animate-fade-out {
          animation: fadeOut 0.3s ease-out forwards;
        }
      `}</style>
    </Layout>
  );
} 