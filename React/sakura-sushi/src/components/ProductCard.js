import React from 'react';

function ProductCard({ product, addToCart }) {
    return (
        <div className="card">
            <h3>{product.nombre}</h3>
            <p>{product.descripcion}</p>
            <button onClick={() => addToCart(product)}>Agregar al Carrito</button>
        </div>
    );
}

export default ProductCard;