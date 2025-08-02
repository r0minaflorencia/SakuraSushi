import React from 'react';

const Navigation = ({ setActiveSection, activeSection }) => {
    const navItems = [
        { id: 'menu', label: 'Menú', icon: '🍣' },
        { id: 'about', label: 'Nosotros', icon: '🏮' },
        { id: 'contact', label: 'Contacto', icon: '📞' },
        { id: 'cart', label: 'Carrito', icon: '🛒' }
    ];

    return (
        <nav className="d-md-none bg-light py-2 border-top">
            <div className="container">
                <div className="row">
                    {navItems.map(item => (
                        <div key={item.id} className="col-3 text-center">
                            <button
                                onClick={() => setActiveSection(item.id)}
                                className={`btn btn-link text-decoration-none p-2 w-100 ${activeSection === item.id ? 'text-danger fw-bold' : 'text-muted'
                                    }`}
                            >
                                <div className="fs-4">{item.icon}</div>
                                <small>{item.label}</small>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;