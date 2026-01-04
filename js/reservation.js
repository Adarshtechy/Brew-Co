// Reservation page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Reservation state
    const reservation = {
        date: null,
        time: null,
        partySize: 2,
        details: {}
    };

    // Initialize reservation system
    function initReservationSystem() {
        // Initialize calendar
        initCalendar();
        
        // Initialize time slots
        initTimeSlots();
        
        // Setup event listeners
        setupStepNavigation();
        setupPartySizeSelection();
        setupFormValidation();
        setupFormSubmission();
        
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        reservation.date = tomorrow;
        
        // Update calendar display
        updateCalendar();
    }

    // Initialize calendar
    function initCalendar() {
        // Generate day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const calendarGrid = document.querySelector('.calendar-grid');
        
        if (!calendarGrid) return;
        
        // Clear existing content
        calendarGrid.innerHTML = '';
        
        // Add day headers
        dayNames.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day-header';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });
        
        // Setup month navigation
        const prevBtn = document.querySelector('.prev-month');
        const nextBtn = document.querySelector('.next-month');
        const monthYear = document.querySelector('.month-year');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                reservation.date.setMonth(reservation.date.getMonth() - 1);
                updateCalendar();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                reservation.date.setMonth(reservation.date.getMonth() + 1);
                updateCalendar();
            });
        }
    }

    // Update calendar display
    function updateCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        const monthYear = document.querySelector('.month-year');
        
        if (!calendarGrid || !monthYear) return;
        
        // Remove existing days (keeping headers)
        const dayElements = calendarGrid.querySelectorAll('.day');
        dayElements.forEach(day => day.remove());
        
        // Update month-year display
        const options = { month: 'long', year: 'numeric' };
        monthYear.textContent = reservation.date.toLocaleDateString('en-US', options);
        
        // Get first day of month
        const firstDay = new Date(reservation.date.getFullYear(), reservation.date.getMonth(), 1);
        const lastDay = new Date(reservation.date.getFullYear(), reservation.date.getMonth() + 1, 0);
        const today = new Date();
        
        // Calculate starting position (0 = Sunday, 1 = Monday, etc.)
        let startDay = firstDay.getDay();
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day disabled';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add days of month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = day;
            
            const currentDate = new Date(reservation.date.getFullYear(), reservation.date.getMonth(), day);
            
            // Check if date is today
            if (currentDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            // Check if date is in the past
            if (currentDate < today && currentDate.toDateString() !== today.toDateString()) {
                dayElement.classList.add('disabled');
            } else {
                // Add click event for selectable dates
                dayElement.addEventListener('click', () => {
                    selectDate(currentDate);
                });
                
                // Check if this date is selected
                if (reservation.date && currentDate.toDateString() === reservation.date.toDateString()) {
                    dayElement.classList.add('selected');
                }
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }

    // Select date
    function selectDate(date) {
        reservation.date = date;
        updateCalendar();
        updateTimeSlots();
        updateSummary();
    }

    // Initialize time slots
    function initTimeSlots() {
        updateTimeSlots();
    }

    // Update time slots based on selected date
    function updateTimeSlots() {
        const timeSlotsContainer = document.querySelector('.time-slots');
        if (!timeSlotsContainer) return;
        
        timeSlotsContainer.innerHTML = '';
        
        // Generate time slots (every 30 minutes from opening to closing)
        const openingHour = 7; // 7:00 AM
        const closingHour = 21; // 9:00 PM
        
        for (let hour = openingHour; hour < closingHour; hour++) {
            for (let minute of [0, 30]) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
                timeSlot.textContent = formatTime(hour, minute);
                timeSlot.setAttribute('data-time', timeString);
                
                // Check if time slot is available (demo logic)
                const isAvailable = isTimeSlotAvailable(timeString);
                if (!isAvailable) {
                    timeSlot.classList.add('unavailable');
                } else {
                    timeSlot.addEventListener('click', () => selectTimeSlot(timeSlot, timeString));
                }
                
                // Check if this time is selected
                if (reservation.time === timeString) {
                    timeSlot.classList.add('selected');
                }
                
                timeSlotsContainer.appendChild(timeSlot);
            }
        }
    }

    // Format time for display
    function formatTime(hour, minute) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    }

    // Check if time slot is available (demo)
    function isTimeSlotAvailable(timeString) {
        // Simulate checking availability
        // In a real app, this would check against booked reservations
        const hour = parseInt(timeString.split(':')[0]);
        
        // Make evening slots more "booked" for demo
        if (hour >= 18) {
            return Math.random() > 0.3; // 70% chance of being available
        }
        
        return Math.random() > 0.1; // 90% chance of being available
    }

    // Select time slot
    function selectTimeSlot(element, timeString) {
        // Remove selected class from all time slots
        const timeSlots = document.querySelectorAll('.time-slot');
        timeSlots.forEach(slot => slot.classList.remove('selected'));
        
        // Add selected class to clicked time slot
        element.classList.add('selected');
        
        // Update reservation
        reservation.time = timeString;
        updateSummary();
    }

    // Setup step navigation
    function setupStepNavigation() {
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        
        // Next step buttons
        nextButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const nextStep = this.getAttribute('data-next');
                
                // Validate current step before proceeding
                if (validateCurrentStep(parseInt(nextStep) - 1)) {
                    navigateToStep(nextStep);
                }
            });
        });
        
        // Previous step buttons
        prevButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const prevStep = this.getAttribute('data-prev');
                navigateToStep(prevStep);
            });
        });
    }

    // Validate current step
    function validateCurrentStep(stepNumber) {
        switch(stepNumber) {
            case 1: // Date & Time step
                if (!reservation.date) {
                    showNotification('Please select a date', 'error');
                    return false;
                }
                if (!reservation.time) {
                    showNotification('Please select a time', 'error');
                    return false;
                }
                return true;
                
            case 2: // Party Size step
                if (!reservation.partySize) {
                    showNotification('Please select party size', 'error');
                    return false;
                }
                return true;
                
            default:
                return true;
        }
    }

    // Navigate to step
    function navigateToStep(stepNumber) {
        // Hide all steps
        const steps = document.querySelectorAll('.reservation-step');
        steps.forEach(step => step.classList.remove('active'));
        
        // Show target step
        const targetStep = document.getElementById(`step-${stepNumber}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }
        
        // Update step indicator
        updateStepIndicator(stepNumber);
        
        // Scroll to top of step
        targetStep?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update step indicator
    function updateStepIndicator(activeStep) {
        const steps = document.querySelectorAll('.step');
        
        steps.forEach(step => {
            const stepNumber = step.getAttribute('data-step');
            step.classList.remove('active');
            
            if (parseInt(stepNumber) <= parseInt(activeStep)) {
                step.classList.add('active');
            }
        });
    }

    // Setup party size selection
    function setupPartySizeSelection() {
        const sizeOptions = document.querySelectorAll('.size-option');
        
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                sizeOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Update reservation
                const size = parseInt(this.getAttribute('data-size'));
                reservation.partySize = size;
                
                // Update table visualization
                updateTableVisualization(size);
                
                // Update summary
                updateSummary();
            });
        });
    }

    // Update table visualization
    function updateTableVisualization(size) {
        const tables = document.querySelectorAll('.table');
        
        tables.forEach(table => {
            const tableSize = parseInt(table.getAttribute('data-size'));
            if (tableSize === size || (size >= 8 && tableSize === 4)) {
                table.style.opacity = '1';
                table.style.transform = 'scale(1.1)';
            } else {
                table.style.opacity = '0.5';
                table.style.transform = 'scale(1)';
            }
        });
    }

    // Setup form validation
    function setupFormValidation() {
        const form = document.querySelector('.reservation-details-form');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input[required], select[required]');
        
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

    // Setup form submission
    function setupFormSubmission() {
        const form = document.querySelector('.reservation-details-form');
        const submitButton = form?.querySelector('.submit-reservation');
        const confirmationModal = document.getElementById('confirmation-modal');
        const closeModal = confirmationModal?.querySelector('.close-modal');
        const closeConfirmation = confirmationModal?.querySelector('.close-confirmation');
        const addToCalendarBtn = confirmationModal?.querySelector('.add-to-calendar');
        
        if (form && submitButton) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate all required fields
                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!validateField(field)) {
                        isValid = false;
                    }
                });
                
                if (!isValid) {
                    showNotification('Please fill in all required fields correctly', 'error');
                    return;
                }
                
                // Validate reservation details
                if (!reservation.date || !reservation.time || !reservation.partySize) {
                    showNotification('Please complete all reservation steps', 'error');
                    return;
                }
                
                // Collect form data
                reservation.details = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    occasion: document.getElementById('occasion').value,
                    specialRequests: document.getElementById('special-requests').value,
                    subscribe: document.getElementById('newsletter').checked
                };
                
                // Show loading state
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitButton.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitButton.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Reservation';
                    submitButton.disabled = false;
                    
                    // Update confirmation modal
                    updateConfirmationModal();
                    
                    // Show confirmation modal
                    confirmationModal.classList.add('show');
                    
                    // Reset form
                    form.reset();
                    
                    // Reset reservation (except for confirmation)
                    resetReservation();
                }, 2000);
            });
        }
        
        // Close modal buttons
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                confirmationModal.classList.remove('show');
            });
        }
        
        if (closeConfirmation) {
            closeConfirmation.addEventListener('click', () => {
                confirmationModal.classList.remove('show');
            });
        }
        
        // Close modal on outside click
        if (confirmationModal) {
            confirmationModal.addEventListener('click', (e) => {
                if (e.target === confirmationModal) {
                    confirmationModal.classList.remove('show');
                }
            });
        }
        
        // Add to calendar functionality
        if (addToCalendarBtn) {
            addToCalendarBtn.addEventListener('click', function() {
                addToCalendar();
            });
        }
    }

    // Update confirmation modal
    function updateConfirmationModal() {
        // Generate reservation ID
        const reservationId = `BCR-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`;
        
        // Format date and time
        const date = reservation.date ? reservation.date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }) : '--';
        
        const time = reservation.time ? formatDisplayTime(reservation.time) : '--';
        
        // Update modal content
        const confirmId = document.getElementById('confirm-id');
        const confirmDatetime = document.getElementById('confirm-datetime');
        const confirmParty = document.getElementById('confirm-party');
        
        if (confirmId) confirmId.textContent = reservationId;
        if (confirmDatetime) confirmDatetime.textContent = `${date} at ${time}`;
        if (confirmParty) confirmParty.textContent = `${reservation.partySize} ${reservation.partySize === 1 ? 'person' : 'people'}`;
    }

    // Format time for display
    function formatDisplayTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 || 12;
        return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    // Add to calendar functionality
    function addToCalendar() {
        if (!reservation.date || !reservation.time) return;
        
        // Create calendar event
        const startDate = new Date(reservation.date);
        const [hours, minutes] = reservation.time.split(':').map(Number);
        startDate.setHours(hours, minutes);
        
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2); // 2-hour reservation
        
        // Create .ics file (simplified)
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Coffee Reservation at Brew & Co.
DTSTART:${formatDateForICS(startDate)}
DTEND:${formatDateForICS(endDate)}
LOCATION:123 Coffee Street\\, Brew City
DESCRIPTION:Reservation for ${reservation.partySize} people at Brew & Co.
END:VEVENT
END:VCALENDAR`;
        
        // Create download link
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Brew-Co-Reservation-${new Date().getTime()}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Calendar event downloaded', 'success');
    }

    // Format date for ICS
    function formatDateForICS(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    // Reset reservation (keep for confirmation)
    function resetReservation() {
        // Set date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        reservation.date = tomorrow;
        reservation.time = null;
        reservation.partySize = 2;
        reservation.details = {};
        
        // Reset UI
        updateCalendar();
        updateTimeSlots();
        updateStepIndicator('1');
        navigateToStep('1');
    }

    // Update reservation summary
    function updateSummary() {
        const summaryDate = document.getElementById('summary-date');
        const summaryTime = document.getElementById('summary-time');
        const summaryParty = document.getElementById('summary-party');
        
        if (summaryDate && reservation.date) {
            summaryDate.textContent = reservation.date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });
        }
        
        if (summaryTime && reservation.time) {
            summaryTime.textContent = formatDisplayTime(reservation.time);
        }
        
        if (summaryParty) {
            summaryParty.textContent = `${reservation.partySize} ${reservation.partySize === 1 ? 'person' : 'people'}`;
        }
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

    // Start the reservation system
    initReservationSystem();
    
    // Add today's date highlight
    const today = new Date();
    const todayElement = document.querySelector(`.day[data-date="${today.toDateString()}"]`);
    if (todayElement) {
        todayElement.classList.add('today');
    }
    
    // Add keyboard navigation for calendar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            reservation.date.setMonth(reservation.date.getMonth() - 1);
            updateCalendar();
        } else if (e.key === 'ArrowRight') {
            reservation.date.setMonth(reservation.date.getMonth() + 1);
            updateCalendar();
        }
    });
});