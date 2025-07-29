import React, { useState, useEffect } from 'react';
import { useCart } from './context/CartContext';
import { useProducts } from './hooks/useProducts';
import { useOrders } from './hooks/useOrders';
import contactService from './services/contactService';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import {
  ShoppingCart,
  Star,
  Plus,
  AlertCircle,
  RefreshCw,
  Search,
  Minus,
  CreditCard,
  MapPin,
  Phone,
  Clock
} from 'lucide-react';

const App = () => {
  const [activeSection, setActiveSection] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Hooks para manejar estado
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart
  } = useCart();

  const {
    products,
    categories,
    loading: productsLoading,
    error: productsError,
    loadProductsByCategory,
    searchProducts,
    refetch: refetchProducts
  } = useProducts();

  const {
    loading: orderLoading,
    processOrder
  } = useOrders();

  // useEffect para manejar la lógica de carga de productos
  // Se ejecutará cada vez que selectedCategory o searchTerm cambien
  useEffect(() => {
    if (searchTerm) {
      searchProducts(searchTerm);
    } else {
      loadProductsByCategory(selectedCategory);
    }
  }, [selectedCategory, searchTerm]);
  
  // Funciones auxiliares
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchTerm(''); // Limpia el término de búsqueda al cambiar de categoría
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      setSelectedCategory('Todos'); // Limpia la categoría seleccionada al buscar
    }
  };

  const handleProcessOrder = async (customerData) => {
    try {
      const orderData = {
        customer: customerData,
        items: cart,
        total: parseFloat(getTotalPrice()),
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

  // Componentes de la aplicación
  const Header = () => (
    <header className="bg-danger text-white shadow-lg py-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h1 className="h3 mb-0 me-3">🍣 Sakura Sushi</h1>
            <p className="d-none d-md-block text-white-50">Auténtico sabor japonés</p>
          </div>
          <div className="d-flex align-items-center">
            <button
              onClick={() => setActiveSection('about')}
              className="btn btn-outline-light me-3"
            >
              Nosotros
            </button>
            <button
              onClick={() => setActiveSection('cart')}
              className="btn btn-dark position-relative"
            >
              <ShoppingCart size={20} />
              <span>Carrito</span>
              {getTotalItems() > 0 && (
                <span className="badge bg-warning text-dark rounded-pill position-absolute top-0 start-100 translate-middle">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const Navigation = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm border-bottom">
      <div className="container">
        <div className="navbar-nav d-flex flex-row">
          {[
            { id: 'menu', label: 'Menú', icon: '🍣' },
            { id: 'about', label: 'Nosotros', icon: '🏮' },
            { id: 'contact', label: 'Contacto', icon: '📞' }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`btn btn-link text-decoration-none py-3 px-2 ${activeSection === section.id
                ? 'text-danger border-bottom border-danger fw-bold'
                : 'text-secondary'
                }`}
            >
              <span>{section.icon}</span>
              <span className="ms-2">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );

  const ProductCard = ({ product }) => (
    <div className="card shadow-sm h-100">
      <div className="card-body text-center d-flex flex-column justify-content-between">
        <div>
          <div className="display-4 mb-2">{product.image || '🍣'}</div>
          <h3 className="card-title h5 text-dark">{product.nombre}</h3>
          <p className="card-text text-muted small">{product.descripcion}</p>
        </div>

        <div className="d-flex align-items-center justify-content-center mb-3">
          <Star className="text-warning me-1" size={16} />
          <span className="text-muted small">{product.rating || 4.5}</span>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <span className="fs-4 fw-bold text-danger">${product.precioBase}</span>
          <button
            onClick={() => addToCart(product)}
            className="btn btn-danger btn-sm d-flex align-items-center"
          >
            <Plus size={16} className="me-1" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );

  const MenuSection = () => {
    const ErrorMessage = ({ message, onRetry }) => (
      <div className="alert alert-danger text-center p-4" role="alert">
        <AlertCircle className="mx-auto d-block h-auto w-auto text-danger mb-3" size={48} />
        <h3 className="h5 text-danger mb-2">Error al cargar productos</h3>
        <p className="text-danger mb-3">{message}</p>
        <button
          onClick={onRetry}
          className="btn btn-danger d-flex align-items-center mx-auto"
        >
          <RefreshCw size={16} className="me-2" />
          <span>Reintentar</span>
        </button>
      </div>
    );

    const LoadingSpinner = () => (
      <div className="text-center py-5">
        <div className="spinner-border text-danger mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted">Cargando productos deliciosos...</p>
      </div>
    );

    return (
      <div className="container my-5">
        <div className="text-center mb-4">
          <h2 className="display-5 fw-bold text-dark mb-3">Nuestro Menú</h2>
          <p className="text-muted">Descubre la auténtica cocina japonesa</p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mx-auto mb-4" style={{ maxWidth: '500px' }}>
          <div className="input-group">
            <span className="input-group-text"><Search size={20} /></span>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Filtros de categoría */}
        <div className="d-flex flex-wrap justify-content-center mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              disabled={productsLoading}
              className={`btn btn-sm rounded-pill mx-1 mb-2 ${selectedCategory === category
                ? 'btn-danger'
                : 'btn-outline-secondary'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Contenido principal */}
        {productsError ? (
          <ErrorMessage message={productsError} onRetry={refetchProducts} />
        ) : productsLoading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 mb-3">🍱</div>
            <h3 className="h5 fw-bold text-dark mb-2">
              {searchTerm ? `No se encontraron productos para "${searchTerm}"` : 'No hay productos disponibles'}
            </h3>
            {!searchTerm && <p className="text-muted">Intenta seleccionar otra categoría</p>}
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {products.map(product => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const CartSection = () => (
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
                      <h3 className="h6 mb-0">{item.name}</h3>
                      <p className="text-muted small mb-0">${item.price}</p>
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
                    <span>${getTotalPrice()}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Envío:</span>
                    <span>$2.99</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>{(parseFloat(getTotalPrice()) + 2.99).toFixed(2)}</span>
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

  const AboutSection = () => (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h2 className="display-5 fw-bold text-dark text-center mb-4">Sobre Nosotros</h2>
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <h3 className="h4 fw-bold mb-3">Tradición Japonesa</h3>
              <p className="text-muted mb-3">
                En Sakura Sushi, nos enorgullecemos de ofrecer la más auténtica experiencia culinaria japonesa.
                Nuestros chefs maestros preparan cada plato con ingredientes frescos y técnicas tradicionales
                transmitidas a través de generaciones.
              </p>
              <p className="text-muted">
                Desde 2010, hemos sido el destino favorito para los amantes del sushi,
                combinando sabores tradicionales con presentaciones modernas.
              </p>
            </div>
            <div className="col-md-6 text-center">
              <div className="display-1 mb-3">🏮</div>
              <p className="text-muted fst-italic">"El arte del sushi es el arte de la perfección"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactSection = () => {
    const [contactForm, setContactForm] = useState({
      name: '',
      email: '',
      message: ''
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async () => {
      if (!contactForm.name || !contactForm.email || !contactForm.message) {
        alert('Por favor completa todos los campos');
        return;
      }

      try {
        setSending(true);
        await contactService.send(contactForm);
        alert('Mensaje enviado exitosamente');
        setContactForm({ name: '', email: '', message: '' });
      } catch (error) {
        alert('Error al enviar el mensaje: ' + error.message);
      } finally {
        setSending(false);
      }
    };

    return (
      <div className="container my-5">
        <h2 className="display-5 fw-bold text-dark text-center mb-4">Contacto</h2>
        <div className="row justify-content-center g-4">
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title h5 mb-3">Información</h3>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center">
                    <MapPin className="text-danger me-2" size={20} />
                    <span>Av. Corrientes 1234, Buenos Aires</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <Phone className="text-danger me-2" size={20} />
                    <span>+54 11 1234-5678</span>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <Clock className="text-danger me-2" size={20} />
                    <span>Lun-Dom: 12:00 - 23:00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title h5 mb-3">Envíanos un Mensaje</h3>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    placeholder="Tu email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    placeholder="Tu mensaje"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="form-control"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={sending}
                  className="btn btn-danger w-100"
                >
                  {sending ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizado principal
  return (
    <div className="App-container bg-light">
      <Header />
      <Navigation />

      <main>
        {activeSection === 'menu' && <MenuSection />}
        {activeSection === 'cart' && <CartSection />}
        {activeSection === 'about' && <AboutSection />}
        {activeSection === 'contact' && <ContactSection />}
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