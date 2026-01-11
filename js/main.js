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

    
    // HERO BACKGROUND SLIDER

    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        // Respect reduced motion
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!reduceMotion) {
            let currentSlide = 0;
            const intervalMs = 5000; // change time here (5000 = 5 seconds)

            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, intervalMs);
        } else {
            // If reduced motion is enabled, just show first slide
            slides.forEach((s, i) => s.classList.toggle('active', i === 0));
        }
    }

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

    // 1. SCROLL PROGRESS BAR
    const progressBar = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrollPercentage + '%';
        }
    });


    // 3. 3D TILT HOVER EFFECTS
    const tiltCards = document.querySelectorAll('.project-card, .work-card, .mission-vision-card');

    tiltCards.forEach(card => {
        card.classList.add('tilt-card'); // Add CSS class for perspective
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation (max 10 degrees)
            const xRotation = -((y - rect.height / 2) / rect.height * 10);
            const yRotation = ((x - rect.width / 2) / rect.width * 10);
            
            card.style.transform = `perspective(1000px) scale(1.02) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset position smoothly
            card.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // Remove transition for instant follow
        });
    });

    // CONTACT MODAL
    const modal = document.getElementById('contact-modal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Form elements
    const formContainer = document.getElementById('form-container');
    const form = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    function openModal(e) {
        e.preventDefault();
        if (modal) modal.classList.add('active');
    }

    function closeModal() {
        if (modal) modal.classList.remove('active');
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // --- Form Submission Logic ---
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            submitBtn.textContent = "Please wait...";
            submitBtn.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            })
            .then(async (response) => {
                if (response.status == 200) {
                    formContainer.classList.add('hidden');
                    formFeedback.classList.remove('hidden');
                } else { throw new Error('Form submission failed'); }
            })
            .catch(error => {
                console.error(error);
                alert('Sorry, there was an error sending your message. Please try again later.');
                submitBtn.textContent = "Submit Message";
                submitBtn.disabled = false;
            });
        });
    }

// PARTNERS SECTION - Expandable Cards

const partnerCards = document.querySelectorAll('.partner-card');

partnerCards.forEach(card => {
    card.addEventListener('click', function(e) {
        // Don't trigger if clicking on links or buttons inside
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
            return;
        }
        
        const isActive = this.classList.contains('active');
        
        // Close all other cards
        partnerCards.forEach(otherCard => {
            otherCard.classList.remove('active');
        });
        
        // If the clicked card wasn't active, open it
        if (!isActive) {
            this.classList.add('active');
            
            // Scroll the card into view if it's not fully visible
            const cardTop = this.getBoundingClientRect().top;
            const cardBottom = this.getBoundingClientRect().bottom;
            const viewportHeight = window.innerHeight;
            
            if (cardBottom > viewportHeight || cardTop < 0) {
                this.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    });
});

// Close partner cards when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.partner-card')) {
        partnerCards.forEach(card => {
            card.classList.remove('active');
        });
    }
});

// Close partner cards when pressing Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        partnerCards.forEach(card => {
            card.classList.remove('active');
        });
    }
});
});
