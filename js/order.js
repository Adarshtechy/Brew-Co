// Order page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Sample menu data
    const menuItems = {
        coffee: [
            { id: 1, name: "Espresso", price: 3.50, description: "Rich, concentrated shot", image: "/images/espresso.jpg" },
            { id: 2, name: "Cappuccino", price: 4.75, description: "Espresso with steamed milk", image: "/images/cappuccino.jpg" },
            { id: 3, name: "Latte", price: 5.00, description: "Smooth espresso with milk", image: "/images/latte.jpg" },
            { id: 4, name: "Americano", price: 4.00, description: "Espresso shots with hot water", image: "/images/americano.jpg" },
            { id: 5, name: "Mocha", price: 5.50, description: "Chocolate espresso with milk", image: "/images/mocha.jpg" },
            { id: 6, name: "Cold Brew", price: 4.75, description: "Slow-steeped for 18 hours", image: "/images/cold-brew.jpg" }
        ],
        tea: [
            { id: 7, name: "Earl Grey", price: 4.00, description: "Black tea with bergamot", image: "/images/earl-grey.jpg" },
            { id: 8, name: "Green Tea", price: 4.00, description: "Japanese sencha", image: "/images/green-tea.jpg" },
            { id: 9, name: "Chamomile", price: 4.25, description: "Floral herbal infusion", image: "/images/chamomile.jpg" },
            { id: 10, name: "Chai Latte", price: 5.25, description: "Spiced tea with milk", image: "/images/chai-latte.jpg" }
        ],
        pastries: [
            { id: 11, name: "Butter Croissant", price: 3.75, description: "Flaky French-style croissant", image: "/images/croissant.jpg" },
            { id: 12, name: "Chocolate Croissant", price: 4.25, description: "Croissant filled with rich chocolate", image: "/images/chocolate-croissant.jpg" },
            { id: 13, name: "Blueberry Muffin", price: 3.50, description: "Soft muffin loaded with blueberries", image: "/images/blueberry-muffin.jpg" },
            { id: 14, name: "Cinnamon Roll", price: 4.50, description: "Warm roll with cinnamon glaze", image: "/images/cinnamon-roll.jpg" },
            { id: 15, name: "Almond Danish", price: 4.25, description: "Buttery pastry with almond filling", image: "/images/almond-danish.jpg" }
        ],
        breakfast: [
            { id: 16, name: "Avocado Toast", price: 6.75, description: "Sourdough topped with smashed avocado", image: "/images/avocado-toast.jpg" },
            { id: 17, name: "Egg & Cheese Sandwich", price: 5.50, description: "Scrambled eggs with melted cheese", image: "/images/egg-cheese-sandwich.jpg" },
            { id: 18, name: "Bacon & Egg Croissant", price: 6.25, description: "Croissant with crispy bacon and egg", image: "/images/bacon-egg-croissant.jpg" },
            { id: 19, name: "Pancake Stack", price: 6.95, description: "Fluffy pancakes with maple syrup", image: "/images/pancakes.jpg" },
            { id: 20, name: "Greek Yogurt Bowl", price: 5.95, description: "Yogurt with granola and fresh fruits", image: "/images/yogurt-bowl.jpg" }
        ]


    };

    // Cart state
    const cart = {
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0
    };

    // Initialize order process
    function initOrderProcess() {
        // Load initial menu items
        loadMenuItems('coffee');
        
        // Setup event listeners
        setupCategoryButtons();
        setupStepNavigation();
        setupDeliveryOptions();
        setupPaymentMethods();
        setupOrderSubmission();
        
        // Initialize cart
        updateCartDisplay();
    }

    // Load menu items by category
    function loadMenuItems(category) {
        const container = document.getElementById('coffee-items');
        if (!container) return;
        
        container.innerHTML = '';
        
        const items = menuItems[category] || [];
        items.forEach((item, index) => {
            const itemElement = createMenuItemElement(item, index);
            container.appendChild(itemElement);
            
            // Add animation delay
            setTimeout(() => {
                itemElement.classList.add('visible');
            }, index * 100);
        });
    }

    // Create menu item element
    function createMenuItemElement(item, index) {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.style.animationDelay = `${index * 0.1}s`;
        
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="item-info">
                <div class="item-header">
                    <h3>${item.name}</h3>
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                </div>
                <p class="item-description">${item.description}</p>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity" id="qty-${item.id}">0</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="add-to-cart" data-id="${item.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const minusBtn = div.querySelector('.minus');
        const plusBtn = div.querySelector('.plus');
        const addBtn = div.querySelector('.add-to-cart');
        
        minusBtn.addEventListener('click', () => updateQuantity(item.id, -1));
        plusBtn.addEventListener('click', () => updateQuantity(item.id, 1));
        addBtn.addEventListener('click', () => addToCart(item));
        
        return div;
    }

    // Update item quantity
    function updateQuantity(itemId, change) {
        const quantityElement = document.getElementById(`qty-${itemId}`);
        let quantity = parseInt(quantityElement.textContent) || 0;
        quantity = Math.max(0, quantity + change);
        quantityElement.textContent = quantity;
    }

    // Add item to cart
    function addToCart(item) {
        const quantityElement = document.getElementById(`qty-${item.id}`);
        const quantity = parseInt(quantityElement.textContent) || 0;
        
        if (quantity === 0) {
            showNotification('Please select a quantity', 'error');
            return;
        }
        
        // Check if item already in cart
        const existingIndex = cart.items.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingIndex > -1) {
            // Update existing item
            cart.items[existingIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                ...item,
                quantity: quantity,
                customization: getCurrentCustomization()
            });
        }
        
        // Reset quantity display
        quantityElement.textContent = '0';
        
        // Update cart
        updateCart();
        
        // Show success message
        showNotification(`${quantity} ${item.name}(s) added to cart!`, 'success');
        
        // Animate add button
        const addBtn = document.querySelector(`.add-to-cart[data-id="${item.id}"]`);
        addBtn.classList.add('added');
        setTimeout(() => addBtn.classList.remove('added'), 1000);
    }

    // Get current customization
    function getCurrentCustomization() {
        return {
            size: document.querySelector('input[name="size"]:checked')?.value || 'medium',
            milk: document.querySelector('input[name="milk"]:checked')?.value || 'whole',
            addons: Array.from(document.querySelectorAll('input[name="addons"]:checked'))
                .map(checkbox => checkbox.value),
            instructions: document.querySelector('.instructions')?.value || ''
        };
    }

    // Update cart
    function updateCart() {
        // Calculate subtotal
        cart.subtotal = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Calculate tax (8%)
        cart.tax = cart.subtotal * 0.08;
        
        // Calculate total
        cart.total = cart.subtotal + cart.tax + cart.deliveryFee;
        
        // Update display
        updateCartDisplay();
        updateReviewSummary();
    }

    // Update cart display
    function updateCartDisplay() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const totalAmountElement = document.querySelector('.total-amount');
        
        if (!cartItemsContainer || !totalAmountElement) return;
        
        // Clear existing items
        cartItemsContainer.innerHTML = '';
        
        // Add items
        cart.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name} x${item.quantity}</h4>
                    <p>${item.customization?.size || 'Medium'}</p>
                </div>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Update total
        totalAmountElement.textContent = `$${cart.total.toFixed(2)}`;
    }

    // Update review summary
    function updateReviewSummary() {
        const subtotalElement = document.querySelector('.subtotal');
        const taxElement = document.querySelector('.tax');
        const deliveryFeeElement = document.querySelector('.delivery-fee');
        const finalTotalElement = document.querySelector('.final-total');
        
        if (subtotalElement) subtotalElement.textContent = `$${cart.subtotal.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${cart.tax.toFixed(2)}`;
        if (deliveryFeeElement) deliveryFeeElement.textContent = `$${cart.deliveryFee.toFixed(2)}`;
        if (finalTotalElement) finalTotalElement.textContent = `$${cart.total.toFixed(2)}`;
    }

    // Setup category buttons
    function setupCategoryButtons() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Load items for selected category
                const category = this.getAttribute('data-category');
                loadMenuItems(category);
            });
        });
    }

    // Setup step navigation
    function setupStepNavigation() {
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        
        // Next step buttons
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStep = this.getAttribute('data-next');
                navigateToStep(nextStep);
            });
        });
        
        // Previous step buttons
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prevStep = this.getAttribute('data-prev');
                navigateToStep(prevStep);
            });
        });
    }

    // Navigate to step
    function navigateToStep(stepNumber) {
        // Hide all steps
        const steps = document.querySelectorAll('.order-step');
        steps.forEach(step => step.classList.remove('active'));
        
        // Show target step
        const targetStep = document.getElementById(`step-${stepNumber}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }
        
        // Update progress bar
        updateProgressBar(stepNumber);
        
        // Update cart in review step
        if (stepNumber === '4') {
            updateReviewSummary();
        }
    }

    // Update progress bar
    function updateProgressBar(activeStep) {
        const progressSteps = document.querySelectorAll('.progress-step');
        
        progressSteps.forEach(step => {
            const stepNumber = step.getAttribute('data-step');
            step.classList.remove('active');
            
            if (parseInt(stepNumber) <= parseInt(activeStep)) {
                step.classList.add('active');
            }
        });
    }

    // Setup delivery options
    function setupDeliveryOptions() {
        const optionCards = document.querySelectorAll('.option-card');
        const pickupDetails = document.querySelector('.pickup-details');
        const deliveryForm = document.querySelector('.delivery-form');
        
        optionCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove active class from all cards
                optionCards.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked card
                this.classList.add('active');
                
                // Update delivery details
                const option = this.getAttribute('data-option');
                
                if (option === 'pickup') {
                    pickupDetails.classList.add('active');
                    deliveryForm.classList.remove('active');
                    cart.deliveryFee = 0;
                } else {
                    pickupDetails.classList.remove('active');
                    deliveryForm.classList.add('active');
                    cart.deliveryFee = 3.99;
                }
                
                // Update cart
                updateCart();
            });
        });
    }

    // Setup payment methods
    function setupPaymentMethods() {
        const methodOptions = document.querySelectorAll('.method-option');
        const paymentForms = document.querySelectorAll('.payment-form');
        
        methodOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                methodOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Show corresponding form
                const method = this.querySelector('input').value;
                paymentForms.forEach(form => form.classList.remove('active'));
                
                const targetForm = document.querySelector(`.payment-form[data-method="${method}"]`);
                if (targetForm) {
                    targetForm.classList.add('active');
                }
            });
        });
    }

    // Setup order submission
    function setupOrderSubmission() {
        const submitButton = document.querySelector('.submit-order');
        const trackingModal = document.getElementById('tracking-modal');
        const closeModal = trackingModal.querySelector('.close-modal');
        
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Validate cart
                if (cart.items.length === 0) {
                    showNotification('Please add items to your cart', 'error');
                    return;
                }
                
                // Validate payment
                if (!validatePayment()) {
                    showNotification('Please complete payment information', 'error');
                    return;
                }
                
                // Show loading state
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                this.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    this.innerHTML = '<i class="fas fa-lock"></i> Place Order';
                    this.disabled = false;
                    
                    // Show tracking modal
                    trackingModal.classList.add('show');
                    
                    // Start order tracking simulation
                    simulateOrderTracking();
                }, 2000);
            });
        }
        
        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                trackingModal.classList.remove('show');
            });
        }
        
        // Close modal on outside click
        trackingModal.addEventListener('click', (e) => {
            if (e.target === trackingModal) {
                trackingModal.classList.remove('show');
            }
        });
    }

    // Validate payment
    function validatePayment() {
        // This is a demo validation
        const cardNumber = document.getElementById('card-number')?.value.trim();
        const cardName = document.getElementById('card-name')?.value.trim();
        const expiry = document.getElementById('expiry')?.value.trim();
        const cvv = document.getElementById('cvv')?.value.trim();
        
        if (!cardNumber || cardNumber.length < 16) return false;
        if (!cardName) return false;
        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) return false;
        if (!cvv || cvv.length < 3) return false;
        
        return true;
    }

    // Simulate order tracking
    function simulateOrderTracking() {
        const trackingSteps = document.querySelectorAll('.tracking-step');
        let currentStep = 0;
        
        const interval = setInterval(() => {
            if (currentStep < trackingSteps.length) {
                trackingSteps[currentStep].classList.add('active');
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 3000);
    }

    // Show notification
    function showNotification(message, type = 'info') {
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
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
        
        // Close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
    }

    // Initialize form validation
    function initFormValidation() {
        const inputs = document.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }

    // Validate field
    function validateField(field) {
        const value = field.value.trim();
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (!value && field.hasAttribute('required')) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        clearFieldError(field);
        return true;
    }

    // Show field error
    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 1.2rem;
            margin-top: 0.5rem;
            display: block;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    // Clear field error
    function clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Start the order process
    initOrderProcess();
    initFormValidation();
    
    // Add cart count to navbar
    function updateNavbarCart() {
        const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
        const orderButton = document.querySelector('.nav-menu .btn-outline');
        
        if (orderButton && cartCount > 0) {
            const existingBadge = orderButton.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.textContent = cartCount;
            } else {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = cartCount;
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #e74c3c;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                orderButton.style.position = 'relative';
                orderButton.appendChild(badge);
            }
        } else if (orderButton) {
            const existingBadge = orderButton.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
        }
    }
    
    // Update navbar cart when cart changes
    const cartObserver = new MutationObserver(updateNavbarCart);
    const cartContainer = document.querySelector('.cart-items');
    if (cartContainer) {
        cartObserver.observe(cartContainer, { childList: true, subtree: true });
    }
});