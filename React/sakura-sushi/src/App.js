import React, { useState, useEffect } from 'react';
import { useCart } from './context/CartContext';
import useProducts from './hooks/useProducts';
import { useOrders } from './hooks/useOrders';
import ContactSection from './components/sections/ContactSection';
import MenuSection from './components/sections/MenuSection';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ProductCard from './components/ProductCard';
import AboutSection from './components/sections/AboutSection';


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  CreditCard,
  MapPin,
  Phone,
  Clock
} from 'lucide-react';

const App = () => {
  const [activeSection, setActiveSection] = useState('menu');
  const [selectedcategoria, setSelectedcategoria] = useState('Todos');

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks para manejar estado
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalprecioBase,
    getTotalItems,
    clearCart
  } = useCart();

  const {
    products,
    categories,
    loadInitialData,
    loading: productsLoading,
    error: productsError,
    loadProductsBycategoria,
    searchProducts,
    refetch: refetchProducts
  } = useProducts();

  const {
    loading: orderLoading,
    processOrder
  } = useOrders();

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Carga inicial - SOLO UNA VEZ
  useEffect(() => {
    if (!initialLoadDone) {
      loadInitialData(); // Carga productos y categorías
      setInitialLoadDone(true);
    }
  }, []); // Array vacío

  // Manejo de cambios - SIN CARGAR AL INICIO
  useEffect(() => {
    if (!initialLoadDone) return; // No hacer nada hasta carga inicial

    if (searchTerm) {
      searchProducts(searchTerm);
    } else if (selectedcategoria !== 'Todos') {
      loadProductsBycategoria(selectedcategoria);
    }
  }, [selectedcategoria, searchTerm, initialLoadDone]);

  // Funciones auxiliares
  const handlecategoriaChange = (categoria) => {
    setSelectedcategoria(categoria);
    setSearchTerm(''); // Limpia el término de búsqueda al cambiar de categoría
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      setSelectedcategoria('Todos'); // Limpia la categoría seleccionada al buscar
    }
  };

  const handleProcessOrder = async (customerData) => {
    try {
      const orderData = {
        customer: customerData,
        items: cart,
        total: parseFloat(getTotalprecioBase()),
        paymentMethod: customerData.paymentMethod || 'EFECTIVO',
        deliveryType: customerData.deliveryType || 'DELIVERY'
      };

      const result = await processOrder(orderData);

      if (result.success) {
        alert('¡Pedido procesado exitosamente!');
        clearCart();
        setActiveSection('menu');
      } else {
        alert(result.error || 'Error al procesar el pedido');
      }
    } catch (error) {
      alert('Error inesperado al procesar el pedido');
      console.error('Order processing error:', error);
    }
  };

  // Funciones para mensajes
  const showSuccessMessage = (message) => {
    alert(`✅ ${message}`);
  };

  const showErrorMessage = (message) => {
    alert(`❌ ${message}`);
  };

  const CartSection = () => {
    const shippingCost = 490; // Costo de envío consistente

    return (
      <div className="container my-5">
        <h2 className="display-5 fw-bold text-dark mb-4">Tu Pedido</h2>

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <ShoppingCart size={64} className="text-muted mb-3" />
            <p className="text-muted h5">Tu carrito está vacío</p>
            <button
              onClick={() => setActiveSection('menu')}
              className="btn btn-danger mt-3"
            >
              Ver Menú
            </button>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="list-group">
                {cart.map(item => (
                  <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="fs-3 me-3">{item.image || '🍣'}</div>
                      <div>
                        <h3 className="h6 mb-0">{item.name || item.nombre}</h3>
                        <p className="text-muted small mb-0">${item.precioBase}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-2 fw-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-link text-danger ms-3"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm sticky-top" style={{ top: '1rem' }}>
                <div className="card-body">
                  <h3 className="card-title h5 mb-3">Resumen del Pedido</h3>
                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Subtotal:</span>
                      <span>${getTotalprecioBase()}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <span>Envío:</span>
                      <span>${shippingCost}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>${(parseFloat(getTotalprecioBase()) + shippingCost).toFixed(2)}</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handleProcessOrder({
                      name: 'Cliente Demo',
                      email: 'demo@email.com',
                      phone: '123456789',
                      address: 'Dirección demo'
                    })}
                    disabled={orderLoading}
                    className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
                  >
                    {orderLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} className="me-2" />
                        <span>Proceder al Pago</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderizado principal
  return (
    <div className="App-container bg-light">
      {/* Pasando las props necesarias a Header */}
      <Header
        setActiveSection={setActiveSection}
        getTotalItems={getTotalItems}
        ShoppingCart={ShoppingCart}
      />

      {/* Pasando las props necesarias a Navigation */}
      <Navigation
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />

      <main>
        {activeSection === 'menu' && (
          <MenuSection
            refetchProducts={refetchProducts}
            showSuccessMessage={showSuccessMessage}
            showErrorMessage={showErrorMessage}
            // Pasar también los datos necesarios
            products={products}
            categories={categories}
            productsLoading={productsLoading}
            productsError={productsError}
            selectedcategoria={selectedcategoria}
            handlecategoriaChange={handlecategoriaChange}
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            addToCart={addToCart}
            ProductCard={ProductCard}
            // Pasando íconos necesarios
            Star={Star}
            Plus={Plus}
          />
        )}
        {activeSection === 'cart' && <CartSection />}
        {activeSection === 'about' && <AboutSection />}
        {activeSection === 'contact' && (
          <ContactSection
            // Pasando íconos necesarios a ContactSection
            MapPin={MapPin}
            Phone={Phone}
            Clock={Clock}
          />
        )}
      </main>

      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0">&copy; 2025 Sakura Sushi. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;