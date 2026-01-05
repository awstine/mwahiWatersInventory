document.addEventListener('DOMContentLoaded', () => {
    // --- Force page to top on refresh ---
    // Prevents the browser from jumping to a #hash link on reload
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- Element Selectors ---
    const header = document.getElementById('site-header');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = menuBtn.querySelector('i');
    const backToTopBtn = document.getElementById('back-to-top');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

    // --- Header Scroll & Back to Top Button ---
    const handleScroll = () => {
        // Add 'scrolled' class to header for dynamic styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Toggle visibility of the back-to-top button
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // --- Mobile Menu Toggle ---
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Toggle icon between list and x for better UX
        if (mobileMenu.classList.contains('active')) {
            menuIcon.classList.replace('ph-list', 'ph-x');
        } else {
            menuIcon.classList.replace('ph-x', 'ph-list');
        }
    });

    // --- Close mobile menu when a link is clicked ---
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuIcon.classList.replace('ph-x', 'ph-list');
        });
    });

    // --- Back to Top Button Functionality ---
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Scroll-triggered Animations ---
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Triggers animation a bit before element is fully in view
    });

    // Animate standalone elements
    document.querySelectorAll('.section-header, .registration-badge, .partners-header').forEach(el => {
        observer.observe(el);
    });

    // Animate grid items with a staggered delay
    const grids = document.querySelectorAll('.stats-grid, .mission-vision-grid, .values-grid, .projects-grid, .work-grid, .partners-grid');
    grids.forEach(grid => {
        const gridItems = Array.from(grid.children);
        gridItems.forEach((item, index) => {
            item.style.setProperty('--stagger-index', index);
            observer.observe(item);
        });
    });
});