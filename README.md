# max.dev — Personal Portfolio

Personal portfolio and blog for Maximilian Pezzullo. Built with Next.js 16, TypeScript, Tailwind CSS, and GSAP.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom CSS (dark/light theme via `next-themes`)
- **Animations**: GSAP + ScrollTrigger
- **Blog**: Markdown files parsed with `gray-matter` + `remark`
- **Contact**: Nodemailer (server-side API route)

## Project Structure

```
src/
  app/
    page.tsx              — Homepage (Hero, Projects, About, Blog preview, Contact)
    blog/[slug]/          — Individual blog post pages
    blog/                 — Blog index
    kernel/               — Linux kernel contributions page
    stack/[slug]/         — Tech stack detail pages
    admin/                — Password-protected admin panel
    api/                  — Contact form + admin API routes
  components/             — All UI components (Nav, Hero, Projects, About, etc.)
  data/                   — Stack/tech data
  lib/                    — Markdown parsing utilities

content/
  posts/                  — Blog posts as Markdown files
    vira-os.md
    ftc-dashboard.md
    linux-driver.md
    project-gelb.md
    ap-world.md
    mit-maker-analysis.md
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Writing a Blog Post

Add a `.md` file to `content/posts/` with front matter:

```markdown
---
title: "Post title"
date: "YYYY-MM-DD"
excerpt: "Short description shown in previews."
tags: ["Tag1", "Tag2"]
---

Content here...
```

The slug is derived from the filename (`my-post.md` → `/blog/my-post`).

## Adding a Project

Edit the `PROJECTS` array in `src/components/Projects.tsx`. Each entry needs:

```ts
{
  id:          "slug-matching-blog-post",
  name:        "Display Name",
  tagline:     "One-liner",
  description: "Card description",
  tags:        ["Tech", "Stack"],
  accent:      "#hexcolor",
  year:        "YYYY",
  status:      "Status badge text",
}
```

## Commands

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Environment Variables

Create a `.env.local` for the contact form and admin panel:

```
EMAIL_USER=your@email.com
EMAIL_PASS=your_app_password
ADMIN_PASSWORD=your_admin_password
```

