---
title: "I Made Duolingo for AP World History Because I Hated Quizlet"
date: "2025-02-05"
excerpt: "Spaced repetition, gamified streaks, unit-based card decks — a study app that actually makes AP World review feel like a game instead of a chore."
tags: ["React", "TypeScript", "Education"]
---

## The Problem With Existing Tools

I needed to study for AP World History. Quizlet works fine but it's boring. The interface is dated, the gamification feels tacked on, and there's no reason to come back every day.

Duolingo has cracked the code on habit formation, but obviously it doesn't cover AP World content. So I built the combination I wanted.

## Core Mechanic: Spaced Repetition

The app uses a simplified version of the SM-2 algorithm to schedule card reviews. Cards you answer correctly get pushed further into the future. Cards you miss come back sooner. Over time the app learns which topics you struggle with and weights them higher.

This sounds complicated but the implementation is surprisingly simple — each card stores a difficulty factor and an interval in days, and a scheduler function updates them after each review based on your response quality (1–5 scale).

## Content Structure

Cards are organized by AP World periods:
- Period 1: Technological and Environmental Transformations
- Period 2: Organization and Reorganization of Human Societies  
- Period 3: Regional and Interregional Interactions
- Period 4: Global Interactions
- Period 5: Industrialization and Global Integration
- Period 6: Accelerating Global Change and Realignments

Each period has 50–100 cards covering key civilizations, trade routes, political structures, and historical figures tested on the AP exam.

## The Gamification Layer

The thing that makes Duolingo sticky is the streak + XP system. I copied it shamelessly:

- **Daily streak** — break it and the owl looks sad (my version just turns the counter red)
- **XP per session** — cards reviewed = XP earned
- **Unit completion badges** — finishing a period unlocks an animation
- **Leaderboard** — localStorage mock for now, eventually multi-player

## Tech Stack

React + TypeScript, Tailwind CSS. No backend — everything lives in `localStorage`. The card data is a JSON file bundled with the app.

The study session component was the most interesting engineering challenge: smooth card transitions, the swipe-to-answer gesture on mobile, the reveal animation, and keeping the review queue correct across sessions all required careful state management.

## Does It Work?

I used it for the last two months before the AP exam. Whether I pass is a question for May. The app made me actually open review sessions every day, which is more than I can say for any other study tool I tried.

The source is on GitHub if you want to pull it, add cards, or fork it for a different AP subject.
