document.addEventListener('DOMContentLoaded', function() {
  // 語言切換功能
  const langSwitchButton = document.querySelector('.lang-switch');
  const currentLangElement = document.getElementById('currentLang');
  
  if (langSwitchButton) {
    langSwitchButton.addEventListener('click', function() {
      const isEnglish = currentLangElement.textContent === 'EN';
      
      // 保存語言設置到localStorage和cookie
      if (isEnglish) {
        localStorage.setItem('language', 'zh');
        document.cookie = "NEXT_LOCALE=zh; path=/; max-age=31536000";
      } else {
        localStorage.setItem('language', 'en');
        document.cookie = "NEXT_LOCALE=en; path=/; max-age=31536000";
      }
      
      // 重新加載頁面以應用新語言設置
      window.location.reload();
    });
  }
  
  // 從cookie獲取當前語言設置
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  
  // 初始化語言設置
  const nextLocale = getCookie('NEXT_LOCALE');
  if (nextLocale) {
    localStorage.setItem('language', nextLocale);
    if (nextLocale === 'zh') {
      document.body.classList.add('zh-mode');
      if (currentLangElement) {
        currentLangElement.textContent = 'ZH';
      }
    } else {
      document.body.classList.remove('zh-mode');
      if (currentLangElement) {
        currentLangElement.textContent = 'EN';
      }
    }
  } else {
    // 如果沒有cookie設置，使用localStorage中的設置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage === 'zh') {
      document.body.classList.add('zh-mode');
      if (currentLangElement) {
        currentLangElement.textContent = 'ZH';
      }
      document.cookie = "NEXT_LOCALE=zh; path=/; max-age=31536000";
    } else if (savedLanguage === 'en') {
      document.body.classList.remove('zh-mode');
      if (currentLangElement) {
        currentLangElement.textContent = 'EN';
      }
      document.cookie = "NEXT_LOCALE=en; path=/; max-age=31536000";
    }
  }

  // 添加到購物車功能
  const addToCartButtons = document.querySelectorAll('.btn-add-cart');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-product-id');
      addToCart(productId);
    });
  });
  
  function addToCart(productId) {
    // 獲取當前購物車數據
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 檢查產品是否已在購物車中
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        quantity: 1
      });
    }
    
    // 保存更新的購物車
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 更新購物車計數
    updateCartCount();
    
    // 顯示添加成功訊息
    showNotification('產品已添加到購物車');
  }
  
  // 更新購物車數量顯示
  function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    let totalItems = 0;
    cart.forEach(item => {
      totalItems += item.quantity;
    });
    
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
    }
  }
  
  // 初始化購物車計數
  updateCartCount();
  
  // 顯示通知訊息
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 顯示通知
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // 移除通知
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // 圖片載入失敗時的替代處理
  document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
      this.style.backgroundColor = '#1a1a1a';
      this.style.height = this.parentElement.classList.contains('product-image') ? '250px' : 
                         this.parentElement.classList.contains('category-card') ? '300px' : 
                         this.parentElement.classList.contains('testimonial-author') ? '60px' : '200px';
      this.style.width = this.parentElement.classList.contains('testimonial-author') ? '60px' : '100%';
      this.style.borderRadius = this.parentElement.classList.contains('testimonial-author') ? '50%' : '8px';
      this.alt = 'Image placeholder';
      this.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; // 透明占位符
      
      // 添加標籤文字
      const label = document.createElement('div');
      label.style.position = 'absolute';
      label.style.top = '50%';
      label.style.left = '50%';
      label.style.transform = 'translate(-50%, -50%)';
      label.style.color = '#666';
      label.style.fontSize = '1rem';
      label.textContent = this.parentElement.classList.contains('product-image') ? 'Product Image' : 
                         this.parentElement.classList.contains('category-card') ? 'Category Image' : 
                         this.parentElement.classList.contains('testimonial-author') ? 'Avatar' : 'Image';
      this.parentElement.style.position = 'relative';
      this.parentElement.appendChild(label);
    };
  });
  
  // 添加品牌自動滾動功能
  const brandsMarquee = document.querySelectorAll('.brands-marquee .marquee-content');
  if (brandsMarquee.length > 0) {
    brandsMarquee.forEach(marquee => {
      const clone = marquee.cloneNode(true);
      marquee.parentElement.appendChild(clone);
    });
  }
}); 