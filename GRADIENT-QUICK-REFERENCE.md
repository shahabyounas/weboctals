# 🎨 Gradient Styles Quick Reference

## Available Gradient Variables

```css
/* Primary Gradients */
--gradient-primary          /* Blue → Purple */
--gradient-secondary        /* Purple → Pink */
--gradient-text            /* Blue → Purple → Pink */

/* Themed Gradients */
--gradient-hero            /* Purple spectrum */
--gradient-hero-overlay    /* Dark blue-purple overlay */
--gradient-success         /* Teal → Green */
--gradient-info            /* Blue → Cyan */
--gradient-sunset          /* Pink → Yellow */
--gradient-ocean           /* Dark blue → Cyan */
--gradient-purple-pink     /* Purple → Pink */
--gradient-blue-teal       /* Blue → Teal */
--gradient-warm            /* Red → Yellow */
--gradient-cool            /* Blue → Purple */

/* Utility Gradients */
--gradient-background      /* Subtle page background */
--gradient-card            /* Card backgrounds */
--gradient-border          /* Border gradients */
```

---

## Quick Use Utility Classes

### Text Gradients
```html
<h2 class="gradient-text">Gradient Heading</h2>
```

### Background Gradients
```html
<section class="gradient-bg-primary">White text content</section>
<section class="gradient-bg-secondary">White text content</section>
```

### Border Gradients
```html
<div class="gradient-border">Content with gradient border</div>
```

### Overlay Effects
```html
<div class="gradient-overlay">Hover to see gradient overlay</div>
```

---

## Section Backgrounds

### Subtle Gradient
```html
<section class="section-gradient-subtle">
    <!-- Soft white-gray-white gradient -->
</section>
```

### Blue Theme
```html
<section class="section-gradient-blue">
    <!-- Subtle blue-purple background -->
</section>
```

### Purple Theme
```html
<section class="section-gradient-purple">
    <!-- Subtle purple-pink background -->
</section>
```

### Mesh Effect
```html
<section class="section-gradient-mesh">
    <!-- Modern mesh gradient with radial gradients -->
</section>
```

### Hero Background
```html
<section class="hero">
    <div class="hero-gradient-bg"></div>
    <!-- Hero content -->
</section>
```

---

## Component Styles (Auto-Applied)

### ✅ Already Enhanced with Gradients

- **Navigation Bar** - Gradient background + border
- **Service Cards** - Gradient borders + hover effects
- **Pricing Cards** - Gradient backgrounds + borders
- **Feature Cards** - Gradient icons + borders
- **CTA Boxes** - Animated gradient backgrounds
- **Stat Numbers** - Gradient text with glow
- **SEO Audit Button** - Pulse gradient effect
- **Section Titles** - Gradient text

---

## Custom Gradient Border (Copy-Paste)

```css
.your-element {
    border: 2px solid transparent;
    background-image: 
        linear-gradient(white, white), 
        var(--gradient-primary);
    background-origin: border-box;
    background-clip: padding-box, border-box;
}
```

---

## Custom Gradient Text (Copy-Paste)

```css
.your-text {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
}
```

---

## Animated Gradient (Copy-Paste)

```css
.animated-gradient {
    background: linear-gradient(270deg, #2563eb, #7c3aed, #ec4899);
    background-size: 600% 600%;
    animation: gradient-flow 8s ease infinite;
}

@keyframes gradient-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
```

---

## Color Reference

| Gradient Name | Start Color      | End Color        | Use Case         |
| ------------- | ---------------- | ---------------- | ---------------- |
| Primary       | Blue `#2563eb`   | Purple `#7c3aed` | Buttons, titles  |
| Secondary     | Purple `#7c3aed` | Pink `#ec4899`   | Accents          |
| Success       | Teal `#11998e`   | Green `#38ef7d`  | Positive actions |
| Info          | Blue `#4facfe`   | Cyan `#00f2fe`   | Informational    |
| Ocean         | Navy `#2e3192`   | Cyan `#1bffff`   | Backgrounds      |
| Warm          | Red `#ff6b6b`    | Yellow `#feca57` | Alerts, energy   |
| Cool          | Blue `#48c6ef`   | Purple `#6f86d6` | Calm sections    |

---

## Best Practices

### ✅ Do
- Use gradients for visual hierarchy
- Apply to backgrounds, borders, and text
- Keep opacity low (3-10%) for subtle effects
- Use hover states for engagement
- Maintain readability with contrast

### ❌ Don't
- Overuse gradients on every element
- Use harsh color combinations
- Apply to body text (readability)
- Use heavy opacity on backgrounds
- Mix too many gradient styles

---

## Mobile Considerations

All gradient styles are **fully responsive**:
- Gradients scale with viewport
- Animations optimized for mobile
- No performance issues
- Touch-friendly hover alternatives

---

## Quick Test Snippet

```html
<!-- Copy this to test gradients quickly -->
<div style="padding: 40px; background: var(--gradient-primary); color: white; border-radius: 12px;">
    <h2>Gradient Test</h2>
    <p>Testing gradient background</p>
</div>
```

---

**Last Updated:** November 1, 2025
