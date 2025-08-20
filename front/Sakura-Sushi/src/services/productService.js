import api from './api';

export const productService = {
  // Obtener todos los productos
  getAll: async () => {
    try {
      const response = await api.get('/productos');
      // Extraer solo el contenido del objeto Page
      return response.data.content || response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('No se pudieron cargar los productos');
    }
  },

  getProductsByCategoria: async (categoria) => {
    try {
      const response = await api.get(`/productos?categoria=${categoria}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoria}:`, error);
      throw error;
    }
  },

  // Obtener producto específico
  getById: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error('Producto no encontrado');
    }
  },

  // Buscar productos
  search: async (searchTerm) => {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return [];
      }

      const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
      const response = await api.get(`/productos/busqueda?q=${encodedSearchTerm}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('No se pudieron encontrar productos con ese término de búsqueda');
    }
  },

  // Obtener categorías disponibles
  getCategories: async () => {
    try {
      const response = await api.get('/productos/categorias');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback a categorías por defecto
      return ['Maki', 'Nigiri', 'Sashimi', 'Combo', 'General'];
    }
  },

  // Crear producto
  create: async (productData) => {
    try {
      // Validar datos requeridos
      if (!productData.nombre || !productData.precioBase) {
        throw new Error('Nombre y precio son campos obligatorios');
      }

      const dataToSend = {
        nombre: productData.nombre,
        descripcion: productData.descripcion || '',
        precioBase: parseFloat(productData.precioBase),
        dType: productData.dType,
        // image: productData.image || '🍣', 
        disponible: productData.disponible || true,
        esGlutenFree: productData.esGlutenFree || false,
        esPicante: productData.esPicante || false,
        esVegano: productData.esVegano || false,
        esVegetariano: productData.esVegetariano || false,
      };

      if (isNaN(dataToSend.precioBase) || dataToSend.precioBase <= 0) {
        throw new Error('El precio debe ser un número mayor a 0');
      }

      console.log('Datos finales a enviar al backend (desde restaurantService):', dataToSend);

      const response = await api.post('/productos', dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);

      // Extraer mensaje de error más específico
      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || 'Error al crear el producto';

      throw new Error(errorMessage);
    }
  },

  // Actualizar producto existente
  update: async (productId, productData) => {
    try {
      if (!productId) {
        throw new Error('ID del producto es requerido');
      }

      // Preparar datos para enviar
      const dataToSend = {
        nombre: productData.nombre,
        descripcion: productData.descripcion || '',
        precioBase: parseFloat(productData.precioBase || productData.precio),
        dType: productData.dType || productData.categoria?.toUpperCase(),
        disponible: productData.disponible !== undefined ? productData.disponible : true,
        esGlutenFree: productData.esGlutenFree || false,
        esPicante: productData.esPicante || false,
        esVegano: productData.esVegano || false,
        esVegetariano: productData.esVegetariano || false,
      };

      // Validar que el precio sea válido si se proporciona
      if (dataToSend.precioBase && (isNaN(dataToSend.precioBase) || dataToSend.precioBase <= 0)) {
        throw new Error('El precio debe ser un número mayor a 0');
      }

      const response = await api.put(`/productos/${productId}`, dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);

      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || 'Error al actualizar el producto';

      throw new Error(errorMessage);
    }
  },

  // Eliminar producto (admin)
  delete: async (productId) => {
    try {
      const response = await api.delete(`/productos/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('No se pudo eliminar el producto');
    }
  }
};

export default productService;