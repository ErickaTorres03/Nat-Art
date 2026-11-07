
document.addEventListener('DOMContentLoaded', () => {
    initFilterTabs();
    initProductActions();
    initSortSelect();
});

/* ---- Filter Tabs ---- */
function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const products = document.querySelectorAll('.product-card[data-type]');
    const resultsCount = document.querySelector('.results-count');

    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');
            let visibleCount = 0;

            products.forEach(product => {
                if (filter === 'all' || product.getAttribute('data-type') === filter) {
                    product.style.display = '';
                    product.style.animation = 'fadeInUp 0.4s ease forwards';
                    product.style.animationDelay = (visibleCount * 0.05) + 's';
                    visibleCount++;
                } else {
                    product.style.display = 'none';
                }
            });

            if (resultsCount) {
                resultsCount.textContent = `${visibleCount} producto${visibleCount !== 1 ? 's' : ''} encontrado${visibleCount !== 1 ? 's' : ''}`;
            }
        });
    });
}

/* ---- Product Actions ---- */
function initProductActions() {
    // Wishlist toggle
    document.querySelectorAll('.product-wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.toggle('active');

            if (btn.classList.contains('active')) {
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                showToast('¡Agregado a favoritos! ❤️');
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
                showToast('Eliminado de favoritos');
            }
        });
    });

    // Quick add to cart
    document.querySelectorAll('.product-quick-add .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            btn.textContent = '✓ Agregado';
            btn.style.background = 'var(--success)';
            btn.style.color = 'var(--white)';

            showToast('¡Producto agregado al carrito! 🛒');

            // Update cart badge
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                const count = parseInt(cartBadge.textContent) + 1;
                cartBadge.textContent = count;
                cartBadge.style.animation = 'bounceSubtle 0.5s ease';
                setTimeout(() => cartBadge.style.animation = '', 500);
            }

            setTimeout(() => {
                btn.textContent = 'Agregar al carrito';
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
        });
    });
}

/* ---- Sort Select ---- */
function initSortSelect() {
    const sortSelect = document.querySelector('.filter-sort select');
    if (!sortSelect) return;

    sortSelect.addEventListener('change', () => {
        const value = sortSelect.value;
        const grid = document.querySelector('.products-grid');
        if (!grid) return;

        const products = Array.from(grid.querySelectorAll('.product-card'));

        products.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price') || 0);
            const priceB = parseFloat(b.getAttribute('data-price') || 0);
            const nameA = a.getAttribute('data-name') || '';
            const nameB = b.getAttribute('data-name') || '';

            switch (value) {
                case 'price-low': return priceA - priceB;
                case 'price-high': return priceB - priceA;
                case 'name-az': return nameA.localeCompare(nameB);
                case 'name-za': return nameB.localeCompare(nameA);
                default: return 0;
            }
        });

        products.forEach((product, index) => {
            product.style.animation = 'fadeInUp 0.4s ease forwards';
            product.style.animationDelay = (index * 0.03) + 's';
            grid.appendChild(product);
        });
    });
}

/* ---- Toast Notification ---- */
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(45, 50, 80, 0.95);
        color: white;
        padding: 14px 28px;
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 500;
        font-family: 'Inter', sans-serif;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}
