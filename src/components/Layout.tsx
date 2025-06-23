import React, { ReactNode, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';
import { useCart } from '@/contexts/CartContext';
import SearchBar from './SearchBar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Haka Toyz - 美國代購潮物', 
  description = '您的優質美國代購服務' 
}) => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems, isLoaded, cartItems } = useCart();
  
  // 客戶端狀態儲存購物車商品數量
  const [cartCount, setCartCount] = useState<number>(0);
  
  // 在客戶端渲染後更新購物車數量
  useEffect(() => {
    if (isLoaded) {
      setCartCount(getTotalItems());
    }
  }, [getTotalItems, isLoaded]);
  
  // 監聽購物車變化
  useEffect(() => {
    if (isLoaded) {
      setCartCount(getTotalItems());
    }
  }, [cartItems, getTotalItems, isLoaded]);
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // 判斷當前語言
  const isEnglish = locale === 'en';
  
  // 在頁面載入時應用適合的語言類
  useEffect(() => {
    // 應用語言類
    if (locale === 'zh') {
      document.body.classList.add('zh-mode');
    } else {
      document.body.classList.remove('zh-mode');
    }
    
    // 同步 localStorage 和 cookie
    if (locale) {
      localStorage.setItem('language', locale);
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    }
  }, [locale]);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 當移動菜單打開時禁止背景滾動
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);
  
  // 切換語言
  const switchLanguage = () => {
    const newLocale = isEnglish ? 'zh' : 'en';
    
    // 同时更新 localStorage 和 cookie
    localStorage.setItem('language', newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    // 应用页面语言类
    if (newLocale === 'zh') {
      document.body.classList.add('zh-mode');
    } else {
      document.body.classList.remove('zh-mode');
    }
    
    // 使用 Next.js 路由切换语言
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };
  
  // 登出處理
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    router.push('/login');
  };
  
  // 根據當前語言決定顯示內容
  const t = {
    home: isEnglish ? 'Home' : '首頁',
    products: isEnglish ? 'Products' : '產品',
    categories: isEnglish ? 'Categories' : '分類',
    about: isEnglish ? 'About' : '關於我們',
    contactUs: isEnglish ? 'Contact Us' : '聯絡我們',
    searchPlaceholder: isEnglish ? 'Search products...' : '搜尋商品...',
    myAccount: isEnglish ? 'My Account' : '我的帳戶',
    memberLogin: isEnglish ? 'Member Login' : '會員登入',
    trendyProducts: isEnglish ? 'Trendy Products from USA' : '美國代購潮物',
    quickLinks: isEnglish ? 'Quick Links' : '快速鏈接',
    featuredProducts: isEnglish ? 'Featured Products' : '熱門商品',
    helpCenter: isEnglish ? 'Help Center' : '幫助中心',
    faq: isEnglish ? 'FAQ' : '常見問題',
    shippingInfo: isEnglish ? 'Shipping Info' : '運送資訊',
    returns: isEnglish ? 'Returns' : '退換貨',
    orderStatus: isEnglish ? 'Order Status' : '訂單狀態',
    paymentMethods: isEnglish ? 'Payment Methods' : '付款方式',
    contactUsFooter: isEnglish ? 'Contact Us' : '聯絡方式',
    copyright: isEnglish ? '© 2023 Haka Toyz. All Rights Reserved.' : '© 2023 Haka Toyz. 保留所有權利。',
    logout: isEnglish ? 'Logout' : '登出',
    closeSearch: isEnglish ? 'Close' : '關閉',
    search: isEnglish ? 'Search' : '搜索',
  };
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content={description} />
        <meta name="theme-color" content="#121212" />
      </Head>
      
      {/* 導航欄 */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="container flex-between">
          <div className="logo">
            <Link href="/">
              <h1 className="neon-pulse">HAKA TOYZ</h1>
            </Link>
          </div>
          
          {/* 桌面導航鏈接 */}
          <div className="nav-links desktop-nav desktop-only">
            <Link href="/" className={pathname === '/' ? 'active' : ''}>{t.home}</Link>
            <Link href="/products" className={pathname === '/products' ? 'active' : ''}>{t.products}</Link>
            <Link href="/categories" className={pathname === '/categories' ? 'active' : ''}>{t.categories}</Link>
            <Link href="/about" className={pathname === '/about' ? 'active' : ''}>{t.about}</Link>
            <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>{t.contactUs}</Link>
          </div>
          
          <div className="nav-actions">
            <SearchBar 
              placeholder={t.searchPlaceholder}
              onSearch={(query) => {
                console.log('Search query:', query);
                // TODO: 實現搜索功能
                router.push(`/products?search=${encodeURIComponent(query)}`);
              }}
            />
            
            {isAuthenticated ? (
              <>
                <Link 
                  href="/user" 
                  className="user-icon" 
                  data-tooltip={t.myAccount} 
                  aria-label="User Account"
                >
                  <i className="fas fa-user" />
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="logout-icon" 
                  data-tooltip={t.logout} 
                  aria-label="Logout"
                >
                  <i className="fas fa-sign-out-alt" />
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="login-icon" 
                data-tooltip={t.memberLogin} 
                aria-label="Login"
              >
                <i className="fas fa-sign-in-alt" />
              </Link>
            )}
            
            <Link href="/cart" className="cart-icon" aria-label="Shopping Cart">
              <i className="fas fa-shopping-cart" />
              <span className="cart-count">{cartCount}</span>
            </Link>
            
            <button className="lang-switch" onClick={switchLanguage} aria-label="Switch Language">
              <i className="fas fa-globe" />
              <span id="currentLang">{isEnglish ? 'EN' : 'ZH'}</span>
            </button>
            
            <button 
              className="mobile-menu-btn mobile-only" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`} />
            </button>
          </div>
        </div>
        
        {/* 手機端導航菜單 */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-links">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>{t.home}</Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)}>{t.products}</Link>
            <Link href="/categories" onClick={() => setMobileMenuOpen(false)}>{t.categories}</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)}>{t.about}</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>{t.contactUs}</Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/user" onClick={() => setMobileMenuOpen(false)}>
                  {t.myAccount}
                </Link>
                <button onClick={(e) => { setMobileMenuOpen(false); handleLogout(e); }}>
                  {t.logout}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                {t.memberLogin}
              </Link>
            )}

            <div className="mobile-lang-switch">
              <button onClick={() => { switchLanguage(); setMobileMenuOpen(false); }}>
                <i className="fas fa-globe"></i>
                {isEnglish ? '切換至中文' : 'Switch to English'}
              </button>
            </div>
          </div>
          <div className="mobile-search">
            <input
              type="text"
              className="search-input"
              placeholder={t.searchPlaceholder}
            />
            <button className="search-btn">
              <i className="fas fa-search" />
            </button>
          </div>
        </div>
      </nav>
      
      {/* 主要内容区域 */}
      <main className={mobileMenuOpen ? 'blur-content' : ''}>{children}</main>
      
      {/* 页脚 */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>HAKA TOYZ</h2>
              <p>{t.trendyProducts}</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h3>{t.quickLinks}</h3>
                <ul>
                  <li>
                    <Link href="/">{t.home}</Link>
                  </li>
                  <li>
                    <Link href="/#products">{t.featuredProducts}</Link>
                  </li>
                  <li>
                    <Link href="/#categories">{t.categories}</Link>
                  </li>
                  <li>
                    <Link href="/about">{t.about}</Link>
                  </li>
                </ul>
              </div>
              <div className="footer-column">
                <h3>{t.helpCenter}</h3>
                <ul>
                  <li>
                    <Link href="/help-faq">{t.faq}</Link>
                  </li>
                  <li>
                    <Link href="/help-shipping">{t.shippingInfo}</Link>
                  </li>
                  <li>
                    <Link href="/help-returns">{t.returns}</Link>
                  </li>
                  <li>
                    <Link href="/help-orders">{t.orderStatus}</Link>
                  </li>
                  <li>
                    <Link href="/help-payment">{t.paymentMethods}</Link>
                  </li>
                </ul>
              </div>
              <div className="footer-column">
                <h3>{t.contactUsFooter}</h3>
                <ul>
                  <li><a href="mailto:info@hakatoyz.com">info@hakatoyz.com</a></li>
                  <li><a href="tel:+15551234567">+1 (555) 123-4567</a></li>
                  <li><a href="#wechat">WeChat: HakaToyz_Official</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t.copyright}</p>
            <div className="social-icons">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Weibo">
                <i className="fab fa-weibo" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="WeChat">
                <i className="fab fa-weixin" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <i className="fab fa-tiktok" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 返回頂部按鈕 */}
      {scrolled && (
        <button 
          className="back-to-top" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </>
  );
};

export default Layout; 