import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 模擬用戶數據（實際應用中應該存儲到資料庫）
let mockUsers = [
  {
    id: 1,
    email: 'admin@hakatoyz.com',
    password: '$2a$10$example.hash',
    name: 'Admin User',
    role: 'admin'
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, password, name } = req.body;
      
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and name are required'
        });
      }
      
      // 檢查郵箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
      
      // 檢查密碼長度
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }
      
      // 檢查用戶是否已存在
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists'
        });
      }
      
      // 加密密碼（實際應用中應該使用bcrypt）
      // const hashedPassword = await bcrypt.hash(password, 10);
      const hashedPassword = `hashed_${password}`; // 臨時處理
      
      // 創建新用戶
      const newUser = {
        id: mockUsers.length + 1,
        email,
        password: hashedPassword,
        name,
        role: 'user'
      };
      
      // 添加到用戶列表（實際應用中應該存儲到資料庫）
      mockUsers.push(newUser);
      
      // 生成JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email, 
          role: newUser.role 
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
          },
          token
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }
} 