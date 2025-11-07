// Menu items data
const menuItems = [
    {
        id: 1,
        name: 'Margherita Pizza',
        category: 'pizza',
        price: 299,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil.'
    },
    {
        id: 2,
        name: 'Veg Supreme Burger',
        category: 'burger',
        price: 199,
        image: 'https://images.unsplash.com/photo-1571091718767-18bdd1d4e1b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        description: 'Delicious veg patty with fresh vegetables and special sauce.'
    },
    {
        id: 3,
        name: 'Pasta Alfredo',
        category: 'pasta',
        price: 249,
        image: 'https://images.unsplash.com/photo-1645112411348-404c894e447c?ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        description: 'Creamy pasta with parmesan cheese and garlic.'
    },
    {
        id: 4,
        name: 'Caesar Salad',
        category: 'salad',
        price: 179,
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        description: 'Fresh romaine lettuce with croutons, parmesan, and Caesar dressing.'
    },
    {
        id: 5,
        name: 'Chocolate Lava Cake',
        category: 'dessert',
        price: 149,
        image: 'https://images.unsplash.com/photo-1571115173804-d1fbe080dba6?ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        description: 'Warm chocolate cake with a molten center, served with ice cream.'
    },
    {
        id: 6,
        name: 'Pepperoni Pizza',
        category: 'pizza',
        price: 349,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80',
        description: 'Classic pizza with tomato sauce, mozzarella, and pepperoni.'
    },
    {
        id: 7,
        name: 'Cheeseburger',
        category: 'burger',
        price: 229,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1199&q=80',
        description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce.'
    },
    {
        id: 8,
        name: 'Tiramisu',
        category: 'dessert',
        price: 199,
        image: 'https://images.unsplash.com/photo-1571870188182-9b1a9330a97f?ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone.'
    }
];

// DOM Elements
const menuItemsContainer = document.getElementById('menuItems');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItems');
const totalAmount = document.querySelector('.total-amount');
const viewCartBtn = document.getElementById('viewCartBtn');
const closeCartBtn = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.querySelector('.close-modal');
const orderForm = document.getElementById('orderForm');

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayMenuItems(menuItems);
    updateCartCount();
    setupEventListeners();
});

// Display menu items
function displayMenuItems(items) {
    menuItemsContainer.innerHTML = items.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <img src="${item.image}" alt="${item.name}" class="menu-item-img">
            <div class="menu-item-content">
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-desc">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">₹${item.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${item.id}">
                        <i class="fas fa-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter menu items
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.dataset.category;
        
        if (category === 'all') {
            displayMenuItems(menuItems);
        } else {
            const filteredItems = menuItems.filter(item => item.category === category);
            displayMenuItems(filteredItems);
        }
    });
});

// Setup event listeners
function setupEventListeners() {
    // Add to cart
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const itemId = parseInt(e.target.dataset.id);
            addToCart(itemId);
        }

        // Handle quantity changes
        if (e.target.classList.contains('quantity-btn')) {
            const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
            const isIncrement = e.target.classList.contains('increment');
            updateCartItemQuantity(itemId, isIncrement);
        }

        // Remove item
        if (e.target.classList.contains('remove-item')) {
            const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
            removeFromCart(itemId);
        }
    });

    // Toggle cart
    viewCartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        toggleCart();
        checkoutModal.style.display = 'flex';
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });

    // Handle form submission
    orderForm.addEventListener('submit', handleOrderSubmit);
}

// Cart functions
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCart();
    showNotification(`${item.name} added to cart!`);
}

function updateCartItemQuantity(itemId, isIncrement) {
    const item = cart.find(item => item.id === itemId);
    
    if (isIncrement) {
        item.quantity += 1;
    } else {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(itemId);
            return;
        }
    }
    
    updateCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

function updateCart() {
    // Save to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Update cart items
    renderCartItems();
    
    // Update total
    updateTotal();
}

function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn decrement">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increment">+</button>
                    <button class="remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `₹${total.toFixed(2)}`;
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

function toggleCart() {
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartOverlay.classList.contains('active') ? 'hidden' : '';
}

// Handle order submission
function handleOrderSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'pending'
    };

    // Here you would typically send this data to your backend
    console.log('Order submitted:', formData);
    
    // Show success message
    alert('Order placed successfully! Thank you for your order.');
    
    // Reset form and cart
    orderForm.reset();
    cart = [];
    updateCart();
    
    // Close modal
    checkoutModal.style.display = 'none';
    
    // Redirect to home or order confirmation page
    // window.location.href = 'order-confirmation.html';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);
