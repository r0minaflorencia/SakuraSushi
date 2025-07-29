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
    const [cartItems, setCartItems] = useState([]);

    const addItem = (item) => {
        setCartItems((prevItems) => [...prevItems, item]);
    };

    const removeItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalPrice = () => {
        return 0; 
    };

    const getTotalItems = () => {
        return 0; 
    };

    const updateQuantity = (id, newQuantity) => {
    };

    return (
        <CartContext.Provider value={{ cart: cartItems, addItem, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};