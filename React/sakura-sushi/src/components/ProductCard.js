import React from 'react';

const ProductCard = ({ product, addToCart, Star, Plus }) => {

    const handleAddToCart = () => {
        if (addToCart && product) {
            addToCart(product);
        }
    };

    if (!product) {
        return null;
    }

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
                        {product.name || product.nombre}
                    </h5>

                    <p className="card-text text-muted small flex-grow-1">
                        {product.description || product.descripcion || 'Deliciosa preparación japonesa'}
                    </p>

                    <div className="d-flex align-items-center mb-2">
                        <div className="me-2">
                            {renderStars(product.rating)}
                        </div>
                        <small className="text-muted">
                            ({product.reviews || 0} reseñas)
                        </small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span className="h5 text-danger fw-bold mb-0">
                                ${product.price || product.precioBase}
                            </span>
                            {product.originalPrice && (
                                <small className="text-muted text-decoration-line-through ms-2">
                                    ${product.originalPrice}
                                </small>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="btn btn-danger btn-sm d-flex align-items-center"
                        >
                            <Plus size={16} className="me-1" />
                            Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;