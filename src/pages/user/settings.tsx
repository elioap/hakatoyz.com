import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

export default function UserSettingsPage() {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const { user, isAuthenticated, loading } = useAuth();
  
  // 狀態設定
  const [activeTab, setActiveTab] = useState('account');
  const [notificationSettings, setNotificationSettings] = useState({
    emailOrder: true,
    emailPromotion: false,
    emailNewsletter: true,
    smsOrder: false,
    smsPromotion: false,
    pushOrder: true,
  });
  
  // 如果未登入，重定向到登入頁面
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);
  
  // 切換通知設定
  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };
  
  // 密碼表單處理
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 簡單的密碼驗證
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert(isEnglish ? 'New passwords do not match!' : '新密碼不一致！');
      return;
    }
    
    // TODO: 實際的密碼更新邏輯
    alert(isEnglish ? 'Password updated successfully!' : '密碼更新成功！');
    
    // 重置表單
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  // 國際化文本
  const t = {
    title: isEnglish ? 'Account Settings - Haka Toyz' : '帳號設定 - Haka Toyz',
    pageHeading: isEnglish ? 'Account Settings' : '帳號設定',
    accountTab: isEnglish ? 'Account' : '帳號',
    securityTab: isEnglish ? 'Security' : '安全性',
    notificationsTab: isEnglish ? 'Notifications' : '通知',
    privacyTab: isEnglish ? 'Privacy' : '隱私',
    
    // 帳號頁面
    accountSettings: isEnglish ? 'Account Settings' : '帳號設定',
    language: isEnglish ? 'Language' : '語言',
    english: isEnglish ? 'English' : '英文',
    chinese: isEnglish ? 'Chinese' : '中文',
    timezone: isEnglish ? 'Timezone' : '時區',
    currency: isEnglish ? 'Currency' : '貨幣',
    usd: isEnglish ? 'USD ($)' : '美元 ($)',
    twd: isEnglish ? 'TWD (NT$)' : '台幣 (NT$)',
    saveChanges: isEnglish ? 'Save Changes' : '儲存變更',
    deactivate: isEnglish ? 'Deactivate Account' : '停用帳號',
    deactivateText: isEnglish ? 'Deactivating your account will remove all your personal information. This action cannot be undone.' : '停用帳號將會移除您所有的個人資訊。此操作無法復原。',
    
    // 安全頁面
    securitySettings: isEnglish ? 'Security Settings' : '安全設定',
    changePassword: isEnglish ? 'Change Password' : '變更密碼',
    currentPassword: isEnglish ? 'Current Password' : '目前密碼',
    newPassword: isEnglish ? 'New Password' : '新密碼',
    confirmPassword: isEnglish ? 'Confirm New Password' : '確認新密碼',
    updatePassword: isEnglish ? 'Update Password' : '更新密碼',
    twoFactor: isEnglish ? 'Two-Factor Authentication' : '雙因素驗證',
    twoFactorText: isEnglish ? 'Add an additional layer of security to your account.' : '為您的帳號添加額外的安全層級。',
    enable: isEnglish ? 'Enable' : '啟用',
    disable: isEnglish ? 'Disable' : '停用',
    
    // 通知頁面
    notificationSettings: isEnglish ? 'Notification Settings' : '通知設定',
    emailNotifications: isEnglish ? 'Email Notifications' : '電子郵件通知',
    orderUpdates: isEnglish ? 'Order Updates' : '訂單更新',
    promotions: isEnglish ? 'Promotions & Discounts' : '促銷與折扣',
    newsletter: isEnglish ? 'Newsletter' : '電子報',
    smsNotifications: isEnglish ? 'SMS Notifications' : '簡訊通知',
    pushNotifications: isEnglish ? 'Push Notifications' : '推送通知',
    
    // 隱私頁面
    privacySettings: isEnglish ? 'Privacy Settings' : '隱私設定',
    dataSharing: isEnglish ? 'Data Sharing' : '資料共享',
    dataSharingText: isEnglish ? 'Allow us to share your non-personal data to improve our services.' : '允許我們分享您的非個人資料以改善我們的服務。',
    cookiePreferences: isEnglish ? 'Cookie Preferences' : 'Cookie偏好設定',
    cookiePreferencesText: isEnglish ? 'Manage how we use cookies to enhance your browsing experience.' : '管理我們如何使用cookies來提升您的瀏覽體驗。',
    manageSettings: isEnglish ? 'Manage Settings' : '管理設定',
    downloadData: isEnglish ? 'Download Your Data' : '下載您的資料',
    downloadDataText: isEnglish ? 'Get a copy of all the data we have stored about you.' : '獲取我們存儲的所有關於您的資料副本。',
    download: isEnglish ? 'Download' : '下載',
    
    back: isEnglish ? 'Back to Account' : '返回帳戶',
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

        {/* 設定選項卡和內容 */}
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
          {/* 選項卡 */}
          <div className="border-b border-gray-800 mb-6">
            <nav className="flex flex-wrap -mb-px">
              <button 
                onClick={() => setActiveTab('account')} 
                className={`mr-8 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'account' 
                    ? 'border-cyan-500 neon-text-secondary' 
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                <i className="fas fa-user mr-2"></i>
                {t.accountTab}
              </button>
              <button 
                onClick={() => setActiveTab('security')} 
                className={`mr-8 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'security' 
                    ? 'border-cyan-500 neon-text-secondary' 
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                <i className="fas fa-lock mr-2"></i>
                {t.securityTab}
              </button>
              <button 
                onClick={() => setActiveTab('notifications')} 
                className={`mr-8 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications' 
                    ? 'border-cyan-500 neon-text-secondary' 
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                <i className="fas fa-bell mr-2"></i>
                {t.notificationsTab}
              </button>
              <button 
                onClick={() => setActiveTab('privacy')} 
                className={`mr-8 py-3 border-b-2 font-medium text-sm ${
                  activeTab === 'privacy' 
                    ? 'border-cyan-500 neon-text-secondary' 
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                <i className="fas fa-shield-alt mr-2"></i>
                {t.privacyTab}
              </button>
            </nav>
          </div>
          
          {/* 帳號設定內容 */}
          {activeTab === 'account' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">{t.accountSettings}</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 語言設定 */}
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.language}</label>
                    <select 
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      defaultValue={isEnglish ? 'en' : 'zh'}
                    >
                      <option value="en">{t.english}</option>
                      <option value="zh">{t.chinese}</option>
                    </select>
                  </div>
                  
                  {/* 時區設定 */}
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.timezone}</label>
                    <select 
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      defaultValue="Asia/Taipei"
                    >
                      <option value="Asia/Taipei">Asia/Taipei (GMT+8)</option>
                      <option value="America/Los_Angeles">America/Los Angeles (GMT-8)</option>
                      <option value="America/New_York">America/New York (GMT-5)</option>
                      <option value="Europe/London">Europe/London (GMT+0)</option>
                    </select>
                  </div>
                  
                  {/* 貨幣設定 */}
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.currency}</label>
                    <select 
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      defaultValue="TWD"
                    >
                      <option value="USD">{t.usd}</option>
                      <option value="TWD">{t.twd}</option>
                    </select>
                  </div>
                </div>
                
                {/* 儲存按鈕 */}
                <div className="flex justify-end pt-4 border-t border-gray-800">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-md transition-colors"
                  >
                    {t.saveChanges}
                  </button>
                </div>
              </form>
              
              {/* 停用帳號 */}
              <div className="mt-12 pt-6 border-t border-gray-800">
                <h3 className="text-lg font-medium text-red-400">{t.deactivate}</h3>
                <p className="mt-2 text-gray-400">{t.deactivateText}</p>
                <button
                  className="mt-4 px-6 py-2 bg-red-900/50 text-red-300 border border-red-700 rounded-md hover:bg-red-800/50 transition-colors"
                >
                  {t.deactivate}
                </button>
              </div>
            </div>
          )}
          
          {/* 安全設定內容 */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">{t.securitySettings}</h2>
              
              {/* 密碼變更 */}
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-8">
                <h3 className="text-lg font-medium mb-4">{t.changePassword}</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.currentPassword}</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.newPassword}</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                      minLength={8}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.confirmPassword}</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-md transition-colors"
                    >
                      {t.updatePassword}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* 雙因素驗證 */}
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{t.twoFactor}</h3>
                    <p className="text-gray-400 mt-1">{t.twoFactorText}</p>
                  </div>
                  <button
                    className="px-5 py-2 bg-green-800/50 text-green-300 border border-green-700 rounded-md hover:bg-green-700/50 transition-colors"
                  >
                    {t.enable}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 通知設定內容 */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">{t.notificationSettings}</h2>
              
              {/* 電子郵件通知 */}
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-8">
                <h3 className="text-lg font-medium mb-4">{t.emailNotifications}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t.orderUpdates}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.emailOrder}
                        onChange={() => toggleNotification('emailOrder')} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t.promotions}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.emailPromotion}
                        onChange={() => toggleNotification('emailPromotion')} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t.newsletter}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.emailNewsletter}
                        onChange={() => toggleNotification('emailNewsletter')} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* 簡訊通知 */}
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-8">
                <h3 className="text-lg font-medium mb-4">{t.smsNotifications}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t.orderUpdates}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.smsOrder}
                        onChange={() => toggleNotification('smsOrder')} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t.promotions}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.smsPromotion}
                        onChange={() => toggleNotification('smsPromotion')} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* 推送通知 */}
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium mb-4">{t.pushNotifications}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t.orderUpdates}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.pushOrder}
                        onChange={() => toggleNotification('pushOrder')} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 隱私設定內容 */}
          {activeTab === 'privacy' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">{t.privacySettings}</h2>
              
              {/* 資料共享 */}
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{t.dataSharing}</h3>
                    <p className="text-gray-400 mt-1">{t.dataSharingText}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
              
              {/* Cookie偏好 */}
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{t.cookiePreferences}</h3>
                    <p className="text-gray-400 mt-1">{t.cookiePreferencesText}</p>
                  </div>
                  <button
                    className="px-4 py-2 bg-cyan-800/50 text-cyan-300 border border-cyan-700 rounded-md hover:bg-cyan-700/50 transition-colors"
                  >
                    {t.manageSettings}
                  </button>
                </div>
              </div>
              
              {/* 下載資料 */}
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{t.downloadData}</h3>
                    <p className="text-gray-400 mt-1">{t.downloadDataText}</p>
                  </div>
                  <button
                    className="px-4 py-2 bg-purple-800/50 text-purple-300 border border-purple-700 rounded-md hover:bg-purple-700/50 transition-colors"
                  >
                    {t.download}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 