import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceRoots = ['src', 'public'];
const textExtensions = new Set(['.astro', '.ts', '.css', '.txt', '.xml', '.svg', '']);
const forbidden = [
  'konsulenttjenester',
  'foredragstilbud',
  'tilgjengelig for oppdrag',
  'faglige henvendelser',
  'bierverv',
  'styreverv',
  'ta kontakt'
];
const allowedEkranAdvisoryPath = path.normalize('src/pages/juridisk-informasjon.astro');
const allowedCommercialPhrase = 'Siden markedsfører ikke rådgivningstjenester eller nye oppdrag.';

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = sourceRoots.flatMap((dir) => walk(path.join(root, dir)));
const errors = [];
for (const file of files) {
  const ext = path.extname(file);
  if (!textExtensions.has(ext)) continue;
  const relative = path.relative(root, file);
  const text = fs.readFileSync(file, 'utf8');
  const lower = text.toLowerCase();

  for (const term of forbidden) {
    if (lower.includes(term)) errors.push(`${relative}: forbidden public phrase "${term}"`);
  }

  if (lower.includes('ekran advisory') && path.normalize(relative) !== allowedEkranAdvisoryPath && !relative.endsWith('site.ts')) {
    errors.push(`${relative}: Ekran Advisory is only allowed in legal/config source`);
  }

  if ((lower.includes('rådgivning') || lower.includes('oppdrag')) && !text.includes(allowedCommercialPhrase) && path.normalize(relative) !== allowedEkranAdvisoryPath) {
    errors.push(`${relative}: commercial wording outside approved disclaimer/legal copy`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('qa:source passed');
