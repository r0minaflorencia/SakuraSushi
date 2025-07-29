import { useState, useCallback } from 'react';
import { orderService } from '../services/restaurantService';

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  // Procesar un nuevo pedido
  const processOrder = useCallback(async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones básicas
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('El carrito está vacío');
      }

      if (!orderData.customer || !orderData.customer.name) {
        throw new Error('Datos del cliente incompletos');
      }

      if (!orderData.total || orderData.total <= 0) {
        throw new Error('Total del pedido inválido');
      }

      // Crear orden con timestamp y adaptada a tu estructura
      const orderWithTimestamp = {
        ...orderData,
        timestamp: new Date().toISOString(),
        status: 'PENDIENTE', // Usar estados en español
        orderNumber: generateOrderNumber()
      };

      const result = await orderService.create(orderWithTimestamp);
      
      // Normalizar respuesta del servidor (adaptar campos si es necesario)
      const normalizedOrder = {
        ...result,
        id: result.id || result._id, // Manejar diferentes tipos de ID
        status: result.estado || result.status || 'PENDIENTE',
        orderNumber: result.numeroPedido || result.orderNumber || orderWithTimestamp.orderNumber,
        createdAt: result.fechaPedido || result.createdAt || orderWithTimestamp.timestamp,
        customer: result.cliente || result.customer || orderData.customer,
        items: result.items || orderData.items,
        total: result.total || orderData.total
      };
      
      // Actualizar estados
      setCurrentOrder(normalizedOrder);
      
      // Agregar a la lista de órdenes si no existe
      setOrders(prevOrders => {
        const exists = prevOrders.find(order => 
          (order.id && order.id === normalizedOrder.id) || 
          (order.orderNumber && order.orderNumber === normalizedOrder.orderNumber)
        );
        if (!exists) {
          return [normalizedOrder, ...prevOrders];
        }
        return prevOrders;
      });

      // Agregar al historial
      setOrderHistory(prevHistory => [normalizedOrder, ...prevHistory]);

      return {
        success: true,
        order: normalizedOrder,
        message: '¡Pedido creado exitosamente!',
        orderNumber: normalizedOrder.orderNumber
      };

    } catch (err) {
      const errorMessage = err.message || 'Error al procesar el pedido';
      setError(errorMessage);
      
      console.error('Error processing order:', err);
      
      return {
        success: false,
        error: errorMessage,
        details: err
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener pedidos del usuario
  const fetchOrders = useCallback(async (customerId = null) => {
    try {
      setLoading(true);
      setError(null);

      const result = await orderService.getAll(customerId);
      
      // Normalizar órdenes recibidas del servidor
      const normalizedOrders = (result || []).map(order => ({
        ...order,
        id: order.id || order._id,
        status: order.estado || order.status || 'PENDIENTE',
        orderNumber: order.numeroPedido || order.orderNumber,
        createdAt: order.fechaPedido || order.createdAt,
        updatedAt: order.fechaActualizacion || order.updatedAt,
        customer: order.cliente || order.customer,
        cancelReason: order.motivoCancelacion || order.cancelReason,
        cancelledAt: order.fechaCancelacion || order.cancelledAt
      }));

      setOrders(normalizedOrders);

      return {
        success: true,
        orders: normalizedOrders
      };

    } catch (err) {
      const errorMessage = err.message || 'Error al obtener pedidos';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener un pedido específico
  const fetchOrderById = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await orderService.getById(orderId);
      
      // Normalizar orden recibida
      const normalizedOrder = {
        ...result,
        id: result.id || result._id,
        status: result.estado || result.status || 'PENDIENTE',
        orderNumber: result.numeroPedido || result.orderNumber,
        createdAt: result.fechaPedido || result.createdAt,
        updatedAt: result.fechaActualizacion || result.updatedAt,
        customer: result.cliente || result.customer,
        cancelReason: result.motivoCancelacion || result.cancelReason,
        cancelledAt: result.fechaCancelacion || result.cancelledAt
      };

      setCurrentOrder(normalizedOrder);

      return {
        success: true,
        order: normalizedOrder
      };

    } catch (err) {
      const errorMessage = err.message || 'Error al obtener el pedido';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar estado de un pedido
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    try {
      setLoading(true);
      setError(null);

      // Mapear estados al formato del servidor si es necesario
      const serverStatus = mapStatusToServer(newStatus);

      const result = await orderService.updateStatus(orderId, serverStatus);
      
      // Normalizar respuesta
      const normalizedResult = {
        ...result,
        status: result.estado || result.status || serverStatus,
        updatedAt: result.fechaActualizacion || result.updatedAt || new Date().toISOString()
      };
      
      // Actualizar en la lista de órdenes
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: normalizedResult.status, 
                updatedAt: normalizedResult.updatedAt 
              }
            : order
        )
      );

      // Actualizar orden actual si es la misma
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder(prev => ({ 
          ...prev, 
          status: normalizedResult.status, 
          updatedAt: normalizedResult.updatedAt
        }));
      }

      return {
        success: true,
        order: normalizedResult,
        message: `Estado actualizado a ${normalizedResult.status}`
      };

    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar el pedido';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  // Cancelar un pedido
  const cancelOrder = useCallback(async (orderId, reason = '') => {
    try {
      setLoading(true);
      setError(null);

      const result = await orderService.cancel(orderId, reason);
      
      // Normalizar respuesta
      const normalizedResult = {
        ...result,
        status: 'CANCELADO',
        cancelReason: result.motivoCancelacion || result.cancelReason || reason,
        cancelledAt: result.fechaCancelacion || result.cancelledAt || new Date().toISOString(),
        updatedAt: result.fechaActualizacion || result.updatedAt || new Date().toISOString()
      };
      
      // Actualizar estados
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: 'CANCELADO', 
                cancelReason: normalizedResult.cancelReason, 
                cancelledAt: normalizedResult.cancelledAt,
                updatedAt: normalizedResult.updatedAt
              }
            : order
        )
      );

      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder(prev => ({ 
          ...prev, 
          status: 'CANCELADO', 
          cancelReason: normalizedResult.cancelReason,
          cancelledAt: normalizedResult.cancelledAt,
          updatedAt: normalizedResult.updatedAt
        }));
      }

      return {
        success: true,
        order: normalizedResult,
        message: 'Pedido cancelado exitosamente'
      };

    } catch (err) {
      const errorMessage = err.message || 'Error al cancelar el pedido';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  // Obtener historial de pedidos por email (usar tu función existente)
  const fetchCustomerHistory = useCallback(async (customerEmail, limit = 10) => {
    try {
      setLoading(true);
      setError(null);

      const result = await orderService.getHistory(customerEmail);
      
      // Normalizar historial
      const normalizedHistory = (result || []).slice(0, limit).map(order => ({
        ...order,
        id: order.id || order._id,
        status: order.estado || order.status || 'PENDIENTE',
        orderNumber: order.numeroPedido || order.orderNumber,
        createdAt: order.fechaPedido || order.createdAt,
        customer: order.cliente || order.customer
      }));

      setOrderHistory(normalizedHistory);

      return {
        success: true,
        orders: normalizedHistory
      };

    } catch (err) {
      const errorMessage = err.message || 'Error al obtener historial';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener estadísticas de pedidos desde el servidor
  const fetchOrderStats = useCallback(async (startDate = null, endDate = null) => {
    try {
      setLoading(true);
      setError(null);

      // Intentar obtener stats del servidor primero
      if (orderService.getStats) {
        const result = await orderService.getStats(startDate, endDate);
        return {
          success: true,
          stats: result
        };
      }

      // Fallback: calcular stats localmente
      const localStats = getOrderStats();
      return {
        success: true,
        stats: localStats
      };

    } catch (err) {
      // Si falla, usar stats locales
      const localStats = getOrderStats();
      return {
        success: true,
        stats: localStats,
        warning: 'Usando estadísticas locales'
      };
    } finally {
      setLoading(false);
    }
  }, [orders]);

  // Limpiar estado actual
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
    setError(null);
  }, []);

  // Limpiar todos los estados
  const clearAllOrders = useCallback(() => {
    setOrders([]);
    setOrderHistory([]);
    setCurrentOrder(null);
    setError(null);
  }, []);

  // Limpiar solo errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Generar número de orden único
  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  };

  // Mapear estados al formato del servidor
  const mapStatusToServer = (status) => {
    const statusMap = {
      'PENDING': 'PENDIENTE',
      'CONFIRMED': 'CONFIRMADO',
      'PREPARING': 'PREPARANDO',
      'READY': 'LISTO',
      'DELIVERED': 'ENTREGADO',
      'COMPLETED': 'ENTREGADO',
      'CANCELLED': 'CANCELADO'
    };
    
    return statusMap[status] || status;
  };

  // Obtener estadísticas básicas (calculadas localmente)
  const getOrderStats = useCallback(() => {
    const total = orders.length;
    
    // Usar estados en español
    const pending = orders.filter(order => 
      ['PENDIENTE', 'PENDING'].includes(order.status)
    ).length;
    
    const completed = orders.filter(order => 
      ['ENTREGADO', 'DELIVERED', 'COMPLETED'].includes(order.status)
    ).length;
    
    const cancelled = orders.filter(order => 
      ['CANCELADO', 'CANCELLED'].includes(order.status)
    ).length;
    
    const preparing = orders.filter(order => 
      ['PREPARANDO', 'CONFIRMADO', 'LISTO', 'PREPARING', 'CONFIRMED', 'READY'].includes(order.status)
    ).length;
    
    const totalRevenue = orders
      .filter(order => ['ENTREGADO', 'DELIVERED', 'COMPLETED'].includes(order.status))
      .reduce((sum, order) => sum + (order.total || 0), 0);

    return {
      total,
      pending,
      preparing,
      completed,
      cancelled,
      totalRevenue: totalRevenue.toFixed(2)
    };
  }, [orders]);

  return {
    // Estados
    loading,
    error,
    currentOrder,
    orders,
    orderHistory,
    
    // Funciones principales
    processOrder,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    cancelOrder,
    
    // Funciones adicionales adaptadas
    fetchCustomerHistory,
    fetchOrderStats,
    
    // Funciones de limpieza
    clearCurrentOrder,
    clearAllOrders,
    clearError,
    
    // Utilidades
    getOrderStats
  };

};