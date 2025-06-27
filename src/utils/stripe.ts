import { loadStripe } from '@stripe/stripe-js';

// Stripe 公鑰 - 從環境變量讀取，如果沒有則使用提供的密鑰
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_live_51R8L3LLihhSffOmm2tJoxFCt8jG0PsRIJknJxvITTuelhDZzCP0HNAyeLmOmh0ro7ZMtkE3Gkigixb4bHB6AvXtI00pD4lZqhS';

// 初始化Stripe
export const stripePromise = loadStripe(stripePublishableKey);

// Stripe配置選項
export const stripeOptions = {
  locale: 'zh' as const,
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#ff6b6b',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: '"Segoe UI", Roboto, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
};

// 格式化價格 (從元轉換為分)
export const formatPriceForStripe = (price: number): number => {
  return Math.round(price * 100);
};

// 創建支付意圖
export const createPaymentIntent = async (amount: number, currency: string = 'cny') => {
  try {
    console.log('正在創建支付意圖，金額:', amount, '幣種:', currency);
    
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: formatPriceForStripe(amount),
        currency,
      }),
    });
    
    console.log('API回應狀態:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API錯誤回應:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: 創建支付意圖失敗`);
    }
    
    const data = await response.json();
    console.log('支付意圖創建成功:', data);
    return data;
  } catch (error) {
    console.error('創建支付意圖錯誤:', error);
    throw error;
  }
}; 