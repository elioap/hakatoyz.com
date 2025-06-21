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
    
    const containerWidth = containerRef.current.clientWidth || 400;
    const containerHeight = containerRef.current.clientHeight || 400;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    // 創建初始樣式
    const initialStyles = images.map((_, index) => {
      const theta = Math.random() * Math.PI * 2;
      const radius = 120 + Math.random() * 80;
      const fontSize = Math.random() * 16 + 12;
      
      return {
        position: 'absolute',
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 'bold',
        fontSize: `${fontSize}px`,
        fontFamily: 'Audiowide, sans-serif',
        textShadow: '0 0 5px rgba(255, 0, 128, 0.8), 0 0 10px rgba(0, 255, 255, 0.5)',
        transition: 'opacity 0.5s ease',
        left: `${centerX + radius * Math.cos(theta)}px`,
        top: `${centerY + radius * Math.sin(theta)}px`,
        opacity: 0,
        zIndex: 100,
        transform: 'scale(1)',
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
      }, index * 100);
    });
    
    setLoaded(true);
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [images]);
  
  // 動畫效果
  useEffect(() => {
    if (!containerRef.current || !loaded) return;
    
    const containerWidth = containerRef.current.clientWidth || 400;
    const containerHeight = containerRef.current.clientHeight || 400;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    const animate = () => {
      frameRef.current += 0.01;
      const frame = frameRef.current;
      
      setBrandStyles(prev => {
        return prev.map((style, index) => {
          const theta = frame + (index * Math.PI * 2) / images.length;
          const radius = 120 + Math.sin(frame * 0.5) * 40;
          const zIndex = Math.floor(Math.sin(theta) * 100 + 100);
          const brightness = Math.sin(theta) * 0.5 + 1.5;
          const scale = Math.sin(theta) * 0.3 + 0.7;
          
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
      className="relative h-[400px] w-[400px] overflow-hidden rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(0,12,36,0.8) 0%, rgba(9,9,121,0.4) 35%, rgba(0,212,255,0) 100%)',
      }}
    >
      {!loaded && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-purple-500"></div>
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
  // 熱門代購品牌名稱
  const brands = [
    "Supreme",
    "Nike",
    "Adidas",
    "KAWS",
    "Off-White",
    "Apple",
    "Yeezy",
    "Jordan",
    "PlayStation",
    "Xbox",
    "BAPE",
    "Palace",
    "Stussy",
    "New Balance",
    "UNIQLO",
    "Lego",
    "Nintendo",
    "Funko",
    "Champion",
    "Puma",
    "Converse",
    "Vans",
    "Disney",
    "Marvel",
    "Pokémon",
    "Chrome Hearts",
    "Louis Vuitton",
    "Gucci",
    "Balenciaga",
    "Fear of God"
  ];

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <IconCloud images={brands} />
    </div>
  );
} 