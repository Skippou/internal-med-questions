import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { plugin as markdown, Mode } from 'vite-plugin-markdown';

export default defineConfig({
  plugins: [
    react(),
    markdown({
      mode: [Mode.HTML],
      markdownIt: {
        html: true,
        linkify: true,
        typographer: true
      }
    })
  ],
  base: process.env.GITHUB_PAGES ? '/internal-med-questions/' : '/',
  publicDir: 'public',
  assetsInclude: ['**/*.md'],
});
