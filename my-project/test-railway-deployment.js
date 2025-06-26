// Railway 部署測試腳本
// 已更新為您的實際 Railway URL

const RAILWAY_URL = 'https://hakatoyz.up.railway.app'; 

async function testRailwayDeployment() {
  console.log('🚀 測試 Railway Strapi 部署...\n');
  
  try {
    // 測試健康檢查
    console.log('📡 測試健康檢查...');
    const healthResponse = await fetch(`${RAILWAY_URL}/admin`);
    
    if (healthResponse.ok) {
      console.log('✅ Railway Strapi 部署成功！');
      console.log(`🌐 管理後台: ${RAILWAY_URL}/admin`);
      console.log(`🔗 API 端點: ${RAILWAY_URL}/api`);
      
      // 測試 API 端點
      console.log('\n🧪 測試 Order API...');
      const apiResponse = await fetch(`${RAILWAY_URL}/api/orders`);
      const apiResult = await apiResponse.json();
      
      if (apiResponse.status === 403) {
        console.log('⚠️  Order API 需要設置權限 (這是正常的)');
        console.log('📋 請在 Railway Strapi 管理後台設置 Order API 權限');
      } else if (apiResponse.ok) {
        console.log('✅ Order API 可訪問！');
      } else {
        console.log(`❌ API 錯誤 (${apiResponse.status}):`, apiResult);
      }
      
    } else {
      console.log(`❌ 部署失敗 (${healthResponse.status})`);
      console.log('請檢查 Railway 部署日誌');
    }
    
  } catch (error) {
    console.log('❌ 連接失敗:', error.message);
    console.log('請確認：');
    console.log('1. Railway URL 是否正確');
    console.log('2. 部署是否完成');
    console.log('3. 服務是否正在運行');
  }
}

// 執行測試
testRailwayDeployment(); 