import React from 'react';
import Layout from '@/components/Layout';

const ContactPage: React.FC = () => {
  return (
    <Layout
      title="联系我们 - Haka Toyz"
      description="联系Haka Toyz客户服务团队，获取更多信息和帮助"
    >
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title lang-en">Contact Us</h1>
          <h1 className="page-title lang-zh">聯絡我們</h1>
          <div className="breadcrumb">
            <span className="current lang-en">Contact</span>
            <span className="current lang-zh">聯絡</span>
          </div>
        </div>
      </div>

      {/* 聯絡我們內容 */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="lang-en">Get In Touch</h2>
              <h2 className="lang-zh">聯繫方式</h2>
              
              <div className="contact-methods">
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <div className="contact-details">
                    <h3 className="lang-en">Email</h3>
                    <h3 className="lang-zh">電子郵件</h3>
                    <p>info@hakatoyz.com</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <div className="contact-details">
                    <h3 className="lang-en">Phone</h3>
                    <h3 className="lang-zh">電話</h3>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <i className="fab fa-weixin"></i>
                  <div className="contact-details">
                    <h3 className="lang-en">WeChat</h3>
                    <h3 className="lang-zh">微信</h3>
                    <p>HakaToyz_Official</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <h2 className="lang-en">Send Us a Message</h2>
              <h2 className="lang-zh">發送訊息</h2>
              
              <form>
                <div className="form-group">
                  <label className="lang-en">Name</label>
                  <label className="lang-zh">姓名</label>
                  <input type="text" required />
                </div>
                
                <div className="form-group">
                  <label className="lang-en">Email</label>
                  <label className="lang-zh">電子郵件</label>
                  <input type="email" required />
                </div>
                
                <div className="form-group">
                  <label className="lang-en">Subject</label>
                  <label className="lang-zh">主題</label>
                  <input type="text" required />
                </div>
                
                <div className="form-group">
                  <label className="lang-en">Message</label>
                  <label className="lang-zh">訊息</label>
                  <textarea rows={5} required></textarea>
                </div>
                
                <button type="submit" className="btn-primary">
                  <span className="lang-en">Send Message</span>
                  <span className="lang-zh">發送訊息</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
