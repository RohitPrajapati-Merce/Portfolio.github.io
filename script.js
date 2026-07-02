// ============================================================
// Rohit Prajapati — QA Automation Engineer Portfolio
// ============================================================

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const terminalBody = document.getElementById('terminalBody');
const statNumbers = document.querySelectorAll('.stat-number');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Navbar scroll shadow + test-run progress bar =====
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 40);
    if (scrollProgress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.pageYOffset / max) * 100 : 0;
        scrollProgress.style.width = Math.min(pct, 100) + '%';
    }
}, { passive: true });

// ===== Mobile navigation =====
function closeNav() {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('active');
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
        closeNav();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) closeNav();
});

// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('section[id], header[id]');

function updateActiveNav() {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const top = section.offsetTop - 160;
        const bottom = top + section.offsetHeight;
        const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);
        if (link) link.classList.toggle('active', scrollY > top && scrollY <= bottom);
    });
}

function debounce(fn, wait = 10) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
window.addEventListener('scroll', debounce(updateActiveNav), { passive: true });
updateActiveNav();

// ===== Terminal test-runner animation (signature element) =====
// Each line: [html, delay-before-line-ms, type? (typewriter effect)]
const terminalScript = [
    ['<span class="t-cmd">$ mvn test -Dsuite=rohit_prajapati.xml</span>', 300, true],
    ['<span class="t-info">[INFO] Scanning for candidate profile...</span>', 500],
    ['<span class="t-info">[INFO] Running <span class="t-accent">QAEngineer_VerificationSuite</span></span>', 400],
    ['<span class="t-pass">✓</span> verifyExperience() <span class="t-info">..........</span> <span class="t-pass">PASSED</span> <span class="t-info">(3+ years)</span>', 550],
    ['<span class="t-pass">✓</span> verifySeleniumJava() <span class="t-info">........</span> <span class="t-pass">PASSED</span>', 450],
    ['<span class="t-pass">✓</span> verifyMobileAppium() <span class="t-info">........</span> <span class="t-pass">PASSED</span> <span class="t-info">(Android + iOS)</span>', 450],
    ['<span class="t-pass">✓</span> verifyApiRestAssured() <span class="t-info">......</span> <span class="t-pass">PASSED</span>', 450],
    ['<span class="t-pass">✓</span> verifyCiCdJenkins() <span class="t-info">.........</span> <span class="t-pass">PASSED</span>', 450],
    ['<span class="t-pass">✓</span> verifyBugHuntingSkills() <span class="t-info">....</span> <span class="t-pass">PASSED</span> <span class="t-info">(0 escaped)</span>', 450],
    ['<span class="t-info">Tests run: 6 · Failures: 0 · Errors: 0 · Skipped: 0</span>', 600],
    ['<span class="t-success">[INFO] BUILD SUCCESS — candidate ready to hire ✓</span>', 500],
];

function runTerminal() {
    if (!terminalBody) return;

    // Reduced motion: render everything instantly
    if (prefersReducedMotion) {
        terminalBody.innerHTML = terminalScript
            .map(([html]) => `<div class="t-line">${html}</div>`)
            .join('');
        return;
    }

    let index = 0;

    function nextLine() {
        if (index >= terminalScript.length) {
            const cursorLine = document.createElement('div');
            cursorLine.className = 't-line';
            cursorLine.innerHTML = '<span class="t-cmd">$ </span><span class="t-cursor"></span>';
            terminalBody.appendChild(cursorLine);
            // Restart the loop after a pause
            setTimeout(() => { terminalBody.innerHTML = ''; index = 0; nextLine(); }, 9000);
            return;
        }

        const [html, delay, type] = terminalScript[index];
        index++;

        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 't-line';
            terminalBody.appendChild(line);

            if (type) {
                // Typewriter effect for the command line (plain text, then swap in HTML)
                const temp = document.createElement('div');
                temp.innerHTML = html;
                const text = temp.textContent;
                let i = 0;
                line.innerHTML = '<span class="t-cursor"></span>';
                const typer = setInterval(() => {
                    i++;
                    line.innerHTML = `<span class="t-cmd">${text.slice(0, i)}</span><span class="t-cursor"></span>`;
                    if (i >= text.length) {
                        clearInterval(typer);
                        line.innerHTML = html;
                        nextLine();
                    }
                }, 34);
            } else {
                line.innerHTML = html;
                nextLine();
            }
        }, delay);
    }

    nextLine();
}

runTerminal();

// ===== Stats counter =====
function animateStats() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        if (prefersReducedMotion) { stat.textContent = target; return; }
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            stat.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    });
}

const heroStats = document.getElementById('heroStats');
if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    statsObserver.observe(heroStats);
}

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
    '.skill-card, .project-card, .award-card, .edu-card, .contact-card, .xp-card, .about-text, .about-facts'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealTargets.forEach(el => {
    el.classList.add('fade-in');
    revealObserver.observe(el);
});

// ===== Console easter egg =====
console.log('%c✓ ALL TESTS PASSED', 'font-size: 18px; font-weight: bold; color: #2FBE8F;');
console.log('%cLooking for a QA Automation Engineer? Let\'s talk.', 'font-size: 13px; color: #47554E;');
console.log('%c📧 rohitprajapati2632@gmail.com', 'font-size: 12px; color: #0E8A5F;');