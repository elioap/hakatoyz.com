import { NextApiRequest, NextApiResponse } from 'next';

// PayPal API配置
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

// 獲取PayPal訪問令牌
async function getPayPalAccessToken(): Promise<string> {
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('獲取PayPal訪問令牌失敗');
  }

  const data = await response.json();
  return data.access_token;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許POST請求' });
  }

  try {
    const { orderID } = req.body;

    if (!orderID) {
      return res.status(400).json({ error: '缺少訂單ID' });
    }

    // 獲取訪問令牌
    const accessToken = await getPayPalAccessToken();

    // 捕獲PayPal訂單
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      console.error('PayPal訂單捕獲失敗:', errorData);
      throw new Error('捕獲PayPal訂單失敗');
    }

    const captureData = await captureResponse.json();
    
    // 這裡可以添加訂單保存到數據庫的邏輯
    console.log('PayPal訂單捕獲成功:', captureData);
    
    res.status(200).json(captureData);
  } catch (error: any) {
    console.error('捕獲PayPal訂單錯誤:', error);
    res.status(500).json({ error: error.message });
  }
} 