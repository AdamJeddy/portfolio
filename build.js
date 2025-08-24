// Tiny static builder: copies assets and expands <!--#include file="..." --> directives.
// Tokens like {{title}} are replaced using front-matter-like JSON at top of page between <!--{ }-->

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content);
}

function loadPageMetaAndBody(html) {
  // Optional meta block: <!--{ "title": "Home" }-->
  const metaMatch = html.match(/<!--\{([\s\S]*?)\}-->/);
  let meta = {};
  if (metaMatch) {
    try {
      meta = JSON.parse('{' + metaMatch[1] + '}');
    } catch (e) {
      console.warn('Meta JSON parse error:', e.message);
    }
    html = html.replace(metaMatch[0], '');
  }
  return { meta, body: html };
}

function includePartials(html, baseDir) {
  const incRe = /<!--#include\s+file=\"([^\"]+)\"\s*-->/g;
  return html.replace(incRe, (_, rel) => {
    const p = path.join(baseDir, rel);
    if (!fs.existsSync(p)) return `<!-- missing include: ${rel} -->`;
    return includePartials(read(p), path.dirname(p));
  });
}

function applyTokens(html, tokens) {
  return html.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, k) => {
    return tokens[k] != null ? String(tokens[k]) : '';
  });
}

function buildPages() {
  const pagesDir = path.join(SRC, 'pages');
  const outDir = DIST;
  ensureDir(outDir);
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.html')) files.push(p);
    }
  }
  walk(pagesDir);
  for (const file of files) {
    const rel = path.relative(pagesDir, file);
    const out = path.join(outDir, rel);
    let html = read(file);
    const { meta, body } = loadPageMetaAndBody(html);
    const withIncludes = includePartials(body, path.dirname(file));
    const tokens = { title: meta.title || 'bruh.ae', description: meta.description || 'A 2000s-style personal site' };
    const finalHtml = applyTokens(withIncludes, tokens);
    write(out, finalHtml);
    console.log('Built', rel);
  }
}

function cleanDist() {
  fs.rmSync(DIST, { recursive: true, force: true });
}

function main() {
  cleanDist();
  ensureDir(DIST);
  // copy assets and css/js
  for (const dir of ['assets', 'styles', 'scripts']) {
    const s = path.join(SRC, dir);
    if (fs.existsSync(s)) copyDir(s, path.join(DIST, dir));
  }
  buildPages();
  console.log('Build complete.');
}

main();
