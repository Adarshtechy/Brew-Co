// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryModal = document.querySelector('.gallery-modal');
    const modalImage = document.querySelector('.modal-image');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const modalClose = document.querySelector('.modal-close');
    const modalPrev = document.querySelector('.modal-prev');
    const modalNext = document.querySelector('.modal-next');
    
    let currentImageIndex = 0;
    let filteredItems = [];
    let allItems = Array.from(galleryItems);
    
    // Initialize gallery
    function initGallery() {
        // Set initial filtered items to all items
        filteredItems = allItems;
        
        // Add click events to gallery items
        galleryItems.forEach((item, index) => {
            const viewBtn = item.querySelector('.gallery-view-btn');
            const caption = item.querySelector('.gallery-caption h3');
            const description = item.querySelector('.gallery-caption p');
            const imageSrc = item.querySelector('img').src;
            const imageAlt = item.querySelector('img').alt;
            
            // Store data on the item
            item.dataset.index = index;
            item.dataset.title = caption ? caption.textContent : 'Image';
            item.dataset.description = description ? description.textContent : '';
            item.dataset.imageSrc = imageSrc;
            item.dataset.imageAlt = imageAlt;
            
            // Add click event to item
            item.addEventListener('click', function() {
                openModal(index);
            });
            
            // Add click event to view button
            if (viewBtn) {
                viewBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openModal(index);
                });
            }
        });
        
        // Add click events to filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                if (filter === 'all') {
                    filteredItems = allItems;
                } else {
                    filteredItems = allItems.filter(item => 
                        item.dataset.category === filter
                    );
                }
                
                // Show/hide items with animation
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Re-index filtered items
                filteredItems = Array.from(document.querySelectorAll('.gallery-item[style*="display: block"], .gallery-item:not([style*="display: none"])'));
                filteredItems = filteredItems.filter(item => 
                    getComputedStyle(item).display !== 'none'
                );
            });
        });
        
        // Modal navigation
        modalClose.addEventListener('click', closeModal);
        
        modalPrev.addEventListener('click', function() {
            navigateModal(-1);
        });
        
        modalNext.addEventListener('click', function() {
            navigateModal(1);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (galleryModal.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        closeModal();
                        break;
                    case 'ArrowLeft':
                        navigateModal(-1);
                        break;
                    case 'ArrowRight':
                        navigateModal(1);
                        break;
                }
            }
        });
        
        // Close modal when clicking outside the image
        galleryModal.addEventListener('click', function(e) {
            if (e.target === galleryModal) {
                closeModal();
            }
        });
    }
    
    // Open modal with specific image
    function openModal(index) {
        // Get the filtered items
        const visibleItems = Array.from(document.querySelectorAll('.gallery-item')).filter(item => 
            getComputedStyle(item).display !== 'none'
        );
        
        // Find the actual index in visible items
        currentImageIndex = visibleItems.findIndex(item => 
            parseInt(item.dataset.index) === index
        );
        
        if (currentImageIndex === -1) return;
        
        const item = visibleItems[currentImageIndex];
        
        // Update modal content
        modalImage.src = item.dataset.imageSrc;
        modalImage.alt = item.dataset.imageAlt;
        modalTitle.textContent = item.dataset.title;
        modalDescription.textContent = item.dataset.description;
        
        // Show modal
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update navigation buttons state
        updateModalNavigation(visibleItems.length);
    }
    
    // Navigate through modal images
    function navigateModal(direction) {
        const visibleItems = Array.from(document.querySelectorAll('.gallery-item')).filter(item => 
            getComputedStyle(item).display !== 'none'
        );
        
        if (visibleItems.length <= 1) return;
        
        currentImageIndex += direction;
        
        // Handle wrap-around
        if (currentImageIndex < 0) {
            currentImageIndex = visibleItems.length - 1;
        } else if (currentImageIndex >= visibleItems.length) {
            currentImageIndex = 0;
        }
        
        const item = visibleItems[currentImageIndex];
        
        // Update modal content with fade animation
        galleryModal.querySelector('.modal-content').style.opacity = '0';
        
        setTimeout(() => {
            modalImage.src = item.dataset.imageSrc;
            modalImage.alt = item.dataset.imageAlt;
            modalTitle.textContent = item.dataset.title;
            modalDescription.textContent = item.dataset.description;
            
            galleryModal.querySelector('.modal-content').style.opacity = '1';
        }, 200);
        
        updateModalNavigation(visibleItems.length);
    }
    
    // Update modal navigation buttons
    function updateModalNavigation(totalItems) {
        // Hide buttons if only one image
        if (totalItems <= 1) {
            modalPrev.style.display = 'none';
            modalNext.style.display = 'none';
        } else {
            modalPrev.style.display = 'flex';
            modalNext.style.display = 'flex';
        }
    }
    
    // Close modal
    function closeModal() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset modal content opacity
        galleryModal.querySelector('.modal-content').style.opacity = '1';
    }
    
    // Initialize
    initGallery();
    
    // Add animation to gallery items on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Set initial styles for animation
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
});