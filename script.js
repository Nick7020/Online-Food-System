// Sample food data
const foodItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        price: 12.99,
        description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
        image: "images/image_6.jpg",
        rating: 4.5,
        category: "Pizza"
    },
    {
        id: 2,
        name: "Cheeseburger",
        price: 9.99,
        description: "Juicy beef patty with cheddar cheese, lettuce, and special sauce",
        image: "images/image_7.jpg",
        rating: 4.7,
        category: "Burgers"
    },
    {
        id: 3,
        name: "Caesar Salad",
        price: 8.99,
        description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
        image: "images/image_8.jpg",
        rating: 4.3,
        category: "Salads"
    },
    {
        id: 4,
        name: "Sushi Platter",
        price: 18.99,
        description: "Assorted sushi rolls with wasabi, ginger, and soy sauce",
        image: "images/image_9.jpg",
        rating: 4.8,
        category: "Sushi"
    },
    {
        id: 5,
        name: "Pasta Carbonara",
        price: 14.99,
        description: "Spaghetti with creamy egg sauce, pancetta, and parmesan",
        image: "images/image_10.jpg",
        rating: 4.6,
        category: "Pasta"
    },
    {
        id: 6,
        name: "Chicken Tikka Masala",
        price: 13.99,
        description: "Grilled chicken chunks in a spiced curry sauce",
        image: "images/image_11.jpg",
        rating: 4.7,
        category: "Indian"
    }
];

// Shopping cart
let cart = [];

// DOM Elements
const foodGrid = document.querySelector('.food-grid');
const cartCount = document.querySelector('.cart-count');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar .btn');

// Initialize the app
function init() {
    renderFoodItems(foodItems);
    setupEventListeners();
    updateCartCount();
}

// Render food items to the DOM
function renderFoodItems(items) {
    foodGrid.innerHTML = '';
    
    if (items.length === 0) {
        foodGrid.innerHTML = '<div class="no-results">No food items found. Try a different search.</div>';
        return;
    }
    
    items.forEach(item => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        foodCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="food-img">
            <div class="food-info">
                <div class="food-header">
                    <h3 class="food-title">${item.name}</h3>
                    <span class="food-price">$${item.price.toFixed(2)}</span>
                </div>
                <p class="food-description">${item.description}</p>
                <div class="food-footer">
                    <div class="rating">${getStarRating(item.rating)}</div>
                    <button class="add-to-cart" data-id="${item.id}">
                        <i class="fas fa-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        foodGrid.appendChild(foodCard);
    });
    
    // Add event listeners to the new "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Get star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let stars = '';
    stars += '★'.repeat(fullStars);
    stars += halfStar ? '½' : '';
    stars += '☆'.repeat(emptyStars);
    
    return stars;
}

// Add item to cart
function addToCart(e) {
    const itemId = parseInt(e.target.closest('.add-to-cart').dataset.id);
    const item = foodItems.find(item => item.id === itemId);
    
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification(`${item.name} added to cart!`);
    
    // Update the button text temporarily
    const button = e.target.closest('.add-to-cart');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.backgroundColor = '#4caf50';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

// Update cart count in the header
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger reflow
    notification.offsetHeight;
    
    notification.style.bottom = '20px';
    
    setTimeout(() => {
        notification.style.bottom = '-100px';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Search food items
function searchFood(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        renderFoodItems(foodItems);
        return;
    }
    
    const filteredItems = foodItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    
    renderFoodItems(filteredItems);
}

// Smooth scrolling for navigation links
function scrollToSection(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    // Close mobile menu if open
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
    
    window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
    });
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', scrollToSection);
    });
    
    // Search functionality
    searchButton.addEventListener('click', () => searchFood(searchInput.value));
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchFood(searchInput.value);
        }
    });
    
    // Add scroll event for header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.category-card, .food-card, .step, .testimonial');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Add some CSS for the notification
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: -100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #4caf50;
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: bottom 0.5s ease;
        font-weight: 500;
    }
    
    .category-card,
    .food-card,
    .step,
    .testimonial {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
`;
document.head.appendChild(style);
