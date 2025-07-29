import { useState, useEffect } from 'react';
import { productService } from '../services/restaurantService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Todos']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos iniciales
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        productService.getCategories()
      ]);
      
      setProducts(productsData);
      setCategories(['Todos', ...categoriesData]);
      
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos por categoría
  const loadProductsByCategory = async (category) => {
    if (category === 'Todos') {
      return loadProducts();
    }

    try {
      setLoading(true);
      setError(null);
      
      const categoryProducts = await productService.getByCategory(category);
      setProducts(categoryProducts);
      
    } catch (err) {
      setError(err.message);
      console.error('Error loading products by category:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar productos
  const searchProducts = (searchTerm) => {
    if (!searchTerm.trim()) {
      loadProducts();
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setProducts(filtered);
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    loadProducts,
    loadProductsByCategory,
    searchProducts,
    refetch: loadProducts
  };
};