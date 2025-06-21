import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

const ForgotPasswordPage: React.FC = () => {
  return (
    <Layout
      title="忘记密码 - Haka Toyz"
      description="重置您的Haka Toyz账户密码"
    >
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1 className="lang-en">Forgot Password</h1>
          <h1 className="lang-zh">忘記密碼</h1>
          <div className="breadcrumb">
            <span className="current lang-en">Reset Password</span>
            <span className="current lang-zh">重置密碼</span>
          </div>
        </div>
      </div>

      {/* 忘記密碼表單 */}
      <section className="forgot-password-section">
        <div className="container">
          <div className="form-container">
            <h2 className="lang-en">Reset Your Password</h2>
            <h2 className="lang-zh">重置您的密碼</h2>
            <p className="lang-en">Enter your email to receive a password reset link</p>
            <p className="lang-zh">輸入您的電子郵件以接收密碼重置鏈接</p>
            
            <form className="password-reset-form">
              <div className="form-group">
                <label className="lang-en">Email Address</label>
                <label className="lang-zh">電子郵件地址</label>
                <input type="email" required />
              </div>
              
              <button type="submit" className="btn-primary">
                <span className="lang-en">Send Reset Link</span>
                <span className="lang-zh">發送重置鏈接</span>
              </button>
            </form>
            
            <div className="form-footer">
              <p>
                <Link href="/login">
                  <span className="lang-en">Back to Login</span>
                  <span className="lang-zh">返回登錄</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPasswordPage;
