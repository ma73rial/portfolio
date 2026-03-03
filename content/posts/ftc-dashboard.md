---
title: "I Built an All-in-One Dashboard for My Robotics Team Because 10 Tabs Was Too Many"
date: "2024-11-01"
excerpt: "FTC Dashboard: real-time attendance, Kanban tasks, budget, WebSocket chat, and a local LLM for insights — built for FIRST Tech Challenge teams #10937 and #30548."
tags: ["React", "WebSocket", "Local LLM", "Node.js"]
---

## The Problem

Our FTC robotics team was running on chaos. Attendance was tracked in a Google Sheet. Tasks were in a different Google Doc. Budget was in yet another sheet. Chat was a mix of iMessage and Discord. Part orders required manually cross-referencing three different supplier websites.

Ten tabs. Constantly stale. Nobody looking at the same version.

I got tired of it during a competition week and just started building.

## The Stack

- **Frontend**: React + TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js + SQLite (via `better-sqlite3`)
- **Real-time**: WebSocket for live updates across all connected clients
- **AI**: `node-llama-cpp` running a local GGUF model (Phi-3.5 mini) for insights
- **Distribution**: npm package — any team can run `npx ftc-dashboard`

No cloud. No accounts. No monthly bill. Runs on a laptop at the build table.

## Features

### Attendance
A grid-based system where you tap a member's name to mark them in or out. The AI backend can analyze attendance patterns — "Aiden has missed 4 of the last 5 Tuesdays" — and surface them automatically.

### Tasks (Kanban)
Drag-and-drop Kanban board for build tasks. Cards have assignees, deadlines, and status. The AI can generate a daily summary: "3 tasks blocked, 2 overdue, robot arm assembly is the critical path."

### Budget
Income and expense tracking with team-level categories. See at a glance where money is going. Export to CSV for grant reports.

### WebSocket Chat
In-app messaging with `@mention` notifications. When someone is mentioned, they get a notification badge regardless of which panel they're looking at.

### AI Scout (Local LLM)
The most interesting feature. The dashboard runs a local Phi-3.5 mini model via `node-llama-cpp`. You can ask it questions about your team data, get attendance analysis, or stream FTC competition news scraped via the Exa search API.

Running inference locally means no API key, no latency to a cloud endpoint, and no data leaving the machine. The tradeoff is 30–60 seconds for a response and a 3GB model download on first run. Worth it.

## Part Imports via Web Scraping

One quality-of-life feature I'm proud of: the parts procurement panel scrapes REV Robotics product pages. You paste a part URL and it fills in the name, SKU, and price automatically. No more copy-pasting across tabs.

## npm Package

The dashboard is published to npm. Any FTC team can spin it up:

```bash
npx ftc-dashboard
```

On first run, it walks you through model download and initial setup. After that, it's just a local server you run at build sessions.

Teams #10937 and #30548 at Stuttgart High School have been using it for a full season. Build table laptops stay on one tab now.
