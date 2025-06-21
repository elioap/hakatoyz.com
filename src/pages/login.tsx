import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/components/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const { login, isAuthenticated, error: authError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  
  // 檢查用戶是否已登入，若已登入則重定向到用戶中心
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/user');
    }
  }, [isAuthenticated, router]);

  // 當 AuthContext 中的錯誤更新時同步到本地狀態
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 簡單表單驗證
    if (!email) {
      setError(isEnglish ? 'Email is required' : '電子郵件為必填項');
      return;
    }
    
    if (!password) {
      setError(isEnglish ? 'Password is required' : '密碼為必填項');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login({ email, password, rememberMe });
      if (success) {
        router.push('/user');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 国际化文本
  const t = {
    title: isEnglish ? 'Member Login - Haka Toyz' : '會員登入 - Haka Toyz',
    pageHeading: isEnglish ? 'Welcome Back' : '歡迎回來',
    signIn: isEnglish ? 'Sign In' : '登入',
    joinNow: isEnglish ? 'Join Now' : '立即加入',
    email: isEnglish ? 'Email Address' : '電子郵件地址',
    emailPlaceholder: isEnglish ? 'Enter your email' : '請輸入電子郵件',
    password: isEnglish ? 'Password' : '密碼',
    passwordPlaceholder: isEnglish ? 'Enter your password' : '請輸入密碼',
    rememberMe: isEnglish ? 'Keep me signed in' : '保持登入狀態',
    forgotPassword: isEnglish ? 'Forgot Password?' : '忘記密碼？',
    loginButton: isEnglish ? 'SIGN IN' : '登入',
    noAccount: isEnglish ? 'New to Haka Toyz?' : '初次使用 Haka Toyz？',
    registerNow: isEnglish ? 'Create Account' : '建立帳戶',
    processing: isEnglish ? 'Signing In...' : '登入中...',
    demoLoginTitle: isEnglish ? 'Demo Account' : '示範帳戶',
    demoLogin: isEnglish ? 'test@example.com / password123' : 'test@example.com / password123',
    termsText: isEnglish ? 'By clicking the Sign In button, you agree to our' : '點擊登入按鈕即表示您同意我們的',
    termsLink: isEnglish ? 'Terms of Use' : '使用條款',
    privacyLink: isEnglish ? 'Privacy Policy' : '隱私政策',
    and: isEnglish ? 'and' : '和',
    rewardsTitle: isEnglish ? 'INTRODUCING' : '介紹',
    rewardsSubtitle: isEnglish ? 'HAKA TOYZ REWARDS' : 'HAKA TOYZ 會員獎勵',
    rewardsDescription: isEnglish ? 'THE NEW WAY TO EARN POINTS & REWARDS AT HT!' : '在 HT 賺取積分和獎勵的新方式！',
    joinFree: isEnglish ? 'JOIN FREE' : '免費加入',
    rewardAmount: isEnglish ? '$5 Reward for every 100 points earned' : '每賺取100積分獲得$5獎勵',
    rewardBenefits: isEnglish ? 'Birthday and Anniversary Rewards, Exclusive Perks, Early Access to Sales, & More' : '生日和週年獎勵、專屬優惠、搶先購買權等更多福利',
    inStoreSignup: isEnglish ? 'Did you sign up in-store?' : '您是在店內註冊的嗎？',
    inStoreText: isEnglish ? 'Choose Join Now and we\'ll find your account and help you set up a password so you can start earning points online, too' : '選擇立即加入，我們將找到您的帳戶並幫助您設置密碼，這樣您也可以開始在線賺取積分'
  };

  return (
    <Layout title={t.title}>
      <div className="login-page">
        <div className="login-container">
          {/* 左側登入表單 */}
          <div className="login-form-section">
            <div className="login-form-container">
              {/* 頁面導航 */}
              <div className="breadcrumb">
                <Link href="/" className="breadcrumb-link">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{t.signIn}</span>
      </div>
      
              {/* 標籤切換 */}
              <div className="tab-container">
                <button 
                  className={`tab-button ${activeTab === 'signin' ? 'active' : ''}`}
                  onClick={() => setActiveTab('signin')}
                >
                  {t.signIn}
                </button>
                <button 
                  className={`tab-button ${activeTab === 'joinnow' ? 'active' : ''}`}
                  onClick={() => router.push('/register')}
                >
                  {t.joinNow}
                </button>
              </div>

              {/* 登入表單 */}
              <form onSubmit={handleSubmit} className="login-form">
        {error && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

                {/* 示範帳戶提示 */}
                <div className="demo-account-info">
                  <div className="demo-title">
                    <i className="fas fa-info-circle"></i>
                    {t.demoLoginTitle}
                  </div>
                  <div className="demo-credentials">{t.demoLogin}</div>
        </div>
        
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
              {t.email}
                    <span className="required">Required</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
              placeholder={t.emailPlaceholder}
              required
            />
          </div>
          
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
              {t.password}
                    <span className="required">Required</span>
            </label>
                  <div className="password-input-container">
            <input
              id="password"
                      type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
              placeholder={t.passwordPlaceholder}
              required
            />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
          </div>
          
                <div className="form-options">
                  <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
                    <span className="checkmark"></span>
              {t.rememberMe}
            </label>
                </div>

                <div className="terms-text">
                  {t.termsText}{' '}
                  <Link href="/terms" className="terms-link">{t.termsLink}</Link>
                  {' '}{t.and}{' '}
                  <Link href="/privacy" className="terms-link">{t.privacyLink}</Link>.
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
                  className="signin-button"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      {t.processing}
                    </>
                  ) : (
                    t.loginButton
                  )}
          </button>
          
                <Link href="/forgot-password" className="forgot-password-link">
                  {t.forgotPassword}
              </Link>
              </form>

              {/* 店內註冊提示 */}
              <div className="instore-signup">
                <h3>{t.inStoreSignup}</h3>
                <p>{t.inStoreText}</p>
              </div>
            </div>
          </div>

          {/* 右側獎勵計劃 */}
          <div className="rewards-section">
            <div className="rewards-container">
              <div className="rewards-content">
                <h2 className="rewards-title">{t.rewardsTitle}</h2>
                <h1 className="rewards-subtitle">{t.rewardsSubtitle}</h1>
                <p className="rewards-description">{t.rewardsDescription}</p>
                
                <div className="join-free-badge">
                  {t.joinFree}
                </div>
                
                <div className="instant-reward">
                  {isEnglish ? 'Get $5 reward instantly upon registration!' : '註冊即可立即獲得$5獎勵！'}
                </div>
                
                <div className="reward-amount">{t.rewardAmount}</div>
                
                <div className="reward-benefits">
                  {t.rewardBenefits}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .login-page {
            min-height: 100vh;
            background: linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 30, 0.9) 100%);
            position: relative;
            overflow: hidden;
          }

          .login-page::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
              radial-gradient(circle at 20% 20%, rgba(255, 61, 113, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(0, 230, 255, 0.1) 0%, transparent 50%);
            z-index: 0;
          }

          .login-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 100vh;
            position: relative;
            z-index: 1;
          }

          /* 左側登入表單區域 */
          .login-form-section {
            padding: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
          }

          .login-form-container {
            width: 100%;
            max-width: 480px;
            padding: 2rem;
          }

          /* 麵包屑導航 */
          .breadcrumb {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 2rem;
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
          }

          .breadcrumb-link {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .breadcrumb-link:hover {
            color: #ff0066;
            text-shadow: 0 0 8px rgba(255, 0, 102, 0.5);
          }

          .breadcrumb-separator {
            color: rgba(255, 255, 255, 0.4);
          }

          .breadcrumb-current {
            color: white;
            font-weight: 500;
          }

          /* 標籤切換 */
          .tab-container {
            display: flex;
            margin-bottom: 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .tab-button {
            flex: 1;
            padding: 1rem 0;
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            border-bottom: 3px solid transparent;
          }

          .tab-button.active {
            color: white;
            border-bottom-color: #ff0066;
            text-shadow: 0 0 10px rgba(255, 0, 102, 0.5);
          }

          .tab-button:hover:not(.active) {
            color: rgba(255, 255, 255, 0.8);
          }

          /* 表單樣式 */
          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .error-message {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid rgba(255, 0, 0, 0.3);
            border-radius: 0.5rem;
            color: #ff6b6b;
            font-size: 0.9rem;
          }

          .demo-account-info {
            padding: 1rem;
            background: rgba(0, 230, 255, 0.1);
            border: 1px solid rgba(0, 230, 255, 0.3);
            border-radius: 0.5rem;
            margin-bottom: 1rem;
          }

          .demo-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #00ffff;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .demo-credentials {
            color: rgba(255, 255, 255, 0.8);
            font-family: monospace;
            font-size: 0.9rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .form-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
            font-weight: 500;
            font-size: 0.95rem;
          }

          .required {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.8rem;
            font-weight: normal;
          }

          .form-input {
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            color: white;
            font-size: 1rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }

          .form-input:focus {
            outline: none;
            border-color: #ff0066;
            box-shadow: 0 0 15px rgba(255, 0, 102, 0.3);
            background: rgba(255, 255, 255, 0.08);
          }

          .form-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }

          .password-input-container {
            position: relative;
          }

          .password-toggle {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .password-toggle:hover {
            color: #ff0066;
          }

          .form-options {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .checkbox-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            position: relative;
          }

          .checkbox-container input[type="checkbox"] {
            appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 3px;
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .checkbox-container input[type="checkbox"]:checked {
            background: #ff0066;
            border-color: #ff0066;
            box-shadow: 0 0 10px rgba(255, 0, 102, 0.5);
          }

          .checkbox-container input[type="checkbox"]:checked::after {
            content: '✓';
            position: absolute;
            left: 3px;
            top: -2px;
            color: white;
            font-size: 12px;
            font-weight: bold;
          }

          .terms-text {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.4;
          }

          .terms-link {
            color: #00ffff;
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .terms-link:hover {
            color: #ff0066;
            text-shadow: 0 0 8px rgba(255, 0, 102, 0.5);
          }

          .signin-button {
            padding: 1rem 2rem;
            background: linear-gradient(45deg, #ff0066, #ff3388);
            border: none;
            border-radius: 0.5rem;
            color: white;
            font-size: 1rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 0 0 20px rgba(255, 0, 102, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .signin-button:hover:not(:disabled) {
            background: linear-gradient(45deg, #ff3388, #ff66aa);
            box-shadow: 0 0 30px rgba(255, 0, 102, 0.6);
            transform: translateY(-2px);
          }

          .signin-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .forgot-password-link {
            text-align: center;
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          }

          .forgot-password-link:hover {
            color: #00ffff;
            text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
          }

          .instore-signup {
            margin-top: 2rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .instore-signup h3 {
            color: white;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
          }

          .instore-signup p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            line-height: 1.5;
          }

          /* 右側獎勵區域 */
          .rewards-section {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(15px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
          }

          .rewards-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
              radial-gradient(circle at 30% 30%, rgba(255, 0, 102, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(0, 230, 255, 0.1) 0%, transparent 50%);
            z-index: 0;
          }

          .rewards-container {
            position: relative;
            z-index: 1;
            text-align: center;
            max-width: 500px;
          }

          .rewards-content {
            background: rgba(20, 20, 30, 0.8);
            padding: 3rem 2rem;
            border-radius: 1rem;
            box-shadow: 
              0 20px 40px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
          }

          .rewards-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 0.5rem;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .rewards-subtitle {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(45deg, #ff0066, #00ffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            line-height: 1.1;
            text-shadow: 0 0 30px rgba(255, 0, 102, 0.5);
          }

          .rewards-description {
            font-size: 1.1rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 2rem;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .join-free-badge {
            display: inline-block;
            background: linear-gradient(45deg, #ff0066, #ff3388);
            color: white;
            padding: 1rem 2rem;
            border-radius: 2rem;
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            box-shadow: 
              0 10px 20px rgba(255, 0, 102, 0.4),
              0 0 30px rgba(255, 0, 102, 0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
          }

          .join-free-badge:hover {
            transform: translateY(-2px);
            box-shadow: 
              0 15px 30px rgba(255, 0, 102, 0.5),
              0 0 40px rgba(255, 0, 102, 0.4);
          }

          .instant-reward {
            background: rgba(0, 255, 255, 0.1);
            border: 1px solid rgba(0, 255, 255, 0.3);
            color: #00ffff;
            padding: 1rem;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          }

          .reward-amount {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
            color: #ffc107;
            padding: 1rem;
            border-radius: 0.5rem;
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            text-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
          }

          .reward-benefits {
            color: rgba(255, 255, 255, 0.8);
            font-size: 1rem;
            line-height: 1.6;
            font-weight: 500;
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          /* 響應式設計 */
          @media (max-width: 1024px) {
            .login-container {
              grid-template-columns: 1fr;
            }

            .rewards-section {
              order: -1;
              padding: 1rem;
            }

            .rewards-content {
              padding: 2rem 1.5rem;
            }

            .rewards-subtitle {
              font-size: 2rem;
            }

            .join-free-badge {
              font-size: 1.2rem;
              padding: 0.8rem 1.5rem;
            }
          }

          @media (max-width: 768px) {
            .login-form-section {
              padding: 1rem;
            }

            .login-form-container {
              padding: 1rem;
            }

            .tab-button {
              font-size: 1rem;
              padding: 0.8rem 0;
            }

            .rewards-subtitle {
              font-size: 1.8rem;
            }

            .rewards-description {
              font-size: 1rem;
            }
          }

          /* 中文版調整 */
          :global(body.zh-mode) .tab-button,
          :global(body.zh-mode) .signin-button,
          :global(body.zh-mode) .form-label {
            font-family: 'Noto Sans TC', sans-serif;
            letter-spacing: 1px;
          }

          :global(body.zh-mode) .rewards-subtitle {
            font-family: 'Noto Sans TC', sans-serif;
            letter-spacing: 2px;
          }
        `}</style>
      </div>
    </Layout>
  );
}
