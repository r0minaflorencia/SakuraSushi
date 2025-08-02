import React, { useState } from 'react';
import restaurantService from '../../services/restaurantService';

const MenuSection = ({
  refetchProducts,
  showSuccessMessage,
  showErrorMessage,
  products,
  productsLoading,
  productsError,
  selectedcategoria,
  handlecategoriaChange,
  searchTerm,
  handleSearchChange,
  addToCart,
  ProductCard,
  Star,
  Plus
}) => {
  // Estados locales solo para el formulario de agregar producto
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);

  const [newProduct, setNewProduct] = useState({
    nombre: '',
    descripcion: '',
    precioBase: '',
    categoria: 'Sushi',
    image: '🍣'
  });

  // Manejar cambios en los inputs
  const handleInputChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejar agregar producto
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddingProduct(true);

    try {
      // Validar campos requeridos
      if (!newProduct.nombre.trim() || !newProduct.precioBase) {
        throw new Error('Nombre y precio son campos obligatorios');
      }

      const productData = {
        nombre: newProduct.nombre.trim(),
        descripcion: newProduct.descripcion.trim(),
        precioBase: parseFloat(newProduct.precioBase),
        categoria: newProduct.categoria,
        image: newProduct.image || '🍣',
        disponible: true,
        esGlutenFree: false,
        esPicante: false,
        esVegano: false,
        esVegetariano: false,
        stock: 1
      };

      // Llamar al servicio para crear el producto
      await restaurantService.create(productData);

      // Refrescar la lista de productos
      if (refetchProducts) {
        await refetchProducts();
      }

      // Reset del formulario
      setNewProduct({
        nombre: '',
        descripcion: '',
        precioBase: '',
        categoria: 'Sushi',
        image: '🍣'
      });

      // Cerrar formulario
      setShowAddForm(false);

      // Mostrar mensaje de éxito
      if (showSuccessMessage) {
        showSuccessMessage('Producto agregado exitosamente!');
      } else {
        alert('Producto agregado exitosamente!');
      }

    } catch (error) {
      console.error('Error al agregar producto:', error);

      // Mostrar mensaje de error
      if (showErrorMessage) {
        showErrorMessage(error.message);
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setAddingProduct(false);
    }
  };

  // Manejar cancelar
  const handleCancel = () => {
    setNewProduct({
      nombre: '',
      descripcion: '',
      precioBase: '',
      categoria: 'Sushi',
      image: '🍣'
    });
    setShowAddForm(false);
  };

  return (
    <div className="container my-5">
      {/* Header con búsqueda y botón para agregar producto */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="display-5 fw-bold text-dark">Nuestro Menú</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
          disabled={addingProduct}
        >
          Agregar Producto
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="input-group-text">
              🔍
            </span>
          </div>
        </div>
      </div>

      {/* Formulario para agregar producto */}
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title h5 mb-3">Agregar Nuevo Producto</h3>

            <form onSubmit={handleAddProduct}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProduct.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    disabled={addingProduct}
                    placeholder="Nombre del producto"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    value={newProduct.precioBase}
                    onChange={(e) => handleInputChange('precioBase', e.target.value)}
                    disabled={addingProduct}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-select"
                    value={newProduct.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    disabled={addingProduct}
                  >
                    <option value="Maki">Maki</option>
                    <option value="Sashimi">Sashimi</option>
                    <option value="Nigiri">Nigiri</option>
                    <option value="Combo">Combo</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Emoji/Imagen</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProduct.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    disabled={addingProduct}
                    placeholder="🍣"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    value={newProduct.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    disabled={addingProduct}
                    placeholder="Descripción del producto"
                    rows="3"
                  />
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    disabled={addingProduct}
                    className="btn btn-success me-2"
                  >
                    {addingProduct ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Agregando...
                      </>
                    ) : (
                      'Agregar Producto'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={addingProduct}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filtros de categoría */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          {['Todos', 'Maki', 'Sashimi', 'Nigiri', 'Combo'].map((categoria) => (
            <button
              key={categoria}
              onClick={() => handlecategoriaChange(categoria)}
              className={`btn ${selectedcategoria === categoria
                ? 'btn-danger'
                : 'btn-outline-danger'
                }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      {/* Estados de carga y error */}
      {productsLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando productos...</p>
        </div>
      )}

      {productsError && (
        <div className="alert alert-danger text-center" role="alert">
          <strong>Error:</strong> {productsError}
          <button
            onClick={refetchProducts}
            className="btn btn-outline-danger btn-sm ms-3"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Lista de productos */}
      {!productsLoading && !productsError && (
        <>
          {products && products.length > 0 ? (
            <div className="row g-4">
              {products && products.length > 0 && products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  Star={Star}
                  Plus={Plus}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="display-1 text-muted mb-3">🍣</div>
              <h3 className="text-muted">No se encontraron productos</h3>
              <p className="text-muted">
                {searchTerm ? `No hay productos que coincidan con "${searchTerm}"` : 'No hay productos en esta categoría'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange({ target: { value: '' } })}
                  className="btn btn-outline-danger"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MenuSection;