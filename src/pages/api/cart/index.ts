import { NextApiRequest, NextApiResponse } from 'next';
import { products } from '../../../data/products';

// 模擬購物車數據（實際應用中應該存儲到資料庫）
let mockCarts: { [userId: number]: any[] } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 模擬用戶ID（實際應用中應該從JWT token獲取）
  const userId = 1;
  
  if (req.method === 'GET') {
    try {
      const userCart = mockCarts[userId] || [];
      
      // 獲取購物車商品的完整信息
      const cartWithDetails = userCart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          ...item,
          product: product || null
        };
      });
      
      res.status(200).json({
        success: true,
        data: cartWithDetails,
        total: cartWithDetails.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { productId, quantity = 1 } = req.body;
      
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }
      
      // 檢查產品是否存在
      const product = products.find(p => p.id === productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // 檢查庫存
      if (!product.inStock) {
        return res.status(400).json({
          success: false,
          message: 'Product is out of stock'
        });
      }
      
      // 初始化用戶購物車
      if (!mockCarts[userId]) {
        mockCarts[userId] = [];
      }
      
      // 檢查商品是否已在購物車中
      const existingItem = mockCarts[userId].find(item => item.productId === productId);
      
      if (existingItem) {
        // 更新數量
        existingItem.quantity += quantity;
      } else {
        // 添加新商品
        mockCarts[userId].push({
          id: Date.now(), // 臨時ID
          productId,
          quantity,
          addedAt: new Date().toISOString()
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Product added to cart successfully',
        data: mockCarts[userId]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      // 清空購物車
      mockCarts[userId] = [];
      
      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} Not Allowed`
    });
  }
} 