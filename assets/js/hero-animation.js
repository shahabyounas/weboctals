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
    const markColor = styles.getPropertyValue('--color-cta-500').trim();

    const MAX_DIST = 150;
    let width = 0;
    let height = 0;
    let nodes = [];
    let markNode = null;
    let rafId = null;

    function nodeCountForWidth() {
        return window.innerWidth <= 768 ? 20 : 50;
    }

    function resize() {
        width = hero.clientWidth;
        height = hero.clientHeight;
        canvas.width = width;
        canvas.height = height;
        buildNodes();
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
        markNode = { x: width / 2, y: height / 2, radius: 14 };
    }

    function step() {
        nodes.forEach((node) => {
            node.x += node.vx;
            node.y += node.vy;
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
        });

        ctx.clearRect(0, 0, width, height);

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
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = nodeColor;
        nodes.forEach((node) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1;
        ctx.fillStyle = markColor;
        ctx.shadowColor = markColor;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(markNode.x, markNode.y, markNode.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        rafId = requestAnimationFrame(step);
    }

    window.addEventListener('resize', resize);
    resize();
    rafId = requestAnimationFrame(step);
}
