(() => {
    const catalog = window.productCatalog || [];
    const labels = {
        amigos: 'Amigos',
        familiar: 'Familiar',
        hombre: 'Hombre',
        mujer: 'Mujer',
        navidad: 'Navidad',
        religion: 'Religion',
        snoppy: 'Snoppy',
        Stitch: 'Stitch',
        cumpleaños: 'Cumpleaños',
        graduacion: 'Graduacion',
        pareja: 'Pareja',
        personalizado: 'Personalizado',
        spiderman: 'Spiderman',
    };
    const products = catalog.flatMap((group) => group.files.map((file, index) => ({
        type: group.type,
        typeLabel: group.type === 'tazas' ? 'Taza' : 'Polo',
        price: group.type === 'tazas' ? 15 : 30,
        category: group.category,
        categoryLabel: labels[group.category] || group.category,
        image: encodeURI(`img/${group.type}/${group.category}/${file}`),
        number: index + 1,
    })));

    const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const currentPage = decodeURIComponent(location.pathname.split('/').pop() || 'index.html')
        .replace(/\.html$/i, '');
    const requestedCategory = new URLSearchParams(location.search).get('categoria') || currentPage;
    const initialCategory = catalog.find((group) => normalize(group.category) === normalize(requestedCategory))?.category || '';
    const initialType = new URLSearchParams(location.search).get('tipo') || '';
    const isHome = currentPage === 'index';
    const requestedView = new URLSearchParams(location.search).get('vista');
    const validViews = ['inicio', 'catalogo', 'contacto'];
    const activeView = validViews.includes(requestedView)
        ? requestedView
        : (initialCategory || initialType || !isHome ? 'catalogo' : 'inicio');
    const categoryCount = new Set(catalog.map((group) => group.category)).size;
    const heroCategoryOrder = ['mujer', 'pareja', 'navidad', 'snoppy', 'hombre', 'amigos'];
    const heroSlides = heroCategoryOrder
        .map((category) => products.find((item) => item.category === category))
        .filter(Boolean);
    const categoryCopy = {
        cumpleaños: 'para celebrar tu día',
        graduacion: 'para recordar tu logro',
        pareja: 'para compartir de a dos',
        mujer: 'para llevar tu estilo',
        amigos: 'para compartir con tus amigos',
        snoppy: 'para fans de Snoopy',
        personalizado: 'con tu propio diseño',
        navidad: 'para regalar en Navidad',
        familiar: 'para toda la familia',
        hombre: 'para llevar tu estilo',
        religion: 'para expresar tu fe',
        Stitch: 'para fans de Stitch',
        spiderman: 'para fans de tu héroe favorito',
    };
    function setMetaTag(attribute, key, value) {
        let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attribute, key);
            document.head.append(tag);
        }
        tag.setAttribute('content', value);
    }

    function updatePageMetadata(category = initialCategory, type = initialType) {
        const categoryLabel = labels[category] || category;
        const productType = type === 'tazas' ? 'tazas' : type === 'polos' ? 'polos' : 'tazas y polos';
        let title = 'Tazas y polos personalizados | Nat Art';
        let description = 'Descubre tazas y polos personalizados de Nat Art, hechos para regalar, celebrar y recordar.';

        if (activeView === 'contacto') {
            title = 'Contacto | Nat Art';
            description = 'Comunícate con Nat Art para consultar por tazas y polos personalizados y preparar tu pedido.';
        } else if (activeView === 'catalogo') {
            title = category
                ? `${productType} personalizados de ${categoryLabel} | Nat Art`
                : `${productType[0].toUpperCase()}${productType.slice(1)} personalizados | Nat Art`;
            description = category
                ? `Explora diseños de ${categoryLabel} en ${productType} personalizados de Nat Art. Elige tu favorito y consúltanos por WhatsApp.`
                : `Explora el catálogo de ${productType} personalizados de Nat Art y encuentra un diseño para regalar o disfrutar.`;
        }

        const previewProduct = products.find((item) => (!category || item.category === category) && (!type || item.type === type))
            || products[0];
        const previewImage = new URL(previewProduct?.image || 'img/logo.jpeg', location.href).href;

        document.title = title;
        setMetaTag('name', 'description', description);
        setMetaTag('property', 'og:type', 'website');
        setMetaTag('property', 'og:site_name', 'Nat Art');
        setMetaTag('property', 'og:title', title);
        setMetaTag('property', 'og:description', description);
        setMetaTag('property', 'og:image', previewImage);
        setMetaTag('property', 'og:url', location.href);
        setMetaTag('name', 'twitter:card', 'summary_large_image');
        setMetaTag('name', 'twitter:title', title);
        setMetaTag('name', 'twitter:description', description);
        setMetaTag('name', 'twitter:image', previewImage);
    }

    updatePageMetadata();

    function categoryLinks() {
        const categories = [...new Set(catalog.map((group) => group.category))];
        return categories.map((category) => `
            <button class="category-chip" type="button" data-category="${category}">
                ${labels[category] || category}<span>${products.filter((item) => item.category === category).length}</span>
            </button>`).join('') + `
            <button class="collection-more" type="button" aria-label="Mostrar más categorías" hidden>
                <span class="collection-more-icon">+</span><span class="collection-more-label"> Ver más categorías</span>
            </button>`;
    }

    function homeSections() {
        const formatCards = ['tazas', 'polos'].map((type) => {
            const item = products.find((product) => product.type === type);
            if (!item) return '';
            const name = type === 'tazas' ? 'Tazas que cuentan historias' : 'Polos para llevar tu estilo';
            const price = type === 'tazas' ? 15 : 30;
            return `
                <a class="format-card format-${type}" href="index.html?vista=catalogo&tipo=${type}">
                    <img src="${item.image}" alt="${item.typeLabel} de ${item.categoryLabel}" loading="lazy">
                    <span class="format-overlay"></span>
                    <span class="format-copy">
                        <span class="format-kicker">${item.typeLabel} personalizados</span>
                        <strong>${name}</strong>
                        <span class="format-bottom"><span>Desde S/ ${price.toFixed(2)}</span><span class="format-arrow" aria-hidden="true">↗</span></span>
                    </span>
                </a>`;
        }).join('');

        const featuredCategories = ['pareja', 'cumpleaños', 'graduacion', 'mujer', 'navidad', 'snoppy', 'personalizado', 'amigos', 'hombre'];
        const featured = featuredCategories.map((category, index) => {
            const item = products.find((product) => product.category === category);
            if (!item) return '';
            return `
                <a class="featured-collection" href="index.html?vista=catalogo&categoria=${encodeURIComponent(category)}">
                    <span class="featured-image"><img src="${item.image}" alt="Diseño de ${item.categoryLabel}" loading="lazy"><span>${String(index + 1).padStart(2, '0')}</span></span>
                    <span class="featured-caption"><strong>${item.categoryLabel}</strong><span>Ver colección ↗</span></span>
                </a>`;
        }).join('');

        return `
            <section class="format-section" aria-labelledby="format-heading">
                <div class="editorial-heading"><div><p class="eyebrow"><span></span> Objetos para ti</p><h2 id="format-heading">Elige tu <em>formato.</em></h2></div><p>Un detalle cotidiano puede guardar una historia muy tuya.</p></div>
                <div class="format-grid">${formatCards}</div>
            </section>
            <section class="featured-section" aria-labelledby="featured-heading">
                <div class="editorial-heading"><div><p class="eyebrow"><span></span> Encuentra inspiración</p><h2 id="featured-heading">Una idea para <em>cada momento.</em></h2></div><a class="section-text-link" href="index.html?vista=catalogo">Ver todo el catálogo <span>↘</span></a></div>
                <div class="featured-carousel">
                    <button class="featured-arrow featured-arrow-prev" type="button" aria-label="Ver ideas anteriores">←</button>
                    <div class="featured-viewport">
                        <div class="featured-grid">${featured}</div>
                    </div>
                    <button class="featured-arrow featured-arrow-next" type="button" aria-label="Ver más ideas">→</button>
                </div>
            </section>
            <section class="promo-video-section" aria-labelledby="promo-video-heading">
                <video class="promo-video-background" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1">
                    <source src="videos/tasas/anime.mp4" type="video/mp4">
                </video>
                <div class="promo-video-copy">
                    <p class="eyebrow"><span></span> Nat Art · detalles con historia</p>
                    <h2 id="promo-video-heading">Tu idea,hecha para<br><em>regalar.</em></h2>
                    <p>Un diseño pensado por ti puede convertir cualquier momento en un recuerdo inolvidable.</p>
                    <a class="promo-video-link" href="https://wa.me/51985925137" target="_blank" rel="noopener noreferrer">
                        Cuéntanos tu idea <span aria-hidden="true">↗</span>
                    </a>
                </div>
            </section>
            <section class="steps-section" aria-labelledby="steps-heading">
                <div class="steps-intro"><p class="eyebrow"><span></span> Simple y personal</p><h2 id="steps-heading">De la idea al <em>detalle.</em></h2><p>Explora, elige y revisa cada diseño con calma.</p></div>
                <div class="steps-list">
                    <article class="step-item"><span>01</span><div><h3>Encuentra una colección</h3><p>Explora las carpetas por ocasión y estilo.</p></div></article>
                    <article class="step-item"><span>02</span><div><h3>Elige taza o polo</h3><p>Filtra el catálogo según el formato que buscas.</p></div></article>
                    <article class="step-item"><span>03</span><div><h3>Acércate al diseño</h3><p>Abre cualquier imagen para verla en grande.</p></div></article>
                </div>
            </section>`;
    }

    function productCards(items) {
        if (!items.length) {
            return '<p class="empty-state">No encontramos diseños con esos filtros. Prueba otra búsqueda.</p>';
        }
        return items.map((item, index) => `
            <article class="product-card group overflow-hidden rounded-xl bg-white transition hover:-translate-y-1 hover:shadow-lg" style="--card-order:${index % 12}">
                <button class="product-image-button" type="button" data-image="${item.image}" data-title="${item.typeLabel} ${item.categoryLabel}">
                    <img src="${item.image}" alt="${item.typeLabel} ${item.categoryLabel}" loading="lazy">
                    <span class="product-type-badge">${item.typeLabel}</span>
                    <span class="image-action" aria-hidden="true">↗</span>
                </button>
                <div class="product-info">
                    <div class="product-meta"><span>${item.categoryLabel}</span></div>
                    <h3>${item.typeLabel} ${categoryCopy[item.category] || 'personalizada'}</h3>
                    <div class="product-bottom">
                        <div class="product-price"><span>Precio</span><strong>S/ ${item.price.toFixed(2)}</strong></div>
                        <button class="text-action" type="button" data-image="${item.image}" data-title="${item.typeLabel} ${item.categoryLabel}">Ver diseño <span>↗</span></button>
                    </div>
                </div>
            </article>`).join('');
    }

    function mount() {
        document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
            if (!link.href.includes('storefront.css')) link.remove();
        });
        document.body.innerHTML = `
            <header class="site-header sticky top-0 z-20 flex h-[74px] items-center justify-between bg-white px-[5vw] backdrop-blur">
                <a class="brand" href="index.html?vista=inicio" aria-label="Nat Art, inicio">
                    <img src="./img/logo.jpeg" alt="Nat Art" class="brand-logo">
                </a>
                <nav class="main-nav" aria-label="Navegación principal">
                    <a href="index.html?vista=inicio" class="nav-item ${activeView === 'inicio' ? 'is-current' : ''}">Inicio</a>
                    <a href="index.html?vista=catalogo" class="nav-item ${activeView === 'catalogo' ? 'is-current' : ''}">Catálogo</a>
                    <a href="index.html?vista=contacto" class="nav-item ${activeView === 'contacto' ? 'is-current' : ''}">Contacto</a>
                </nav>
                <button class="mobile-menu" type="button" aria-label="Abrir navegación" aria-expanded="false"><span></span><span></span></button>
            </header>
            <main class="min-h-screen">
                ${activeView === 'inicio' ? `
                    <section class="hero relative flex items-center overflow-hidden text-[#482c38]">
                        <img class="hero-image is-active absolute inset-0 h-full w-full object-cover" src="${heroSlides[0]?.image || 'img/hero-banner.png'}" alt="${heroSlides[0] ? `${heroSlides[0].typeLabel} ${heroSlides[0].categoryLabel}` : 'Diseño personalizado'}" fetchpriority="high">
                        <img class="hero-image hero-image-next absolute inset-0 h-full w-full object-cover" src="${heroSlides[1]?.image || heroSlides[0]?.image || 'img/hero-banner.png'}" alt="" aria-hidden="true">
                        <div class="hero-shade"></div>
                        <div class="hero-copy">
                            <p class="eyebrow"><span></span> <span class="hero-slide-label">${categoryCopy[heroSlides[0]?.category] || 'hecho para regalar'}</span></p>
                            <h1>Regalos con<br><em>tu sello.</em></h1>
                            <p>Encuentra una taza o un polo que convierta tus momentos favoritos en un detalle personal.</p>
                            <div class="hero-actions">
                                <a class="hero-link" href="index.html?vista=catalogo">Descubrir diseños <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-down-right"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7l10 10" /><path d="M17 8l0 9l-9 0" /></svg></span></a>
                            </div>
                        </div>
                        <div class="hero-controls" aria-label="Controles de portada">
                            <button class="hero-arrow" type="button" data-direction="previous" aria-label="Imagen anterior">←</button>
                            <div class="hero-pagination" role="group" aria-label="Elegir imagen de portada">${heroSlides.map((slide, index) => `<button class="hero-dot ${index === 0 ? 'is-active' : ''}" type="button" data-slide="${index}" aria-label="Mostrar ${slide.typeLabel} de ${slide.categoryLabel}" aria-current="${index === 0 ? 'true' : 'false'}"></button>`).join('')}</div>
                            <button class="hero-arrow" type="button" data-direction="next" aria-label="Imagen siguiente">→</button>
                            <button class="hero-pause" type="button" aria-label="Pausar carrusel" aria-pressed="false"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-player-pause"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -12" /><path d="M14 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -12" /></svg></button>
                            <span class="hero-index"><span class="hero-current-index">01</span> / ${String(heroSlides.length).padStart(2, '0')}</span>
                        </div>
                    </section>` : ''}
                ${activeView === 'inicio' ? homeSections() : ''}
                ${activeView === 'catalogo' ? `
                <section class="catalog-section mx-auto w-full max-w-[1440px] px-[6vw] py-[45px]" id="colecciones">
                    <div class="section-heading">
                        <div><p class="eyebrow"><span></span> Explora por carpeta</p><h2>${initialCategory ? labels[initialCategory] || initialCategory : initialType ? `Colecciones de ${initialType === 'tazas' ? 'tazas' : 'polos'}` : 'Toda nuestra colección'}</h2></div>
                        <p class="collection-count">${products.length} diseños disponibles</p>
                    </div>
                    <div class="collection-rail" aria-label="Filtrar colecciones">${categoryLinks()}</div>
                    <div class="catalog-toolbar">
                        <div class="type-switch" role="group" aria-label="Tipo de producto">
                            <button type="button" data-type="" class="${!initialType ? 'selected' : ''}">Todos</button>
                            <button type="button" data-type="tazas" class="${initialType === 'tazas' ? 'selected' : ''}">Tazas</button>
                            <button type="button" data-type="polos" class="${initialType === 'polos' ? 'selected' : ''}">Polos</button>
                        </div>
                        <label class="search-box"><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar colección..." aria-label="Buscar colección"></label>
                    </div>
                    <div class="active-filter" aria-live="polite"></div>
                    <div class="product-grid grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 lg:grid-cols-4" aria-live="polite"></div>
                    <div class="catalog-pagination" aria-label="Paginación del catálogo" aria-live="polite"></div>
                </section>` : ''}
                ${activeView === 'contacto' ? `<section class="ct" id="contacto" aria-labelledby="contact-heading">
                    <div class="ct-panel">
                        <div class="ct-intro">
                            <p class="eyebrow"><span></span> Estamos para ayudarte</p>
                            <h2 id="contact-heading">Hablemos de tu <em>idea.</em></h2>
                            <p>Elige tu canal favorito y cuéntanos qué detalle tienes en mente.</p>
                            <a class="ct-cta" href="https://wa.me/51985925137" target="_blank" rel="noopener noreferrer">
                                Escribir ahora <span aria-hidden="true">↗</span>
                            </a>
                        </div>

                        <div class="ct-list">
                            <a class="ct-item ct-wa" href="https://wa.me/51985925137" target="_blank" rel="noopener noreferrer">
                                <span class="ct-icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.5L3 21z"/><path d="M9 8.5c.3 2.5 3 5.2 5.5 5.5l1.2-1.2-2-1-.8.8c-.8-.4-1.8-1.4-2.2-2.2l.8-.8-1-2L9 8.5z"/></svg>
                                </span>
                                <span class="ct-text"><small>WhatsApp</small><strong>+51 985 925 137</strong></span>
                                <span class="ct-go" aria-hidden="true">↗</span>
                            </a>

                            <a class="ct-item ct-ig" href="https://www.instagram.com/creativeprints.pe/" target="_blank" rel="noopener noreferrer">
                                <span class="ct-icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/></svg>
                                </span>
                                <span class="ct-text"><small>Instagram</small><strong>@creativeprints.pe</strong></span>
                                <span class="ct-go" aria-hidden="true">↗</span>
                            </a>

                            <a class="ct-item ct-fb" href="https://www.facebook.com/creativeprints.pe/" target="_blank" rel="noopener noreferrer">
                                <span class="ct-icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.2h2.5V21h3.2v-6.8H16l.5-3.2h-2.8V8.9c0-.2.1-.4.3-.4z"/></svg>
                                </span>
                                <span class="ct-text"><small>Facebook</small><strong>Nat Art - Sublimación</strong></span>
                                <span class="ct-go" aria-hidden="true">↗</span>
                            </a>
                        </div>
                    </div>
                </section>` : ''}
            </main>
            <footer class="site-footer">
                <div class="site-footer-inner">
                    <div class="site-footer-brand">
                        <a class="brand" href="index.html?vista=inicio">
                            <img src="./img/logo2.png" alt="Nat Art" class="brand-logo">
                        </a>
                        <p>Detalles personalizados para regalar, celebrar y recordar.</p>
                    </div>
                    <div class="site-footer-links">
                        <div>
                            <span class="footer-label">Navegación</span>
                            <a href="index.html?vista=inicio">Inicio</a>
                            <a href="index.html?vista=catalogo">Catálogo</a>
                            <a href="index.html?vista=contacto">Contacto</a>
                        </div>
                        <div>
                            <span class="footer-label">Contacto</span>
                            <a href="https://wa.me/51985925137" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                            <a href="https://www.instagram.com/creativeprints.pe/" target="_blank" rel="noopener noreferrer">Instagram</a>
                            <a href="https://www.facebook.com/creativeprints.pe/" target="_blank" rel="noopener noreferrer">Facebook</a>
                        </div>
                    </div>
                </div>
                <div class="site-footer-bottom">
                    <p>Diseñado con cariño en Perú · © 2026 Nat Art</p>
                </div>
            </footer>
            <dialog class="design-dialog" aria-label="Vista del diseño"><button class="dialog-close" type="button" aria-label="Cerrar">×</button><img alt=""><div class="dialog-caption"></div></dialog>
            <div class="toast" role="status" aria-live="polite"></div>`;
        document.body.classList.remove('storefront-pending');

        const featuredCarousel = document.querySelector('.featured-carousel');
        if (featuredCarousel) {
            const viewport = featuredCarousel.querySelector('.featured-viewport');
            const track = featuredCarousel.querySelector('.featured-grid');
            const prevButton = featuredCarousel.querySelector('.featured-arrow-prev');
            const nextButton = featuredCarousel.querySelector('.featured-arrow-next');
            const cards = Array.from(track.children);
            let currentIndex = 0;
            const getStep = () => {
                const firstCard = cards[0];
                if (!firstCard) return 0;
                const styles = window.getComputedStyle(track);
                const gap = parseFloat(styles.columnGap || styles.gap || '0');
                return firstCard.getBoundingClientRect().width + gap;
            };
            const updateCarousel = () => {
                if (!cards.length) return;
                const maxIndex = Math.max(0, cards.length - 1);
                currentIndex = Math.min(currentIndex, maxIndex);
                const offset = getStep() * currentIndex;
                track.style.transform = `translateX(-${offset}px)`;
                prevButton.disabled = currentIndex === 0;
                nextButton.disabled = currentIndex >= maxIndex;
                track.style.transition = 'transform .35s ease';
            };
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex -= 1;
                    updateCarousel();
                }
            });
            nextButton.addEventListener('click', () => {
                if (currentIndex < cards.length - 1) {
                    currentIndex += 1;
                    updateCarousel();
                }
            });
            window.addEventListener('resize', updateCarousel);
            updateCarousel();
        }

        const hero = document.querySelector('.hero');
        if (hero && heroSlides.length > 1) {
            const heroImages = [...hero.querySelectorAll('.hero-image')];
            const heroDots = [...hero.querySelectorAll('.hero-dot')];
            const heroLabel = hero.querySelector('.hero-slide-label');
            const heroIndex = hero.querySelector('.hero-current-index');
            const pauseButton = hero.querySelector('.hero-pause');
            let currentSlide = 0;
            let timerId;
            let manuallyPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            let pointerOverHero = false;

            heroSlides.forEach((slide) => {
                const preload = new Image();
                preload.src = slide.image;
            });

            function showSlide(index) {
                currentSlide = (index + heroSlides.length) % heroSlides.length;
                const activeImage = hero.querySelector('.hero-image.is-active');
                const nextImage = heroImages.find((image) => image !== activeImage);
                const slide = heroSlides[currentSlide];

                nextImage.src = slide.image;
                nextImage.alt = `${slide.typeLabel} ${slide.categoryLabel}`;
                nextImage.removeAttribute('aria-hidden');
                activeImage.setAttribute('aria-hidden', 'true');
                activeImage.alt = '';
                nextImage.classList.add('is-active');
                activeImage.classList.remove('is-active');
                heroLabel.textContent = `${slide.categoryLabel} · hecho para regalar, creado para ti`;
                heroIndex.textContent = String(currentSlide + 1).padStart(2, '0');

                heroDots.forEach((dot, dotIndex) => {
                    const isCurrent = dotIndex === currentSlide;
                    dot.classList.toggle('is-active', isCurrent);
                    dot.setAttribute('aria-current', String(isCurrent));
                });
            }

            function resetTimer() {
                window.clearInterval(timerId);
                if (!manuallyPaused && !pointerOverHero && !document.hidden) {
                    timerId = window.setInterval(() => showSlide(currentSlide + 1), 1500);
                }
                pauseButton.innerHTML = manuallyPaused ? `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-player-play">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M7 4v16l13 -8l-13 -8" />
                    </svg>
                ` : `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-player-pause">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -12" />
                        <path d="M14 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -12" />
                    </svg>
                `;
                pauseButton.setAttribute('aria-pressed', String(manuallyPaused));
                pauseButton.setAttribute('aria-label', manuallyPaused ? 'Reanudar carrusel' : 'Pausar carrusel');
            }

            hero.querySelectorAll('.hero-arrow').forEach((button) => {
                button.addEventListener('click', () => {
                    showSlide(currentSlide + (button.dataset.direction === 'next' ? 1 : -1));
                    resetTimer();
                });
            });
            heroDots.forEach((dot) => {
                dot.addEventListener('click', () => {
                    showSlide(Number(dot.dataset.slide));
                    resetTimer();
                });
            });
            pauseButton.addEventListener('click', () => {
                manuallyPaused = !manuallyPaused;
                resetTimer();
            });
            hero.addEventListener('pointerenter', () => {
                pointerOverHero = true;
                resetTimer();
            });
            hero.addEventListener('pointerleave', () => {
                pointerOverHero = false;
                resetTimer();
            });
            document.addEventListener('visibilitychange', resetTimer);
            resetTimer();
        }

        if (activeView === 'catalogo') {
            let selectedType = initialType;
            let selectedCategory = initialCategory;
            let categoryPage = 0;
            let currentPage = 1;
            const categoriesPerPage = 10;
            const grid = document.querySelector('.product-grid');
            const search = document.querySelector('.search-box input');
            const filterNote = document.querySelector('.active-filter');
            const pagination = document.querySelector('.catalog-pagination');
            const itemsPerPage = 20;

            function renderPagination(totalPages) {
                if (!pagination) return;
                if (totalPages <= 1) {
                    pagination.innerHTML = '';
                    pagination.hidden = true;
                    return;
                }

                const pages = [];
                const maxButtons = 5;
                let start = Math.max(1, currentPage - 2);
                let end = Math.min(totalPages, start + maxButtons - 1);

                if (end - start + 1 < maxButtons) {
                    start = Math.max(1, end - maxButtons + 1);
                }

                if (start > 1) {
                    pages.push(1);
                    if (start > 2) pages.push('ellipsis-start');
                }

                for (let page = start; page <= end; page += 1) {
                    pages.push(page);
                }

                if (end < totalPages) {
                    if (end < totalPages - 1) pages.push('ellipsis-end');
                    pages.push(totalPages);
                }

                const buttons = pages.map((page) => {
                    if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                        return '<span class="pagination-ellipsis">…</span>';
                    }

                    const isActive = page === currentPage;
                    return `<button type="button" class="pagination-page ${isActive ? 'is-active' : ''}" data-page="${page}" ${isActive ? 'aria-current="page"' : ''}>${page}</button>`;
                }).join('');

                pagination.hidden = false;
                pagination.innerHTML = `
                    <button type="button" class="pagination-nav" data-page="${Math.max(1, currentPage - 1)}" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>
                    <div class="pagination-pages">${buttons}</div>
                    <button type="button" class="pagination-nav" data-page="${Math.min(totalPages, currentPage + 1)}" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente</button>
                `;

                pagination.querySelectorAll('.pagination-page').forEach((button) => {
                    button.addEventListener('click', () => {
                        currentPage = Number(button.dataset.page);
                        updateGrid();
                    });
                });

                pagination.querySelectorAll('.pagination-nav').forEach((button) => {
                    button.addEventListener('click', () => {
                        currentPage = Number(button.dataset.page);
                        updateGrid();
                    });
                });
            }

            function updateGrid() {
            const query = normalize(search.value.trim());
            const typeProducts = products.filter((item) => !selectedType || item.type === selectedType);
            const availableCategories = [...new Set(typeProducts.map((item) => item.category))];
            if (selectedCategory && availableCategories.includes(selectedCategory)) {
                categoryPage = Math.floor(availableCategories.indexOf(selectedCategory) / categoriesPerPage);
            }
            const pageCount = Math.max(1, Math.ceil(availableCategories.length / categoriesPerPage));
            categoryPage = Math.min(categoryPage, pageCount - 1);
            const visibleCategories = new Set(availableCategories.slice(categoryPage * categoriesPerPage, (categoryPage + 1) * categoriesPerPage));
            if (selectedCategory && !availableCategories.includes(selectedCategory)) selectedCategory = '';

            const shown = typeProducts.filter((item) => {
                const matchesCategory = !selectedCategory || item.category === selectedCategory;
                const matchesQuery = !query || normalize(`${item.categoryLabel} ${item.typeLabel} ${item.title}`).includes(query);
                return matchesCategory && matchesQuery;
            });

            const totalPages = Math.max(1, Math.ceil(shown.length / itemsPerPage));
            currentPage = Math.min(currentPage, totalPages);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedItems = shown.slice(startIndex, startIndex + itemsPerPage);

            updatePageMetadata(selectedCategory, selectedType);
            grid.innerHTML = productCards(paginatedItems);
            const startNumber = shown.length ? startIndex + 1 : 0;
            const endNumber = Math.min(startIndex + itemsPerPage, shown.length);
            document.querySelector('.collection-count').textContent = `${shown.length ? `${startNumber}-${endNumber} de ` : ''}${shown.length} ${shown.length === 1 ? 'diseño disponible' : 'diseños disponibles'}`;
            filterNote.textContent = selectedCategory ? `${labels[selectedCategory] || selectedCategory} · ${shown.length} diseños` : `${shown.length} diseños`;
            const moreButton = document.querySelector('.collection-more');
            moreButton.hidden = pageCount < 2;
            moreButton.classList.toggle('is-back', categoryPage > 0);
            moreButton.querySelector('.collection-more-icon').textContent = categoryPage > 0 ? '←' : '+';
            moreButton.querySelector('.collection-more-label').textContent = categoryPage > 0 ? ' Volver a categorías' : ' Ver más categorías';
            moreButton.setAttribute('aria-label', categoryPage > 0 ? ' Volver a las categorías anteriores' : 'Mostrar más categorías');
            document.querySelectorAll('.category-chip').forEach((chip) => {
                const count = typeProducts.filter((item) => item.category === chip.dataset.category).length;
                chip.hidden = count === 0 || !visibleCategories.has(chip.dataset.category);
                chip.querySelector('span').textContent = count;
                chip.classList.toggle('is-selected', chip.dataset.category === selectedCategory);
            });
            renderPagination(totalPages);
            }

            document.querySelector('.collection-more').addEventListener('click', () => {
            const categoryTotal = new Set(products.filter((item) => !selectedType || item.type === selectedType).map((item) => item.category)).size;
            const pageCount = Math.ceil(categoryTotal / categoriesPerPage);
            categoryPage = categoryPage === 0 ? 1 : 0;
            selectedCategory = '';
            currentPage = 1;
            updateGrid();
            });

            document.querySelectorAll('.category-chip').forEach((chip) => {
            chip.addEventListener('click', () => {
                selectedCategory = selectedCategory === chip.dataset.category ? '' : chip.dataset.category;
                currentPage = 1;
                updateGrid();
            });
            });
            document.querySelectorAll('.type-switch button').forEach((button) => {
            button.addEventListener('click', () => {
                selectedType = button.dataset.type;
                categoryPage = 0;
                currentPage = 1;
                document.querySelectorAll('.type-switch button').forEach((item) => item.classList.toggle('selected', item === button));
                updateGrid();
            });
            });
            search.addEventListener('input', () => {
                currentPage = 1;
                updateGrid();
            });
            grid.addEventListener('click', (event) => {
            const trigger = event.target.closest('[data-image]');
            if (!trigger) return;
            const dialog = document.querySelector('.design-dialog');
            dialog.querySelector('img').src = trigger.dataset.image;
            dialog.querySelector('img').alt = trigger.dataset.title;
            dialog.querySelector('.dialog-caption').textContent = trigger.dataset.title;
            dialog.showModal();
            });
            const dialog = document.querySelector('.design-dialog');
            dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
            dialog.addEventListener('click', (event) => {
            if (event.target === dialog) dialog.close();
            });
            updateGrid();
        }

        const menuButton = document.querySelector('.mobile-menu');
        menuButton.addEventListener('click', () => {
            const open = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', String(!open));
            document.querySelector('.main-nav').classList.toggle('nav-open', !open);
        });
    }

    document.addEventListener('DOMContentLoaded', mount);
})();
