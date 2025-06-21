import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

export default function UserProfilePage() {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const { user, isAuthenticated, loading } = useAuth();
  
  // 假設個人資料的資料結構
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    gender: '',
  });
  
  // 如果未登入，重定向到登入頁面
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    
    // 如果用戶已登入，設置初始資料
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: '0912345678', // 示例數據
        birthday: '1990-01-01', // 示例數據
        gender: 'male', // 示例數據
      });
    }
  }, [loading, isAuthenticated, router, user]);
  
  // 表單處理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 在這裡實現資料儲存邏輯
    alert(isEnglish ? 'Profile updated successfully!' : '個人資料更新成功！');
  };
  
  // 國際化文本
  const t = {
    title: isEnglish ? 'Personal Profile - Haka Toyz' : '個人資料 - Haka Toyz',
    pageHeading: isEnglish ? 'Personal Profile' : '個人資料',
    basicInfo: isEnglish ? 'Basic Information' : '基本資料',
    name: isEnglish ? 'Name' : '姓名',
    email: isEnglish ? 'Email' : '電子郵件',
    phone: isEnglish ? 'Phone' : '電話',
    birthday: isEnglish ? 'Birthday' : '生日',
    gender: isEnglish ? 'Gender' : '性別',
    male: isEnglish ? 'Male' : '男',
    female: isEnglish ? 'Female' : '女',
    other: isEnglish ? 'Other' : '其他',
    save: isEnglish ? 'Save Changes' : '儲存變更',
    cancel: isEnglish ? 'Cancel' : '取消',
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

        {/* 個人資料表單 */}
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-bold neon-text-secondary mb-6 pb-4 border-b border-gray-800">
            {t.basicInfo}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 姓名 */}
              <div className="space-y-2">
                <label className="block text-gray-300">{t.name}</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              
              {/* 電子郵件 */}
              <div className="space-y-2">
                <label className="block text-gray-300">{t.email}</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              
              {/* 電話 */}
              <div className="space-y-2">
                <label className="block text-gray-300">{t.phone}</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              {/* 生日 */}
              <div className="space-y-2">
                <label className="block text-gray-300">{t.birthday}</label>
                <input
                  type="date"
                  name="birthday"
                  value={profile.birthday}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              {/* 性別 */}
              <div className="space-y-2">
                <label className="block text-gray-300">{t.gender}</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="male">{t.male}</option>
                  <option value="female">{t.female}</option>
                  <option value="other">{t.other}</option>
                </select>
              </div>
            </div>
            
            {/* 按鈕 */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => router.push('/user')}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-pink-700 hover:bg-pink-600 rounded-md transition-colors"
              >
                {t.save}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 