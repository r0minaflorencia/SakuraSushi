import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Acciones del carrito
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Estado inicial del carrito
const initialState = {
  items: [],
  totalItems: 0,
  precioBase: 0,
  isOpen: false
};

// Reducer para manejar las acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product.id);
      
      let newItems;
      if (existingItemIndex >= 0) {
        // Si el producto ya existe, actualizar cantidad
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si es nuevo producto, agregarlo
        newItems = [...state.items, { ...product, quantity }];
      }
      
      return calculateTotals({ ...state, items: newItems });
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      return calculateTotals({ ...state, items: newItems });
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si cantidad es 0 o menos, remover el item
        const newItems = state.items.filter(item => item.id !== id);
        return calculateTotals({ ...state, items: newItems });
      }
      
      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      return calculateTotals({ ...state, items: newItems });
    }

    case CART_ACTIONS.CLEAR_CART: {
      return { ...initialState };
    }

    case CART_ACTIONS.LOAD_CART: {
      return calculateTotals({ ...state, items: action.payload });
    }

    default:
      return state;
  }
};

// Función helper para calcular totales
const calculateTotals = (state) => {
  const totalItems = state.items.reduce((total, item) => total + (item.quantity || 0), 0);
  const precioBase = state.items.reduce((total, item) => {
  const price = item.price || item.precioBase;
  return total + (price * item.quantity);
}, 0);
  
  return {
    ...state,
    totalItems,
    precioBase: Math.round(precioBase * 100) / 100 // Redondear a 2 decimales
  };
};

// Crear contexto
const CartContext = createContext();

// Provider del carrito
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito del localStorage al iniciar - con verificación de window
  useEffect(() => {
    // Verificar si estamos en el navegador
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('sakura-cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          // Limpiar localStorage corrupto
          localStorage.removeItem('sakura-cart');
        }
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie - con verificación de window
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sakura-cart', JSON.stringify(state.items));
    }
  }, [state.items]);

  // Funciones del carrito
  const addItem = (product, quantity = 1) => {
    dispatch({ 
      type: CART_ACTIONS.ADD_ITEM, 
      payload: { product, quantity } 
    });
  };

  const removeItem = (id) => {
    dispatch({ 
      type: CART_ACTIONS.REMOVE_ITEM, 
      payload: { id } 
    });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { id, quantity } 
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const isInCart = (id) => {
    return state.items.some(item => item.id === id);
  };

  const getItemQuantity = (id) => {
    const item = state.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const value = {
    // Estado
    items: state.items,
    totalItems: state.totalItems,
    precioBase: state.precioBase,
    
    // Funciones
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado con un CartProvider');
  }
  return context;
};

export default CartContext;