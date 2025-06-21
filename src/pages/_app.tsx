import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/components/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
} 