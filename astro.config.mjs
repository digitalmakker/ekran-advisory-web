import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ekranadvisory.no',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  }
});
