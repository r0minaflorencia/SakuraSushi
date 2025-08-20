import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { CounterBadge } from '../ui/Badge'; 
import '/src/styles/header.css'; 

const Header = ({ setActiveSection, totalItems, activeSection = 'menu' }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigationItems = [
        { id: 'menu', label: 'Menú' },
        { id: 'about', label: 'Nosotros' },
        { id: 'contact', label: 'Contacto' }
    ];

    const handleNavClick = (section) => {
        setActiveSection(section);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="bg-dark text-white shadow-lg sticky-top" style={{ zIndex: 1050 }}>
            <div className="container-fluid px-3 px-md-4">
                <div className="d-flex justify-content-between align-items-center py-3">
                    {/* Logo */}
                    <div 
                        className="d-flex align-items-center" 
                        role="button"
                        onClick={() => handleNavClick('menu')}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="fs-2 me-2">🌸</span>
                        <h1 className="fs-2 fs-lg-1 fw-bold mb-0 text-white">
                            Sakura Sushi
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="d-none d-md-flex align-items-center">
                        <div className="d-flex align-items-center me-3">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`btn fw-medium me-2 px-3 py-2 btn-transition ${
                                        activeSection === item.id
                                            ? 'btn-light text-dark'
                                            : 'btn-outline-light'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Desktop Cart Button */}
                        <button
                            onClick={() => handleNavClick('cart')}
                            className={`btn d-flex align-items-center position-relative fw-medium px-3 py-2 btn-transition ${
                                activeSection === 'cart'
                                    ? 'btn-light text-dark'
                                    : 'btn-outline-light'
                            }`}
                        >
                            <ShoppingCart size={20} className="me-2" />
                            <span className="d-none d-lg-inline">Carrito</span>
                            <span className="d-lg-none">
                                <ShoppingCart size={20} />
                            </span>
                            {/* Badge del carrito */}
                            <CounterBadge 
                                count={totalItems} 
                                max={99} 
                                variant="warning"
                                className="top-0 start-100 translate-middle"
                            />
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="btn btn-outline-light d-md-none p-2"
                        aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation Menu */}
                <div 
                    className={`d-md-none border-top collapse ${isMobileMenuOpen ? 'show' : ''}`}
                    style={{ 
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        animation: isMobileMenuOpen ? 'slideDown 0.3s ease-out' : 'none'
                    }}
                >
                    <nav className="py-3">
                        <div className="d-flex flex-column gap-2">
                            {navigationItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`btn text-start fw-medium px-3 py-3 btn-transition ${
                                        activeSection === item.id
                                            ? 'btn-light text-dark'
                                            : 'btn-outline-light'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}

                            {/* Mobile Cart Button */}
                            <button
                                onClick={() => handleNavClick('cart')}
                                className={`btn d-flex align-items-center justify-content-between fw-medium px-3 py-3 btn-transition position-relative ${
                                    activeSection === 'cart'
                                        ? 'btn-light text-dark'
                                        : 'btn-outline-light'
                                }`}
                            >
                                <div className="d-flex align-items-center">
                                    <ShoppingCart size={20} className="me-2" />
                                    <span>Carrito</span>
                                </div>
                                {/* Badge del carrito móvil */}
                                <CounterBadge 
                                    count={totalItems} 
                                    max={99} 
                                    variant="warning"
                                    className="position-static"
                                    style={{
                                        position: 'relative',
                                        top: 'auto',
                                        right: 'auto',
                                        transform: 'none'
                                    }}
                                />
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;