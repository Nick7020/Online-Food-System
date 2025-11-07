// Load navbar component
function loadNavbar() {
    const navbarContainer = document.getElementById('navbar');
    if (navbarContainer) {
        fetch('components/navbar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                navbarContainer.innerHTML = html;
                // Initialize navbar functionality after loading
                initNavbar();
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                // Fallback: If fetch fails, use a default navbar
                navbarContainer.innerHTML = `
                    <header class="header">
                        <nav class="navbar container">
                            <a href="index.html" class="logo">Food<span>Express</span></a>
                            <div class="nav-links" id="navLinks">
                                <a href="index.html" class="active">Home</a>
                                <a href="#menu">Menu</a>
                                <a href="#about">About</a>
                                <a href="#testimonials">Reviews</a>
                                <a href="#contact">Contact</a>
                            </div>
                            <div class="nav-actions">
                                <button class="btn btn-primary">Order Now</button>
                                <div class="cart-icon">
                                    <i class="fas fa-shopping-cart"></i>
                                    <span class="cart-count">0</span>
                                </div>
                                <div class="hamburger" id="menuBtn">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </nav>
                    </header>`;
                // Initialize navbar functionality after setting fallback
                initNavbar();
            });
    }
}

// Initialize navbar functionality
function initNavbar() {
    // Mobile menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Sticky header on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn-cart');
    const cartCount = document.querySelector('.cart-count');
    let count = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            count++;
            cartCount.textContent = count;
            
            // Add animation
            const cartIcon = document.querySelector('.cart-icon');
            cartIcon.classList.add('animate');
            setTimeout(() => {
                cartIcon.classList.remove('animate');
            }, 500);
            
            // Change button text temporarily
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Added!';
            button.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.backgroundColor = '';
            }, 2000);
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would typically send the email to your server
                console.log('Subscribed with email:', email);
                
                // Show success message
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }

    // Initialize animations on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .dish-card, .testimonial');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial styles for animation
    document.addEventListener('DOMContentLoaded', () => {
        const elements = document.querySelectorAll('.feature-card, .dish-card, .testimonial');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Trigger initial animation check
        animateOnScroll();
    });

    // Add scroll event listener for animations
    window.addEventListener('scroll', animateOnScroll);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load the navbar
    loadNavbar();
    
    // Initialize other components
    initNavbar();
    
    // Rest of your initialization code...
});
