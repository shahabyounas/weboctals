// WebOctals - Landing page GSAP + ScrollTrigger animations (index.html only)
// Progressive enhancement: every animated element is either hidden via a
// CSS class already baked into the markup (.reveal / .reveal-left /
// .reveal-right / .reveal-mask, all defined in styles.css and already
// visible-by-default under prefers-reduced-motion), or animated from its
// current on-screen state. If this script fails to load, the page reads
// normally with everything visible.

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
    if (REDUCED_MOTION) return;

    initHero();
    initHeroParallax();
    initHeadingReveals();
    initReveals();
    initMarquee();
    initProjectsStack();

    ScrollTrigger.refresh();
});

// Groups elements by shared parent and reveals each group together with a
// stagger, so a row of cards animates in as a wave rather than all at once.
function revealGroup(elements, { start = "top 87%" } = {}) {
    const groups = new Map();
    elements.forEach((el) => {
        const parent = el.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
    });

    groups.forEach((els) => {
        els.forEach((el) => {
            const fromVars = { autoAlpha: 0 };
            if (el.classList.contains("reveal-left")) fromVars.x = -40;
            else if (el.classList.contains("reveal-right")) fromVars.x = 40;
            else fromVars.y = 24;
            el.classList.remove("reveal", "reveal-left", "reveal-right");
            gsap.set(el, fromVars);
        });

        gsap.to(els, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: els[0], start },
        });
    });
}

function initReveals() {
    const items = Array.from(document.querySelectorAll(".reveal, .reveal-left, .reveal-right")).filter(
        (el) => !el.closest(".hero") && !el.closest("#work")
    );
    if (items.length) revealGroup(items);
}

// Stacking project cards: a shared art panel on the left stays pinned while
// the detailed project text scrolls past on the right; as each text block
// crosses the vertical center of the viewport, the pinned art crossfades to
// match it. The .js-stack-active class (and the ScrollTrigger/pin it drives)
// is only added on desktop (1024px+) via gsap.matchMedia — narrower
// viewports, no-JS, and prefers-reduced-motion all get the plain vertical
// list defined in CSS instead, with every project's own inline art icon.
function initProjectsStack() {
    const container = document.querySelector(".projects-stack");
    const visual = container ? container.querySelector(".stack-visual") : null;
    const track = container ? container.querySelector(".stack-text-track") : null;
    const textItems = container ? gsap.utils.toArray(container.querySelectorAll(".stack-text-item")) : [];
    const artPanels = container ? gsap.utils.toArray(container.querySelectorAll(".stack-art")) : [];
    if (!container || !visual || !track || textItems.length < 2 || textItems.length !== artPanels.length) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
        container.classList.add("js-stack-active");

        gsap.set(artPanels, { autoAlpha: 0, scale: 0.94, filter: "blur(4px)", y: 0 });
        gsap.set(artPanels[0], { autoAlpha: 1, scale: 1, filter: "blur(0px)" });

        // The resting (untransformed) position of the art card, recomputed
        // fresh on every call rather than measured once — measuring once at
        // setup captured the panel's *pre-pin*, natural-document-flow
        // position (the section is still off-screen at page load), which is
        // meaningless once pinned. Read from .stack-visual itself (never
        // transformed by GSAP — only individual .stack-art panels get a `y`
        // nudge) plus its child's padding, so it stays correct regardless of
        // which panel is currently active/offset.
        const artPaddingTop = parseFloat(getComputedStyle(artPanels[0]).paddingTop) || 0;
        function getRestingTop() {
            return visual.getBoundingClientRect().top + artPaddingTop;
        }

        let activeIndex = 0;
        function setActive(i) {
            if (i === activeIndex) return;
            gsap.to(artPanels[activeIndex], {
                autoAlpha: 0,
                scale: 0.94,
                filter: "blur(4px)",
                duration: 0.5,
                ease: "power2.out",
            });
            gsap.set(artPanels[i], { y: 0 });
            gsap.to(artPanels[i], { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" });
            textItems[activeIndex].classList.remove("is-active");
            textItems[i].classList.add("is-active");
            activeIndex = i;
        }

        // Two things happen on every scroll tick:
        //  1. Whichever heading is closest to the card's resting position
        //     becomes "active" (decides which project's image shows).
        //  2. The active card is then nudged, in px, so its own top exactly
        //     matches that heading's *current* top — not just "closest",
        //     genuinely level, continuously, even as the heading keeps
        //     scrolling. Recomputing the nudge from a fresh measurement each
        //     time (rather than accumulating a delta) keeps it exact.
        function updateActiveByProximity() {
            const restingTop = getRestingTop();
            let closest = 0;
            let closestDistance = Infinity;
            textItems.forEach((item, i) => {
                const heading = item.querySelector("h3");
                const top = (heading || item).getBoundingClientRect().top;
                const distance = Math.abs(top - restingTop);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closest = i;
                }
            });
            setActive(closest);

            const activeHeading = textItems[activeIndex].querySelector("h3");
            const activeCard = artPanels[activeIndex].querySelector(".project-card-art");
            if (!activeHeading || !activeCard) return;
            const headingTop = activeHeading.getBoundingClientRect().top;
            const cardTop = activeCard.getBoundingClientRect().top;
            gsap.set(artPanels[activeIndex], { y: `+=${headingTop - cardTop}` });
        }

        // One trigger spans the whole text track and owns both the pin (the
        // art panel stays fixed for as long as ANY project text is
        // scrolling past) and the proximity/alignment check above, re-run
        // on every scroll update within that same range — plus once
        // immediately, so the very first project is already aligned before
        // any scrolling happens.
        const pinTrigger = ScrollTrigger.create({
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            pin: visual,
            pinSpacing: false,
            onUpdate: updateActiveByProximity,
        });
        updateActiveByProximity();

        return () => {
            pinTrigger.kill();
            gsap.set(artPanels, { clearProps: "all" });
            textItems.forEach((item, i) => item.classList.toggle("is-active", i === 0));
            container.classList.remove("js-stack-active");
        };
    });
}

function initHeadingReveals() {
    document.querySelectorAll(".reveal-mask").forEach((el) => {
        gsap.to(el, {
            clipPath: "inset(0% 0 0% 0)",
            y: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
        });
    });
}

function initHero() {
    const heroTitle = document.getElementById("hero-title");
    const eyebrow = document.querySelector(".hero-eyebrow");
    const subtitle = document.querySelector(".hero-subtitle");
    const buttons = document.querySelector(".hero-buttons");
    const trustBullets = document.querySelector(".hero-trust-bullets");
    const chips = document.querySelectorAll(".hero-chip");

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (heroTitle) {
        const split = new SplitText(heroTitle, {
            type: "words,lines",
            mask: "lines",
            wordsClass: "hero-title-word",
        });
        gsap.set(split.words, { yPercent: 110, autoAlpha: 0 });
        tl.to(split.words, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06 }, 0.1);
    }

    [eyebrow, subtitle, buttons, trustBullets].filter(Boolean).forEach((el) => {
        el.classList.remove("reveal");
        gsap.set(el, { autoAlpha: 0, y: 20 });
    });

    if (eyebrow) tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.6 }, 0);
    if (subtitle) tl.to(subtitle, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.55);
    if (buttons) tl.to(buttons, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.75);
    if (trustBullets) tl.to(trustBullets, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.9);

    if (chips.length) {
        gsap.set(chips, { autoAlpha: 0, scale: 0.6 });
        tl.to(chips, { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: "back.out(1.7)" }, 1.1);
    }
}

function initHeroParallax() {
    const hero = document.querySelector(".hero");
    const targets = [document.querySelector(".hero-aurora"), document.getElementById("hero-canvas")].filter(
        Boolean
    );
    if (!hero || !targets.length) return;

    gsap.to(targets, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    });
}

// Infinite right-to-left client name ticker. Markup already contains two
// identical .marquee-track copies; the duplicate starts display:none in CSS
// as a safe no-JS/reduced-motion fallback (a single static row), and is
// only switched on here once we know we're actually going to animate it.
function initMarquee() {
    const marquee = document.querySelector(".marquee");
    if (!marquee) return;

    const inner = marquee.querySelector(".marquee-inner");
    const duplicate = marquee.querySelector('.marquee-track[aria-hidden="true"]');
    if (!inner || !duplicate) return;

    duplicate.style.display = "flex";

    gsap.to(inner, { xPercent: -50, duration: 32, ease: "none", repeat: -1 });
}


