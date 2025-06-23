import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }

  try {
    const token = req.cookies['admin-token'];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未登入'
      });
    }

    // 驗證JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '權限不足'
      });
    }

    res.status(200).json({
      success: true,
      message: '驗證成功',
      user: {
        username: decoded.username,
        role: decoded.role
      }
    });
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Token無效或已過期'
    });
  }
} 