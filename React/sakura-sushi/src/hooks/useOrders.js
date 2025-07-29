import { useState } from 'react';
import { orderService } from '../services/restaurantService';

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Procesar un nuevo pedido
  const processOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await orderService.create(orderData);
      setCurrentOrder(result);

      return {
        success: true,
        order: result,
        message: '¡Pedido creado exitosamente!'
      };

    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Limpiar estado actual
  const clearCurrentOrder = () => {
    setCurrentOrder(null);
    setError(null);
  };

  return {
    loading,
    error,
    currentOrder,
    processOrder,
    clearCurrentOrder
  };
};