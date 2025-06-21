import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export default function UserAddressesPage() {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const { user, isAuthenticated, loading } = useAuth();
  
  // 示例地址數據
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: 'Home',
      phone: '+886912345678',
      address: '100 台北市中正區忠孝東路一段',
      city: '台北市',
      state: '中正區',
      country: 'Taiwan',
      postalCode: '100',
      isDefault: true
    },
    {
      id: 2,
      name: 'Office',
      phone: '+886987654321',
      address: '106 台北市大安區敦化南路二段',
      city: '台北市',
      state: '大安區',
      country: 'Taiwan',
      postalCode: '106',
      isDefault: false
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  
  // 如果未登入，重定向到登入頁面
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);
  
  // 設置默認地址
  const setAsDefault = (id: number) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
  };
  
  // 編輯地址
  const editAddress = (address: Address) => {
    setCurrentAddress(address);
    setShowForm(true);
  };
  
  // 刪除地址
  const deleteAddress = (id: number) => {
    if (confirm(isEnglish ? 'Are you sure you want to delete this address?' : '您確定要刪除此地址嗎？')) {
      setAddresses(addresses.filter(address => address.id !== id));
    }
  };
  
  // 取消表單
  const cancelForm = () => {
    setShowForm(false);
    setCurrentAddress(null);
  };
  
  // 國際化文本
  const t = {
    title: isEnglish ? 'Address Management - Haka Toyz' : '地址管理 - Haka Toyz',
    pageHeading: isEnglish ? 'Address Management' : '地址管理',
    noAddresses: isEnglish ? 'You have no saved addresses.' : '您還沒有保存任何地址。',
    addNewAddress: isEnglish ? 'Add New Address' : '新增地址',
    editAddress: isEnglish ? 'Edit Address' : '編輯地址',
    name: isEnglish ? 'Name' : '名稱',
    phone: isEnglish ? 'Phone' : '電話',
    address: isEnglish ? 'Address' : '地址',
    city: isEnglish ? 'City' : '城市',
    state: isEnglish ? 'State/Province' : '州/省',
    country: isEnglish ? 'Country' : '國家',
    postalCode: isEnglish ? 'Postal Code' : '郵遞區號',
    actions: isEnglish ? 'Actions' : '操作',
    edit: isEnglish ? 'Edit' : '編輯',
    delete: isEnglish ? 'Delete' : '刪除',
    setAsDefault: isEnglish ? 'Set as Default' : '設為預設',
    defaultAddress: isEnglish ? 'Default Address' : '預設地址',
    save: isEnglish ? 'Save' : '儲存',
    cancel: isEnglish ? 'Cancel' : '取消',
    back: isEnglish ? 'Back to Account' : '返回帳戶',
    loading: isEnglish ? 'Loading...' : '載入中...',
    formTitle: isEnglish ? 'Address Information' : '地址資訊',
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

        {/* 地址列表 */}
        <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold neon-text-secondary">
              {showForm ? (currentAddress ? t.editAddress : t.addNewAddress) : 'Addresses'}
            </h2>
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-md transition-colors flex items-center"
              >
                <i className="fas fa-plus mr-2"></i>
                {t.addNewAddress}
              </button>
            )}
          </div>
          
          {/* 表單區域 */}
          {showForm ? (
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 mb-8">
              <h3 className="text-xl mb-4 pb-3 border-b border-gray-700">{t.formTitle}</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 名稱 */}
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.name}</label>
                    <input
                      type="text"
                      value={currentAddress?.name || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  {/* 電話 */}
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.phone}</label>
                    <input
                      type="tel"
                      value={currentAddress?.phone || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  {/* 地址 */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-gray-300">{t.address}</label>
                    <input
                      type="text"
                      value={currentAddress?.address || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  {/* 城市 */}
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.city}</label>
                    <input
                      type="text"
                      value={currentAddress?.city || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  {/* 州/省 */}
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.state}</label>
                    <input
                      type="text"
                      value={currentAddress?.state || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  {/* 國家 */}
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.country}</label>
                    <input
                      type="text"
                      value={currentAddress?.country || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  {/* 郵遞區號 */}
                  <div className="space-y-2">
                    <label className="block text-gray-300">{t.postalCode}</label>
                    <input
                      type="text"
                      value={currentAddress?.postalCode || ''}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
                
                {/* 按鈕 */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-md transition-colors"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">{t.noAddresses}</p>
              <button 
                onClick={() => setShowForm(true)}
                className="inline-block px-6 py-2 bg-cyan-700 hover:bg-cyan-600 text-white rounded-md transition-colors"
              >
                {t.addNewAddress}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className={`p-5 rounded-lg border ${address.isDefault ? 'bg-cyan-900/20 border-cyan-700' : 'bg-gray-800/50 border-gray-700'} relative`}
                >
                  {address.isDefault && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-cyan-800/70 text-cyan-300 text-xs rounded-full border border-cyan-600">
                      {t.defaultAddress}
                    </span>
                  )}
                  
                  <div className="mb-4 pb-3 border-b border-gray-700">
                    <h3 className="font-medium text-lg">{address.name}</h3>
                    <p className="text-gray-400">{address.phone}</p>
                  </div>
                  
                  <div className="space-y-1 text-gray-300 mb-6">
                    <p>{address.address}</p>
                    <p>{`${address.city}, ${address.state} ${address.postalCode}`}</p>
                    <p>{address.country}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => setAsDefault(address.id)}
                        className="px-3 py-1 bg-cyan-800/50 text-cyan-300 border border-cyan-700 rounded-md hover:bg-cyan-700/50 transition-colors text-sm"
                      >
                        {t.setAsDefault}
                      </button>
                    )}
                    <button
                      onClick={() => editAddress(address)}
                      className="px-3 py-1 bg-blue-800/50 text-blue-300 border border-blue-700 rounded-md hover:bg-blue-700/50 transition-colors text-sm"
                    >
                      {t.edit}
                    </button>
                    <button
                      onClick={() => deleteAddress(address.id)}
                      className="px-3 py-1 bg-red-800/50 text-red-300 border border-red-700 rounded-md hover:bg-red-700/50 transition-colors text-sm"
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 