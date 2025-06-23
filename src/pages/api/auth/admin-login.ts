import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const ADMIN_USERNAME = 'adminep';
const ADMIN_PASSWORD = 'Admin123!!!';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }

  try {
    const { username, password } = req.body;

    // 驗證管理員帳號密碼
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: '帳號或密碼錯誤'
      });
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        username: ADMIN_USERNAME,
        role: 'admin',
        loginTime: Date.now()
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 設置Cookie
    res.setHeader('Set-Cookie', [
      `admin-token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    ]);

    res.status(200).json({
      success: true,
      message: '登入成功',
      user: {
        username: ADMIN_USERNAME,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: '服務器錯誤',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 