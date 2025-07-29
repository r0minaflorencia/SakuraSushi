import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import ProductCard from "../components/ProductCard"; // <-- Importa el componente ProductCard

function Products({ products }) {
  // Define la función para agregar productos al carrito
  const addToCart = (product) => {
    console.log(`Adding ${product.nombre} to cart`);
    // Lógica para actualizar el estado del carrito
  };

  return (
    <div>
      {products.map(product => (
        // Pasa la función `addToCart` como una prop
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
}


export default Products;