// Order API 權限測試腳本
const STRAPI_URL = 'http://localhost:1337'; // 本地測試，部署後改為Railway URL

// 測試訂單數據
const testOrder = {
  data: {
    orderNumber: `ORD-${Date.now()}`,
    customerName: "測試用戶",
    customerEmail: "test@example.com",
    customerPhone: "0912345678",
    shippingAddress: {
      street: "測試街道123號",
      city: "台北市",
      state: "台北市",
      postalCode: "10001",
      country: "台灣"
    },
    subtotal: 1000,
    totalAmount: 1000,
    paymentMethod: "credit_card",
    status: "pending",
    paymentStatus: "pending"
  }
};

// 測試函數
async function testOrderAPI() {
  try {
    console.log('🧪 測試 Order API 權限...\n');
    
    // 測試 POST /api/orders (創建訂單)
    console.log('📤 測試 POST /api/orders...');
    const response = await fetch(`${STRAPI_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ POST /api/orders 成功！');
      console.log('📋 創建的訂單:', result.data.attributes.orderNumber);
      
      // 測試 GET /api/orders (獲取訂單列表)
      console.log('\n📥 測試 GET /api/orders...');
      const getResponse = await fetch(`${STRAPI_URL}/api/orders`);
      const getResult = await getResponse.json();
      
      if (getResponse.ok) {
        console.log('✅ GET /api/orders 成功！');
        console.log(`📊 找到 ${getResult.data.length} 個訂單`);
      } else {
        console.log('❌ GET /api/orders 失敗:', getResult);
      }
      
    } else {
      console.log('❌ POST /api/orders 失敗:');
      console.log('狀態碼:', response.status);
      console.log('錯誤:', result);
      
      if (response.status === 403) {
        console.log('\n💡 權限錯誤！請確認：');
        console.log('1. 已登入 Strapi 管理後台');
        console.log('2. Settings → Users & Permissions Plugin → Roles → Public');
        console.log('3. Order 部分已勾選 "create" 權限');
        console.log('4. 已點擊 "Save" 保存設置');
      }
    }
    
  } catch (error) {
    console.log('❌ 測試失敗:', error.message);
    console.log('請確認 Strapi 服務器正在運行');
  }
}

// 執行測試
testOrderAPI(); 