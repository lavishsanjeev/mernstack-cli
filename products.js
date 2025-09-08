// F1 Store - Product Database and Management
// This file contains all product data and related functions

// Product Database - In a real application, this would come from a backend API
const products = [
    {
        id: 1,
        name: "Red Bull Racing Jersey 2024",
        price: 7499,
        originalPrice: 9129,
        category: "jerseys",
        team: "red-bull",
        image: "🏎️",
        rating: 4.8,
        reviews: 156,
        badge: "sale",
        description: "Official Red Bull Racing team jersey for the 2024 season. Made with premium moisture-wicking fabric.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Navy Blue", "Red", "White"],
        inStock: true,
        featured: true
    },
    {
        id: 2,
        name: "Ferrari Scuderia Cap",
        price: 3817,
        category: "caps",
        team: "ferrari",
        image: "🧢",
        rating: 4.6,
        reviews: 89,
        badge: "new",
        description: "Classic Ferrari Scuderia cap with embroidered logo. Adjustable strap for perfect fit.",
        sizes: ["One Size"],
        colors: ["Red", "Black"],
        inStock: true,
        featured: true
    },
    {
        id: 3,
        name: "Mercedes AMG Petronas Jacket",
        price: 10789,
        category: "jackets",
        team: "mercedes",
        image: "🧥",
        rating: 4.9,
        reviews: 203,
        badge: "",
        description: "Premium Mercedes AMG Petronas team jacket. Wind and water resistant with team branding.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Silver", "Black", "Teal"],
        inStock: true,
        featured: true
    },
    {
        id: 4,
        name: "McLaren Racing Watch",
        price: 16599,
        category: "accessories",
        team: "mclaren",
        image: "⌚",
        rating: 4.7,
        reviews: 67,
        badge: "",
        description: "Limited edition McLaren Racing chronograph watch with orange accents.",
        sizes: ["One Size"],
        colors: ["Black", "Orange"],
        inStock: true,
        featured: false
    },
    {
        id: 5,
        name: "F1 Championship Trophy Replica",
        price: 24899,
        category: "collectibles",
        team: "f1",
        image: "🏆",
        rating: 5.0,
        reviews: 34,
        badge: "",
        description: "Official F1 World Championship trophy replica. Perfect for collectors and fans.",
        sizes: ["One Size"],
        colors: ["Gold"],
        inStock: true,
        featured: true
    },
    {
        id: 6,
        name: "Alpine F1 Team Polo",
        price: 5809,
        category: "jerseys",
        team: "alpine",
        image: "👕",
        rating: 4.5,
        reviews: 78,
        badge: "",
        description: "Comfortable Alpine F1 team polo shirt with moisture-wicking technology.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "Pink", "White"],
        inStock: true,
        featured: false
    },
    {
        id: 7,
        name: "Aston Martin Racing Keychain",
        price: 2074,
        category: "accessories",
        team: "aston-martin",
        image: "🔑",
        rating: 4.3,
        reviews: 45,
        badge: "",
        description: "Premium Aston Martin Racing keychain with metal construction.",
        sizes: ["One Size"],
        colors: ["Green", "Silver"],
        inStock: true,
        featured: false
    },
    {
        id: 8,
        name: "Williams Racing Hoodie",
        price: 7499,
        originalPrice: 8299,
        category: "hoodies",
        team: "williams",
        image: "👘",
        rating: 4.4,
        reviews: 92,
        badge: "sale",
        description: "Warm and comfortable Williams Racing hoodie with team colors.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Blue", "White"],
        inStock: true,
        featured: false
    }
];

// Team information
const teams = {
    "red-bull": { name: "Red Bull Racing", color: "#1e41ff", logo: "🏎️" },
    "ferrari": { name: "Scuderia Ferrari", color: "#dc143c", logo: "🐎" },
    "mercedes": { name: "Mercedes AMG Petronas", color: "#00d2be", logo: "⭐" },
    "mclaren": { name: "McLaren F1 Team", color: "#ff8700", logo: "🧡" },
    "alpine": { name: "Alpine F1 Team", color: "#0090ff", logo: "🔵" },
    "aston-martin": { name: "Aston Martin Cognizant", color: "#006f62", logo: "💚" },
    "williams": { name: "Williams Racing", color: "#005aff", logo: "🔷" },
    "f1": { name: "Formula 1", color: "#e10600", logo: "🏁" }
};

// Get products by category
function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

// Get products by team
function getProductsByTeam(team) {
    return products.filter(product => product.team === team);
}

// Get featured products
function getFeaturedProducts() {
    return products.filter(product => product.featured);
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        teams[product.team]?.name.toLowerCase().includes(searchTerm)
    );
}

// Get all categories
function getCategories() {
    const categories = [...new Set(products.map(product => product.category))];
    return categories.map(category => ({
        name: category,
        count: products.filter(product => product.category === category).length
    }));
}

// Format price
function formatPrice(price) {
    return `₹${price.toFixed(2)}`;
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    
    if (hasHalfStar) {
        stars += '⭐';
    }
    
    return stars;
}

// Create product card HTML
function createProductCard(product) {
    const originalPriceHTML = product.originalPrice ? 
        `<span class="original-price" style="text-decoration: line-through; color: #999; margin-left: 0.5rem;">$${product.originalPrice.toFixed(2)}</span>` : '';
    
    const badgeHTML = product.badge ? 
        `<div class="product-badge ${product.badge}">${product.badge.toUpperCase()}</div>` : '';
    
    return `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image">
                ${product.image}
                ${badgeHTML}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ${formatPrice(product.price)}
                    ${originalPriceHTML}
                </div>
                <div class="product-rating">
                    <span class="stars">${generateStarRating(product.rating)}</span>
                    <span class="rating-text">${product.rating} (${product.reviews})</span>
                </div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Load featured products on homepage
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featuredProducts = getFeaturedProducts();
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// Load products on products page
function loadProducts(productsToShow = products) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
        return;
    }
    
    container.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
}

// Filter products by category
function filterProductsByCategory(category) {
    const filteredProducts = category === 'all' ? products : getProductsByCategory(category);
    loadProducts(filteredProducts);
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
}

// Filter products by team
function filterProductsByTeam(team) {
    const filteredProducts = getProductsByTeam(team);
    loadProducts(filteredProducts);
}

// Sort products
function sortProducts(sortBy) {
    let sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Default order
            break;
    }
    
    loadProducts(sortedProducts);
}

// Initialize products page
function initProductsPage() {
    loadProducts();
    
    // Set up filter buttons
    const filterContainer = document.getElementById('categoryFilters');
    if (filterContainer) {
        const categories = getCategories();
        const filtersHTML = `
            <button class="filter-btn active" data-category="all" onclick="filterProductsByCategory('all')">
                All Products
            </button>
            ${categories.map(category => `
                <button class="filter-btn" data-category="${category.name}" onclick="filterProductsByCategory('${category.name}')">
                    ${category.name.charAt(0).toUpperCase() + category.name.slice(1)} (${category.count})
                </button>
            `).join('')}
        `;
        filterContainer.innerHTML = filtersHTML;
    }
    
    // Set up sort dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        teams,
        getProductsByCategory,
        getProductsByTeam,
        getFeaturedProducts,
        getProductById,
        searchProducts,
        getCategories,
        formatPrice,
        generateStarRating,
        createProductCard,
        loadFeaturedProducts,
        loadProducts,
        filterProductsByCategory,
        filterProductsByTeam,
        sortProducts,
        initProductsPage
    };
}