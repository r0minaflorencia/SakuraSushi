import { useState } from 'react';
import { orderService } from '../services/restaurantService'; 

const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      // Lógica para procesar la orden, utilizando un servicio
      const response = await orderService.create(orderData);
      
      // Manejar la respuesta exitosa
      setLoading(false);
      return response.data; // Devuelve los datos de la orden creada
      
    } catch (err) {
      // Manejar el error
      setLoading(false);
      setError(err.response?.data?.message || 'Error al procesar la orden.');
      console.error('Error al procesar la orden:', err);
      
      // Lanza el error para que el componente lo pueda manejar si es necesario
      throw err;
    }
  };

  return { processOrder, loading, error };
};

export default useOrders;