import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  MapPin,
  Clock,
  User,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const formatPrice = (price) => {
  const numPrice = parseFloat(price);
  return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
};

const formatCurrency = (price) => {
  return `$${formatPrice(price)}`;
};

// Componente para cada item del carrito
const CartItem = ({ item, updateQuantity, removeItem }) => {

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="cart-item border rounded-lg p-3 mb-3 bg-white shadow-sm">
      <div className="row align-items-center">
        {/* Imagen/Emoji del producto */}
        <div className="col-3 col-md-2">
          <div className="d-flex align-items-center justify-content-center bg-light rounded"
            style={{ height: '60px', fontSize: '2rem' }}>
            {item.image || item.emoji || '🍣'}
          </div>
        </div>

        {/* Información del producto */}
        <div className="col-6 col-md-6">
          <h6 className="mb-1 fw-bold">{item.name || item.nombre}</h6>
          <p className="text-muted small mb-1">
            {item.description || item.descripcion || 'Deliciosa preparación'}
          </p>
          <span className="text-primary fw-bold">
            ${formatPrice(item.price || item.precioBase)}
          </span>
        </div>

        {/* Controles de cantidad */}
        <div className="col-3 col-md-4">
          <div className="d-flex flex-column align-items-end">
            {/* Botones de cantidad */}
            <div className="btn-group mb-2" role="group" aria-label="Cantidad">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="btn btn-outline-secondary btn-sm disabled">
                {item.quantity}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuantityChange(item.quantity + 1)}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Subtotal y botón eliminar */}
            <div className="d-flex align-items-center gap-2">
              <span className="small fw-bold">
                Subtotal: {formatCurrency((item.price || item.precioBase) * item.quantity)}
              </span>
              <button
                className="btn btn-outline-danger btn-sm ms-2"
                onClick={() => removeItem(item.id)}
                title="Eliminar producto"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal del carrito
const CartSection = ({ setActiveSection }) => {
  const shippingCost = 490;
  const { items, totalItems, precioBase, clearCart, updateQuantity, removeItem } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderStep, setOrderStep] = useState('cart'); // cart, delivery, payment, confirmation

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = parseFloat(shippingCost) || 0;
    return subtotal + shipping;
  };

  // Datos del formulario de entrega
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    deliveryTime: 'asap'
  });

  const handleInputChange = (field, value) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckout = () => {
    setOrderStep('delivery');
    setShowCheckout(true);
  };

  const handleBackToMenu = () => {
    setActiveSection('menu');
  };

  const processOrder = () => {
    // Acá va la lógica para procesar el pedido
    setOrderStep('confirmation');
    setTimeout(() => {
      clearCart();
      setOrderStep('cart');
      setShowCheckout(false);
    }, 3000);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      // Asegúrate de que tanto el precio como la cantidad son números
      const itemPrice = parseFloat(item.price || item.precioBase) || 0;
      const itemQuantity = item.quantity || 0;
      return total + (itemPrice * itemQuantity);
    }, 0);
  };

  // Si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <ShoppingCart size={80} className="text-muted mb-4" />
          <h3 className="text-muted mb-3">Tu carrito está vacío</h3>
          <p className="text-muted mb-4">
            Agrega algunos deliciosos productos de nuestro menú
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleBackToMenu}
          >
            <ArrowLeft className="me-2" size={20} />
            Explorar Menú
          </button>
        </div>
      </div>
    );
  }

  // Vista de confirmación
  if (orderStep === 'confirmation') {
    return (
      <div className="container py-5">
        <div className="text-center">
          <CheckCircle size={80} className="text-success mb-4" />
          <h3 className="text-success mb-3">¡Pedido Confirmado!</h3>
          <p className="text-muted mb-4">
            Tu pedido ha sido enviado exitosamente. Te contactaremos pronto.
          </p>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Procesando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header del carrito */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="mb-1">
            <ShoppingCart className="me-2" size={28} />
            Mi Carrito
          </h2>
          <p className="text-muted mb-0">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={handleBackToMenu}
        >
          <ArrowLeft className="me-2" size={16} />
          Seguir Comprando
        </button>
      </div>

      <div className="row">
        {/* Lista de productos */}
        <div className="col-md-8">
          <div className="cart-items">
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            ))}
          </div>

          {/* Botón limpiar carrito */}
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-outline-danger"
              onClick={clearCart}
            >
              <Trash2 className="me-2" size={16} />
              Vaciar Carrito
            </button>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Resumen del Pedido</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({totalItems || 0} productos)</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Envío</span>
                <span className={shippingCost === 0 ? "text-success" : ""}>
                  {shippingCost === 0 ? "Gratis" : formatCurrency(shippingCost)}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong className="text-primary">{formatCurrency(calculateTotal())}</strong>
              </div>

              {!showCheckout ? (
                <button
                  className="btn btn-primary w-100 btn-lg"
                  onClick={handleCheckout}
                >
                  <CreditCard className="me-2" size={18} />
                  Proceder al Checkout
                </button>
              ) : (
                <div className="checkout-form">
                  {orderStep === 'delivery' && (
                    <div>
                      <h6 className="mb-3">
                        <MapPin className="me-2" size={16} />
                        Información de Entrega
                      </h6>

                      <div className="mb-3">
                        <label className="form-label small">Nombre completo</label>
                        <input
                          type="text"
                          className="form-control"
                          value={deliveryInfo.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Tu nombre"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small">Teléfono</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={deliveryInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+54 9 11 1234-5678"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small">Dirección</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={deliveryInfo.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Calle, número, piso, depto"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small">
                          <Clock className="me-1" size={14} />
                          Tiempo de entrega
                        </label>
                        <select
                          className="form-select"
                          value={deliveryInfo.deliveryTime}
                          onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                        >
                          <option value="asap">Lo antes posible</option>
                          <option value="30min">En 30 minutos</option>
                          <option value="1hour">En 1 hora</option>
                          <option value="2hours">En 2 horas</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small">Notas adicionales</label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={deliveryInfo.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Instrucciones especiales, alergias, etc."
                        />
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-success"
                          onClick={processOrder}
                          disabled={!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address}
                        >
                          <CheckCircle className="me-2" size={16} />
                          Confirmar Pedido - {formatCurrency(calculateTotal())}
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => setShowCheckout(false)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-3 text-center">
            <small className="text-muted d-block mb-2">
              <AlertCircle className="me-1" size={14} />
              Tiempo estimado de entrega: 30-45 min
            </small>
            <small className="text-muted d-block">
              <Phone className="me-1" size={14} />
              ¿Necesitas ayuda? Llámanos al (11) 1234-5678
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSection;