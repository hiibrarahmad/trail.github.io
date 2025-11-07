/**
 * Portfolio Website - Main JavaScript
 * Author: Ibrar Ahmad
 * Features: Loading, Animations, 3D Graphics, Smooth Scrolling, Modal System
 */

// ==================================================
// Global Variables
// ==================================================

let isLoading = true;
let scrollProgress = 0;
let mouseX = 0;
let mouseY = 0;

// ==================================================
// Loading Screen
// ==================================================

window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const loaderProgress = document.querySelector('.loader-progress');
    const loaderPercentage = document.querySelector('.loader-percentage');
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loaderProgress.style.width = `${progress}%`;
        loaderPercentage.textContent = `${Math.round(progress)}%`;
        
        if (progress === 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loader.classList.add('hidden');
                isLoading = false;
                initAnimations();
            }, 500);
        }
    }, 100);
});

// ==================================================
// Custom Cursor
// ==================================================

const cursor = {
    dot: document.querySelector('.cursor-dot'),
    outline: document.querySelector('.cursor-outline'),
    
    init() {
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move cursor dot immediately
            this.dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
            
            // Move cursor outline with slight delay
            requestAnimationFrame(() => {
                this.outline.style.transform = `translate(${mouseX - 15}px, ${mouseY - 15}px)`;
            });
        });
        
        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card, .nav-toggle');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            
            element.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.dot.style.opacity = '0';
            this.outline.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            this.dot.style.opacity = '1';
            this.outline.style.opacity = '0.5';
        });
    }
};

// ==================================================
// Navigation
// ==================================================

const navigation = {
    navbar: document.querySelector('.navbar'),
    navMenu: document.querySelector('.nav-menu'),
    navToggle: document.querySelector('.nav-toggle'),
    navLinks: document.querySelectorAll('.nav-link'),
    
    init() {
        this.setupScrollBehavior();
        this.setupMobileMenu();
        this.setupSmoothScroll();
    },
    
    setupScrollBehavior() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add scrolled class
            if (currentScroll > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    },
    
    setupMobileMenu() {
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });
    },
    
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offset = 80;
                    const targetPosition = targetSection.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// ==================================================
// Scroll Progress & Back to Top
// ==================================================

const scrollFeatures = {
    progressBar: document.querySelector('.scroll-progress'),
    backToTop: document.querySelector('.back-to-top'),
    
    init() {
        this.setupScrollProgress();
        this.setupBackToTop();
    },
    
    setupScrollProgress() {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            this.progressBar.style.width = `${scrolled}%`;
        });
    },
    
    setupBackToTop() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                this.backToTop.classList.add('visible');
            } else {
                this.backToTop.classList.remove('visible');
            }
        });
        
        this.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// ==================================================
// Hero Section Animations
// ==================================================

const heroAnimations = {
    init() {
        this.setupTypingEffect();
        this.setup3DScene();
        this.animateHeroElements();
    },
    
    setupTypingEffect() {
        const typingText = document.querySelector('.typing-text');
        const phrases = [
            'Deep-Tech Engineer',
            'BCI Systems Specialist',
            'Embedded Hardware Expert',
            'Signal Processing Engineer',
            'PCB Design Professional',
            'IoT Solutions Developer'
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                setTimeout(() => {
                    isDeleting = true;
                }, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
            
            const typingSpeed = isDeleting ? 50 : 100;
            setTimeout(type, typingSpeed);
        }
        
        type();
    },
    
    setup3DScene() {
        const container = document.getElementById('canvas-container');
        if (!container) return;
        
        // Three.js Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Create wireframe brain/chip geometry
        const geometry = new THREE.IcosahedronGeometry(2, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        // Add particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 500;
        const posArray = new Float32Array(particlesCount * 3);
        
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x9945ff,
            transparent: true,
            opacity: 0.8
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        camera.position.z = 5;
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.005;
            
            particlesMesh.rotation.y += 0.001;
            
            // React to mouse movement
            if (mouseX && mouseY) {
                const mouseXNorm = (mouseX / window.innerWidth) * 2 - 1;
                const mouseYNorm = -(mouseY / window.innerHeight) * 2 + 1;
                
                mesh.rotation.x += mouseYNorm * 0.01;
                mesh.rotation.y += mouseXNorm * 0.01;
            }
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    },
    
    animateHeroElements() {
        // Animate hero text on load
        gsap.from('.hero-name .name-letter', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out',
            delay: 0.5
        });
        
        gsap.from('.hero-tagline', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 1,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-buttons', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 1.2,
            ease: 'power3.out'
        });
        
        gsap.from('.scroll-indicator', {
            opacity: 0,
            y: -30,
            duration: 1,
            delay: 1.5,
            ease: 'power3.out'
        });
    }
};

// ==================================================
// Section Animations with ScrollTrigger
// ==================================================

function initScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate skill items
    gsap.utils.toArray('.skill-item').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate service cards
    gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            rotation: 5,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Animate timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        gsap.from(item, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse',
                onEnter: () => item.classList.add('visible'),
                onLeaveBack: () => item.classList.remove('visible')
            }
        });
    });
    
    // Animate project cards
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// ==================================================
// Counter Animation
// ==================================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// ==================================================
// Project Gallery & Modal
// ==================================================

const projectGallery = {
    modal: document.getElementById('projectModal'),
    modalClose: document.querySelector('.modal-close'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescription: document.querySelector('.modal-description'),
    modalTech: document.querySelector('.modal-tech'),
    modalGithub: document.querySelector('.modal-github'),
    modalDemo: document.querySelector('.modal-demo'),
    modalImg: document.querySelector('.modal-img'),
    
    projects: {
        'smartwatch': {
            title: 'Next-Gen Smartwatch',
            description: 'A cutting-edge smartwatch featuring wireless charging (BQ51003), advanced health monitoring with ECG, PPG, and SpO₂ measurements (MAX86150), environmental sensing capabilities (BME680, CCS811), and dual display system combining a vibrant 1.54" IPS LCD with an energy-efficient E-Ink display. Powered by the nRF5340 dual-core SoC with Bluetooth 5.2 for seamless connectivity and ultra-low power operation.',
            tech: ['nRF5340', 'BQ51003', 'MAX86150', 'BME680', 'E-Ink', 'Bluetooth 5.2', 'C++', 'Nordic SDK'],
            github: 'https://github.com/hiibrarahmad/Smart_watch.github.io',
            demo: 'https://hiibrarahmad.github.io/Smart_watch.github.io/',
            image: 'assets/images/smartwatch.jpg'
        },
        'eeg-analyzer': {
            title: 'EEG Signal Analyzer',
            description: 'Comprehensive MATLAB application for real-time EEG signal analysis and visualization. Features include multi-channel data acquisition from OpenBCI Cyton boards, advanced filtering with BrainFlow and SciPy implementations, frequency band analysis (Delta, Theta, Alpha, Beta, Gamma), bandpower calculations, and interactive GUI with real-time waveform display. Includes synthetic signal generation for validation and performance testing.',
            tech: ['MATLAB', 'OpenBCI', 'BrainFlow', 'Python', 'SciPy', 'Signal Processing', 'GUI Development'],
            github: 'https://github.com/hiibrarahmad/eeg-analyzer',
            demo: '#',
            image: 'assets/images/eeg-analyzer.jpg'
        },
        'smart-lock': {
            title: 'Smart Door Lock System',
            description: 'Advanced wireless security system featuring ESP32-CAM integration for real-time video monitoring, multi-factor authentication (RFID, fingerprint, PIN), remote access control via mobile app, and two-way audio communication. The system includes a TFT display for visual feedback, automated visitor logging, and cloud-based access management for enhanced security and convenience.',
            tech: ['ESP32-CAM', 'RFID', 'Fingerprint Sensor', 'TFT Display', 'IoT', 'C++', 'Firebase'],
            github: 'https://github.com/hiibrarahmad/smart-door-lock',
            demo: '#',
            image: 'assets/images/smart-lock.jpg'
        }
    },
    
    init() {
        this.setupImageSliders();
        this.setupModalTriggers();
        this.setupModalClose();
    },
    
    setupImageSliders() {
        // Auto-rotate images in project cards
        document.querySelectorAll('.project-card').forEach(card => {
            const images = card.querySelectorAll('.project-img');
            let currentIndex = 0;
            
            if (images.length > 1) {
                setInterval(() => {
                    images[currentIndex].classList.remove('active');
                    currentIndex = (currentIndex + 1) % images.length;
                    images[currentIndex].classList.add('active');
                }, 3000);
            }
        });
    },
    
    setupModalTriggers() {
        const viewButtons = document.querySelectorAll('.project-view-btn');
        
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = button.getAttribute('data-project');
                this.openModal(projectId);
            });
        });
    },
    
    openModal(projectId) {
        const project = this.projects[projectId];
        if (!project) return;
        
        // Update modal content
        this.modalTitle.textContent = project.title;
        this.modalDescription.textContent = project.description;
        
        // Update tech stack
        this.modalTech.innerHTML = project.tech.map(tech => 
            `<span>${tech}</span>`
        ).join('');
        
        // Update links
        this.modalGithub.href = project.github;
        if (project.demo !== '#') {
            this.modalDemo.href = project.demo;
            this.modalDemo.style.display = 'inline-flex';
        } else {
            this.modalDemo.style.display = 'none';
        }
        
        // Show modal with animation
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate modal content
        gsap.from('.modal-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    },
    
    setupModalClose() {
        // Close button
        this.modalClose.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Click outside modal
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    },
    
    closeModal() {
        gsap.to('.modal-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                this.modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
};

// ==================================================
// Contact Form
// ==================================================

const contactForm = {
    init() {
        const contactBtn = document.querySelector('.contact-btn');
        
        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                contactBtn.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // Open email client
                window.location.href = 'mailto:hiibrarahmad@gmail.com?subject=Portfolio%20Contact&body=Hi%20Ibrar,%0A%0A';
            });
        }
    }
};

// ==================================================
// Tilt Effect for Cards
// ==================================================

function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ==================================================
// Initialize Everything
// ==================================================

function initAnimations() {
    // Initialize all components
    cursor.init();
    navigation.init();
    scrollFeatures.init();
    heroAnimations.init();
    projectGallery.init();
    contactForm.init();
    
    // Initialize animations
    initScrollAnimations();
    animateCounters();
    initTiltEffect();
    
    // Add smooth reveal animation to all sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(section);
    });
}

// ==================================================
// Mobile Detection & Adjustments
// ==================================================

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    // Disable certain heavy animations on mobile
    document.body.classList.add('mobile-device');
    
    // Simplify particle effects
    document.querySelector('.particle-field')?.remove();
    
    // Disable custom cursor on mobile
    document.querySelector('.cursor-dot')?.remove();
    document.querySelector('.cursor-outline')?.remove();
}

// ==================================================
// Console Easter Egg
// ==================================================

console.log(
    '%c Welcome to Ibrar Ahmad\'s Portfolio! 🚀 ',
    'background: linear-gradient(135deg, #00ffff 0%, #9945ff 100%); color: white; font-size: 20px; font-weight: bold; padding: 10px;'
);
console.log(
    '%c Looking for the source code? Check out my GitHub! ',
    'color: #00ffff; font-size: 14px;'
);
console.log(
    '%c https://github.com/hiibrarahmad ',
    'color: #9945ff; font-size: 12px;'
);

// ==================================================
// Export for potential use in other scripts
// ==================================================

window.portfolioApp = {
    cursor,
    navigation,
    scrollFeatures,
    heroAnimations,
    projectGallery,
    contactForm,
    isMobile
};