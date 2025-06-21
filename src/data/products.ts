// 定義商品類型
export interface Product {
  id: number;
  name: {
    zh: string;
    en: string;
  };
  price: number;
  originalPrice?: number; // 原價（用於顯示折扣）
  category: {
    zh: string;
    en: string;
  };
  image: string;
  images: string[];
  description: {
    zh: string;
    en: string;
  };
  specs?: {
    key: {
      zh: string;
      en: string;
    };
    value: {
      zh: string;
      en: string;
    };
  }[];
  features?: {
    zh: string;
    en: string;
  }[]; // 商品特色列表
  tag?: 'hot' | 'new' | 'limited' | null;
  tags?: string[]; // 多個標籤
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

// 商品數據
export const products: Product[] = [
  {
    id: 1,
    name: {
      zh: "科技積木套裝",
      en: "Tech Building Set"
    },
    price: 299,
    originalPrice: 399, // 原價
    category: {
      zh: "科技玩具",
      en: "Tech Toys"
    },
    image: "/images/product1.jpg",
    images: [
      "/images/product1.jpg",
      "/images/product2.jpg",
      "/images/product3.jpg",
      "/images/product4.jpg",
    ],
    description: {
      zh: "這款科技積木套裝包含500多個小零件，可以組裝成各種機械模型。適合7歲以上兒童，幫助培養空間想象力和動手能力。產品材質安全環保，接縫緊密，色彩鮮艷。",
      en: "This tech building set includes over 500 small parts that can be assembled into various mechanical models. Suitable for children aged 7 and above, it helps develop spatial imagination and hands-on skills. The product is made of safe and environmentally friendly materials, with tight seams and vibrant colors."
    },
    features: [
      { zh: "500+精密零件，組裝體驗豐富", en: "500+ precision parts for rich assembly experience" },
      { zh: "環保ABS材質，安全無毒", en: "Eco-friendly ABS material, safe and non-toxic" },
      { zh: "多種模型組合，創意無限", en: "Multiple model combinations, unlimited creativity" },
      { zh: "培養空間思維和動手能力", en: "Develops spatial thinking and hands-on skills" },
      { zh: "適合親子互動遊戲", en: "Perfect for parent-child interactive play" }
    ],
    specs: [
      { 
        key: { zh: "適用年齡", en: "Age" }, 
        value: { zh: "7歲以上", en: "7+ years" } 
      },
      { 
        key: { zh: "零件數量", en: "Parts" }, 
        value: { zh: "500+", en: "500+" } 
      },
      { 
        key: { zh: "材質", en: "Material" }, 
        value: { zh: "環保ABS塑料", en: "Eco-friendly ABS plastic" } 
      },
      { 
        key: { zh: "產品尺寸", en: "Dimensions" }, 
        value: { zh: "包裝盒：40 x 30 x 10cm", en: "Package: 40 x 30 x 10cm" } 
      },
      { 
        key: { zh: "產品重量", en: "Weight" }, 
        value: { zh: "約1.2kg", en: "Approx. 1.2kg" } 
      },
      { 
        key: { zh: "產地", en: "Made in" }, 
        value: { zh: "中國", en: "China" } 
      },
      { 
        key: { zh: "電池要求", en: "Battery" }, 
        value: { zh: "不需要電池", en: "No battery required" } 
      },
    ],
    tag: "hot",
    tags: ["HOT", "SALE"],
    inStock: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-06-20T00:00:00Z"
  },
  { 
    id: 2, 
    name: {
      zh: "智能遙控機器人",
      en: "Smart RC Robot"
    }, 
    price: 399, 
    category: {
      zh: "科技玩具",
      en: "Tech Toys"
    }, 
    image: "/images/product2.jpg",
    images: [
      "/images/product2.jpg",
      "/images/product2.jpg",
      "/images/product2.jpg",
      "/images/product2.jpg",
    ],
    description: {
      zh: "智能遙控機器人，可通過手機APP控制，支持編程和語音指令。配備紅外線感應器和觸摸感應，能夠自動避障和跟隨物體移動。內置充電電池，續航時間約2小時。",
      en: "Smart remote-controlled robot that can be controlled via a mobile app, supporting programming and voice commands. Equipped with infrared sensors and touch sensing, it can automatically avoid obstacles and follow objects. Built-in rechargeable battery with approximately 2 hours of runtime."
    },
    specs: [
      { 
        key: { zh: "適用年齡", en: "Age" }, 
        value: { zh: "8歲以上", en: "8+ years" } 
      },
      { 
        key: { zh: "尺寸", en: "Size" }, 
        value: { zh: "25 x 15 x 10cm", en: "25 x 15 x 10cm" } 
      },
      { 
        key: { zh: "電池", en: "Battery" }, 
        value: { zh: "內置可充電鋰電池", en: "Built-in rechargeable lithium battery" } 
      },
      { 
        key: { zh: "充電時間", en: "Charging Time" }, 
        value: { zh: "約2小時", en: "Approx. 2 hours" } 
      }
    ],
    tag: null,
    inStock: true,
    createdAt: "2023-02-10T00:00:00Z",
    updatedAt: "2023-07-15T00:00:00Z"
  },
  { 
    id: 3, 
    name: {
      zh: "益智拼圖遊戲",
      en: "Educational Puzzle Game"
    }, 
    price: 99, 
    category: {
      zh: "益智遊戲",
      en: "Educational Games"
    }, 
    image: "/images/product3.jpg",
    images: [
      "/images/product3.jpg",
      "/images/product3.jpg",
      "/images/product3.jpg",
      "/images/product3.jpg",
    ],
    description: {
      zh: "這款益智拼圖遊戲包含100片高質量的拼圖，拼出後形成精美的風景畫。適合5歲以上兒童，有助於培養耐心、觀察力和專注力。拼圖邊緣平滑，色彩鮮明持久。",
      en: "This educational puzzle game contains 100 high-quality puzzle pieces that form a beautiful landscape when assembled. Suitable for children aged 5 and above, it helps develop patience, observation skills, and concentration. The puzzle edges are smooth with vibrant and long-lasting colors."
    },
    specs: [
      { 
        key: { zh: "適用年齡", en: "Age" }, 
        value: { zh: "5歲以上", en: "5+ years" } 
      },
      { 
        key: { zh: "拼圖片數", en: "Pieces" }, 
        value: { zh: "100片", en: "100 pieces" } 
      },
      { 
        key: { zh: "完成尺寸", en: "Completed Size" }, 
        value: { zh: "40 x 30cm", en: "40 x 30cm" } 
      }
    ],
    tag: "new",
    inStock: true,
    createdAt: "2023-03-05T00:00:00Z",
    updatedAt: "2023-08-01T00:00:00Z"
  },
  { 
    id: 4, 
    name: {
      zh: "兒童繪畫套裝",
      en: "Kids Art Kit"
    }, 
    price: 129, 
    category: {
      zh: "藝術創作",
      en: "Arts & Crafts"
    }, 
    image: "/images/product4.jpg",
    images: [
      "/images/product4.jpg",
      "/images/product4.jpg",
      "/images/product4.jpg",
      "/images/product4.jpg",
    ],
    description: {
      zh: "全面的兒童繪畫套裝，包含水彩筆、蠟筆、彩色鉛筆、繪圖紙和繪畫教程。顏料採用天然成分，無毒無害，易於清洗。適合4歲以上兒童，激發創造力和藝術表達能力。",
      en: "Comprehensive art kit for kids that includes watercolor pens, crayons, colored pencils, drawing paper, and painting tutorials. The paints are made from natural ingredients, non-toxic, and easy to clean. Suitable for children aged 4 and above, it stimulates creativity and artistic expression."
    },
    specs: [
      { 
        key: { zh: "適用年齡", en: "Age" }, 
        value: { zh: "4歲以上", en: "4+ years" } 
      },
      { 
        key: { zh: "包含物品", en: "Contents" }, 
        value: { zh: "水彩筆24色，蠟筆12色，彩色鉛筆12色，繪圖紙30張", en: "24 watercolor pens, 12 crayons, 12 colored pencils, 30 sheets of drawing paper" } 
      },
      { 
        key: { zh: "材質", en: "Material" }, 
        value: { zh: "無毒水溶性顏料", en: "Non-toxic water-soluble paint" } 
      }
    ],
    tag: null,
    inStock: true,
    createdAt: "2023-04-12T00:00:00Z",
    updatedAt: "2023-09-05T00:00:00Z"
  },
  { 
    id: 5, 
    name: {
      zh: "戶外水槍套裝",
      en: "Outdoor Water Gun Set"
    }, 
    price: 89, 
    category: {
      zh: "戶外玩具",
      en: "Outdoor Toys"
    }, 
    image: "/images/product5.jpg",
    images: [
      "/images/product5.jpg",
      "/images/product5.jpg",
      "/images/product5.jpg",
      "/images/product5.jpg",
    ],
    description: {
      zh: "這款戶外水槍套裝包含兩把高壓水槍，射程可達8米。容量400ml，採用環保ABS塑料製成，耐用且安全。適合夏季戶外玩耍，為孩子帶來清涼的水上樂趣。",
      en: "This outdoor water gun set includes two high-pressure water guns with a range of up to 8 meters. Each gun has a capacity of 400ml and is made of eco-friendly ABS plastic, durable and safe. Perfect for outdoor summer play, providing cooling water fun for children."
    },
    specs: [
      { 
        key: { zh: "適用年齡", en: "Age" }, 
        value: { zh: "6歲以上", en: "6+ years" } 
      },
      { 
        key: { zh: "水槍數量", en: "Number of Guns" }, 
        value: { zh: "2把", en: "2 pieces" } 
      },
      { 
        key: { zh: "容量", en: "Capacity" }, 
        value: { zh: "每把400ml", en: "400ml each" } 
      },
      { 
        key: { zh: "射程", en: "Range" }, 
        value: { zh: "最遠8米", en: "Up to 8 meters" } 
      }
    ],
    tag: null,
    inStock: true,
    createdAt: "2023-05-20T00:00:00Z",
    updatedAt: "2023-10-10T00:00:00Z"
  },
  { 
    id: 6, 
    name: {
      zh: "魔方解謎玩具",
      en: "Puzzle Cube Toy"
    }, 
    price: 69, 
    category: {
      zh: "益智遊戲",
      en: "Educational Games"
    }, 
    image: "/images/product6.jpg",
    images: [
      "/images/product6.jpg",
      "/images/product6.jpg",
      "/images/product6.jpg",
      "/images/product6.jpg",
    ],
    description: {
      zh: "專業級魔方解謎玩具，採用高品質ABS材料，轉動順暢不卡住。附帶解法指南，從初學者到專業玩家都適用。鍛煉邏輯思維和空間想象力，提高手指靈活度。",
      en: "Professional-grade puzzle cube toy made from high-quality ABS material, with smooth rotation and no jamming. Comes with a solution guide, suitable for beginners to professional players. Exercises logical thinking and spatial imagination, improves finger dexterity."
    },
    specs: [
      { 
        key: { zh: "適用年齡", en: "Age" }, 
        value: { zh: "8歲以上", en: "8+ years" } 
      },
      { 
        key: { zh: "尺寸", en: "Size" }, 
        value: { zh: "5.7 x 5.7 x 5.7cm", en: "5.7 x 5.7 x 5.7cm" } 
      },
      { 
        key: { zh: "材質", en: "Material" }, 
        value: { zh: "ABS塑料", en: "ABS plastic" } 
      },
      { 
        key: { zh: "重量", en: "Weight" }, 
        value: { zh: "約85g", en: "Approx. 85g" } 
      }
    ],
    tag: "limited",
    inStock: true,
    createdAt: "2023-06-08T00:00:00Z",
    updatedAt: "2023-11-15T00:00:00Z"
  }
];

// 獲取所有商品
export function getAllProducts(): Product[] {
  return products;
}

// 獲取單個商品
export function getProductById(id: number): Product | undefined {
  return products.find(product => product.id === id);
}

// 根據分類獲取商品
export function getProductsByCategory(category: string, locale: string = 'en'): Product[] {
  const categoryKey = locale === 'en' ? 'en' : 'zh';
  return products.filter(product => product.category[categoryKey] === category);
}

// 獲取熱門商品
export function getHotProducts(): Product[] {
  return products.filter(product => product.tag === 'hot');
}

// 獲取新商品
export function getNewProducts(): Product[] {
  return products.filter(product => product.tag === 'new');
}

// 獲取限量商品
export function getLimitedProducts(): Product[] {
  return products.filter(product => product.tag === 'limited');
}

// 搜索商品
export function searchProducts(query: string, locale: string = 'en'): Product[] {
  const langKey = locale === 'en' ? 'en' : 'zh';
  const lowercaseQuery = query.toLowerCase();
  
  return products.filter(product => 
    product.name[langKey].toLowerCase().includes(lowercaseQuery) ||
    product.description[langKey].toLowerCase().includes(lowercaseQuery) ||
    product.category[langKey].toLowerCase().includes(lowercaseQuery)
  );
}
