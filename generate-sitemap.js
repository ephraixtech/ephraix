/**
 * generate-sitemap.js
 * Pure Node.js — no npm dependencies required.
 *
 * Scans this project folder for .html files and writes sitemap.xml
 * at the project root. Run manually with:
 *   node generate-sitemap.js
 *
 * Or let it run automatically before every deploy (see package.json).
 */

const fs = require('fs');
const path = require('path');

// ---- CONFIG: adjust if needed ----
const SITE_URL = 'https://ephraix.com';
const ROOT_DIR = __dirname; // assumes this script sits in your project root
const OUTPUT_FILE = path.join(ROOT_DIR, 'sitemap.xml');

// Folders to skip entirely (assets, functions, config, version control, etc.)
const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.git',
  'functions',
  'css',
  'js',
  'images',
  '.wrangler',
]);

// Specific files to skip even if they end in .html
const EXCLUDE_FILES = new Set([]);

// ---- SCRIPT ----
const urls = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      if (EXCLUDE_FILES.has(entry.name)) continue;

      let relativePath = path.relative(ROOT_DIR, fullPath).split(path.sep).join('/');

      // index.html -> clean folder URL
      if (relativePath === 'index.html') {
        relativePath = '';
      } else if (relativePath.endsWith('/index.html')) {
        relativePath = relativePath.slice(0, -'index.html'.length);
      }

      const url = relativePath ? `${SITE_URL}/${relativePath}` : `${SITE_URL}/`;
      urls.push(url);
    }
  }
}

walk(ROOT_DIR);

// Dedupe + sort for a clean, stable diff each time it regenerates
const uniqueUrls = [...new Set(urls)].sort();

const today = new Date().toISOString().split('T')[0];

const xmlEntries = uniqueUrls
  .map((url) => {
    // Homepage gets top priority, deeper pages get slightly lower priority
    const depth = url.replace(SITE_URL, '').split('/').filter(Boolean).length;
    const priority = depth === 0 ? '1.0' : depth === 1 ? '0.8' : '0.6';
    return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries}\n</urlset>\n`;

fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');

console.log(`✓ sitemap.xml generated with ${uniqueUrls.length} URLs`);