import api from './api';

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
          precio: item.precioBase,
          subtotal: item.precioBase * item.quantity,
          nombre: item.nombre // Incluir nombre para referencia
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

export const restaurantService = {

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

const restaurantServices = {
  // Servicios principales 

  orderService,
  restaurantService,

  // Alias para compatibilidad
  orders: orderService,
  restaurant: restaurantService,
};

export default restaurantServices;