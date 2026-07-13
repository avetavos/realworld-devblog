// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://projects.avetavos.com',
  base: '/devblog',
  output: 'static',
  integrations: [starlight({
    title: 'DevBlog — Real-World Project',
    head: [
      { tag: 'script', attrs: { type: 'module', src: '/devblog/mermaid-init.js' } },
      { tag: 'link', attrs: { rel: 'manifest', href: '/devblog/manifest.webmanifest' } },
      { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/devblog/apple-touch-icon.png' } },
      { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/devblog/icon-192.png' } },
      { tag: 'meta', attrs: { name: 'theme-color', content: '#E5484D' } },
    ],
    defaultLocale: 'en',
    locales: {
      en: { label: 'English', lang: 'en' },
      th: { label: 'ไทย', lang: 'th' },
    },
    customCss: ['./src/styles/custom.css'],
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/avetavos/realworld-devblog' }],
    sidebar: [
      { label: 'Introduction', items: [{ autogenerate: { directory: 'introduction' } }] },
      { label: '1 · Setup & Tooling', items: [{ autogenerate: { directory: 'setup' } }] },
      { label: '2 · Data Modeling', items: [{ autogenerate: { directory: 'data-modeling' } }] },
      { label: '3 · Backend Foundations', items: [{ autogenerate: { directory: 'backend-foundations' } }] },
      { label: '4 · Authentication', items: [{ autogenerate: { directory: 'auth' } }] },
      { label: '5 · GraphQL API', items: [{ autogenerate: { directory: 'graphql-api' } }] },
      { label: '6 · Content Workflow', items: [{ autogenerate: { directory: 'content-workflow' } }] },
      { label: '7 · Comments', items: [{ autogenerate: { directory: 'comments' } }] },
      { label: '8 · Frontend Foundations', items: [{ autogenerate: { directory: 'frontend-foundations' } }] },
      { label: '9 · Public Blog', items: [{ autogenerate: { directory: 'public-blog' } }] },
      { label: '10 · Admin Dashboard', items: [{ autogenerate: { directory: 'admin' } }] },
      { label: '11 · Testing', items: [{ autogenerate: { directory: 'testing' } }] },
      { label: '12 · Docker & Compose', items: [{ autogenerate: { directory: 'docker' } }] },
      { label: '13 · Wrap-up', items: [{ autogenerate: { directory: 'wrap-up' } }] },
    ],
  }), preact()],
});
