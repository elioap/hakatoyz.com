import React, { createContext, useContext, useState, useEffect } from 'react';

// 購物車項目類型
export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (id: number) => boolean;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 初始化時設置 isLoaded 為 false
  const [isLoaded, setIsLoaded] = useState(false);
  // 初始化購物車為空數組
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 在客戶端加載購物車數據
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart');
      setCartItems(saved ? JSON.parse(saved) : []);
      setIsLoaded(true);
    }
  }, []);

  // 當購物車更新時，保存到本地存儲
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  // 添加商品到購物車
  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // 商品已經在購物車中，更新數量
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      setCartItems(updatedItems);
    } else {
      // 商品不在購物車中，添加新項目
      setCartItems([...cartItems, { ...item, quantity }]);
    }
  };

  // 從購物車移除商品
  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // 更新購物車中商品數量
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
  };

  // 清空購物車
  const clearCart = () => {
    setCartItems([]);
  };

  // 獲取購物車總商品數
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // 獲取購物車總價
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // 檢查商品是否在購物車中
  const isInCart = (id: number) => {
    return cartItems.some(item => item.id === id);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isInCart,
      isLoaded
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 