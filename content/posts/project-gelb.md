---
title: "GelbIT: Bridging Communities Through AI-Powered Recycling"
date: "2026-01-19"
excerpt: "When military families arrive at USAG Stuttgart, they face Germany's strict 5-bin recycling system with zero guidance. I built an AI assistant that fixes that — computer vision, agentic scraping, and real-time local rules."
tags: ["Python", "Gemma", "Agentic AI", "Computer Vision", "Selenium", "Ollama"]
---

## The Problem

When families arrive at USAG Stuttgart in Germany, they face an unexpected culture shock: five colored recycling bins, strict contamination rules, and instructions entirely in German. Over 70% of newcomers reported confusion about proper recycling in our initial surveys. Contamination isn't just embarrassing — it can result in fines and violations of the Status of Forces Agreement (SOFA) governing U.S. military communities abroad.

I wanted to fix this with AI.

## What I Built

GelbIT (German for yellow — the recycling bin color that trips people up most) is a web app that lets you photograph a piece of trash and instantly get precise, location-aware recycling instructions in your language.

Three AI systems work together:

**1. Fine-tuned Computer Vision**
A customized Gemma model classifies not just material type but contamination and condition. Instead of "metal can," it outputs "metal can with sauce residue" — which changes the recycling guidance entirely. I assembled a dataset of 2,527 labeled images specific to common household items in our community.

**2. Agentic Research System**
Rather than a static database (which goes stale the moment local rules change), I built an agentic system using Python, Selenium, and Ollama. When given a classified item, it autonomously formulates search queries, scrapes official municipal websites and the Stuttgart Amt für Umweltschutz, cross-references multiple sources, and synthesizes current, hyper-local guidance. It even generates follow-up queries automatically — detecting sauce on a can triggers additional research on whether Stuttgart's facilities accept contaminated metals.

**3. Multi-Language NLP**
Translation and natural language generation ensure the app works for English, German, Spanish, and other languages common in our diverse community.

## How It Works

1. User uploads or captures a photo
2. Gemma classifies the item (with contamination/condition context)
3. Agentic system live-scrapes Stuttgart's waste management authority for current rules
4. App returns: item classification, specific bin instructions, any prep steps (rinsing etc.), and a map of nearby recycling centers

The whole flow takes seconds.

## Engineering Challenges

**Running on consumer hardware.** Most AI pipelines require cloud infrastructure or expensive GPUs. I deliberately optimized to run on my personal laptop — careful model optimization, query caching, and smart resource management. Any community organization could deploy this.

**Accuracy at the edge.** Recycling rules vary by municipality and change over time. My multi-source verification approach has the agent flag discrepancies and present confidence scores. When the AI is uncertain, it says so and links the user to official sources rather than guessing.

**Web scraping at scale.** Dynamic JS-rendered content, varying site structures, and respectful rate limiting all required thoughtful engineering — Selenium browser automation, adherence to robots.txt, and fallback sources when primaries were inaccessible.

## Results

- **94% accuracy** across 100 diverse test items against official Stadt Stuttgart guidelines
- **85% self-reported increase** in recycling participation from beta users
- **Zero contamination notices** reported by beta users during two-week real-world deployment
- Vice President of our school, after first use: *"No plastic bags?! Oops!!!! I'm doing it wrong. You already helped me!!"*
- Facility managers have requested deployment in common areas for bulk waste guidance
- Exploring expansion to other European military installations

## What I Learned

The biggest lesson: responsible AI means designing for failure gracefully. Our image classification struggled with transparent plastics and poor lighting. Rather than hiding that, I built it into the UX — confidence thresholds, fallback manual selection, and clear prompts like "photograph items in good lighting." Trust comes from transparency, not from pretending the AI is infallible.

I also learned that the most impactful AI applications solve boring, everyday problems. Recycling isn't glamorous. But eliminating genuine confusion for thousands of people — and doing it with AI that actually works — matters more than a flashy demo.

---

*Built with: Python, Gemma (fine-tuned), Selenium, Ollama, LM Studio, geolocation API, multi-language NLP. Team: Maximilian Pezzullo & William Hargrove. Supervising Adult: Matthew Snoeyink.*
