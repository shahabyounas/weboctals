// WebOctals - Hero neural constellation canvas
// Decorative animated background for the homepage hero (#hero-canvas).
// No-ops entirely if the canvas element isn't present on the page.

document.addEventListener('DOMContentLoaded', initializeHeroAnimation);

function initializeHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    const hero = document.getElementById('home');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    const styles = getComputedStyle(document.documentElement);
    const nodeColor = styles.getPropertyValue('--color-accent-600').trim();
    const lineColor = styles.getPropertyValue('--color-accent-2-500').trim();
    const markColor = styles.getPropertyValue('--color-accent').trim();

    const MAX_DIST = 150;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointerFine = window.matchMedia('(pointer: fine)').matches;

    let width = 0;
    let height = 0;
    let nodes = [];
    let markNode = null;
    let rafId = null;
    let running = false;
    let pointerX = 0;
    let pointerY = 0;
    let pointerTargetX = 0;
    let pointerTargetY = 0;

    function nodeCountForWidth() {
        return window.innerWidth <= 768 ? 20 : 50;
    }

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        width = hero.clientWidth;
        height = hero.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildNodes();
        drawFrame();
    }

    function buildNodes() {
        const count = nodeCountForWidth();
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            radius: 1.5 + Math.random() * 1.5
        }));
        // Offset from centre — dead centre puts the mark on top of the headline copy.
        markNode = { x: width * 0.78, y: height * 0.28, radius: 11 };
    }

    function drawFrame() {
        ctx.clearRect(0, 0, width, height);

        const offsetX = pointerX * 12;
        const offsetY = pointerY * 12;

        const allNodes = nodes.concat([markNode]);
        for (let i = 0; i < allNodes.length; i++) {
            for (let j = i + 1; j < allNodes.length; j++) {
                const a = allNodes[i];
                const b = allNodes[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < MAX_DIST) {
                    ctx.strokeStyle = lineColor;
                    ctx.globalAlpha = (1 - dist / MAX_DIST) * 0.35;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x + offsetX, a.y + offsetY);
                    ctx.lineTo(b.x + offsetX, b.y + offsetY);
                    ctx.stroke();
                }
            }
        }

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = nodeColor;
        nodes.forEach((node) => {
            ctx.beginPath();
            ctx.arc(node.x + offsetX, node.y + offsetY, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Brand hub: a soft halo with a small solid core, so it reads as a
        // luminous node in the constellation rather than a hard UI dot.
        const mx = markNode.x + offsetX;
        const my = markNode.y + offsetY;
        const halo = ctx.createRadialGradient(mx, my, 0, mx, my, markNode.radius * 3.2);
        halo.addColorStop(0, markColor);
        halo.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(mx, my, markNode.radius * 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.85;
        ctx.fillStyle = markColor;
        ctx.beginPath();
        ctx.arc(mx, my, markNode.radius * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    function step() {
        if (!running) return;

        nodes.forEach((node) => {
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
        });

        pointerX += (pointerTargetX - pointerX) * 0.05;
        pointerY += (pointerTargetY - pointerY) * 0.05;

        drawFrame();
        rafId = requestAnimationFrame(step);
    }

    function startLoop() {
        if (running || reducedMotion) return;
        running = true;
        rafId = requestAnimationFrame(step);
    }

    function stopLoop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    if (pointerFine) {
        hero.addEventListener('mousemove', (event) => {
            const rect = hero.getBoundingClientRect();
            pointerTargetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            pointerTargetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                startLoop();
            } else {
                stopLoop();
            }
        });
    }, { threshold: 0 });

    window.addEventListener('resize', resize);
    resize();
    observer.observe(hero);

    if (reducedMotion) {
        drawFrame();
    }
}
