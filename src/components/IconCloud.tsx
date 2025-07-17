import React, { useState, useEffect, useRef } from 'react';

interface IconCloudProps {
  images: string[];
}

interface BrandItemProps {
  text: string;
  style: React.CSSProperties;
}

// 單個品牌項目組件
const BrandItem: React.FC<BrandItemProps> = ({ text, style }) => {
  return <div className="brand-item" style={style}>{text}</div>;
};

export function IconCloud({ images }: IconCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [brandStyles, setBrandStyles] = useState<React.CSSProperties[]>([]);
  const animationRef = useRef<number>();
  const frameRef = useRef(0);

  // 初始化品牌樣式
  useEffect(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth || 600;
    const containerHeight = containerRef.current.clientHeight || 600;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    // 創建初始樣式
    const initialStyles = images.map((_, index) => {
      const theta = Math.random() * Math.PI * 2;
      const radius = 180 + Math.random() * 120; // 增大半徑
      const fontSize = Math.random() * 20 + 14; // 增大字體
      
      return {
        position: 'absolute',
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: 'bold',
        fontSize: `${fontSize}px`,
        fontFamily: 'Audiowide, sans-serif',
        textShadow: '0 0 8px rgba(255, 0, 128, 0.9), 0 0 16px rgba(0, 255, 255, 0.6)',
        transition: 'opacity 0.5s ease',
        left: `${centerX + radius * Math.cos(theta)}px`,
        top: `${centerY + radius * Math.sin(theta)}px`,
        opacity: 0,
        zIndex: 100,
        transform: 'scale(1)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      } as React.CSSProperties;
    });
    
    setBrandStyles(initialStyles);
    
    // 逐漸顯示元素的效果
    const timers = images.map((_, index) => {
      return setTimeout(() => {
        setBrandStyles(prev => {
          const newStyles = [...prev];
          if (newStyles[index]) {
            newStyles[index] = { ...newStyles[index], opacity: 1 };
          }
          return newStyles;
        });
      }, index * 80);
    });
    
    setLoaded(true);
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [images]);
  
  // 動畫效果
  useEffect(() => {
    if (!containerRef.current || !loaded) return;
    
    const containerWidth = containerRef.current.clientWidth || 600;
    const containerHeight = containerRef.current.clientHeight || 600;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    const animate = () => {
      frameRef.current += 0.008; // 稍微慢一點的動畫
      const frame = frameRef.current;
      
      setBrandStyles(prev => {
        return prev.map((style, index) => {
          const theta = frame + (index * Math.PI * 2) / images.length;
          const radius = 180 + Math.sin(frame * 0.5 + index) * 60; // 更大的半徑範圍
          const zIndex = Math.floor(Math.sin(theta) * 100 + 100);
          const brightness = Math.sin(theta) * 0.4 + 1.3;
          const scale = Math.sin(theta) * 0.4 + 0.8;
          
          return {
            ...style,
            left: `${centerX + radius * Math.cos(theta)}px`,
            top: `${centerY + radius * Math.sin(theta)}px`,
            zIndex,
            filter: `brightness(${brightness})`,
            transform: `scale(${scale})`,
          };
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [images, loaded]);
  
  return (
    <div 
      ref={containerRef} 
      className="relative h-[600px] w-[600px] overflow-visible hidden-on-mobile"
      style={{
        background: 'radial-gradient(circle, rgba(0,12,36,0.6) 0%, rgba(9,9,121,0.3) 40%, rgba(0,212,255,0) 70%)',
        borderRadius: '50%',
      }}
    >
      {!loaded && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
        </div>
      )}
      
      {loaded && images.map((image, index) => (
        <BrandItem 
          key={`brand-${index}-${image}`} 
          text={image} 
          style={brandStyles[index] || {}} 
        />
      ))}
    </div>
  );
}

export function BrandsIconCloud() {
  const [brands, setBrands] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  // 從 Directus API 獲取品牌數據
  React.useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/brands');
        const data = await response.json();
        
        if (data.success) {
          // 提取品牌名稱用於3D雲顯示
          const brandNames = data.data.map((brand: any) => brand.name);
          setBrands(brandNames);
        } else {
          // 如果API失敗，使用靜態數據作為後備
          console.warn('Failed to fetch brands from API, using fallback');
          setBrands([
            "Supreme", "Nike", "Adidas", "KAWS", "Off-White", "Apple",
            "Yeezy", "Jordan", "PlayStation", "Xbox", "BAPE", "Palace"
          ]);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        // 錯誤時使用靜態數據作為後備
        setBrands([
          "Supreme", "Nike", "Adidas", "KAWS", "Off-White", "Apple",
          "Yeezy", "Jordan", "PlayStation", "Xbox", "BAPE", "Palace"
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <IconCloud images={brands} />
    </div>
  );
} 