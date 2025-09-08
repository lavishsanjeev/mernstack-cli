// F1 Store - Main JavaScript File
// Handles cart functionality, user authentication, and general site interactions

// Global variables
let cart = JSON.parse(localStorage.getItem('f1_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('f1_current_user')) || null;
let users = JSON.parse(localStorage.getItem('f1_users')) || [];
let orders = JSON.parse(localStorage.getItem('f1_orders')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateUserInterface();
    loadFeaturedProducts();
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu')) {
            document.getElementById('userDropdown').classList.remove('show');
        }
    });
});

// Cart Management Functions
function addToCart(productId, quantity = 1, selectedSize = null, selectedColor = null) {
    const product = getProductById(productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => 
        item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            selectedSize: selectedSize || (product.sizes ? product.sizes[0] : null),
            selectedColor: selectedColor || (product.colors ? product.colors[0] : null)
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId, selectedSize = null, selectedColor = null) {
    cart = cart.filter(item => 
        !(item.id === productId && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor)
    );
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Item removed from cart', 'success');
}

function updateCartQuantity(productId, newQuantity, selectedSize = null, selectedColor = null) {
    const item = cart.find(item => 
        item.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
    );
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId, selectedSize, selectedColor);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Cart cleared', 'success');
}

function saveCart() {
    localStorage.setItem('f1_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Cart Display Functions
function openCart() {
    window.location.href = 'cart.html';
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add some F1 merchandise to get started!</p>
                <button class="btn" onclick="location.href='products.html'">Shop Now</button>
            </div>
        `;
        if (cartTotal) cartTotal.innerHTML = '';
        return;
    }
    
    const cartHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-details">
                    ${item.selectedSize ? `Size: ${item.selectedSize}` : ''}
                    ${item.selectedColor ? ` | Color: ${item.selectedColor}` : ''}
                </div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1}, '${item.selectedSize}', '${item.selectedColor}')">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1}, '${item.selectedSize}', '${item.selectedColor}')">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id}, '${item.selectedSize}', '${item.selectedColor}')">Remove</button>
        </div>
    `).join('');
    
    cartContainer.innerHTML = cartHTML;
    
    if (cartTotal) {
        const total = getCartTotal();
        cartTotal.innerHTML = `
            <div class="cart-total">
                <div class="total-amount">Total: ${formatPrice(total)}</div>
                <button class="btn" onclick="proceedToCheckout()">Proceed to Checkout</button>
                <button class="btn btn-secondary" onclick="clearCart()">Clear Cart</button>
            </div>
        `;
    }
}

// User Authentication Functions
function signUp(userData) {
    // Validate email doesn't already exist
    if (users.find(user => user.email === userData.email)) {
        showNotification('Email already registered', 'error');
        return false;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        createdAt: new Date().toISOString(),
        orders: []
    };
    
    users.push(newUser);
    localStorage.setItem('f1_users', JSON.stringify(users));
    
    showNotification('Account created successfully!', 'success');
    return true;
}

function signIn(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('f1_current_user', JSON.stringify(currentUser));
        updateUserInterface();
        showNotification(`Welcome back, ${user.name}!`, 'success');
        return true;
    } else {
        showNotification('Invalid email or password', 'error');
        return false;
    }
}

function signOut() {
    currentUser = null;
    localStorage.removeItem('f1_current_user');
    updateUserInterface();
    showNotification('Signed out successfully', 'success');
    
    // Redirect to home if on protected page
    if (window.location.pathname.includes('admin.html')) {
        window.location.href = 'index.html';
    }
}

function updateUserInterface() {
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (!userBtn || !userDropdown) return;
    
    if (currentUser) {
        userBtn.textContent = currentUser.name.charAt(0).toUpperCase();
        userDropdown.innerHTML = `
            <div style="padding: 0.75rem 1rem; font-weight: bold; border-bottom: 1px solid #eee;">
                ${currentUser.name}
            </div>
            <a href="#" onclick="showOrders()">My Orders</a>
            <a href="#" onclick="signOut()">Sign Out</a>
        `;
    } else {
        userBtn.textContent = '👤';
        userDropdown.innerHTML = `
            <a href="login.html">Sign In</a>
            <a href="signup.html">Sign Up</a>
        `;
    }
}

// Navigation Functions
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        // Store search query and redirect to products page
        localStorage.setItem('f1_search_query', query);
        window.location.href = 'products.html';
    }
}

function filterProducts(category) {
    localStorage.setItem('f1_filter_category', category);
    window.location.href = 'products.html';
}

function filterByTeam(team) {
    localStorage.setItem('f1_filter_team', team);
    window.location.href = 'products.html';
}

function showTeams() {
    // Implement teams page or modal
    showNotification('Teams page coming soon!', 'info');
}

function showDrivers() {
    // Implement drivers page or modal
    showNotification('Drivers page coming soon!', 'info');
}

// Product Functions
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Checkout Functions
function proceedToCheckout() {
    if (!currentUser) {
        showNotification('Please sign in to checkout', 'error');
        window.location.href = 'login.html';
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    window.location.href = 'checkout.html';
}

function processPayment(paymentMethod, paymentData) {
    // Simulate payment processing
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate random success/failure (90% success rate)
            const success = Math.random() > 0.1;
            resolve({
                success: success,
                transactionId: success ? 'TXN' + Date.now() : null,
                message: success ? 'Payment processed successfully' : 'Payment failed. Please try again.'
            });
        }, 2000);
    });
}

function completeOrder(paymentResult, paymentMethod = 'upi', addressData = null) {
    if (!paymentResult.success) {
        showNotification(paymentResult.message, 'error');
        return;
    }
    
    // Calculate total with COD charges if applicable
    const subtotal = getCartTotal();
    const shipping = subtotal > 6225 ? 0 : 829;
    const codCharge = paymentMethod === 'cod' ? 8299 : 0;
    const tax = subtotal * 0.08;
    const finalTotal = subtotal + shipping + tax + codCharge;
    
    // Get address data from checkout form or use provided data
    let shippingAddress = addressData;
    if (!shippingAddress && typeof document !== 'undefined') {
        // Extract address from checkout form if available
        const form = document.getElementById('checkoutForm');
        if (form) {
            shippingAddress = {
                firstName: form.querySelector('#firstName')?.value || '',
                lastName: form.querySelector('#lastName')?.value || '',
                email: form.querySelector('#email')?.value || currentUser.email,
                phone: form.querySelector('#phone')?.value || '',
                address: form.querySelector('#address')?.value || '',
                city: form.querySelector('#city')?.value || '',
                state: form.querySelector('#state')?.value || '',
                zipCode: form.querySelector('#zipCode')?.value || ''
            };
        }
    }
    
    // Fallback address if no form data available
    if (!shippingAddress || !shippingAddress.address) {
        shippingAddress = {
            name: currentUser.name,
            firstName: currentUser.name.split(' ')[0] || '',
            lastName: currentUser.name.split(' ').slice(1).join(' ') || '',
            email: currentUser.email,
            phone: 'Not provided',
            address: 'Address not provided',
            city: 'City not provided',
            state: 'State not provided',
            zipCode: 'ZIP not provided'
        };
    }
    
    // Create order
    const order = {
        id: Date.now(),
        userId: currentUser.id,
        items: [...cart],
        total: finalTotal,
        status: 'confirmed',
        paymentMethod: paymentMethod,
        transactionId: paymentResult.transactionId,
        createdAt: new Date().toISOString(),
        shippingAddress: shippingAddress,
        billingAddress: shippingAddress // Same as shipping for now
    };
    
    // Save order
    orders.push(order);
    localStorage.setItem('f1_orders', JSON.stringify(orders));
    
    // Add order to user's order history
    currentUser.orders.push(order.id);
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('f1_users', JSON.stringify(users));
        localStorage.setItem('f1_current_user', JSON.stringify(currentUser));
    }
    
    // Clear cart
    clearCart();
    
    // Show success message
    showNotification('Order placed successfully!', 'success');
    
    // Redirect to order confirmation
    setTimeout(() => {
        window.location.href = `order-confirmation.html?id=${order.id}`;
    }, 2000);
}

// Orders Functions
function showOrders() {
    if (!currentUser) {
        showNotification('Please sign in to view orders', 'error');
        window.location.href = 'login.html?return=orders.html';
        return;
    }
    
    window.location.href = 'orders.html';
}

function getUserOrders() {
    if (!currentUser) return [];
    
    return orders.filter(order => order.userId === currentUser.id)
                 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Admin Functions (for admin.html)
function isAdmin() {
    return currentUser && (currentUser.email === 'admin@f1store.com' || currentUser.isAdmin === true);
}

function checkAdminAccess() {
    // Create admin user if doesn't exist
    const adminEmail = 'admin@f1store.com';
    let adminUser = users.find(u => u.email === adminEmail);
    
    if (!adminUser) {
        adminUser = {
            id: 999999,
            name: 'Admin User',
            email: adminEmail,
            password: 'admin123',
            createdAt: new Date().toISOString(),
            orders: [],
            isAdmin: true
        };
        users.push(adminUser);
        localStorage.setItem('f1_users', JSON.stringify(users));
    }
    
    // Auto login admin if not logged in
    if (!currentUser) {
        currentUser = adminUser;
        localStorage.setItem('f1_current_user', JSON.stringify(currentUser));
        updateUserInterface();
        return true;
    }
    
    if (!isAdmin()) {
        showNotification('Access denied. Admin privileges required.', 'error');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize page-specific functionality
function initPage() {
    const path = window.location.pathname;
    
    if (path.includes('cart.html')) {
        updateCartDisplay();
    } else if (path.includes('products.html')) {
        initProductsPage();
        
        // Handle search query from localStorage
        const searchQuery = localStorage.getItem('f1_search_query');
        if (searchQuery) {
            const searchResults = searchProducts(searchQuery);
            loadProducts(searchResults);
            localStorage.removeItem('f1_search_query');
        }
        
        // Handle category filter from localStorage
        const filterCategory = localStorage.getItem('f1_filter_category');
        if (filterCategory) {
            filterProductsByCategory(filterCategory);
            localStorage.removeItem('f1_filter_category');
        }
        
        // Handle team filter from localStorage
        const filterTeam = localStorage.getItem('f1_filter_team');
        if (filterTeam) {
            filterProductsByTeam(filterTeam);
            localStorage.removeItem('f1_filter_team');
        }
    } else if (path.includes('admin.html')) {
        checkAdminAccess();
    }
}

// Call initPage when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    initPage();
});

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        signUp,
        signIn,
        signOut,
        processPayment,
        completeOrder,
        showNotification,
        formatDate,
        validateEmail,
        validatePassword,
        isAdmin,
        checkAdminAccess
    };
}