// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If user is not logged in and trying to access a protected page
    if (!token && currentPage === 'index.html') {
        window.location.href = 'login.html';
        return false;
    }
    
    // If user is logged in and trying to access login/signup page
    if (token && (currentPage === 'login.html' || currentPage === 'signup.html')) {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Function to log out
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', checkAuth);
