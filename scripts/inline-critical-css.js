#!/usr/bin/env node
// Post-build: inline above-the-fold CSS into each dist/*.html page and
// async-load the rest of the stylesheet (same preload+swap pattern already
// used for Google Fonts), so pages paint correctly on first navigation
// instead of flashing unstyled before the full stylesheet arrives.

const fs = require('fs');
const path = require('path');
const Critters = require('critters');

const DIST_DIR = path.join(__dirname, '..', 'dist');

const critters = new Critters({
    path: DIST_DIR,
    publicPath: '/',
    preload: 'media',
    pruneSource: false,
    compress: true,
    logLevel: 'warn',
});

function findHtmlFiles(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(findHtmlFiles(full));
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            results.push(full);
        }
    }
    return results;
}

async function run() {
    const targets = process.argv.slice(2);
    const htmlFiles = targets.length
        ? targets.map((f) => path.join(DIST_DIR, f))
        : findHtmlFiles(DIST_DIR);

    for (const file of htmlFiles) {
        const html = fs.readFileSync(file, 'utf8');
        let processed = await critters.process(html);
        // critters' "media" preload strategy clones the media="print"
        // onload="this.media='all'" link verbatim into <noscript>. Without JS
        // to fire onload, that link would stay print-only forever, leaving
        // no-JS visitors with zero screen styling. Strip media/onload there
        // so the noscript fallback is a normal, always-applied stylesheet.
        processed = processed.replace(
            /<noscript><link ([^>]*?)media="print" onload="[^"]*"([^>]*)><\/noscript>/g,
            '<noscript><link $1$2></noscript>'
        );
        fs.writeFileSync(file, processed);
        console.log('Inlined critical CSS:', path.relative(DIST_DIR, file));
    }
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
