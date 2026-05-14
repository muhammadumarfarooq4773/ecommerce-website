// ==================== Product Data ====================
const products = [
    {
        id: 1,
        name: 'Premium Headphones',
        price: 149.99,
        description: 'High-quality sound with noise cancellation',
        emoji: '🎧'
    },
    {
        id: 2,
        name: 'Wireless Mouse',
        price: 49.99,
        description: 'Ergonomic design with long battery life',
        emoji: '🖱️'
    },
    {
        id: 3,
        name: 'USB-C Cable',
        price: 19.99,
        description: 'Fast charging and data transfer',
        emoji: '🔌'
    },
    {
        id: 4,
        name: 'Mechanical Keyboard',
        price: 99.99,
        description: 'RGB backlit with mechanical switches',
        emoji: '⌨️'
    },
    {
        id: 5,
        name: 'USB Hub',
        price: 34.99,
        description: '7-in-1 multi-port USB hub',
        emoji: '🔗'
    },
    {
        id: 6,
        name: 'Phone Stand',
        price: 24.99,
        description: 'Adjustable and portable phone stand',
        emoji: '📱'
    },
    {
        id: 7,
        name: 'Webcam HD',
        price: 79.99,
        description: '1080p with built-in microphone',
        emoji: '📷'
    },
    {
        id: 8,
        name: 'Laptop Cooler',
        price: 39.99,
        description: 'Portable cooling pad for laptops',
        emoji: '❄️'
    }
];

// ==================== Cart Management ====================
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
    loadCartFromLocalStorage();
});

// Setup event listeners
function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Cart icon click
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.addEventListener('click', openCart);

    // Close cart when clicking outside
    const cartModal = document.getElementById('cartModal');
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCart();
        }
    });
}

// ==================== Render Products ====================
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animationDelay = `${index * 0.1}s`;

        const isInCart = cart.some(item => item.id === product.id);

        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn ${isInCart ? 'added' : ''}" 
                            onclick="addToCart(${product.id})"
                            id="btn-${product.id}">
                        ${isInCart ? '✓ Added' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });
}

// ==================== Add to Cart ====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity: 1
        });
    }

    // Update button state
    const btn = document.getElementById(`btn-${productId}`);
    btn.classList.add('added');
    btn.textContent = '✓ Added';

    // Save to localStorage
    saveCartToLocalStorage();
    
    // Update cart count
    updateCartCount();

    // Show feedback
    showNotification('Added to cart!');
}

// ==================== Cart Operations ====================
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function openCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'block';
    renderCart();
}

function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartSummary.style.display = 'none';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.emoji} ${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;

        cartItems.appendChild(cartItem);
    });

    // Update total
    document.getElementById('totalPrice').textContent = total.toFixed(2);
    cartSummary.style.display = 'block';
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Reset button state
    const btn = document.getElementById(`btn-${productId}`);
    if (btn) {
        btn.classList.remove('added');
        btn.textContent = 'Add to Cart';
    }

    saveCartToLocalStorage();
    updateCartCount();
    renderCart();
    showNotification('Removed from cart');
}

// ==================== LocalStorage ====================
function saveCartToLocalStorage() {
    localStorage.setItem('shophub-cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('shophub-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        
        // Update button states
        cart.forEach(item => {
            const btn = document.getElementById(`btn-${item.id}`);
            if (btn) {
                btn.classList.add('added');
                btn.textContent = '✓ Added';
            }
        });
    }
}

// ==================== Contact Form ====================
function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = event.target.elements[0].value;
    const email = event.target.elements[1].value;
    const message = event.target.elements[2].value;

    // Validate
    if (!name || !email || !message) {
        showNotification('Please fill all fields', 'error');
        return;
    }

    // Simulate form submission
    console.log('Form submitted:', { name, email, message });
    
    showNotification('Thank you! Your message has been sent.');
    event.target.reset();
}

// ==================== Notifications ====================
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ==================== Additional Animations ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== Smooth Scroll for Cart Link ====================
document.querySelector('.cart-link').addEventListener('click', function(e) {
    e.preventDefault();
    openCart();
});

// ==================== Page Scroll Effects ====================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    }
});

// ==================== Welcome Message ====================
console.log('Welcome to ShopHub! 🛍️');
console.log('Cart functionality enabled. Use addToCart() to add products.');
