/**
 * Copies assets that are referenced by ABSOLUTE URL into the build output.
 *
 * Parcel rewrites relative references (src="/assets/images/x.png") to hashed,
 * flattened filenames. It deliberately leaves absolute URLs alone, because it
 * can't know https://weboctals.com/... resolves to this same site. So anything
 * referenced absolutely — og:image, twitter:image, JSON-LD image/logo — has no
 * corresponding file in dist/ and would 404 once we serve dist.
 *
 * Rather than maintain a hand-written list (which silently rots the moment
 * someone adds a new og:image), this scans the built HTML for absolute
 * weboctals.com asset URLs and copies exactly those files across.
 *
 * A reference with no source file is a hard error: that's a broken share image
 * or a broken rich result, and it should fail the build rather than ship.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ORIGIN = 'https://weboctals.com';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found — run the Parcel build first.');
  process.exit(1);
}

// Absolute references to our own /assets/ tree, from every built page.
const refs = new Set();
for (const file of walk(DIST)) {
  const html = fs.readFileSync(file, 'utf8');
  const re = new RegExp(`${ORIGIN}(/assets/[^"'\\s)<>]+)`, 'g');
  let m;
  while ((m = re.exec(html)) !== null) refs.add(m[1]);
}

const missing = [];
let copied = 0;

for (const ref of [...refs].sort()) {
  const src = path.join(ROOT, ref.replace(/^\//, ''));
  const dest = path.join(DIST, ref.replace(/^\//, ''));

  if (!fs.existsSync(src)) {
    missing.push(ref);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  copied++;
}

if (missing.length) {
  console.error('\nBuild failed — pages reference asset URLs with no source file:\n');
  for (const ref of missing) console.error(`  ${ORIGIN}${ref}`);
  console.error('\nThese would 404 in production (broken share cards or rich results).');
  console.error('Fix the reference or add the file, then rebuild.\n');
  process.exit(1);
}

console.log(`Copied ${copied} absolutely-referenced asset${copied === 1 ? '' : 's'} into dist/`);
