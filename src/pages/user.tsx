import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

export default function UserPage() {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const { user, isAuthenticated, loading, logout } = useAuth();
  
  // 如果未登录，重定向到登录页面
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);
  
  // 处理登出
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  // 国际化文本
  const t = {
    title: isEnglish ? 'My Account - Haka Toyz' : '我的帳戶 - Haka Toyz',
    pageHeading: isEnglish ? 'My Account' : '我的帳戶',
    userCenter: isEnglish ? 'User Center' : '用戶中心',
    profile: isEnglish ? 'Personal Profile' : '個人資料',
    orders: isEnglish ? 'My Orders' : '我的訂單',
    wishlist: isEnglish ? 'My Wishlist' : '我的收藏',
    addresses: isEnglish ? 'Address Management' : '地址管理',
    settings: isEnglish ? 'Account Settings' : '帳戶設置',
    logout: isEnglish ? 'Logout' : '登出',
    welcome: isEnglish ? 'Welcome back' : '歡迎回來',
    memberSince: isEnglish ? 'Member since' : '註冊時間',
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
  
  // 如果不通过useEffect重定向，这里也可以直接检查
  if (!isAuthenticated) {
    return null; // 会通过useEffect重定向，这里不需要渲染任何内容
  }

  return (
    <Layout title={t.title}>
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold neon-text-primary">{t.pageHeading}</h1>
        <p className="text-gray-400 mt-2">{t.userCenter}</p>
      </div>

      {/* 用户中心内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900/50 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 mr-4">
                  <img 
                    src="/images/avatar-placeholder.jpg" 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold neon-text-secondary">{user?.name}</h3>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                  <span className="inline-block mt-1 text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full border border-purple-500">
                    {user?.level || (isEnglish ? 'Regular Member' : '一般會員')}
                  </span>
                </div>
              </div>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/user/profile" 
                    className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-800 neon-text-primary transition-colors"
                  >
                    <i className="fas fa-user mr-3"></i>
                    {t.profile}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/user/orders" 
                    className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-800 text-gray-400 hover:neon-text-primary transition-colors"
                  >
                    <i className="fas fa-shopping-bag mr-3"></i>
                    {t.orders}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/user/wishlist" 
                    className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-800 text-gray-400 hover:neon-text-primary transition-colors"
                  >
                    <i className="fas fa-heart mr-3"></i>
                    {t.wishlist}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/user/addresses" 
                    className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-800 text-gray-400 hover:neon-text-primary transition-colors"
                  >
                    <i className="fas fa-map-marker-alt mr-3"></i>
                    {t.addresses}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/user/settings" 
                    className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-800 text-gray-400 hover:neon-text-primary transition-colors"
                  >
                    <i className="fas fa-cog mr-3"></i>
                    {t.settings}
                  </Link>
                </li>
                <li className="pt-2 mt-2 border-t border-gray-800">
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center py-2 px-4 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt mr-3"></i>
                    {t.logout}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* 主内容区 */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
            <div className="mb-6 pb-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold neon-text-secondary mb-2">{t.profile}</h2>
              <p className="text-gray-400">
                {t.welcome}, <span className="neon-text-primary">{user?.name}</span>!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium mb-4">{isEnglish ? 'Account Info' : '帳戶信息'}</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="text-gray-400 w-1/3">{isEnglish ? 'Name' : '姓名'}:</span>
                    <span>{user?.name}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-400 w-1/3">{isEnglish ? 'Email' : '電子郵件'}:</span>
                    <span>{user?.email}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-400 w-1/3">{isEnglish ? 'Member ID' : '會員ID'}:</span>
                    <span>{user?.id}</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-400 w-1/3">{isEnglish ? 'Status' : '狀態'}:</span>
                    <span className="text-green-400">{isEnglish ? 'Active' : '活躍'}</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800/50 p-5 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium mb-4">{isEnglish ? 'Summary' : '摘要'}</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="text-gray-400 w-1/2">{isEnglish ? 'Orders' : '訂單'}:</span>
                    <span>0</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-400 w-1/2">{isEnglish ? 'Wishlist Items' : '收藏商品'}:</span>
                    <span>0</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-400 w-1/2">{isEnglish ? 'Reviews' : '評論'}:</span>
                    <span>0</span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-400 w-1/2">{t.memberSince}:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
