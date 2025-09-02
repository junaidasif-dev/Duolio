/**
 * DuoLio Platform - Main JavaScript
 * Interactive functionality for the AI/ML portfolio site
 */

// --- Page Routing System (updated for DuoLio) ---
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav(pageId) {
    navLinks.forEach(link => {
        const linkHash = link.getAttribute('href');
        link.classList.toggle('active', linkHash === '#' + pageId)
    });
}

function handleRouteChange() {
    const hash = window.location.hash.substring(1) || 'home';
    highlightNav(hash);
}

// --- Theme Management ---
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    
    // Update theme icons
    document.getElementById('theme-icon-sun').classList.toggle('hidden', isLight);
    document.getElementById('theme-icon-moon').classList.toggle('hidden', !isLight);

    // Update logo colors
    document.querySelectorAll('.logo-inner').forEach(path => {
        path.setAttribute('stroke', isLight ? 'var(--c-text-high)' : '#F5F5F5');
    });
    
    document.querySelectorAll('.logo-inner-fav').forEach(path => {
        path.setAttribute('stroke', isLight ? 'var(--c-text-high)' : '#F5F5F5');
    });
}

// --- Background Pattern Changer ---
function changeBackground(pattern) {
    document.body.classList.remove('bg-dots', 'bg-grid');
    if (pattern !== 'plain') {
        document.body.classList.add(`bg-${pattern}`);
    }
}

// --- Mobile Menu Toggle ---
function initializeMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', function() {
            this.classList.toggle('open');
            if (mobileMenu.style.maxHeight) {
                mobileMenu.style.maxHeight = null;
            } else {
                mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
            }
        });
    }
}

// --- Form Handling ---
function initializeForms() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('contact-submit-btn');
            const statusEl = document.getElementById('contact-status');
            statusEl.textContent = '';
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-70','pointer-events-none');
                submitBtn.textContent = 'Booking...';

            const formData = new FormData(contactForm);
            const payload = Object.fromEntries(formData.entries());

                        try {
                                const res = await fetch('/api/contact', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(payload)
                                });
                                const data = await res.json().catch(()=>({}));
                                if (!res.ok) throw new Error(data.error || 'Failed to send');
                                statusEl.style.color = 'var(--c-accent)';
                                statusEl.textContent = '';
                                contactForm.reset();
                                showSuccessDialog(payload.name || 'Thank you');
                        } catch (err) {
                statusEl.style.color = 'var(--c-warn)';
                statusEl.textContent = 'Error: ' + err.message;
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70','pointer-events-none');
                submitBtn.textContent = 'Book Appointment';
            }
        });
    }
}

function showSuccessDialog(name) {
        const existing = document.getElementById('appointment-success-dialog');
        if (existing) existing.remove();
        const wrapper = document.createElement('div');
        wrapper.id = 'appointment-success-dialog';
        wrapper.className = 'fixed inset-0 z-[80] flex items-center justify-center p-4 success-overlay';
        wrapper.innerHTML = `
            <div class="success-modal">
                <div class="icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5 5-5"/></svg>
                </div>
                <h3 class="title">Booked Successfully</h3>
                <p class="msg">${name ? `<span class="highlight">${name}</span>,` : ''} your request was received. We'll reach out shortly to confirm time & next steps.</p>
                <div class="actions">
                    <button class="btn-close" type="button">Close</button>
                    <a href="#services" class="btn-secondary">View Services</a>
                </div>
            </div>`;
        document.body.appendChild(wrapper);
        const close = () => wrapper.remove();
        wrapper.addEventListener('click', e => { if (e.target === wrapper) close(); });
        wrapper.querySelector('.btn-close').addEventListener('click', close);
        const servicesBtn = wrapper.querySelector('a[href="#services"]');
        if (servicesBtn) {
            servicesBtn.addEventListener('click', (e) => {
                // allow smooth scroll behavior already bound globally; just close dialog first
                close();
            });
        }
        document.addEventListener('keydown', function esc(e){ if(e.key==='Escape'){ close(); document.removeEventListener('keydown', esc);} });
        setTimeout(()=> wrapper.classList.add('show'), 20);
}

// --- Fellowship Application Handler ---
function showStayTunedMessage() {
    // Create a custom modal for better UX than alert()
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 modal-overlay flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="modal-content rounded-lg p-8 max-w-md mx-4 text-center">
            <div class="mb-4">
                <svg class="mx-auto h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2" style="color: var(--c-text-high)">Fellowship Applications</h3>
            <p class="mb-6" style="color: var(--c-text-mid)">Stay tuned! Fellowship applications will open soon. Join our Slack community to be the first to know when applications are live.</p>
            <div class="flex gap-3 justify-center">
                <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 modal-btn-secondary rounded-lg hover:opacity-80 transition-opacity">
                    Close
                </button>
                <a href="#join-team" onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Join Community
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on ESC key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// --- A/B Testing Analytics Helper ---
// (Legacy analytics helper removed for portfolio simplification)

// --- Navigation Link Handling ---
function initializeNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetHash = this.getAttribute('href');
            const targetId = targetHash.substring(1);
            const el = document.getElementById(targetId);
            // Immediate visual activation
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            // Allow re-click if already on same hash by performing manual scroll
            if (el) {
                const header = document.getElementById('header');
                const offset = (header ? header.offsetHeight : 64) + 12; // extra breathing room
                const rect = el.getBoundingClientRect();
                const targetY = window.pageYOffset + rect.top - offset;
                window.history.replaceState(null, '', targetHash); // set hash without jump first
                window.scrollTo({ top: targetY < 0 ? 0 : targetY, behavior: 'smooth' });
            }
            const mobileMenu = document.getElementById('mobile-menu');
            const hamburgerBtn = document.getElementById('hamburger-btn');
            if (mobileMenu && hamburgerBtn && mobileMenu.style.maxHeight) {
                mobileMenu.style.maxHeight = null;
                hamburgerBtn.classList.remove('open');
            }
        });
    });
}

// --- Initial Theme Setup ---
function initializeTheme() {
    // Check user's system preference
    const isLightPreferred = window.matchMedia && 
                             window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (isLightPreferred) {
        document.body.classList.add('light-mode');
    }
    
    // Set initial theme UI state
    const isLight = document.body.classList.contains('light-mode');
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    
    if (sunIcon && moonIcon) {
        sunIcon.classList.toggle('hidden', isLight);
        moonIcon.classList.toggle('hidden', !isLight);
    }
    
    // Set initial logo colors
    document.querySelectorAll('.logo-inner').forEach(path => {
        path.setAttribute('stroke', isLight ? 'var(--c-text-high)' : '#F5F5F5');
    });
}

// --- Rotating Hero Content Feature ---
function initializeRotatingHeroContent() {
    // Main headline variations
    const headlines = [
    'Applied Intelligence. Real Outcomes.',
    'LLMs. Pipelines. Agents. Delivered.',
    'From Data to Decisions.',
    'Ship Production AI Faster.',
    'Engineering > Hype.',
    'Operationalize Your Models.',
    'Intelligent Systems. Measurable Value.'
    ];
    // Taglines that complement the main headline
    const taglines = [
        'AI • ML • DL • Automation',
        'Strategy → Model → Deploy → Monitor',
        'Latency. Accuracy. Reliability. Scale.',
        'LLM Augmentation & Evaluation',
        'Secure, Observable, Measurable AI',
        'Data Engineered. Models Operationalized.'
    ];

    // Descriptions that provide more context
    const descriptions = [
        'We design, build & deploy production-grade intelligence: pipelines, LLM apps, inference services & agent workflows.',
        'From ingestion to monitored inference: reproducible data, reliable models, automated evaluation & continuous delivery.',
        'Augment products with contextual LLM reasoning, retrieval pipelines, guardrails & performance dashboards.',
        'Reduce time from experiment to production with containerized serving, registries & CI/CD automation.',
        'Voice, chat and API surfaces powered by optimized deep learning architectures.',
        'Model observability: latency, cost, drift, hallucination, safety & user feedback loops.'
    ];

    const rotatingTagline = document.getElementById('rotating-tagline');
    const rotatingDescription = document.getElementById('rotating-description');
    const heroHeadline = document.getElementById('hero-headline');
    if (!rotatingTagline || !rotatingDescription || !heroHeadline) return;

    // Select random variations for both tagline and description
    const randomTaglineIndex = Math.floor(Math.random() * taglines.length);
    const randomDescriptionIndex = Math.floor(Math.random() * descriptions.length);
    const randomHeadlineIndex = Math.floor(Math.random() * headlines.length);
    const selectedTagline = taglines[randomTaglineIndex];
    const selectedDescription = descriptions[randomDescriptionIndex];
    const selectedHeadline = headlines[randomHeadlineIndex];
    
    // Store the selected content for analytics tracking
    window.duolioHeroVariant = {
    tagline: selectedTagline,
        taglineIndex: randomTaglineIndex,
        description: selectedDescription,
        descriptionIndex: randomDescriptionIndex,
    headline: selectedHeadline,
    headlineIndex: randomHeadlineIndex,
        timestamp: Date.now()
    };
    
    // (Analytics event removed – add gtag event here if needed)
    
    // Smooth fade-in animation for both elements
    rotatingTagline.style.opacity = '0';
    rotatingDescription.style.opacity = '0';
    
    rotatingTagline.textContent = selectedTagline;
    rotatingDescription.textContent = selectedDescription;
    heroHeadline.textContent = selectedHeadline;
    
    // Animate both elements in with a slight stagger
    setTimeout(() => {
        rotatingTagline.style.transition = 'opacity 0.8s ease-in-out';
        rotatingTagline.style.opacity = '1';
        
        setTimeout(() => {
            rotatingDescription.style.transition = 'opacity 0.8s ease-in-out';
            rotatingDescription.style.opacity = '1';
            heroHeadline.style.transition = 'opacity 0.8s ease-in-out';
            heroHeadline.style.opacity = '1';
        }, 200); // Stagger the description by 200ms

        // Animate the headline in parallel with the description
        setTimeout(() => {
            heroHeadline.style.transition = 'opacity 0.8s ease-in-out';
            heroHeadline.style.opacity = '1';
        }, 200); // Same delay as description, but independent
    }, 100);
}

// Removed application funnel code (not needed in portfolio version)

// --- Project Modal System ---
function initializeProjectModals() {
    const root = document.getElementById('project-modal-root');
    const templates = document.getElementById('project-templates');
    if (!root || !templates) return;

    const backdrop = root.querySelector('.modal-backdrop');
    const panel = root.querySelector('.modal-panel');
    const body = root.querySelector('.modal-body');

    function open(projectId) {
        const tpl = templates.querySelector('#project-' + projectId);
        if (!tpl) return;
        body.innerHTML = tpl.innerHTML;
        root.classList.remove('hidden');
        requestAnimationFrame(() => {
            root.classList.add('flex');
            backdrop.classList.add('transition','duration-500');
            panel.classList.add('transition','duo-fade-in');
            backdrop.style.opacity = '1';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        });
    }

    function close() {
        backdrop.style.opacity = '0';
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(24px)';
        setTimeout(() => {
            root.classList.add('hidden');
            root.classList.remove('flex');
        }, 320);
    }

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => open(card.dataset.project));
    });

    root.addEventListener('click', (e) => {
        if (e.target === backdrop) close();
    });
    root.querySelector('.close-modal').addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !root.classList.contains('hidden')) close(); });
}

// --- Event Listeners ---
window.addEventListener('hashchange', handleRouteChange);

// --- Main Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeMobileMenu();
    initializeForms();
    initializeNavigation();
    initializeRotatingHeroContent();
    initializeProjectModals();
    handleRouteChange();
    console.log('🚀 DuoLio site loaded.');
    initializeKpiCounters();
    initializeScrollSpy();
    initializeServiceCards();
});

// --- KPI Counter Animation ---
function initializeKpiCounters() {
    const counters = document.querySelectorAll('.kpi-value');
    if (!counters.length) return;
    const duration = 1600; // ms
    const easeOutQuad = (t) => t * (2 - t);
    const animate = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const startTime = performance.now();
        function frame(now) {
            const progress = Math.min(1, (now - startTime) / duration);
            const eased = easeOutQuad(progress);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    counters.forEach(c => observer.observe(c));
}

// --- Scroll Spy for Active Nav ---
function initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinkMap = new Map();
    document.querySelectorAll('.nav-link').forEach(link => {
        navLinkMap.set(link.getAttribute('href').replace('#',''), link);
    });
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (!id) return;
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                const active = navLinkMap.get(id);
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5] });
    sections.forEach(sec => observer.observe(sec));
}

// --- Services Card Enhancements ---
function initializeServiceCards() {
    const cards = document.querySelectorAll('.service-card.svc-reveal');
    if (!cards.length) return;
    // Stagger animation delays
    cards.forEach((card, i) => {
        card.style.setProperty('--svc-delay', 120 * i + 40); // ms
        // Add pointer light layer
        const light = document.createElement('div');
        light.className = 'pointer-light';
        card.appendChild(light);
        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            const mx = ((e.clientX - rect.left) / rect.width) * 100;
            const my = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mx', mx + '%');
            card.style.setProperty('--my', my + '%');
        });
    });
    // Enable hover light class on parent for CSS effect
    const grid = document.querySelector('.service-grid');
    if (grid) grid.classList.add('hover-light');
    // IntersectionObserver to trigger animation only when visible (reset initial state until then)
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('svc-animate');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });
    cards.forEach(card => observer.observe(card));
}
