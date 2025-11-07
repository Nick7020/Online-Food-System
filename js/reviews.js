// Review System for FoodExpress
class ReviewSystem {
    constructor() {
        this.reviews = JSON.parse(localStorage.getItem('foodexpress_reviews')) || [];
        this.verifiedOrders = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayReviews();
    }

    setupEventListeners() {
        // Star Rating
        const stars = document.querySelectorAll('.rating-input i');
        const ratingInput = document.getElementById('rating');
        
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-rating');
                ratingInput.value = rating;
                this.updateStars(rating);
            });
        });

        // Image Upload
        const imageUpload = document.getElementById('imageUpload');
        const fileInput = document.getElementById('foodPhotos');
        const imagePreview = document.getElementById('imagePreview');

        if (imageUpload && fileInput) {
            imageUpload.addEventListener('click', () => fileInput.click());

            fileInput.addEventListener('change', (e) => {
                imagePreview.innerHTML = '';
                if (fileInput.files.length > 0) {
                    Array.from(fileInput.files).forEach(file => {
                        if (file.type.startsWith('image/')) {
                            this.previewImage(file, imagePreview);
                        }
                    });
                }
            });
        }

        // Order Verification
        const verifyOrderBtn = document.getElementById('verifyOrderBtn');
        if (verifyOrderBtn) {
            verifyOrderBtn.addEventListener('click', this.verifyOrder.bind(this));
        }

        // Form Submission
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', this.submitReview.bind(this));
        }
    }

    updateStars(rating) {
        const stars = document.querySelectorAll('.rating-input i');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    previewImage(file, container) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('div');
            img.className = 'preview-image';
            img.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button class="remove-image" data-filename="${file.name}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(img);

            // Add remove image functionality
            img.querySelector('.remove-image').addEventListener('click', (e) => {
                e.stopPropagation();
                img.remove();
                // Remove from file input
                const dt = new DataTransfer();
                const input = document.getElementById('foodPhotos');
                const { files } = input;
                
                for (let i = 0; i < files.length; i++) {
                    if (files[i].name !== file.name) {
                        dt.items.add(files[i]);
                    }
                }
                
                input.files = dt.files;
            });
        };
        reader.readAsDataURL(file);
    }

    async verifyOrder() {
        const orderId = document.getElementById('orderId').value;
        if (!orderId) {
            this.showNotification('Please enter an order ID', 'error');
            return;
        }

        this.showNotification('Verifying order...', 'info');
        
        try {
            const isVerified = await this.checkOrderVerification(orderId);
            
            if (isVerified) {
                document.getElementById('orderVerification').classList.add('verified');
                document.getElementById('verifiedBadge').classList.remove('d-none');
                this.showNotification('Order verified successfully!', 'success');
            } else {
                this.showNotification('Order not found or already used for review', 'error');
            }
        } catch (error) {
            this.showNotification('Error verifying order. Please try again.', 'error');
            console.error('Order verification error:', error);
        }
    }

    checkOrderVerification(orderId) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const isValidOrder = Math.random() > 0.3; // 70% chance of being valid for demo
                resolve(isValidOrder && !this.verifiedOrders.includes(orderId));
            }, 1000);
        });
    }

    submitReview(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const rating = document.getElementById('rating').value;
        const reviewText = document.getElementById('review').value.trim();
        const orderId = document.getElementById('orderId')?.value;
        const isVerified = document.getElementById('orderVerification')?.classList.contains('verified');
        const files = document.getElementById('foodPhotos').files;

        // Validation
        if (!name || !email || !rating || !reviewText) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Create review object
        const review = {
            id: Date.now().toString(),
            name,
            email,
            rating: parseInt(rating),
            review: reviewText,
            date: new Date().toISOString(),
            isVerified: !!isVerified,
            orderId: orderId || null,
            images: [],
            status: 'pending',
            likes: 0
        };

        // Process images
        if (files.length > 0) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    review.images.push(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        }

        // Save review
        this.saveReview(review);

        // Show success message
        this.showNotification('Thank you for your review! It will be published after moderation.', 'success');

        // Reset form
        this.resetReviewForm();

        // If this was a verified order, mark it as used
        if (isVerified && orderId) {
            this.verifiedOrders.push(orderId);
        }
    }

    saveReview(review) {
        // Add to local storage
        this.reviews.unshift(review);
        localStorage.setItem('foodexpress_reviews', JSON.stringify(this.reviews));
        
        // Update the displayed reviews
        this.displayReviews();
    }

    displayReviews() {
        const reviewsContainer = document.getElementById('reviewsContainer');
        if (!reviewsContainer) return;

        // Filter to only show approved reviews
        const approvedReviews = this.reviews.filter(r => r.status === 'approved');
        
        if (approvedReviews.length === 0) {
            reviewsContainer.innerHTML = '<p class="text-center">No reviews yet. Be the first to review!</p>';
            return;
        }

        // Sort by date (newest first)
        approvedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Generate HTML for each review
        reviewsContainer.innerHTML = approvedReviews.map(review => `
            <div class="review-card" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="reviewer-avatar">
                        ${this.getInitials(review.name)}
                        ${review.isVerified ? '<span class="verified-badge" title="Verified Order"><i class="fas fa-check-circle"></i></span>' : ''}
                    </div>
                    <div class="reviewer-info">
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-meta">
                            <div class="review-rating">
                                ${this.generateStarRating(review.rating)}
                            </div>
                            <div class="review-date">${this.formatDate(review.date)}</div>
                        </div>
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.review}</p>
                    ${review.images && review.images.length > 0 ? `
                        <div class="review-images">
                            ${review.images.map(img => `
                                <img src="${img}" alt="Review image" class="review-image" onclick="openImageModal('${img}')">
                            `).join('')}
                        </div>
                    ` : ''}
                    ${review.orderId ? `
                        <div class="order-reference">
                            <small>Order #${review.orderId}</small>
                        </div>
                    ` : ''}
                </div>
                <div class="review-actions">
                    <button class="btn-like" onclick="window.likeReview('${review.id}')">
                        <i class="far fa-thumbs-up"></i>
                        <span>${review.likes || 0}</span>
                    </button>
                    <button class="btn-share" onclick="window.shareReview('${review.id}')">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Helper methods
    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    generateStarRating(rating) {
        return Array(5).fill('').map((_, i) => `
            <i class="fas fa-star${i < rating ? ' active' : ''}"></i>
        `).join('');
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    resetReviewForm() {
        const form = document.getElementById('reviewForm');
        if (form) form.reset();
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) imagePreview.innerHTML = '';
        
        const stars = document.querySelectorAll('.rating-input i');
        stars.forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
        
        const orderVerification = document.getElementById('orderVerification');
        if (orderVerification) {
            orderVerification.classList.remove('verified');
        }
        
        const verifiedBadge = document.getElementById('verifiedBadge');
        if (verifiedBadge) {
            verifiedBadge.classList.add('d-none');
        }
    }

    showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Trigger reflow
        void notification.offsetWidth;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
}

// Initialize the review system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.reviewSystem = new ReviewSystem();
});

// Global functions
window.likeReview = (reviewId) => {
    const reviews = JSON.parse(localStorage.getItem('foodexpress_reviews')) || [];
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex !== -1) {
        const review = reviews[reviewIndex];
        review.likes = (review.likes || 0) + 1;
        localStorage.setItem('foodexpress_reviews', JSON.stringify(reviews));
        
        // Update the UI
        const likeButton = document.querySelector(`[data-review-id="${reviewId}"] .btn-like`);
        if (likeButton) {
            const likeCount = likeButton.querySelector('span');
            likeCount.textContent = review.likes;
            likeButton.classList.add('active');
        }
    }
};

window.shareReview = (reviewId) => {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this review on FoodExpress',
            text: 'I found this great review on FoodExpress!',
            url: `${window.location.origin}${window.location.pathname}?review=${reviewId}`
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = `${window.location.origin}${window.location.pathname}?review=${reviewId}`;
        prompt('Copy this link to share the review:', shareUrl);
    }
};

window.openImageModal = (imageUrl) => {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${imageUrl}" alt="Full size">
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking the close button or outside the image
    const closeModal = () => modal.remove();
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function handleEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    });
};
