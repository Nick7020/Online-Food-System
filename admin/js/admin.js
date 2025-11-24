// Admin Panel JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initTooltips();
    
    // Initialize sidebar navigation
    initSidebar();
    
    // Initialize notifications
    initNotifications();
    
    // Initialize any charts if needed
    // initCharts();
});

// Initialize tooltips
function initTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = trigger.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        trigger.addEventListener('mouseenter', (e) => {
            const rect = trigger.getBoundingClientRect();
            tooltip.style.display = 'block';
            tooltip.style.top = `${rect.bottom + 5}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
        });
        
        trigger.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });
}

// Initialize sidebar navigation
function initSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Mark current page as active
        if (href === currentPage) {
            link.parentElement.classList.add('active');
        }
        
        // Handle dropdown menus if any
        if (link.nextElementSibling && link.nextElementSibling.classList.contains('submenu')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                this.classList.toggle('open');
            });
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
            document.querySelector('.main-content').classList.toggle('active');
        });
    }
}

// Initialize notifications
function initNotifications() {
    const notificationBell = document.querySelector('.notifications');
    const notificationPanel = document.createElement('div');
    notificationPanel.className = 'notification-panel';
    
    // Sample notifications
    const notifications = [
        { id: 1, text: 'New order #ORD-0123 received', time: '2 min ago', read: false },
        { id: 2, text: 'Order #ORD-0122 has been delivered', time: '1 hour ago', read: false },
        { id: 3, text: 'New review received from John D.', time: '3 hours ago', read: true },
        { id: 4, text: 'Low stock alert: Margherita Pizza', time: '5 hours ago', read: true },
    ];
    
    // Create notification panel content
    let notificationHTML = `
        <div class="notification-header">
            <h4>Notifications</h4>
            <span class="mark-all-read">Mark all as read</span>
        </div>
        <div class="notification-list">
    `;
    
    notifications.forEach(notification => {
        notificationHTML += `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon">
                    <i class="fas fa-bell"></i>
                </div>
                <div class="notification-content">
                    <p>${notification.text}</p>
                    <span class="notification-time">${notification.time}</span>
                </div>
            </div>
        `;
    });
    
    notificationHTML += '</div>';
    notificationPanel.innerHTML = notificationHTML;
    document.body.appendChild(notificationPanel);
    
    // Toggle notification panel
    notificationBell.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationPanel.classList.toggle('active');
        
        // Mark notifications as read when panel is opened
        if (notificationPanel.classList.contains('active')) {
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
                item.classList.add('read');
            });
            
            // Update notification badge
            const badge = notificationBell.querySelector('.badge');
            if (badge) {
                badge.style.display = 'none';
            }
        }
    });
    
    // Close notification panel when clicking outside
    document.addEventListener('click', function(e) {
        if (!notificationPanel.contains(e.target) && !notificationBell.contains(e.target)) {
            notificationPanel.classList.remove('active');
        }
    });
    
    // Handle mark all as read
    const markAllRead = notificationPanel.querySelector('.mark-all-read');
    if (markAllRead) {
        markAllRead.addEventListener('click', function() {
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
                item.classList.add('read');
            });
            
            const badge = notificationBell.querySelector('.badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }
}

// Initialize charts (using Chart.js)
function initCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded');
        return;
    }
    
    // Sample chart data
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Sales',
            data: [12000, 19000, 3000, 5000, 2000, 3000],
            backgroundColor: 'rgba(255, 107, 107, 0.2)',
            borderColor: 'rgba(255, 107, 107, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
        }]
    };
    
    // Create chart if element exists
    const salesChartCtx = document.getElementById('salesChart');
    if (salesChartCtx) {
        new Chart(salesChartCtx, {
            type: 'line',
            data: salesData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show alert message
function showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 5000);
}

// Confirm dialog
function confirmDialog(message, callback) {
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    
    dialog.innerHTML = `
        <div class="confirm-dialog-content">
            <p>${message}</p>
            <div class="confirm-dialog-buttons">
                <button class="btn btn-cancel">Cancel</button>
                <button class="btn btn-confirm">Confirm</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Show dialog
    setTimeout(() => {
        dialog.classList.add('show');
    }, 10);
    
    // Handle button clicks
    const cancelBtn = dialog.querySelector('.btn-cancel');
    const confirmBtn = dialog.querySelector('.btn-confirm');
    
    cancelBtn.addEventListener('click', () => {
        dialog.classList.remove('show');
        setTimeout(() => {
            dialog.remove();
        }, 300);
    });
    
    confirmBtn.addEventListener('click', () => {
        if (typeof callback === 'function') {
            callback();
        }
        dialog.classList.remove('show');
        setTimeout(() => {
            dialog.remove();
        }, 300);
    });
}

// Export functions to global scope
window.Admin = {
    showAlert,
    confirmDialog,
    formatCurrency,
    formatDate
};
