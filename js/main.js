// Shared functionality across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.querySelector('.back-to-top');
    
    // Current page detection
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Mark active navigation link
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
        
        // Update data-page attribute for transitions
        link.setAttribute('data-page', linkHref.replace('.html', ''));
    });
    
    // Sticky Navbar
    function handleStickyNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    }
    
    // Toggle Mobile Menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        
        // Toggle body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Close Mobile Menu
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    // Back to Top Button
    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    // Scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    
    // Initialize Event Listeners
    function init() {
        // Scroll event for sticky navbar
        window.addEventListener('scroll', handleStickyNavbar);
        
        // Scroll event for back to top button
        window.addEventListener('scroll', handleBackToTop);
        
        // Hamburger menu click
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }
        
        // Back to top button click
        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && hamburger && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target) && 
                navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Close menu on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Newsletter form submission
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="email"]').value;
                alert(`Thank you for subscribing with ${email}! You'll receive updates on our latest brews and special offers.`);
                this.reset();
            });
        }
        
        // Initialize
        handleStickyNavbar();
        handleBackToTop();
        
        // Add page load animation
        document.body.classList.add('animate-fade');
    }
    
    // Start the script
    init();
});

// Page transition animation
function navigateToPage(page) {
    const body = document.body;
    body.style.opacity = '0';
    body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.href = page;
    }, 300);
}