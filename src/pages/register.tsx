import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/components/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = router;
  const isEnglish = locale === 'en';
  const { register, login, isAuthenticated, error: authError } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('joinnow');
  
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

  // 密碼強度檢查
  const checkPasswordStrength = (pwd: string): boolean => {
    // 至少8個字符，包含字母和數字
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return strongPassword.test(pwd);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 簡單表單驗證
    if (!name) {
      setError(isEnglish ? 'Name is required' : '姓名為必填項');
      return;
    }
    
    if (!email) {
      setError(isEnglish ? 'Email is required' : '電子郵件為必填項');
      return;
    }
    
    if (!password) {
      setError(isEnglish ? 'Password is required' : '密碼為必填項');
      return;
    }
    
    // 驗證密碼強度
    if (!checkPasswordStrength(password)) {
      setError(isEnglish 
        ? 'Password must be at least 8 characters and contain both letters and numbers' 
        : '密碼必須至少8個字符，並包含字母和數字');
      return;
    }
    
    // 验证密码匹配
    if (password !== confirmPassword) {
      setError(isEnglish ? 'Passwords do not match' : '密碼不匹配');
      return;
    }
    
    // 验证条款同意
    if (!agreeTerms) {
      setError(isEnglish ? 'You must agree to the Terms of Service and Privacy Policy' : '您必須同意服務條款和隱私政策');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const registerSuccess = await register(name, email, password);
      if (registerSuccess) {
        // 註冊成功後自動登入
        await login({ email, password });
        router.push('/user');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (): { text: string; color: string } => {
    if (!password) return { text: '', color: '' };
    
    if (password.length < 6) {
      return { 
        text: isEnglish ? 'Weak' : '弱', 
        color: '#ff6b6b' 
      };
    } else if (checkPasswordStrength(password)) {
      return { 
        text: isEnglish ? 'Strong' : '強', 
        color: '#51cf66' 
      };
    } else {
      return { 
        text: isEnglish ? 'Medium' : '中', 
        color: '#ffd43b' 
      };
    }
  };

  const passwordStrength = getPasswordStrength();
  
  // 国际化文本
  const t = {
    title: isEnglish ? 'Create Account - Haka Toyz' : '建立帳戶 - Haka Toyz',
    pageHeading: isEnglish ? 'Join Haka Toyz' : '加入 Haka Toyz',
    signIn: isEnglish ? 'Sign In' : '登入',
    joinNow: isEnglish ? 'Join Now' : '立即加入',
    name: isEnglish ? 'Full Name' : '姓名',
    namePlaceholder: isEnglish ? 'Enter your full name' : '請輸入姓名',
    email: isEnglish ? 'Email Address' : '電子郵件地址',
    emailPlaceholder: isEnglish ? 'Enter your email' : '請輸入電子郵件',
    password: isEnglish ? 'Password' : '密碼',
    passwordPlaceholder: isEnglish ? 'Create a password' : '請建立密碼',
    confirmPassword: isEnglish ? 'Confirm Password' : '確認密碼',
    confirmPasswordPlaceholder: isEnglish ? 'Confirm your password' : '請確認密碼',
    termsAgree: isEnglish ? 'I agree to the' : '我同意',
    termsOfService: isEnglish ? 'Terms of Service' : '服務條款',
    and: isEnglish ? 'and' : '和',
    privacyPolicy: isEnglish ? 'Privacy Policy' : '隱私政策',
    registerButton: isEnglish ? 'CREATE ACCOUNT' : '建立帳戶',
    haveAccount: isEnglish ? 'Already have an account?' : '已有帳戶？',
    loginHere: isEnglish ? 'Sign In' : '立即登入',
    processing: isEnglish ? 'Creating Account...' : '建立帳戶中...',
    passwordStrength: isEnglish ? 'Password Strength' : '密碼強度',
    passwordRequirements: isEnglish ? 'At least 8 characters with letters and numbers' : '至少8個字符，包含字母和數字',
    rewardsTitle: isEnglish ? 'WELCOME TO' : '歡迎來到',
    rewardsSubtitle: isEnglish ? 'HAKA TOYZ REWARDS' : 'HAKA TOYZ 會員獎勵',
    rewardsDescription: isEnglish ? 'START EARNING POINTS & REWARDS TODAY!' : '今天就開始賺取積分和獎勵！',
    joinFree: isEnglish ? 'FREE TO JOIN' : '免費加入',
    rewardAmount: isEnglish ? '$5 Reward for every 100 points earned' : '每賺取100積分獲得$5獎勵',
    rewardBenefits: isEnglish ? 'Birthday Rewards, Exclusive Offers, Early Access to Sales, & More' : '生日獎勵、專屬優惠、搶先購買權等更多福利',
    instantReward: isEnglish ? 'Get $5 reward instantly upon registration!' : '註冊即可獲得$5獎勵！'
  };

  return (
    <Layout title={t.title}>
      <div className="register-page">
        <div className="register-container">
          {/* 左側註冊表單 */}
          <div className="register-form-section">
            <div className="register-form-container">
              {/* 頁面導航 */}
              <div className="breadcrumb">
                <Link href="/" className="breadcrumb-link">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{t.joinNow}</span>
      </div>
      
              {/* 標籤切換 */}
              <div className="tab-container">
                <button 
                  className={`tab-button ${activeTab === 'signin' ? 'active' : ''}`}
                  onClick={() => router.push('/login')}
                >
                  {t.signIn}
                </button>
                <button 
                  className={`tab-button ${activeTab === 'joinnow' ? 'active' : ''}`}
                  onClick={() => setActiveTab('joinnow')}
                >
                  {t.joinNow}
                </button>
              </div>

              {/* 註冊表單 */}
              <form onSubmit={handleSubmit} className="register-form">
        {error && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}
        
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
              {t.name}
                    <span className="required">Required</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
                    className="form-input"
              placeholder={t.namePlaceholder}
              required
            />
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
                  <div className="password-requirements">
                    {t.passwordRequirements}
                  </div>
            {password && (
                    <div className="password-strength">
                      <span className="strength-label">{t.passwordStrength}:</span>
                      <span className="strength-indicator" style={{ color: passwordStrength.color }}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
          </div>
          
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
              {t.confirmPassword}
                    <span className="required">Required</span>
            </label>
                  <div className="password-input-container">
            <input
              id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input"
              placeholder={t.confirmPasswordPlaceholder}
              required
            />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
          </div>
          
                <div className="form-options">
                  <label className="checkbox-container">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
                    <span className="checkmark"></span>
                    <span className="terms-text">
                {t.termsAgree}{' '}
                      <Link href="/terms" className="terms-link">{t.termsOfService}</Link>
                      {' '}{t.and}{' '}
                      <Link href="/privacy" className="terms-link">{t.privacyPolicy}</Link>
              </span>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
                  className="register-button"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      {t.processing}
                    </>
                  ) : (
                    t.registerButton
                  )}
          </button>
          
                <div className="login-link">
              {t.haveAccount}{' '}
                  <Link href="/login" className="login-here-link">
                  {t.loginHere}
              </Link>
                </div>
              </form>
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
                
                <div className="instant-reward">{t.instantReward}</div>
                
                <div className="reward-amount">{t.rewardAmount}</div>
                
                <div className="reward-benefits">
                  {t.rewardBenefits}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .register-page {
            min-height: 100vh;
            background: linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 30, 0.9) 100%);
            position: relative;
            overflow: hidden;
          }

          .register-page::before {
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

          .register-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 100vh;
            position: relative;
            z-index: 1;
          }

          /* 左側註冊表單區域 */
          .register-form-section {
            padding: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
          }

          .register-form-container {
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
          .register-form {
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

          .password-requirements {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
            margin-top: 0.25rem;
          }

          .password-strength {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
            font-size: 0.85rem;
          }

          .strength-label {
            color: rgba(255, 255, 255, 0.7);
          }

          .strength-indicator {
            font-weight: 600;
          }

          .form-options {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
          }

          .checkbox-container {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            position: relative;
            line-height: 1.4;
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
            margin-top: 2px;
            flex-shrink: 0;
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
            top: 0px;
            color: white;
            font-size: 12px;
            font-weight: bold;
          }

          .terms-text {
            font-size: 0.85rem;
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

          .register-button {
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

          .register-button:hover:not(:disabled) {
            background: linear-gradient(45deg, #ff3388, #ff66aa);
            box-shadow: 0 0 30px rgba(255, 0, 102, 0.6);
            transform: translateY(-2px);
          }

          .register-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .login-link {
            text-align: center;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
          }

          .login-here-link {
            color: #00ffff;
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .login-here-link:hover {
            color: #ff0066;
            text-shadow: 0 0 8px rgba(255, 0, 102, 0.5);
          }

          /* 右側獎勵區域 */
          .rewards-section {
            background: linear-gradient(135deg, rgba(40, 40, 40, 0.9) 0%, rgba(60, 60, 60, 0.8) 100%);
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
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(15px);
            padding: 3rem 2rem;
            border-radius: 1rem;
            box-shadow: 
              0 20px 40px rgba(0, 0, 0, 0.5),
              0 0 30px rgba(255, 0, 102, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 0, 102, 0.3);
            position: relative;
            overflow: hidden;
          }

          .rewards-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
              radial-gradient(circle at 20% 20%, rgba(255, 0, 102, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(0, 230, 255, 0.05) 0%, transparent 50%);
            z-index: -1;
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
            background: linear-gradient(45deg, #ff0066, #00ffff, #ff3388);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            line-height: 1.1;
            text-shadow: 0 0 30px rgba(255, 0, 102, 0.5);
            animation: neonGlow 3s ease-in-out infinite alternate;
          }

          @keyframes neonGlow {
            0% {
              background-position: 0% 50%;
              filter: drop-shadow(0 0 20px rgba(255, 0, 102, 0.7));
            }
            100% {
              background-position: 100% 50%;
              filter: drop-shadow(0 0 30px rgba(0, 255, 255, 0.7));
            }
          }

          .rewards-description {
            font-size: 1.1rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 2rem;
            letter-spacing: 1px;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }

          .join-free-badge {
            display: inline-block;
            background: linear-gradient(45deg, #ff0066, #ff3388);
            color: white;
            padding: 1rem 2rem;
            border-radius: 2rem;
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            box-shadow: 
              0 10px 20px rgba(255, 0, 102, 0.4),
              0 0 30px rgba(255, 0, 102, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
            text-transform: uppercase;
            letter-spacing: 1px;
            border: 1px solid rgba(255, 0, 102, 0.5);
            animation: pulseGlow 2s ease-in-out infinite;
          }

          @keyframes pulseGlow {
            0%, 100% {
              box-shadow: 
                0 10px 20px rgba(255, 0, 102, 0.4),
                0 0 30px rgba(255, 0, 102, 0.6),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
            50% {
              box-shadow: 
                0 15px 30px rgba(255, 0, 102, 0.6),
                0 0 50px rgba(255, 0, 102, 0.8),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
            }
          }

          .instant-reward {
            font-size: 1.1rem;
            font-weight: 700;
            color: #00ffff;
            margin-bottom: 1.5rem;
            padding: 0.8rem 1.5rem;
            background: rgba(0, 255, 255, 0.1);
            border-radius: 0.8rem;
            border: 1px solid rgba(0, 255, 255, 0.4);
            box-shadow: 
              0 0 20px rgba(0, 255, 255, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
            animation: shimmer 2s ease-in-out infinite alternate;
          }

          @keyframes shimmer {
            0% {
              box-shadow: 
                0 0 20px rgba(0, 255, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            }
            100% {
              box-shadow: 
                0 0 30px rgba(0, 255, 255, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }
          }

          .reward-amount {
            font-size: 1.3rem;
            font-weight: 700;
            color: #ffd700;
            margin-bottom: 1.5rem;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
            padding: 0.5rem 1rem;
            background: rgba(255, 215, 0, 0.1);
            border-radius: 0.5rem;
            border: 1px solid rgba(255, 215, 0, 0.3);
          }

          .reward-benefits {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            font-weight: 500;
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          /* 響應式設計 */
          @media (max-width: 1024px) {
            .register-container {
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
            .register-form-section {
              padding: 1rem;
            }

            .register-form-container {
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
          :global(body.zh-mode) .register-button,
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
