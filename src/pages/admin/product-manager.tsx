import React, { useState, useEffect } from 'react';
import { apiService } from '../../utils/api';

interface Category {
  id: number;
  attributes: {
    name: string;
    description?: string;
    createdAt: string;
  };
}

interface Product {
  id: number;
  attributes: {
    title: string;
    price: number;
    inStock: boolean;
    description?: string;
    createdAt: string;
    category?: {
      data: Category;
    };
    image?: {
      data: any[];
    };
  };
}

interface ProductForm {
  title: string;
  price: number;
  inStock: boolean;
  description: string;
  categoryId: number | null;
}

interface CategoryForm {
  name: string;
  description: string;
}

const ProductManager = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product & Category 管理</h1>
      <p>產品管理頁面</p>
    </div>
  );
};

export default ProductManager; 