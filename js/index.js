// Loading screen
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('loading').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 500);
    }, 1000);
    
    // Initialize banner visibility
    const banner = document.getElementById('construction-banner');
    if (banner && !sessionStorage.getItem('bannerClosed')) {
        document.body.classList.add('banner-visible');
    } else if (banner) {
        banner.style.display = 'none';
    }
});

// Close banner function
function closeBanner() {
    const banner = document.getElementById('construction-banner');
    banner.style.animation = 'slideOutUp 0.3s ease-out forwards';
    setTimeout(() => {
        banner.style.display = 'none';
        document.body.classList.remove('banner-visible');
        sessionStorage.setItem('bannerClosed', 'true');
    }, 300);
}

// Mobile menu toggle
function toggleMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const menuButton = document.querySelector('.mobile-menu');
    const isOpen = mobileNav.classList.toggle('active');

    if (menuButton) {
        menuButton.setAttribute('aria-expanded', String(isOpen));
    }
}

function updateMobileNavOffset() {
    const header = document.getElementById('header');
    if (!header) return;
    document.documentElement.style.setProperty('--mobile-nav-top', `${header.offsetHeight}px`);
}

window.addEventListener('load', updateMobileNavOffset);
window.addEventListener('resize', updateMobileNavOffset);

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const scrollTop = document.getElementById('scroll-top');
    
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
        scrollTop.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        scrollTop.classList.remove('visible');
    }

    updateMobileNavOffset();
});

// Scroll to top functionality
document.getElementById('scroll-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    let current = start;
    let increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // Special handling for stats section
            if (entry.target.classList.contains('stats')) {
                if (!entry.target.dataset.counted) {
                    animateCounter(document.getElementById('prestataires-count'), 780);
                    animateCounter(document.getElementById('services-count'), 3200);
                    animateCounter(document.getElementById('clients-count'), 1850);
                    animateCounter(document.getElementById('quartiers-count'), 45);
                    entry.target.dataset.counted = 'true';
                }
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            document.getElementById('mobile-nav').classList.remove('active');
            const menuButton = document.querySelector('.mobile-menu');
            if (menuButton) {
                menuButton.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        const mobileNav = document.getElementById('mobile-nav');
        const menuButton = document.querySelector('.mobile-menu');
        if (mobileNav) mobileNav.classList.remove('active');
        if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Download button click handlers
document.getElementById('android-download').addEventListener('click', function(e) {
    e.preventDefault();
    // Add your Google Play Store link here
    console.log('Redirecting to Google Play Store...');
});

document.getElementById('ios-download').addEventListener('click', function(e) {
    e.preventDefault();
    // Add your App Store link here
    console.log('Redirecting to App Store...');
});

// Parallax effect for hero section
let heroParallaxEnabled = window.innerWidth > 1024;
const hero = document.querySelector('.hero');

window.addEventListener('resize', () => {
    heroParallaxEnabled = window.innerWidth > 1024;
    if (!heroParallaxEnabled && hero) {
        hero.style.transform = 'none';
    }
});

window.addEventListener('scroll', () => {
    if (!heroParallaxEnabled || !hero) return;
    const scrolled = window.pageYOffset;
    hero.style.transform = `translateY(${scrolled * 0.25}px)`;
});

// Lead form submission handler
const leadForm = document.querySelector('.lead-form');
if (leadForm) {
    const successMessage = leadForm.querySelector('.form-success');
    leadForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (successMessage) {
            successMessage.classList.add('visible');
            setTimeout(() => successMessage.classList.remove('visible'), 6000);
        }
        leadForm.reset();
    });
}
