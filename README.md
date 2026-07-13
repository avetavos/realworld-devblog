# DevBlog — Real-World Project Guide

A bilingual (English / ไทย) step-by-step guide that teaches you to build **DevBlog**, a headless CMS + public blog, from an empty repo to a running `docker compose up` stack.

It is project **#2** of the Learn Hub Real-World Projects series (project #1 is [TaskFlow](https://projects.avetavos.com/taskflow/en/)).

**Live:** https://projects.avetavos.com/devblog/en/

## What you build

| Layer | Tech |
|-------|------|
| Backend | Node · NestJS · code-first GraphQL (Apollo) |
| Database | MongoDB · Mongoose |
| Auth | Passport-JWT · bcrypt · role guards |
| Frontend | Next.js (App Router) · SSR/ISR public blog + admin |
| Content | Markdown posts · tags · comments with moderation |
| Runtime | Docker Compose (multi-stage images, one command) |

Features: author/admin auth, Markdown posts with unique slugs and a draft→publish workflow, tags, a paginated GraphQL API, comments with pre-moderation, an ISR-rendered public blog with SEO + RSS + sitemap, and an admin dashboard with a Markdown editor and comment moderation. Backend tested with Jest + `mongodb-memory-server`; frontend with Vitest + Testing Library.

## The guide itself

An [Astro Starlight](https://starlight.astro.build/) site. Lessons live in `src/content/docs/en/**` and `src/content/docs/th/**`, grouped into 14 modules (Introduction → Setup → Data Modeling → Backend Foundations → Auth → GraphQL API → Content Workflow → Comments → Frontend Foundations → Public Blog → Admin → Testing → Docker → Wrap-up). Each lesson follows the same shape: *what we're building → why → pros & cons → build it → verify → recap*, with full copy-pasteable code. Mermaid diagrams render client-side.

## Run the guide locally

```bash
npm install
npm run dev      # http://localhost:4321/devblog/
npm run build    # static build to dist/
```

## Deployment

Static site (`output: 'static'`, `base: '/devblog'`) for `projects.avetavos.com/devblog`. `npm run deploy` builds, stages `dist/` under `.cf-assets/devblog/`, and publishes the Cloudflare Worker.
