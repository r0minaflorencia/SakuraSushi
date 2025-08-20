import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Todos']);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar productos y categorías iniciales
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        productService.getCategories()
      ]);

      setProducts(productsData);
      setAllProducts(productsData); // Guardar en cache
      setCategories(['Todos', ...categoriesData]);

    } catch (err) {
      setError(err.message);
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar solo productos (sin categorías)
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const productsData = await productService.getAll();
      setProducts(productsData);
      setAllProducts(productsData); // Actualizar cache

    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos por categoría
  const loadProductsBycategoria = useCallback(async (categoria) => {
    if (categoria === 'Todos') {
      // Usar cache si existe, sino cargar
      if (allProducts.length > 0) {
        setProducts(allProducts);
        return;
      } else {
        return loadProducts();
      }
    }

    try {
      setLoading(true);
      setError(null);

      const categoriaProducts = await productService.getProductsByCategoria(categoria);
      setProducts(categoriaProducts);

    } catch (err) {
      setError(err.message);
      console.error('Error loading products by categoria:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar productos
  const searchProducts = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const searchResults = await productService.search(searchTerm);
      setProducts(searchResults);

    } catch (err) {
      setError(err.message);
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    loadInitialData,
    loadProducts,
    loadProductsBycategoria,
    searchProducts,
  };
};

export default useProducts;