/**
 * Duolio Portfolio - Main JavaScript
 * Interactive functionality for the AI/ML portfolio site
 */

// --- Page Routing System (updated for Duolio) ---
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
            submitBtn.textContent = 'Sending...';

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
                statusEl.textContent = 'Message sent. Thank you!';
                contactForm.reset();
            } catch (err) {
                statusEl.style.color = 'var(--c-warn)';
                statusEl.textContent = 'Error: ' + err.message;
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70','pointer-events-none');
                submitBtn.textContent = 'Send Inquiry';
            }
        });
    }
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
            const targetSection = this.getAttribute('href').substring(1);
            window.location.hash = this.getAttribute('href');
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
    console.log('🚀 Duolio portfolio loaded.');
});
