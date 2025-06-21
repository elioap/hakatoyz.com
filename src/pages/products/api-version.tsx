import { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { useRouter } from 'next/router';
import { getAllProducts, getProductsByCategory } from '@/utils/dataService';
import { Product } from '@/data/products';

export default function ProductsAPI() {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const langKey = isEnglish ? 'en' : 'zh';
  
  // 狀態管理
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // 從API獲取商品數據
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let fetchedProducts: Product[];
        if (selectedCategory !== 'all') {
          fetchedProducts = await getProductsByCategory(selectedCategory, langKey);
        } else {
          fetchedProducts = await getAllProducts();
        }
        
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('獲取產品失敗:', err);
        setError(isEnglish ? 'Failed to load products' : '載入產品失敗');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory, langKey]);
  
  // 獲取唯一分類列表
  const categories = useMemo(() => {
    return [...new Set(products.map(product => product.category[langKey]))];
  }, [products, langKey]);
  
  // 篩選和排序商品
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // 價格篩選
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }
    
    // 排序
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name[langKey].localeCompare(b.name[langKey]));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // featured - 保持原順序
        break;
    }
    
    return filtered;
  }, [products, priceRange, sortBy, langKey]);
  
  // 國際化文本
  const t = {
    title: isEnglish ? "Products - Haka Toyz" : "商品 - Haka Toyz",
    pageHeading: isEnglish ? "All Products" : "全部商品",
    pageDescription: isEnglish ? "Discover our complete collection of trendy products from the USA" : "探索我們來自美國的完整潮流商品系列",
    sortBy: isEnglish ? "Sort By" : "排序方式",
    category: isEnglish ? "Category" : "分類",
    priceRange: isEnglish ? "Price Range" : "價格範圍",
    filters: isEnglish ? "Filters" : "篩選",
    allFilters: isEnglish ? "All Filters" : "全部篩選",
    results: isEnglish ? "Results" : "結果",
    allProducts: isEnglish ? "All Products" : "全部商品",
    clearFilters: isEnglish ? "Clear Filters" : "清除篩選",
    loading: isEnglish ? "Loading products..." : "載入產品中...",
    error: isEnglish ? "Error loading products" : "載入產品時發生錯誤",
    // 排序選項
    featured: isEnglish ? "Featured" : "精選",
    priceLowToHigh: isEnglish ? "Price: Low to High" : "價格：低到高",
    priceHighToLow: isEnglish ? "Price: High to Low" : "價格：高到低",
    nameAZ: isEnglish ? "Name: A-Z" : "名稱：A-Z",
    newest: isEnglish ? "Newest" : "最新",
    // 價格範圍
    under100: isEnglish ? "Under ¥100" : "¥100以下",
    range100200: "¥100 - ¥200",
    range200500: "¥200 - ¥500",
    range5001000: "¥500 - ¥1000",
    over1000: isEnglish ? "Over ¥1000" : "¥1000以上"
  };
  
  const sortOptions = [
    { value: 'featured', label: t.featured },
    { value: 'price-low', label: t.priceLowToHigh },
    { value: 'price-high', label: t.priceHighToLow },
    { value: 'name', label: t.nameAZ },
    { value: 'newest', label: t.newest }
  ];
  
  const priceOptions = [
    { value: 'all', label: t.allProducts },
    { value: '0-100', label: t.under100 },
    { value: '100-200', label: t.range100200 },
    { value: '200-500', label: t.range200500 },
    { value: '500-1000', label: t.range5001000 },
    { value: '1000-999999', label: t.over1000 }
  ];

  // 清除所有篩選
  const clearAllFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('featured');
  };

  if (loading) {
    return (
      <Layout title={t.title}>
        <div className="products-page">
          <div className="page-header">
            <div className="container">
              <h1 className="page-title">{t.pageHeading}</h1>
              <p className="page-description">{t.pageDescription}</p>
            </div>
          </div>
          <div className="container">
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>{t.loading}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title={t.title}>
        <div className="products-page">
          <div className="page-header">
            <div className="container">
              <h1 className="page-title">{t.pageHeading}</h1>
              <p className="page-description">{t.pageDescription}</p>
            </div>
          </div>
          <div className="container">
            <div className="error-state">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary">
                {isEnglish ? 'Retry' : '重試'}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t.title}>
      <div className="products-page">
        {/* 頁面標題 */}
        <div className="page-header">
          <div className="container">
            <h1 className="page-title">{t.pageHeading}</h1>
            <p className="page-description">{t.pageDescription}</p>
          </div>
        </div>

        {/* 篩選和排序工具欄 */}
        <div className="products-toolbar">
          <div className="container">
            <div className="toolbar-content">
              <div className="toolbar-left">
                {/* 排序選擇器 */}
                <div className="sort-selector">
                  <label htmlFor="sort-select">{t.sortBy}</label>
                  <select 
                    id="sort-select"
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 分類選擇器 */}
                <div className="category-selector">
                  <label htmlFor="category-select">{t.category}</label>
                  <select 
                    id="category-select"
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                  >
                    <option value="all">{t.allProducts}</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 價格範圍選擇器 */}
                <div className="price-selector">
                  <label htmlFor="price-select">{t.priceRange}</label>
                  <select 
                    id="price-select"
                    value={priceRange} 
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="price-select"
                  >
                    {priceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 移動端篩選按鈕 */}
                <button 
                  className="mobile-filters-btn mobile-only"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="fas fa-filter"></i>
                  {t.allFilters}
                </button>
              </div>

              <div className="toolbar-right">
                <div className="results-count">
                  ({filteredProducts.length}) {t.results}
                </div>
                
                {/* 清除篩選按鈕 */}
                {(selectedCategory !== 'all' || priceRange !== 'all' || sortBy !== 'featured') && (
                  <button 
                    className="clear-filters-btn"
                    onClick={clearAllFilters}
                  >
                    <i className="fas fa-times"></i>
                    {t.clearFilters}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 產品網格 */}
        <div className="products-grid">
          <div className="container">
            {filteredProducts.length > 0 ? (
              <div className="products-container">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    name={product.name[langKey]}
                    price={product.price}
                    image={product.image}
                    category={product.category[langKey]}
                    tag={product.tag}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <p>{isEnglish ? 'No products found' : '沒有找到商品'}</p>
                <button onClick={clearAllFilters} className="btn-primary">
                  {isEnglish ? 'Clear Filters' : '清除篩選'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 