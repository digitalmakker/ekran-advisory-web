import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
if (!fs.existsSync(dist)) throw new Error('dist/ missing; run build first');

const pages = [
  { file: 'index.html', canonical: 'https://ekranadvisory.no/' },
  { file: 'innlegg/index.html', canonical: 'https://ekranadvisory.no/innlegg' },
  { file: 'bakgrunn/index.html', canonical: 'https://ekranadvisory.no/bakgrunn' },
  { file: 'juridisk-informasjon/index.html', canonical: 'https://ekranadvisory.no/juridisk-informasjon' }
];
const errors = [];
for (const page of pages) {
  const full = path.join(dist, page.file);
  if (!fs.existsSync(full)) {
    errors.push(`Missing ${page.file}`);
    continue;
  }
  const html = fs.readFileSync(full, 'utf8');
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${page.file}: missing title`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${page.file}: missing description`);
  if (!html.includes(`rel="canonical" href="${page.canonical}"`)) errors.push(`${page.file}: wrong canonical`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${page.file}: expected exactly one h1`);
  if (!html.includes('application/ld+json')) errors.push(`${page.file}: missing structured data`);
  if (html.toLowerCase().includes('professionalservice') || html.toLowerCase().includes('localbusiness') || html.toLowerCase().includes('"@type":"service"')) {
    errors.push(`${page.file}: disallowed structured data type`);
  }
}
for (const required of ['robots.txt', 'sitemap.xml', '_redirects', '_headers', 'favicon.svg']) {
  if (!fs.existsSync(path.join(dist, required))) errors.push(`Missing built asset ${required}`);
}
const redirects = fs.readFileSync(path.join(dist, '_redirects'), 'utf8');
for (const rule of ['/faglige-bidrag /innlegg 301', '/erfaring-og-cv /bakgrunn 301', '/om-martin /bakgrunn 301', '/kontakt / 301']) {
  if (!redirects.includes(rule)) errors.push(`Missing redirect: ${rule}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('qa:built passed');
