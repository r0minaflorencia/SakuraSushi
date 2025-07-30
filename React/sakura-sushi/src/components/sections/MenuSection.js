import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';

const MenuSection = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['Todos']);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // ACÁ ES DONDE CONECTO EL BACKEND
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Esta línea llama a la api
        const data = await productService.getAll();
        
        setProducts(data);
        
        // Extraer categorías únicas
        const uniqueCategories = ['Todos', ...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
        
      } catch (err) {
        setError('Error al cargar los productos');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddProduct = async (e) => {
  e.preventDefault();
  setAddingProduct(true);
  
  try {
    const productData = {
      name: newProduct.name.trim(),
      description: newProduct.description.trim(),
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image || '🍣'
    };

    await createProduct(productData); // Mucho más simple!
    await refetchProducts();
    
    // Reset form...
    showSuccessMessage('Producto agregado exitosamente!');
    
  } catch (error) {
    showErrorMessage(error.message); // El mensaje ya viene procesado
  } finally {
    setAddingProduct(false);
  }
};

  // Filtrar productos cuando cambia la categoría
  useEffect(() => {
    if (selectedCategory !== 'Todos') {
      const loadCategoryProducts = async () => {
        try {
          setLoading(true);
          const data = await productService.getByCategory(selectedCategory);
          setProducts(data);
        } catch (err) {
          setError('Error al filtrar productos');
        } finally {
          setLoading(false);
        }
      };
      loadCategoryProducts();
    }
  }, [selectedCategory]);

  // El resto del componente permanece igual...
  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSX del componente */}
    </div>
  );
};

export default MenuSection;