// Menu page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Menu category navigation
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuSections = document.querySelectorAll('.menu-section');
    
    // Smooth scroll to menu sections
    menuCategories.forEach(category => {
        category.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all categories
            menuCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked category
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Scroll to section
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const menuNavHeight = document.querySelector('.menu-navigation').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - menuNavHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active category on scroll
    function updateActiveCategory() {
        const scrollPosition = window.scrollY + 150;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const menuNavHeight = document.querySelector('.menu-navigation').offsetHeight;
        
        menuSections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - menuNavHeight;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = '#' + section.id;
                menuCategories.forEach(category => {
                    category.classList.remove('active');
                    if (category.getAttribute('href') === sectionId) {
                        category.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Intersection Observer for menu items
    const menuItems = document.querySelectorAll('.menu-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // Observe menu items
    menuItems.forEach(item => {
        observer.observe(item);
    });
    
    // Scroll event for updating active category
    window.addEventListener('scroll', updateActiveCategory);
    
    // Initialize active category
    updateActiveCategory();
    
    // Menu item hover effects
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            if (item.classList.contains('visible')) {
                item.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Add to cart functionality (demo)
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.closest('.menu-item').querySelector('h3').textContent;
                const itemPrice = this.closest('.menu-item').querySelector('.item-price').textContent;
                
                // Show notification
                showNotification(`${itemName} added to cart!`, 'success');
                
                // Update cart count
                updateCartCount();
                
                // Animation
                this.classList.add('added');
                setTimeout(() => {
                    this.classList.remove('added');
                }, 1000);
            });
        });
    }
    
    // Notification function
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        // Close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
    }
    
    // Update cart count (demo)
    function updateCartCount() {
        let cartCount = localStorage.getItem('cartCount') || 0;
        cartCount = parseInt(cartCount) + 1;
        localStorage.setItem('cartCount', cartCount);
        
        // Update UI if cart icon exists
        const cartIcon = document.querySelector('.cart-count');
        if (cartIcon) {
            cartIcon.textContent = cartCount;
            cartIcon.classList.add('updated');
            setTimeout(() => {
                cartIcon.classList.remove('updated');
            }, 500);
        }
    }
});