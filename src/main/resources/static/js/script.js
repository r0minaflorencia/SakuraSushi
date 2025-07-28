// Datos de productos de ejemplo
const products = [
    {
        id: 1,
        name: "Sashimi de Salmón",
        description: "Cortes finos de salmón fresco sin arroz",
        price: 2500,
        category: "sashimi"
    },
    {
        id: 2,
        name: "California Roll",
        description: "Maki con cangrejo, palta y pepino",
        price: 1800,
        category: "maki"
    },
    {
        id: 3,
        name: "Nigiri de Atún",
        description: "Arroz con atún rojo premium",
        price: 2200,
        category: "nigiri"
    },
    {
        id: 4,
        name: "Combo Sakura",
        description: "12 piezas variadas + sopa miso",
        price: 4500,
        category: "combo"
    },
    {
        id: 5,
        name: "Philadelphia Roll",
        description: "Salmón, queso crema y cebollín",
        price: 2100,
        category: "maki"
    },
    {
        id: 6,
        name: "Tempura de Langostino",
        description: "Langostinos en tempura crujiente",
        price: 2800,
        category: "tempura"
    }
];

let cart = [];

// Renderizar productos
function renderProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = products.map(product => `
                <div class="product-card">
                    <div class="product-image"></div>
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <p>${product.description}</p>
                        <div class="product-price">
                            <span class="price">$${product.price}</span>
                            <button class="add-to-cart" onclick="addToCart(${product.id})">
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
}

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showNotification('Producto agregado al carrito');
}

// Actualizar UI del carrito
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = `$${totalPrice}`;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color: #ccc; text-align: center;">Tu carrito está vacío</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #333; color: white;">
                        <div>
                            <h4>${item.name}</h4>
                            <p style="color: #ccc; font-size: 0.9rem;">$${item.price} x ${item.quantity}</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <button onclick="changeQuantity(${item.id}, -1)" style="background: #ff6b35; border: none; color: white; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="changeQuantity(${item.id}, 1)" style="background: #ff6b35; border: none; color: white; width: 25px; height: 25px; border-radius: 50%; cursor: pointer;">+</button>
                        </div>
                    </div>
                `).join('');
    }
}

// Cambiar cantidad
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        updateCartUI();
    }
}

// Toggle carrito
function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.toggle('open');
}

// Scroll al menú
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(45deg, #ff6b35, #f7931e);
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                z-index: 3000;
                animation: slideIn 0.3s ease;
            `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inicializar
document.addEventListener('DOMContentLoaded', function () {
    renderProducts();

    // Animación del header al hacer scroll
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    });
});

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', function (e) {
    const cartPanel = document.getElementById('cart-panel');
    const cartBtn = document.querySelector('.cart-btn');

    if (!cartPanel.contains(e.target) && !cartBtn.contains(e.target) && cartPanel.classList.contains('open')) {
        cartPanel.classList.remove('open');
    }
});