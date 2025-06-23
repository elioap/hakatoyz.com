import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

const AdminLoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('登入失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout
      title="管理員登入 - Haka Toyz"
      description="管理員系統登入"
    >
      <div className="admin-login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>🔐 管理員登入</h1>
              <p>請輸入管理員帳號密碼</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="error-message">
                  ❌ {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username">帳號</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  placeholder="請輸入管理員帳號"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">密碼</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="請輸入密碼"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading || !credentials.username || !credentials.password}
              >
                {loading ? '🔄 登入中...' : '✅ 登入'}
              </button>
            </form>

            <div className="login-footer">
              <p>⚠️ 此頁面僅供授權管理員使用</p>
              <a href="/" className="back-home">← 返回首頁</a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }

        .admin-login-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255, 61, 113, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(0, 230, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .login-container {
          position: relative;
          z-index: 1;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 20px;
          padding: 3rem;
          width: 100%;
          max-width: 450px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(0, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .login-card:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(0, 255, 255, 0.2);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-header h1 {
          color: #fff;
          font-size: 2.2rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        .login-header p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.1rem;
        }

        .login-form {
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 0.8rem;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .form-group input {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(0, 255, 255, 0.3);
          border-radius: 12px;
          color: #fff;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: rgba(0, 255, 255, 0.8);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.15);
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .error-message {
          background: rgba(255, 69, 69, 0.1);
          border: 1px solid rgba(255, 69, 69, 0.4);
          color: #ff6b6b;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 500;
        }

        .login-btn {
          width: 100%;
          padding: 1.2rem;
          background: linear-gradient(45deg, #ff3d71, #00e6ff);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 61, 113, 0.4);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .login-footer {
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.5rem;
        }

        .login-footer p {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .back-home {
          color: rgba(0, 230, 255, 0.8);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .back-home:hover {
          color: #00e6ff;
          text-shadow: 0 0 10px rgba(0, 230, 255, 0.5);
        }

        @media (max-width: 768px) {
          .admin-login-page {
            padding: 1rem;
          }

          .login-card {
            padding: 2rem;
            margin: 1rem;
          }

          .login-header h1 {
            font-size: 1.8rem;
          }

          .form-group input {
            padding: 0.9rem;
            font-size: 1rem;
          }

          .login-btn {
            padding: 1rem;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </Layout>
  );
};

export default AdminLoginPage; 