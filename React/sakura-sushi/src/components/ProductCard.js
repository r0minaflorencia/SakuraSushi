import React from 'react';

const ProductCard = ({ product, addToCart }) => {
    const { id, nombre, descripcion, precio } = product;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105">

            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{nombre}</h3>
                <p className="text-gray-600 text-sm mb-3">{descripcion}</p>
                {categoria && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3">
                        {categoria}
                    </span>
                )}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-gray-900">${precio.toFixed(2)}</span>
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition duration-300 ease-in-out text-sm font-medium"
                    >
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;