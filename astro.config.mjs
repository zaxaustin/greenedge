import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://greenedge.netlify.app',
  output: 'static',
  vite: {
    define: {
      'import.meta.env.PUBLIC_DEPLOY_ENV': JSON.stringify(process.env.PUBLIC_DEPLOY_ENV || 'development')
    }
  }
});
