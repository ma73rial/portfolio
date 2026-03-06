Personal Portfolio

My personal portfolio and blog. Built with Next.js 16, TypeScript, Tailwind CSS, and GSAP.

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



