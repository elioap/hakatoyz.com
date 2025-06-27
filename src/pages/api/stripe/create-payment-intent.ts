import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// 檢查Stripe私鑰
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('錯誤: STRIPE_SECRET_KEY 環境變量未設置');
}

// 注意：這裡需要您的Stripe私鑰，請在環境變量中設置
const stripe = new Stripe(stripeSecretKey || 'sk_test_...', {
  apiVersion: '2024-06-20',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許POST請求' });
  }

  try {
    const { amount, currency = 'cny' } = req.body;
    
    console.log('收到支付意圖請求:', { amount, currency });

    if (!amount || amount <= 0) {
      console.error('無效的金額:', amount);
      return res.status(400).json({ error: '無效的金額' });
    }

    // 檢查Stripe密鑰
    if (!stripeSecretKey || stripeSecretKey.startsWith('sk_test_...')) {
      console.error('Stripe密鑰未正確配置');
      return res.status(500).json({ error: 'Stripe配置錯誤，請檢查環境變量' });
    }

    // 創建支付意圖
    console.log('正在創建Stripe支付意圖...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });

    console.log('支付意圖創建成功:', paymentIntent.id);
    
    res.status(200).json({
      client_secret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('創建支付意圖錯誤:', error);
    
    // 提供更詳細的錯誤信息
    let errorMessage = '創建支付意圖失敗';
    if (error.type === 'StripeInvalidRequestError') {
      errorMessage = `Stripe錯誤: ${error.message}`;
    } else if (error.type === 'StripeAuthenticationError') {
      errorMessage = 'Stripe認證失敗，請檢查API密鑰';
    } else {
      errorMessage = error.message || '未知錯誤';
    }
    
    res.status(500).json({ error: errorMessage });
  }
} 