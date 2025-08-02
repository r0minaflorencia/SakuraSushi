import React from 'react';

const Header = ({ setActiveSection, getTotalItems, ShoppingCart }) => {
    return (
        <header className="bg-danger text-white py-3 shadow-sm">
            <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <span className="fs-2 me-2">🌸</span>
                    <h1 className="h3 mb-0 fw-bold" style={{ cursor: 'pointer' }}
                        onClick={() => setActiveSection('menu')}
                        title="Ir al inicio">Sakura Sushi</h1>
                </div>

                <nav className="d-none d-md-flex">
                    <button
                        onClick={() => setActiveSection('menu')}
                        className="btn btn-link text-white text-decoration-none me-3"
                    >
                        Menú
                    </button>
                    <button
                        onClick={() => setActiveSection('about')}
                        className="btn btn-link text-white text-decoration-none me-3"
                    >
                        Nosotros
                    </button>
                    <button
                        onClick={() => setActiveSection('contact')}
                        className="btn btn-link text-white text-decoration-none me-3"
                    >
                        Contacto
                    </button>
                    <button
                        onClick={() => setActiveSection('cart')}
                        className="btn btn-outline-light position-relative"
                    >
                        <ShoppingCart size={20} className="me-1" />
                        Carrito
                        {getTotalItems() > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                                {getTotalItems()}
                            </span>
                        )}
                    </button>
                </nav>
            </div>
        </header>

    );

};

export default Header;