/* ========================================
   LUXURY PORTFOLIO - ADVANCED JAVASCRIPT
   ======================================== */

// ========================================
// CONFIGURATION & INITIALIZATION
// ========================================

const config = {
    particleCount: 100,
    particleSize: 2,
    particleColor: '#D4AF37',
    mouseFollowStrength: 0.15,
};

let particleSystem = null;
let lenis = null;
let mouseX = 0;
let mouseY = 0;
let isMouseActive = false;

// ========================================
// CUSTOM CURSOR SYSTEM
// ========================================

class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.speed = 0.15;
        
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => this.update(e));
        document.addEventListener('mouseenter', () => {
            document.body.classList.add('mouse-active');
        });
        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('mouse-active');
        });

        this.animate();
    }

    update(event) {
        this.targetX = event.clientX;
        this.targetY = event.clientY;
        mouseX = event.clientX;
        mouseY = event.clientY;

        // Update glow effect
        const glow = document.querySelector('.mouse-follow-glow');
        if (glow) {
            glow.style.left = (this.targetX - 250) + 'px';
            glow.style.top = (this.targetY - 250) + 'px';
        }
    }

    animate() {
        this.x += (this.targetX - this.x) * this.speed;
        this.y += (this.targetY - this.y) * this.speed;

        if (this.cursor) {
            this.cursor.style.left = this.x + 'px';
            this.cursor.style.top = this.y + 'px';
        }

        if (this.cursorDot) {
            this.cursorDot.style.left = this.targetX + 'px';
            this.cursorDot.style.top = this.targetY + 'px';
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// PARTICLE BACKGROUND SYSTEM
// ========================================

class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;

        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * config.particleSize,
                opacity: Math.random() * 0.5 + 0.3,
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let particle of this.particles) {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off walls
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Keep in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

            // Draw particle
            this.ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Connect nearby particles
            for (let other of this.particles) {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                }
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// LOADING SCREEN
// ========================================

class LoadingScreen {
    constructor() {
        this.screen = document.querySelector('.loading-screen');
        this.progress = document.querySelector('.loading-progress');
        this.init();
    }

    init() {
        // Simulate loading progress
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 30;
            if (currentProgress > 90) currentProgress = 90;
            this.progress.style.width = currentProgress + '%';

            if (currentProgress >= 90) clearInterval(interval);
        }, 200);
    }

    complete() {
        this.progress.style.width = '100%';
    }
}

// ========================================
// SMOOTH SCROLLING WITH LENIS
// ========================================

function initSmoothScroll() {
    lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        smoothTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

// ========================================
// GSAP ANIMATIONS & SCROLL TRIGGERS
// ========================================

function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Animations
    const tl = gsap.timeline();
    
    // Section reveals on scroll
    gsap.utils.toArray('.section-header h2').forEach((element) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                once: true,
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
        });
    });

    // Showroom cards
    gsap.utils.toArray('.showroom-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                once: true,
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
        });
    });

    // Service cards
    gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                once: true,
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.08,
            ease: 'power3.out',
        });
    });

    // Timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                once: true,
            },
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
        });
    });

    // About stats animation
    gsap.utils.toArray('.stat-item').forEach((stat, index) => {
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 85%',
                once: true,
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
        });
    });

    // Testimonial cards
    gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                once: true,
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
        });
    });

    // Skill cards
    gsap.utils.toArray('.skill-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                once: true,
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.08,
            ease: 'back.out',
        });

        // Animate progress rings
        const ring = card.querySelector('.ring-progress');
        if (ring) {
            gsap.from(ring, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    once: true,
                },
                strokeDashoffset: 2 * 3.14159 * 54,
                duration: 1.5,
                delay: index * 0.08 + 0.2,
                ease: 'power2.inOut',
            });
        }
    });

    // Contact form animation
    gsap.from('.contact-content h2', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 70%',
            once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
    });

    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 75%',
            once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
    });

    // Form group animations
    gsap.utils.toArray('.form-group').forEach((group, index) => {
        gsap.from(group, {
            scrollTrigger: {
                trigger: group,
                start: 'top 85%',
                once: true,
            },
            x: -20,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out',
        });
    });
}

// ========================================
// FORM HANDLING
// ========================================

function initFormHandling() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;

            // Animate button
            gsap.to(submitBtn, {
                duration: 0.3,
                scale: 0.95,
            });

            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success state
            submitBtn.textContent = '✓ Message Sent';
            gsap.to(submitBtn, {
                duration: 0.3,
                scale: 1,
            });

            // Reset form
            form.reset();

            // Reset button after delay
            setTimeout(() => {
                submitBtn.textContent = originalText;
            }, 3000);
        });
    }
}

// ========================================
// NAVIGATION INTERACTIONS
// ========================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const ctaButtons = document.querySelectorAll('.cta-button');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            const element = document.querySelector(target);
            
            if (element) {
                lenis.scrollTo(element, {
                    duration: 2,
                    easing: (t) => 1 - Math.pow(1 - t, 3),
                });
            }
        });
    });

    // CTA buttons scroll to contact
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                lenis.scrollTo(contactSection, {
                    duration: 2,
                    easing: (t) => 1 - Math.pow(1 - t, 3),
                });
            }
        });
    });
}

// ========================================
// BUTTON INTERACTIONS
// ========================================

function initButtonInteractions() {
    const buttons = document.querySelectorAll('.cta-button, .social-link');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                y: -3,
                boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
            });
        });

        button.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                boxShadow: '0 0 0px rgba(212, 175, 55, 0)',
            });
        });
    });
}

// ========================================
// CARD INTERACTIONS
// ========================================

function initCardInteractions() {
    const cards = document.querySelectorAll('.showroom-card, .service-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.4,
                rotationX: 5,
                rotationY: 5,
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.4,
                rotationX: 0,
                rotationY: 0,
            });
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = ((y - rect.height / 2) / rect.height) * 10;
            const rotateY = ((x - rect.width / 2) / rect.width) * 10;

            gsap.to(card, {
                duration: 0.1,
                rotationX: rotateX,
                rotationY: rotateY,
            });
        });
    });
}

// ========================================
// PARALLAX EFFECTS
// ========================================

function initParallaxEffects() {
    gsap.utils.toArray('[data-parallax]').forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;

        gsap.to(element, {
            scrollTrigger: {
                trigger: element,
                scrub: 1,
                markers: false,
            },
            y: window.innerHeight * speed,
            ease: 'none',
        });
    });
}

// ========================================
// ABOUT SECTION ANIMATIONS
// ========================================

function initAboutSection() {
    const aboutContent = document.querySelector('.about-content');
    const aboutImage = document.querySelector('.about-image');

    if (aboutContent && aboutImage) {
        gsap.from(aboutContent, {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%',
                once: true,
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        });

        gsap.from(aboutImage, {
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%',
                once: true,
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        });
    }
}

// ========================================
// INIT SKILLS SECTION
// ========================================

function initSkillsSection() {
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach((card, index) => {
        const ring = card.querySelector('.ring-progress');
        if (ring) {
            const percentage = parseFloat(ring.style.getPropertyValue('--percentage'));
            const circumference = 2 * Math.PI * 54;
            const offset = circumference * (1 - percentage / 100);

            // Set initial state
            ring.style.strokeDashoffset = circumference;

            // Animate on scroll into view
            gsap.from(ring, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    once: true,
                },
                strokeDashoffset: circumference,
                duration: 1.5,
                delay: index * 0.08,
                ease: 'power2.inOut',
                onComplete: () => {
                    ring.style.strokeDashoffset = offset;
                },
            });
        }
    });
}

// ========================================
// RESPONSIVE ADJUSTMENTS
// ========================================

function handleResponsive() {
    if (window.innerWidth < 768) {
        // Reduce particle count on mobile
        config.particleCount = 50;
    }
}

// ========================================
// PAGE LOAD ANIMATION
// ========================================

window.addEventListener('load', () => {
    // Mark loading as complete
    const loadingScreen = new LoadingScreen();
    loadingScreen.complete();

    // Small delay for visual effect
    setTimeout(() => {
        // Animations complete
    }, 100);
});

// ========================================
// MAIN INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize systems
    const customCursor = new CustomCursor();
    const particlesBg = new ParticleBackground();
    
    initSmoothScroll();
    initGSAPAnimations();
    initFormHandling();
    initNavigation();
    initButtonInteractions();
    initCardInteractions();
    initAboutSection();
    initSkillsSection();
    handleResponsive();

    // Handle window resize
    window.addEventListener('resize', () => {
        handleResponsive();
        if (lenis) {
            lenis.onWindowResize();
        }
        ScrollTrigger.refresh();
    });

    // Prevent default behavior for links without href
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });

    // Performance monitoring
    console.log('✨ Luxury Portfolio Initialized');
    console.log('🎨 Advanced animations enabled');
    console.log('🖱️ Custom cursor active');
    console.log('✨ Smooth scrolling engaged');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Request animation frame polyfill
window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback) {
               return setTimeout(callback, 1000 / 60);
           };
})();

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Intersection Observer for lazy animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .showroom-card, .testimonial-card').forEach(el => {
    observer.observe(el);
});


// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});