import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";

function Products() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProducts().then(data => setProductos(data));
  }, []);

  return (
    <div>
      <h2>Menú</h2>
      <div className="grid">
        {productos.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.nombre}</h3>
            <p>{p.descripcion}</p>
            <strong>${p.precio}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;