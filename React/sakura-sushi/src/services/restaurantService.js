import api from './api';

// =============================================================================
// SERVICIO DE PRODUCTOS
// =============================================================================
export const productService = {
  // Obtener todos los productos
  getAll: async () => {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('No se pudieron cargar los productos');
    }
  },

  // Obtener productos por categoría
  getByCategory: async (category) => {
    try {
      // Si es "Todos", obtener todos los productos
      if (category === 'Todos' || !category) {
        return await productService.getAll();
      }
      
      const response = await api.get(`/productos/categoria/${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new Error(`No se pudieron cargar los productos de la categoría ${category}`);
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
      const response = await api.get(`/productos/busqueda/${encodedSearchTerm}`);
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
      return ['Maki', 'Nigiri', 'Sashimi', 'Combo'];
    }
  },

  // Crear nuevo producto (admin)
  create: async (productData) => {
    try {
      const response = await api.post('/productos', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('No se pudo crear el producto');
    }
  },

  // Actualizar producto (admin)
  update: async (productId, productData) => {
    try {
      const response = await api.put(`/productos/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('No se pudo actualizar el producto');
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

// =============================================================================
// SERVICIO DE PEDIDOS (Compatible con useOrders)
// =============================================================================
export const orderService = {
  // Crear un nuevo pedido
  create: async (orderData) => {
    try {
      // Validaciones básicas
      if (!orderData) {
        throw new Error('Datos de pedido requeridos');
      }

      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('El pedido debe contener al menos un producto');
      }

      if (!orderData.customer || !orderData.customer.name) {
        throw new Error('Información del cliente requerida');
      }

      const orderPayload = {
        cliente: {
          nombre: orderData.customer.name,
          email: orderData.customer.email,
          telefono: orderData.customer.phone,
          direccion: orderData.customer.address
        },
        items: orderData.items.map(item => ({
          productoId: item.id,
          cantidad: item.quantity,
          precio: item.price,
          subtotal: item.price * item.quantity,
          nombre: item.name // Incluir nombre para referencia
        })),
        total: orderData.total,
        metodoPago: orderData.paymentMethod || 'EFECTIVO',
        tipoEntrega: orderData.deliveryType || 'DELIVERY',
        estado: orderData.status || 'PENDIENTE',
        fechaPedido: new Date().toISOString(),
        numeroPedido: orderData.orderNumber || `ORD-${Date.now()}`
      };

      const response = await api.post('/pedidos', orderPayload);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(error.message || 'No se pudo procesar el pedido. Intenta nuevamente.');
    }
  },

  // Obtener todos los pedidos (con filtros opcionales)
  getAll: async (customerId = null, status = null, limit = null) => {
    try {
      let endpoint = '/pedidos';
      const params = new URLSearchParams();

      if (customerId) params.append('clienteId', customerId);
      if (status) params.append('estado', status);
      if (limit) params.append('limite', limit);

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error('No se pudieron cargar los pedidos');
    }
  },

  // Obtener un pedido específico
  getById: async (orderId) => {
    try {
      if (!orderId) {
        throw new Error('ID de pedido requerido');
      }

      const response = await api.get(`/pedidos/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order by ID:', error);
      throw new Error('No se pudo obtener el pedido');
    }
  },

  // Obtener estado del pedido
  getStatus: async (orderId) => {
    try {
      const response = await api.get(`/pedidos/${orderId}/estado`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw new Error('No se pudo obtener el estado del pedido');
    }
  },

  // Actualizar estado de un pedido
  updateStatus: async (orderId, newStatus, notes = '') => {
    try {
      if (!orderId || !newStatus) {
        throw new Error('ID de pedido y nuevo estado requeridos');
      }

      const validStatuses = ['PENDIENTE', 'CONFIRMADO', 'PREPARANDO', 'LISTO', 'ENTREGADO', 'CANCELADO'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error('Estado de pedido inválido');
      }

      const updateData = {
        estado: newStatus,
        fechaActualizacion: new Date().toISOString(),
        ...(notes && { notas: notes })
      };

      const response = await api.patch(`/pedidos/${orderId}/estado`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('No se pudo actualizar el estado del pedido');
    }
  },

  // Cancelar un pedido
  cancel: async (orderId, reason = '') => {
    try {
      if (!orderId) {
        throw new Error('ID de pedido requerido');
      }

      const cancelData = {
        estado: 'CANCELADO',
        motivoCancelacion: reason,
        fechaCancelacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      };

      const response = await api.patch(`/pedidos/${orderId}/cancelar`, cancelData);
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw new Error('No se pudo cancelar el pedido');
    }
  },

  // Obtener historial de pedidos del cliente
  getHistory: async (customerEmail) => {
    try {
      const response = await api.get(`/pedidos/cliente/${encodeURIComponent(customerEmail)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw new Error('No se pudo obtener el historial de pedidos');
    }
  },

  // Obtener historial por ID de cliente
  getCustomerHistory: async (customerId, limit = 10) => {
    try {
      if (!customerId) {
        throw new Error('ID de cliente requerido');
      }

      const response = await api.get(`/pedidos/cliente/id/${customerId}?limite=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer order history:', error);
      throw new Error('No se pudo obtener el historial de pedidos del cliente');
    }
  },

  // Obtener estadísticas de pedidos (admin)
  getStats: async (startDate = null, endDate = null) => {
    try {
      let endpoint = '/pedidos/estadisticas';
      const params = new URLSearchParams();

      if (startDate) params.append('fechaInicio', startDate);
      if (endDate) params.append('fechaFin', endDate);

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw new Error('No se pudieron obtener las estadísticas');
    }
  }
};

// =============================================================================
// SERVICIO DE CATEGORÍAS
// =============================================================================
export const categoryService = {
  // Obtener todas las categorías (alias para compatibilidad)
  getAll: async () => {
    return await productService.getCategories();
  },

  // Crear nueva categoría (admin)
  create: async (categoryData) => {
    try {
      const response = await api.post('/categorias', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('No se pudo crear la categoría');
    }
  },

  // Actualizar categoría (admin)
  update: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/categorias/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('No se pudo actualizar la categoría');
    }
  },

  // Eliminar categoría (admin)
  delete: async (categoryId) => {
    try {
      const response = await api.delete(`/categorias/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('No se pudo eliminar la categoría');
    }
  }
};

// =============================================================================
// SERVICIO DE CONTACTO
// =============================================================================
export const contactService = {
  // Enviar mensaje de contacto
  send: async (contactData) => {
    try {
      const payload = {
        nombre: contactData.name,
        email: contactData.email,
        mensaje: contactData.message,
        fecha: new Date().toISOString()
      };

      const response = await api.post('/contacto', payload);
      return response.data;
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw new Error('No se pudo enviar el mensaje. Intenta nuevamente.');
    }
  }
};

// =============================================================================
// SERVICIO DE CLIENTES
// =============================================================================
export const customerService = {
  // Crear o actualizar cliente
  createOrUpdate: async (customerData) => {
    try {
      const payload = {
        nombre: customerData.name,
        email: customerData.email,
        telefono: customerData.phone,
        direccion: customerData.address
      };

      const response = await api.post('/clientes', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating/updating customer:', error);
      throw new Error('No se pudo procesar los datos del cliente');
    }
  },

  // Obtener cliente por teléfono o email
  getByContact: async (contact) => {
    try {
      const response = await api.get(`/clientes/buscar?contacto=${encodeURIComponent(contact)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer by contact:', error);
      throw new Error('No se pudo encontrar el cliente');
    }
  }
};

// =============================================================================
// SERVICIO DE RESTAURANTE Y UTILIDADES
// =============================================================================
export const restaurantService = {
  // Obtener información del restaurante
  getInfo: async () => {
    try {
      const response = await api.get('/restaurante/info');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant info:', error);
      // Devolver información por defecto
      return {
        nombre: 'Sakura Sushi',
        direccion: 'Av. Corrientes 1234, Buenos Aires',
        telefono: '+54 11 1234-5678',
        horarios: 'Lun-Dom: 12:00 - 23:00',
        email: 'info@sakurasushi.com'
      };
    }
  },

  // Buscar productos (alias para compatibilidad)
  search: async (searchTerm) => {
    return await productService.search(searchTerm);
  },

  // Verificar disponibilidad para delivery
  checkDeliveryAvailability: async (address) => {
    try {
      const response = await api.post('/restaurante/delivery/verificar', { direccion: address });
      return response.data;
    } catch (error) {
      console.error('Error checking delivery availability:', error);
      throw new Error('No se pudo verificar la disponibilidad de delivery');
    }
  },

  // Obtener configuración del restaurante
  getConfig: async () => {
    try {
      const response = await api.get('/restaurante/configuracion');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant config:', error);
      throw new Error('No se pudo obtener la configuración');
    }
  },

  // Actualizar configuración (admin)
  updateConfig: async (configData) => {
    try {
      const response = await api.put('/restaurante/configuracion', configData);
      return response.data;
    } catch (error) {
      console.error('Error updating config:', error);
      throw new Error('No se pudo actualizar la configuración');
    }
  }
};

// =============================================================================
// SERVICIO DE UTILIDADES
// =============================================================================
export const utilService = {
  // Verificar estado del servidor
  healthCheck: async () => {
    try {
      const response = await api.get('/salud');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('El servidor no está disponible');
    }
  },

  // Subir imagen
  uploadImage: async (file, type = 'producto') => {
    try {
      const formData = new FormData();
      formData.append('imagen', file);
      formData.append('tipo', type);

      const response = await api.post('/subir', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('No se pudo subir la imagen');
    }
  }
};

// =============================================================================
// EXPORTACIÓN POR DEFECTO (mantiene compatibilidad total)
// =============================================================================
export default {
  // Servicios principales (tu estructura actual)
  productService,
  orderService,
  contactService,
  restaurantService,
  
  // Servicios adicionales
  categoryService,
  customerService,
  utilService,
  
  // Alias para compatibilidad
  products: productService,
  orders: orderService,
  categories: categoryService,
  customers: customerService,
  contact: contactService,
  restaurant: restaurantService,
  utils: utilService
};