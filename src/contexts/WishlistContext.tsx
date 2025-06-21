import React, { createContext, useContext, useState, useEffect } from 'react';

// 願望清單項目類型
export interface WishlistItem {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  inStock: boolean;
}

// 通知類型
export interface Notification {
  productId: number;
  email?: string;
  line?: string;
  notified: boolean;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  notifications: Notification[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  subscribeNotification: (productId: number, email?: string, line?: string) => void;
  removeNotification: (productId: number) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 從本地存儲加載願望清單
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // 從本地存儲加載通知設置
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wishlistNotifications');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 當願望清單更新時，保存到本地存儲
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems]);

  // 當通知更新時，保存到本地存儲
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlistNotifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // 添加到願望清單
  const addToWishlist = (item: WishlistItem) => {
    if (!isInWishlist(item.id)) {
      setWishlistItems([...wishlistItems, item]);
    }
  };

  // 從願望清單移除
  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    // 同時移除相關通知
    removeNotification(id);
  };

  // 檢查是否在願望清單中
  const isInWishlist = (id: number) => {
    return wishlistItems.some(item => item.id === id);
  };

  // 訂閱到貨通知
  const subscribeNotification = (productId: number, email?: string, line?: string) => {
    const existingIndex = notifications.findIndex(n => n.productId === productId);
    
    if (existingIndex >= 0) {
      // 更新現有通知
      const updatedNotifications = [...notifications];
      updatedNotifications[existingIndex] = {
        ...updatedNotifications[existingIndex],
        email: email || updatedNotifications[existingIndex].email,
        line: line || updatedNotifications[existingIndex].line,
        notified: false
      };
      setNotifications(updatedNotifications);
    } else {
      // 添加新通知
      setNotifications([...notifications, {
        productId,
        email,
        line,
        notified: false
      }]);
    }
  };

  // 移除通知訂閱
  const removeNotification = (productId: number) => {
    setNotifications(notifications.filter(n => n.productId !== productId));
  };

  // 清空願望清單
  const clearWishlist = () => {
    setWishlistItems([]);
    setNotifications([]);
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      notifications,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      subscribeNotification,
      removeNotification,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 