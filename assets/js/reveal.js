// WebOctals - Reveal on scroll
// Fades/lifts/slides .reveal, .reveal-left and .reveal-right elements into
// place as they enter the viewport, staggered by their position within
// their parent grid. No-ops when the page has no reveal elements or the
// visitor prefers reduced motion (in which case everything is shown
// immediately).

document.addEventListener('DOMContentLoaded', initializeReveal);

function initializeReveal() {
    const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!items.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    // Stagger siblings so a grid animates in as a wave rather than all at once.
    const seen = new Map();
    items.forEach((el) => {
        const parent = el.parentElement;
        const index = seen.get(parent) || 0;
        seen.set(parent, index + 1);
        el.style.setProperty('--reveal-delay', (index % 6) * 70 + 'ms');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach((el) => observer.observe(el));
}
