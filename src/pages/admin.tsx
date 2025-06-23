import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Product } from '@/data/products';

interface NewProduct {
  name: { zh: string; en: string };
  price: number;
  originalPrice?: number;
  category: { zh: string; en: string };
  description: { zh: string; en: string };
  tag?: 'hot' | 'new' | 'limited' | null;
  inStock: boolean;
}

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: { zh: '', en: '' },
    price: 0,
    category: { zh: '', en: '' },
    description: { zh: '', en: '' },
    tag: null,
    inStock: true
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 驗證管理員身份
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 加載現有產品
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/verify-admin');
      const result = await response.json();
      
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin-login');
      }
    } catch (error) {
      router.push('/admin-login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('獲取產品失敗:', error);
    }
  };

  // 處理圖片選擇和預覽
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
    
    // 創建預覽URL
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

  // 提交新產品
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 處理圖片命名
      let imageUrls: string[] = [];
      let fileInstructions: string[] = [];
      
      if (selectedImages.length > 0) {
        // 為每個圖片生成建議的文件名
        for (let i = 0; i < selectedImages.length; i++) {
          const file = selectedImages[i];
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              filename: `${i + 1}.${file.name.split('.').pop()}`,
              folder: 'products'
            })
          });
          
          const result = await response.json();
          if (result.success) {
            imageUrls.push(result.url);
            fileInstructions.push(result.instructions);
          }
        }
      } else {
        imageUrls = ['/images/placeholder.jpg'];
      }

      // 創建新產品
      const productData: Omit<Product, 'id'> = {
        ...newProduct,
        image: imageUrls[0],
        images: imageUrls,
        specs: [], // 可以後續添加
        features: [], // 可以後續添加
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 發送到API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();
      
      if (result.success) {
        // 更新本地狀態
        setProducts(prev => [...prev, result.data]);
        
        // 保存到localStorage (臨時解決方案)
        const existingProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
        localStorage.setItem('customProducts', JSON.stringify([...existingProducts, result.data]));

        // 重置表單
        setNewProduct({
          name: { zh: '', en: '' },
          price: 0,
          category: { zh: '', en: '' },
          description: { zh: '', en: '' },
          tag: null,
          inStock: true
        });
        setSelectedImages([]);
        setImagePreviewUrls([]);
        setShowAddForm(false);
        
        // 顯示成功消息和文件指示
        let message = '產品添加成功！\n\n';
        if (fileInstructions.length > 0) {
          message += '圖片文件說明：\n' + fileInstructions.join('\n');
        }
        alert(message);
      } else {
        alert('添加失敗: ' + result.message);
      }
    } catch (error) {
      console.error('提交產品失敗:', error);
      alert('提交失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // 清除cookie
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin-login');
  };

  // 載入狀態
  if (isLoading) {
    return (
      <Layout
        title="載入中 - Haka Toyz"
        description="正在驗證身份..."
      >
        <div className="loading-page">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h2>🔐 驗證管理員身份中...</h2>
            <p>請稍候，正在檢查您的權限</p>
          </div>
        </div>
        <style jsx>{`
          .loading-page {
            min-height: 100vh;
            background: #0a0a0a;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loading-content {
            text-align: center;
            color: #fff;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 255, 255, 0.3);
            border-top: 3px solid #00ffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 2rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loading-content h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          }
          .loading-content p {
            color: rgba(255, 255, 255, 0.7);
          }
        `}</style>
      </Layout>
    );
  }

  // 未認證則不顯示內容
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout
      title="產品管理 - Haka Toyz"
      description="管理產品和上傳圖片"
    >
      <div className="admin-page">
        <div className="container">
          <div className="admin-header">
            <div className="admin-title">
              <h1>產品管理系統</h1>
              <p>👨‍💼 管理員面板</p>
            </div>
            <div className="admin-actions">
              <button 
                className="btn-primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? '取消添加' : '➕ 添加新產品'}
              </button>
              <button 
                className="btn-logout"
                onClick={handleLogout}
                title="登出"
              >
                🚪 登出
              </button>
            </div>
          </div>

          {/* 添加產品表單 */}
          {showAddForm && (
            <div className="add-product-form">
              <h2>添加新產品</h2>
              <form onSubmit={handleSubmitProduct}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>產品名稱 (中文) *</label>
                    <input
                      type="text"
                      value={newProduct.name.zh}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        name: { ...prev.name, zh: e.target.value }
                      }))}
                      required
                      placeholder="例：智能手機"
                    />
                  </div>

                  <div className="form-group">
                    <label>產品名稱 (英文) *</label>
                    <input
                      type="text"
                      value={newProduct.name.en}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        name: { ...prev.name, en: e.target.value }
                      }))}
                      required
                      placeholder="例：Smartphone"
                    />
                  </div>

                  <div className="form-group">
                    <label>價格 ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        price: parseFloat(e.target.value) || 0
                      }))}
                      required
                      placeholder="999.99"
                    />
                  </div>

                  <div className="form-group">
                    <label>原價 ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.originalPrice || ''}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        originalPrice: e.target.value ? parseFloat(e.target.value) : undefined
                      }))}
                      placeholder="1299.99"
                    />
                  </div>

                  <div className="form-group">
                    <label>分類 (中文) *</label>
                    <input
                      type="text"
                      value={newProduct.category.zh}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        category: { ...prev.category, zh: e.target.value }
                      }))}
                      required
                      placeholder="例：電子產品"
                    />
                  </div>

                  <div className="form-group">
                    <label>分類 (英文) *</label>
                    <input
                      type="text"
                      value={newProduct.category.en}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        category: { ...prev.category, en: e.target.value }
                      }))}
                      required
                      placeholder="例：Electronics"
                    />
                  </div>

                  <div className="form-group">
                    <label>標籤</label>
                    <select
                      value={newProduct.tag || ''}
                      onChange={(e) => setNewProduct(prev => ({
                        ...prev,
                        tag: (e.target.value as 'hot' | 'new' | 'limited') || null
                      }))}
                    >
                      <option value="">無標籤</option>
                      <option value="hot">🔥 熱賣</option>
                      <option value="new">✨ 新品</option>
                      <option value="limited">⭐ 限量</option>
                    </select>
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newProduct.inStock}
                        onChange={(e) => setNewProduct(prev => ({
                          ...prev,
                          inStock: e.target.checked
                        }))}
                      />
                      ✅ 有庫存
                    </label>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>產品描述 (中文) *</label>
                  <textarea
                    value={newProduct.description.zh}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      description: { ...prev.description, zh: e.target.value }
                    }))}
                    rows={4}
                    required
                    placeholder="詳細描述產品特色、功能和優點..."
                  />
                </div>

                <div className="form-group full-width">
                  <label>產品描述 (英文) *</label>
                  <textarea
                    value={newProduct.description.en}
                    onChange={(e) => setNewProduct(prev => ({
                      ...prev,
                      description: { ...prev.description, en: e.target.value }
                    }))}
                    rows={4}
                    required
                    placeholder="Detailed description of product features, functions and benefits..."
                  />
                </div>

                <div className="form-group full-width">
                  <label>產品圖片</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="file-input"
                  />
                  <p className="help-text">
                    💡 提示：選擇圖片後，需要手動將圖片放置到 /public/images/ 目錄下，
                    並按照顯示的文件名重命名。
                  </p>
                  
                  {imagePreviewUrls.length > 0 && (
                    <div className="image-previews">
                      <h4>圖片預覽：</h4>
                      {imagePreviewUrls.map((url, index) => {
                        const newId = Math.max(...products.map(p => p.id), 0) + 1;
                        const fileName = `product${newId}_${index + 1}.jpg`;
                        return (
                          <div key={index} className="image-preview-item">
                            <img src={url} alt={`預覽 ${index + 1}`} />
                            <p>文件名：{fileName}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? '正在添加...' : '✅ 添加產品'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    ❌ 取消
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 產品列表 */}
          <div className="products-list">
            <h2>現有產品 ({products.length})</h2>
            <div className="products-admin-grid">
              {products.map((product) => (
                <div key={product.id} className="product-admin-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name.zh} />
                    {product.tag && (
                      <span className={`product-tag ${product.tag}`}>
                        {product.tag === 'hot' ? '🔥' : product.tag === 'new' ? '✨' : '⭐'}
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name.zh}</h3>
                    <p className="product-name-en">{product.name.en}</p>
                    <div className="price-info">
                      <span className="price">${product.price}</span>
                      {product.originalPrice && (
                        <span className="original-price">${product.originalPrice}</span>
                      )}
                    </div>
                    <p className="category">{product.category.zh} / {product.category.en}</p>
                    <p className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                      {product.inStock ? '✅ 有庫存' : '❌ 缺貨'}
                    </p>
                    <p className="product-id">ID: {product.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page {
          padding: 2rem 0;
          background: #0a0a0a;
          min-height: 100vh;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(0, 255, 255, 0.3);
        }

        .admin-title h1 {
          color: #fff;
          font-size: 2.5rem;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          margin-bottom: 0.5rem;
        }

        .admin-title p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.1rem;
          margin: 0;
        }

        .admin-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .btn-logout {
          background: linear-gradient(45deg, #ff4757, #ff6b7a);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);
        }

        .btn-logout:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 71, 87, 0.4);
          background: linear-gradient(45deg, #ff3742, #ff5a6d);
        }

        .add-product-form {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 3rem;
          backdrop-filter: blur(10px);
        }

        .add-product-form h2 {
          color: #fff;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: block;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 0.5rem;
          color: #fff;
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: rgba(0, 255, 255, 0.6);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
        }

        .checkbox-group {
          display: flex;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .checkbox-label input {
          width: auto;
          margin-right: 0.5rem;
        }

        .file-input {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .help-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.5rem;
          line-height: 1.4;
        }

        .image-previews {
          margin-top: 1rem;
        }

        .image-previews h4 {
          color: #fff;
          margin-bottom: 1rem;
        }

        .image-preview-item {
          display: inline-block;
          margin: 0.5rem;
          text-align: center;
        }

        .image-preview-item img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 0.5rem;
          border: 2px solid rgba(0, 255, 255, 0.3);
        }

        .image-preview-item p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .products-list h2 {
          color: #fff;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 10px rgba(255, 0, 128, 0.5);
        }

        .products-admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .product-admin-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 0, 128, 0.3);
          border-radius: 1rem;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .product-admin-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 0, 128, 0.2);
          border-color: rgba(255, 0, 128, 0.6);
        }

        .product-admin-card .product-image {
          position: relative;
          margin-bottom: 1rem;
        }

        .product-admin-card .product-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 0.5rem;
        }

        .product-tag {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .product-tag.hot {
          background: rgba(255, 69, 0, 0.8);
          color: white;
        }

        .product-tag.new {
          background: rgba(50, 205, 50, 0.8);
          color: white;
        }

        .product-tag.limited {
          background: rgba(255, 215, 0, 0.8);
          color: black;
        }

        .product-info h3 {
          color: #fff;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .product-name-en {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .price-info {
          margin-bottom: 0.5rem;
        }

        .price {
          color: #00ff88;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .original-price {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: line-through;
          margin-left: 0.5rem;
        }

        .category {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .stock-status {
          font-size: 0.9rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .stock-status.in-stock {
          color: #00ff88;
        }

        .stock-status.out-of-stock {
          color: #ff4444;
        }

        .product-id {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .admin-title h1 {
            font-size: 2rem;
          }

          .admin-actions {
            flex-direction: column;
            width: 100%;
          }

          .admin-actions button {
            width: 100%;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .products-admin-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
};

export default AdminPage; 