import { useState } from 'react';

export function useCart() {
    const [cart, setCart] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    const addToCart = (productToAdd) => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item.nombre === productToAdd.nombre);
            if (existingProduct) {
                return prevCart.map(item =>
                    item.nombre === productToAdd.nombre
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...productToAdd, quantity: 1 }];
        });
        setTotalItems(prevTotal => prevTotal + 1);
    };

    const clearCart = () => {
        setCart([]);
        setTotalItems(0);
    };

    // ... otras funciones como removeFromCart, etc.

    return { cart, totalItems, addToCart, clearCart };
}