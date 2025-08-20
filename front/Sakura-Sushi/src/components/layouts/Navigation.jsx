import React from 'react';
import { useCart } from '../../context/CartContext'; 
import { Utensils, Users, Phone, ShoppingCart } from 'lucide-react';

const Navigation = ({ setActiveSection, activeSection }) => {
    const { totalItems } = useCart();

    const navItems = [
        {
            id: 'menu',
            label: 'Menú',
            emoji: '🍣',
            icon: Utensils,
            color: 'text-warning',
            activeColor: 'text-warning'
        },
        {
            id: 'about',
            label: 'Nosotros',
            emoji: '🏮',
            icon: Users,
            color: 'text-danger',
            activeColor: 'text-danger'
        },
        {
            id: 'contact',
            label: 'Contacto',
            emoji: '📞',
            icon: Phone,
            color: 'text-primary',
            activeColor: 'text-primary'
        },
        {
            id: 'cart',
            label: 'Carrito',
            emoji: '🛒',
            icon: ShoppingCart,
            color: 'text-success',
            activeColor: 'text-success'
        }
    ];

    const getTotalItems = totalItems || 0;

    const handleNavClick = (itemId) => {
        setActiveSection(itemId);
        // Haptic feedback en dispositivos móviles
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    };

    return (
        <>
            <style jsx>{`
                .bottom-nav {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border-top: 1px solid #dee2e6;
                    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
                    z-index: 1030;
                }

                @media (min-width: 768px) {
                    .bottom-nav {
                        display: none !important;
                    }
                }

                .nav-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    height: 64px;
                }

                .nav-button {
                    border: none;
                    background: none;
                    transition: all 0.3s ease;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .nav-button:hover {
                    background-color: #f8f9fa;
                }

                .nav-button:active {
                    transform: scale(0.95);
                }

                .nav-button-active {
                    background: linear-gradient(to top, #fdf2f8, #ffffff);
                    transform: scale(1.05);
                }

                .nav-button-active:hover {
                    background: linear-gradient(to top, #fdf2f8, #ffffff);
                }

                .ripple-effect {
                    position: absolute;
                    inset: 0;
                    background-color: #fce7f3;
                    border-radius: 8px;
                    margin: 4px 8px;
                    animation: pulse 2s infinite;
                    opacity: 0.5;
                }

                .icon-container {
                    position: relative;
                    transition: all 0.3s ease;
                }

                .icon-container-active {
                    transform: scale(1.1);
                }

                .emoji-bg {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    opacity: 0.2;
                }

                .emoji-bg-active {
                    animation: bounce 1s infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .nav-icon {
                    position: relative;
                    z-index: 10;
                    transition: color 0.3s ease;
                }

                .nav-label {
                    font-size: 12px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    margin-top: 4px;
                }

                .nav-label-active {
                    color: #db2777 !important;
                    font-weight: 600;
                }

                .cart-badge {
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    background-color: #dc3545;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: pulse 2s infinite;
                }

                .active-indicator {
                    position: absolute;
                    bottom: -2px;
                    width: 32px;
                    height: 2px;
                    background: linear-gradient(to right, #ec4899, #e11d48);
                    border-radius: 2px;
                }

                .nav-handle {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translate(-50%, -4px);
                    width: 48px;
                    height: 4px;
                    background-color: #6c757d;
                    border-radius: 2px;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }
            `}</style>

            <nav className="bottom-nav d-md-none">
                <div className="nav-grid">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id;
                        const IconComponent = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`nav-button ${isActive ? 'nav-button-active' : ''}`}
                                aria-label={`Ir a ${item.label}`}
                            >
                                {/* Background ripple effect cuando está activo */}
                                {isActive && (
                                    <div className="ripple-effect" />
                                )}

                                {/* Contenido del botón */}
                                <div className="position-relative d-flex flex-column align-items-center">
                                    {/* Icono con animación */}
                                    <div className={`icon-container ${isActive ? 'icon-container-active' : ''}`}>
                                        {/* Emoji como fondo decorativo */}
                                        <div className={`emoji-bg ${isActive ? 'emoji-bg-active' : ''}`}>
                                            {item.emoji}
                                        </div>

                                        {/* Icono principal */}
                                        <IconComponent
                                            size={20}
                                            className={`nav-icon ${isActive ? item.activeColor : item.color
                                                }`}
                                        />
                                    </div>

                                    {/* Label */}
                                    <span className={`nav-label ${isActive
                                            ? 'nav-label-active'
                                            : 'text-muted'
                                        }`}>
                                        {item.label}
                                    </span>

                                    {/* Badge para el carrito */}
                                    {item.id === 'cart' && totalItems > 0 && (
                                        <div className="cart-badge">
                                            {totalItems > 99 ? '99+' : totalItems}
                                        </div>
                                    )}

                                    {/* Indicador activo */}
                                    {isActive && (
                                        <div className="active-indicator" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Indicador de que es un área interactiva */}
                <div className="nav-handle" />
            </nav>
        </>
    );
};

export default Navigation;