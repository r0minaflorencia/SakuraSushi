import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        console.log('🛒 CartContext - Adding product:', product);
        setCart(prevCart => {
            // Verificar si el producto ya existe
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(id);
            return;
        }
        
        setCart(prevCart => 
            prevCart.map(item =>
                item.id === id
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalprecioBase = () => {
        return cart.reduce((total, item) => {
            const precioBase = parseFloat(item.precioBase) || 0;
            const quantity = parseInt(item.quantity) || 0;
            return total + (precioBase * quantity);
        }, 0).toFixed(2);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + (item.quantity || 0), 0);
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalprecioBase,
        getTotalItems,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};