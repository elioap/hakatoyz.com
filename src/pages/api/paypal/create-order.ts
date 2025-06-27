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
    const { amount, currency = 'USD', orderData } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: '無效的金額' });
    }

    // 獲取訪問令牌
    const accessToken = await getPayPalAccessToken();

    // 創建PayPal訂單
    const orderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
            description: '潮玩商品購買',
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order-confirmation`,
              cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`,
            },
          },
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('PayPal訂單創建失敗:', errorData);
      throw new Error('創建PayPal訂單失敗');
    }

    const order = await orderResponse.json();
    res.status(200).json(order);
  } catch (error: any) {
    console.error('創建PayPal訂單錯誤:', error);
    res.status(500).json({ error: error.message });
  }
} 