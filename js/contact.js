// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const successMessage = document.getElementById('form-success');
    
    // Error elements
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');
    
    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Initialize
    function initContactPage() {
        // Form validation and submission
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        nameInput.addEventListener('blur', validateName);
        emailInput.addEventListener('blur', validateEmail);
        subjectInput.addEventListener('change', validateSubject);
        messageInput.addEventListener('blur', validateMessage);
        
        // FAQ toggle
        initFAQ();
        
        // Add animation to elements on scroll
        initScrollAnimations();
    }
    
    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();
        
        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Simulate form submission
            simulateFormSubmission();
        } else {
            // Scroll to first error
            scrollToFirstError();
        }
    }
    
    // Validate name
    function validateName() {
        const name = nameInput.value.trim();
        
        if (name === '') {
            showError(nameError, 'Please enter your name');
            nameInput.classList.add('error');
            return false;
        }
        
        if (name.length < 2) {
            showError(nameError, 'Name must be at least 2 characters');
            nameInput.classList.add('error');
            return false;
        }
        
        hideError(nameError);
        nameInput.classList.remove('error');
        return true;
    }
    
    // Validate email
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            showError(emailError, 'Please enter your email address');
            emailInput.classList.add('error');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            showError(emailError, 'Please enter a valid email address');
            emailInput.classList.add('error');
            return false;
        }
        
        hideError(emailError);
        emailInput.classList.remove('error');
        return true;
    }
    
    // Validate subject
    function validateSubject() {
        const subject = subjectInput.value;
        
        if (subject === '') {
            showError(subjectError, 'Please select a subject');
            subjectInput.classList.add('error');
            return false;
        }
        
        hideError(subjectError);
        subjectInput.classList.remove('error');
        return true;
    }
    
    // Validate message
    function validateMessage() {
        const message = messageInput.value.trim();
        
        if (message === '') {
            showError(messageError, 'Please enter your message');
            messageInput.classList.add('error');
            return false;
        }
        
        if (message.length < 10) {
            showError(messageError, 'Message must be at least 10 characters');
            messageInput.classList.add('error');
            return false;
        }
        
        hideError(messageError);
        messageInput.classList.remove('error');
        return true;
    }
    
    // Show error message
    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    // Hide error message
    function hideError(errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    // Scroll to first error
    function scrollToFirstError() {
        const firstError = document.querySelector('.error-message.show');
        if (firstError) {
            const input = firstError.previousElementSibling;
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            input.focus();
        }
    }
    
    // Simulate form submission
    function simulateFormSubmission() {
        // Disable submit button and show loading state
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            successMessage.classList.add('show');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            btnText.textContent = originalText;
            submitBtn.disabled = false;
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1500);
    }
    
    // Initialize FAQ functionality
    function initFAQ() {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = this.classList.contains('active');
                
                // Close all other FAQs
                faqQuestions.forEach(q => {
                    if (q !== this) {
                        q.classList.remove('active');
                        q.nextElementSibling.classList.remove('show');
                    }
                });
                
                // Toggle current FAQ
                this.classList.toggle('active');
                
                if (isActive) {
                    answer.classList.remove('show');
                } else {
                    answer.classList.add('show');
                }
            });
        });
        
        // Open first FAQ by default
        if (faqQuestions.length > 0) {
            faqQuestions[0].classList.add('active');
            faqQuestions[0].nextElementSibling.classList.add('show');
        }
    }
    
    // Initialize scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.info-item, .instruction, .faq-item');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(element);
        });
        
        // Handle animation when element becomes visible
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
    
    // Social buttons hover effects
    function initSocialButtons() {
        const socialBtns = document.querySelectorAll('.social-btn');
        
        socialBtns.forEach(btn => {
            const platform = btn.querySelector('i').className.includes('facebook') ? 'facebook' :
                           btn.querySelector('i').className.includes('instagram') ? 'instagram' :
                           btn.querySelector('i').className.includes('twitter') ? 'twitter' : 'tiktok';
            
            btn.classList.add(platform);
        });
    }
    
    // Initialize everything
    initContactPage();
    initSocialButtons();
});