import api from './api';

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
  }
};

export const orderService = {
  // Crear un nuevo pedido
  create: async (orderData) => {
    try {
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
          subtotal: item.price * item.quantity
        })),
        total: orderData.total,
        metodoPago: orderData.paymentMethod || 'EFECTIVO',
        tipoEntrega: orderData.deliveryType || 'DELIVERY',
        estado: 'PENDIENTE',
        fechaPedido: new Date().toISOString()
      };

      const response = await api.post('/pedidos', orderPayload);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('No se pudo procesar el pedido. Intenta nuevamente.');
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

  // Obtener historial de pedidos del cliente
  getHistory: async (customerEmail) => {
    try {
      const response = await api.get(`/pedidos/cliente/${encodeURIComponent(customerEmail)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order history:', error);
      throw new Error('No se pudo obtener el historial de pedidos');
    }
  }
};

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

  search: async (searchTerm) => {
    try {
      // Aseguramos que el término de búsqueda se codifique correctamente para la URL
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      const response = await api.get(`/productos/busqueda/${encodedSearchTerm}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('No se pudieron encontrar productos con ese término de búsqueda');
    }
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
  }
};