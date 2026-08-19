# Martin Ekran — ekranadvisory.no

Astro/TypeScript-kildekode for Martin Ekrans personlige faglige nettsted.

## Teknisk modell
- Astro 7
- TypeScript
- statisk output
- minimalt klient-JavaScript
- ingen database eller CMS
- ingen analyse/piksler som standard
- GitHub som kilde
- Cloudflare Pages som foretrukket hosting
- custom domain hos Domeneshop

## Lokal utvikling
```bash
npm install
npm run dev
```

## QA
```bash
npm run qa
```

## Produksjon
Produksjon deployes fra `main`. Cloudflare Pages build command: `npm run build`. Output directory: `dist`.

Custom domain kobles på først når hostingprosjektet er klart. DNS-records hos Domeneshop skal tas fra hostingplattformens konkrete custom-domain-instruks, ikke gjettes.
