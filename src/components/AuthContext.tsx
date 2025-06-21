import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
  level?: string;
}

interface LoginParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (params: LoginParams) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化時從 localStorage 和 Cookies 恢復用戶狀態
  useEffect(() => {
    const initAuth = () => {
      try {
        // 優先檢查 Cookie
        const authToken = Cookies.get('authToken');
        // 如果有 Token，從 localStorage 獲取用戶資訊
        if (authToken) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token 存在但沒有用戶數據，可能需要刷新 Token
            Cookies.remove('authToken');
          }
        }
      } catch (e) {
        console.error('Failed to initialize auth state', e);
        // 清除可能損壞的數據
        localStorage.removeItem('user');
        Cookies.remove('authToken');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 登入功能
  const login = async ({ email, password, rememberMe = false }: LoginParams): Promise<boolean> => {
    setError(null);
    try {
      // 在實際應用中，這裡應該向後端 API 發送請求
      if (email && password) {
        // 模擬成功登入
        const userData: User = {
          id: '1',
          name: email.split('@')[0],
          email,
          level: 'VIP會員',
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 根據「記住我」設置 Cookie 過期時間
        const expiresInDays = rememberMe ? 30 : 1;
        Cookies.set('authToken', 'sample-auth-token-12345', { 
          expires: expiresInDays,
          sameSite: 'strict',
          secure: window.location.protocol === 'https:'
        });
        
        return true;
      }
      
      setError('無效的電子郵件或密碼');
      return false;
    } catch (e) {
      console.error('Login error:', e);
      setError('登入過程中發生錯誤');
      return false;
    }
  };

  // 註冊功能
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      // 在實際應用中，這裡應該向後端 API 發送請求
      if (name && email && password) {
        // 模擬檢查電子郵件是否已被使用
        if (email === 'test@example.com') {
          setError('此電子郵件已被註冊');
          return false;
        }
        
        // 模擬成功註冊
        const userData: User = {
          id: '1',
          name,
          email,
          level: '一般會員',
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        Cookies.set('authToken', 'sample-auth-token-12345', { 
          expires: 1,
          sameSite: 'strict',
          secure: window.location.protocol === 'https:'
        });
        
        return true;
      }
      
      setError('請填寫所有必填欄位');
      return false;
    } catch (e) {
      console.error('Registration error:', e);
      setError('註冊過程中發生錯誤');
      return false;
    }
  };

  // 登出功能
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    Cookies.remove('authToken');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 