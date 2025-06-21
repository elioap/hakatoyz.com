import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [language, setLanguage] = useState('zh');
  
  // 初始化语言
  useEffect(() => {
    // 同时检查 NEXT_LOCALE cookie 和 localStorage
    const nextLocale = Cookies.get('NEXT_LOCALE');
    const localStorageLang = localStorage.getItem('language');
    
    // 优先使用 NEXT_LOCALE cookie
    const savedLang = nextLocale || localStorageLang || 'zh';
    
    setLanguage(savedLang);
    
    // 同步 localStorage 和 cookie
    if (nextLocale && !localStorageLang) {
      localStorage.setItem('language', nextLocale);
    } else if (!nextLocale && localStorageLang) {
      Cookies.set('NEXT_LOCALE', localStorageLang, { expires: 365 });
    }
    
    // 同步 body 类
    if (savedLang === 'zh') {
      document.body.classList.add('zh-mode');
    } else {
      document.body.classList.remove('zh-mode');
    }
  }, []);

  // 切换语言
  const toggleLanguage = useCallback(() => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    
    // 同时更新 state、localStorage 和 cookie
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    Cookies.set('NEXT_LOCALE', newLang, { expires: 365 });
    
    // 应用页面语言类
    if (newLang === 'zh') {
      document.body.classList.add('zh-mode');
    } else {
      document.body.classList.remove('zh-mode');
    }
    
    // 使用 Next.js 路由切换语言
    router.push(router.pathname, router.asPath, { locale: newLang });
  }, [language, router]);

  return (
    <button 
      onClick={toggleLanguage} 
      className="flex items-center space-x-1 neon-text-secondary"
    >
      <span>{language === 'zh' ? '繁體中文' : 'English'}</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
} 