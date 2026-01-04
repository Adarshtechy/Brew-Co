// About page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animated counters for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    };
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Animate counters in story section
                if (entry.target.classList.contains('about-story')) {
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        animateCounter(stat, target);
                    });
                }
                
                // Animate value cards
                if (entry.target.classList.contains('values')) {
                    const cards = document.querySelectorAll('.value-card');
                    cards.forEach((card, i) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, i * 200);
                    });
                }
                
                // Animate team members
                if (entry.target.classList.contains('team')) {
                    const members = document.querySelectorAll('.team-member');
                    members.forEach((member, i) => {
                        setTimeout(() => {
                            member.classList.add('visible');
                        }, i * 200);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    // Observe sections
    const sections = document.querySelectorAll('.about-story, .values, .team');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Team member hover effect
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            member.style.transform = 'translateY(-10px)';
        });
        
        member.addEventListener('mouseleave', () => {
            if (member.classList.contains('visible')) {
                member.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Image parallax effect
    const storyImage = document.querySelector('.story-image');
    if (storyImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2;
            storyImage.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    }
});