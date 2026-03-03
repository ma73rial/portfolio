---
title: "Building a Full OS That Runs at a file:// URL"
date: "2024-12-10"
excerpt: "How I built a Mac-inspired operating system — filesystem, multi-user accounts, UAC, terminal, IDE, browser, and a custom Python interpreter — entirely client-side in vanilla JS."
tags: ["Browser OS", "Vanilla JS", "Python Interpreter"]
---

## Why?

I was messing around one day and thought: *what's the most complete thing I could build entirely in a browser with no backend?* The answer, apparently, is a full operating system.

Vira OS runs at a `file://` URL. No server. No Node. No cloud. Everything — the filesystem, user sessions, system daemons, rendering engine — lives in a single HTML file and a bundle of vanilla JS.

## The Filesystem

The core challenge was persistence. Browsers don't give you disk access by default, so I built a virtual filesystem backed by `localStorage` and `IndexedDB`. Files and directories serialize to JSON, with a tree structure that mirrors a real UNIX layout: `/home`, `/usr`, `/tmp`, etc.

The tricky part was making it feel instant. I wrote a caching layer that keeps hot files in memory and flushes to `IndexedDB` asynchronously. Read latency on the virtual FS is effectively zero.

## Multi-User Accounts and UAC

Vira OS has real user accounts. You can create users, set passwords (hashed with a simple PBKDF), and log in and out. There's a root account and a UAC system — certain operations require elevation, just like on a real OS.

Sessions are isolated. Each user gets their own home directory, preferences, and desktop state.

## The Python Interpreter

This was the hardest part. I wrote a Python interpreter from scratch in JavaScript. It handles:

- Variables, functions, classes
- Control flow (`if`, `for`, `while`)
- Built-in types: strings, lists, dicts
- Basic standard library (`print`, `len`, `range`, etc.)
- A custom `Turtle`-style canvas module for graphics

It's not CPython. It doesn't run arbitrary Python packages. But it runs *real Python code* well enough to teach the basics, and it lives entirely in the browser.

## Built-In Apps

The OS ships with 30+ applications:

- **Terminal** — shell with basic commands (`ls`, `cd`, `cat`, `mkdir`, `rm`, pipes)
- **IDE** — syntax-highlighted code editor with file open/save
- **Browser** — in-OS web browser with a custom URL bar (navigates within an iframe sandbox)
- **Games** — a few small canvas games
- **Calculator, Clock, Notes, File Manager, Settings** — standard OS utilities
- **System Monitor** — fake (but animating) CPU/memory usage panel

## System Daemons

Behind the scenes, Vira OS runs a handful of "daemons" — background JS intervals that handle things like battery simulation, notification queuing, and a system event bus that apps can subscribe to.

## What I Learned

Building this forced me to understand things I'd been taking for granted: how filesystems actually work, what a process scheduler is doing conceptually, and why OS-level sandboxing exists.

The Python interpreter was a semester of compilers class compressed into a couple of weeks. Tokenizing, parsing an AST, walking it — all things I'll never forget now that I've done them from scratch.

The code is on [GitHub](https://github.com/ma7erial). Go break it.
