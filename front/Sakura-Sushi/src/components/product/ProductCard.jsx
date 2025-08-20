import React from 'react';
import { Plus, Minus, ShoppingCart, Star } from 'lucide-react';
import { useCart } from "../../context/CartContext";
import Badge from '../ui/Badge';

const ProductCard = ({ product }) => {
    // Usar el contexto del carrito
    const { addItem, removeItem, updateQuantity, getItemQuantity, isInCart } = useCart();
    
    // Verificar que el producto existe
    if (!product) {
        return null;
    }

    // Obtener datos del carrito para este producto
    const quantity = getItemQuantity(product.id);
    const inCart = isInCart(product.id);

    // Handlers para las acciones del carrito
    const handleAddToCart = () => {
        if (product && product.id) {
            addItem(product, 1);
        }
    };

    const handleIncrement = () => {
        if (product && product.id) {
            updateQuantity(product.id, quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (product && product.id) {
            if (quantity > 1) {
                updateQuantity(product.id, quantity - 1);
            } else {
                removeItem(product.id);
            }
        }
    };

    // Renderizar estrellas de rating
    const renderStars = (rating = 5) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={16}
                className={index < rating ? 'text-warning' : 'text-muted'}
                fill={index < rating ? 'currentColor' : 'none'}
            />
        ));
    };

    // Formatear precio de forma segura
    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toFixed(2);
        }
        if (typeof price === 'string' && !isNaN(parseFloat(price))) {
            return parseFloat(price).toFixed(2);
        }
        return '0.00';
    };

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
                <div className="position-relative">
                    <div className="card-img-top d-flex align-items-center justify-content-center bg-light"
                        style={{ height: '200px', fontSize: '4rem' }}>
                        {product.image || product.emoji || '🍣'}
                    </div>
                    {product.isNew && (
                        <span className="position-absolute top-0 end-0 badge bg-success m-2">
                            Nuevo
                        </span>
                    )}
                </div>

                <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-dark fw-bold">
                        {product.name || product.nombre || 'Producto sin nombre'}
                    </h5>

                    <p className="card-text text-muted small flex-grow-1">
                        {product.description || product.descripcion || 'Deliciosa preparación japonesa'}
                    </p>

                    <div className="d-flex align-items-center mb-2">
                        <div className="me-2">
                            {renderStars(product.rating || 5)}
                        </div>
                        <small className="text-muted">
                            ({product.reviews || 0} reseñas)
                        </small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span className="h5 text-danger fw-bold mb-0">
                                ${formatPrice(product.price || product.precioBase)}
                            </span>
                            {product.originalPrice && (
                                <small className="text-muted text-decoration-line-through ms-2">
                                    ${formatPrice(product.originalPrice)}
                                </small>
                            )}
                        </div>

                        {/* Botones de cantidad o agregar al carrito */}
                        {inCart ? (
                            <div className="d-flex align-items-center gap-2">
                                <div className="btn-group" role="group">
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={handleDecrement}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="btn btn-outline-secondary btn-sm disabled">
                                        {quantity}
                                    </span>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={handleIncrement}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <Badge variant="success" size="sm">
                                    En carrito
                                </Badge>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary btn-sm d-flex align-items-center"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart size={16} className="me-1" />
                                Agregar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;