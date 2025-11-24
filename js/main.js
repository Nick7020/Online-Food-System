// Initialize animations on scroll
function initAnimations() {
    const elements = document.querySelectorAll('.feature-card, .dish-card, .testimonial');
    
    // Set initial styles for animation
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    const animateOnScroll = function() {
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial check
    animateOnScroll();
    
    // Add scroll event listener for animations
    window.addEventListener('scroll', animateOnScroll);
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    updateActiveLink();
    initMobileMenu();
    initStickyHeader();
    initCartFunctionality();
    initAnimations();
    
    // Initialize newsletter form if it exists
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
});

// Initialize navbar functionality
function initNavbar() {
    // This function is kept for backward compatibility
}

// Initialize mobile menu functionality
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (!menuBtn || !navLinks) {
        console.error('Menu button or nav links not found');
        return;
    }

    // Toggle mobile menu
    const toggleMenu = (e) => {
        if (e) e.stopPropagation();
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };

    // Close menu
    const closeMenu = () => {
        menuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    // Toggle on button click
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.hamburger')) {
            closeMenu();
        }
    });

    // Close when clicking on nav links
    const navItems = document.querySelectorAll('.nav-links a:not(.track-order-link)');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Only prevent default if it's not a regular link
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            closeMenu();
        });
    });
    
    // Handle track order links
    const trackOrderLinks = document.querySelectorAll('.track-order-link');
    trackOrderLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close the mobile menu if it's open
            closeMenu();
            
            // Check if this is a mobile view and the link is in the nav-links (mobile menu)
            const isMobileMenuLink = this.closest('.nav-links') && window.innerWidth <= 992;
            
            if (isMobileMenuLink) {
                // For mobile, let the default link behavior happen
                return true;
            }
            
            // For desktop, ensure the link works normally
            e.stopPropagation();
            return true;
        });
    });
    
    // Ensure clicks on the track order link don't close the menu immediately
    document.addEventListener('click', function(e) {
        if (e.target.closest('.track-order-link')) {
            return;
        }
        
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.hamburger')) {
            closeMenu();
        }
    }, true);

    // Close on window resize (if needed)
    let resizeTimer;
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            closeMenu();
        }
        // Debounce the resize event
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 992) {
                closeMenu();
            }
        }, 250);
    });

    // Initialize the menu state
    closeMenu();
}

// Update active link based on current page
function updateActiveLink() {
    // Get the current page path and clean it up
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Handle the root path (when URL is just the domain)
    if (currentPage === '') {
        currentPage = 'index.html';
    }
    
    // Remove any query strings or hashes from the current page
    currentPage = currentPage.split(/[?#]/)[0];
    
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        // Get the link's href and clean it up
        let linkHref = link.getAttribute('href');
        
        // Remove any query strings or hashes from the link
        linkHref = linkHref.split(/[?#]/)[0];
        
        // Special case for index page
        if ((currentPage === 'index.html' || currentPage === '') && 
            (linkHref === 'index.html' || linkHref === './index.html' || linkHref === '/')) {
            link.classList.add('active');
        } 
        // For other pages
        else if (currentPage === linkHref || 
                (currentPage.endsWith(linkHref) && linkHref !== 'index.html')) {
            link.classList.add('active');
        } 
        // For menu page specifically (in case it's named differently)
        else if ((currentPage === 'menu.html' || currentPage === 'menu') && 
                 (linkHref === 'menu.html' || linkHref === './menu.html' || linkHref === '/menu.html')) {
            link.classList.add('active');
        }
        else {
            link.classList.remove('active');
        }
    });
    
    // Debug info (can be removed in production)
    console.log('Current page:', currentPage);
    console.log('Active link:', document.querySelector('.nav-links a.active')?.getAttribute('href'));
}

// Initialize sticky header on scroll
function initStickyHeader() {
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
}

// Initialize cart functionality
function initCartFunctionality() {
    const addToCartButtons = document.querySelectorAll('.btn-cart');
    const cartCount = document.querySelector('.cart-count');
    let count = 0;

    // Load cart count from localStorage if available
    if (localStorage.getItem('cartCount')) {
        count = parseInt(localStorage.getItem('cartCount'));
        if (cartCount) cartCount.textContent = count;
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            count++;
            if (cartCount) cartCount.textContent = count;
            localStorage.setItem('cartCount', count);
            
            // Add animation
            const cartIcon = document.querySelector('.cart-icon');
            if (cartIcon) {
                cartIcon.classList.add('animate');
                setTimeout(() => {
                    cartIcon.classList.remove('animate');
                }, 500);
            }
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = 'Added to cart!';
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.remove();
            }, 2000);
        });
    });
}
