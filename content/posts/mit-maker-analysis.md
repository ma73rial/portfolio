---
title: "I Built an ML Pipeline to Reverse-Engineer MIT Maker Portfolio Acceptance"
date: "2026-02-28"
excerpt: "105 YouTube videos, a Gradient Boosting classifier, and a local Gemma:7b LLM — analyzing what separates accepted from rejected MIT Maker Portfolios. The irony is not lost on me."
tags: ["Python", "NLP", "Machine Learning", "Ollama", "Gemma"]
---

## The Meta Problem

I'm applying to MIT. MIT has a Maker Portfolio — an optional submission where you document 5 things you've built. Most applicants don't know what the portfolio should look like, what signals admission officers are actually reading for, or whether it matters.

I thought: there are YouTube videos of both accepted and rejected MIT applicants presenting their Maker Portfolios. That's labeled data. What if I could train a classifier on it?

So I did.

---

**TL;DR — how do you differentiate accepted from rejected?**

<img class="blog-table-img blog-img-dark"  src="/images/blog/tldr-summary-dark.png"  alt="TL;DR summary table" />
<img class="blog-table-img blog-img-light" src="/images/blog/tldr-summary-light.png" alt="TL;DR summary table" />

Accepted portfolios talk about finished things in past tense. Rejected ones talk about ideas and iterations that didn't close.

> **People who finish projects talk like they finish projects.** That's the thesis, and the data backs it up.

## The Dataset

I used `yt-dlp` to scrape YouTube for `"MIT Maker Portfolio"` videos plus targeted queries with `"accepted"` and `"rejected"` as modifiers. Labels were assigned from the video *title only* — no manual annotation, just string matching. Anything with "accepted" in the title → Accepted. "rejected" or "denied" → Rejected. Everything else → Unknown.

| Category | Count |
|---|---|
| Accepted | 25 |
| Rejected | 21 |
| Unknown  | 59 |
| **Total** | **105** |

Transcripts were fetched via `yt-dlp`'s Python API with rate limiting (12–22s between requests to respect YouTube). 95/105 videos had English captions.

The obvious caveat: this is a small labeled set and labels are noisy. Some "Rejected" applicants have objectively impressive portfolios — MIT admissions are holistic. I tried to factor this into interpretation.

## The Pipeline

```
scrape.py           → results.json / results.csv
fetch_transcripts.py → transcripts/<video_id>.txt
ollama_nlp.py       → ollama/progress.json  (Gemma:7b NLP)
analyze.py          → analysis/report.txt + analysis/*.json
score_model.py      → analysis/feature_matrix.csv + predictions
```

Step 3 runs Gemma:7b locally via Ollama, which extracts structured `{name, type, outcome, revisions}` objects for each project mentioned in a transcript. This is the most interesting step — you can't count "built a website" and "designed a Mars habitat" as equivalent projects, so I needed an LLM to understand context.

## What the Data Actually Shows

### Finding 1: Past Tense — It's Not About Future, It's About Past

This was the cleanest signal, but there's an important nuance the top-line numbers obscure.

| Category | Past rate/100 tokens | Future rate/100 | **Ratio** |
|---|---|---|---|
| Accepted | 10.92 | 4.20 | **2.60×** |
| Rejected | 9.98 | 4.55 | **2.19×** |

At first glance this looks like rejected applicants talk more about the future. They don't — not really. When computed per-video (rather than across the pooled corpus), the future tense rates are nearly identical: **4.27 for accepted, 4.29 for rejected**. The entire gap is in the past tense rate (10.56 vs 9.91). Accepted applicants don't talk less about plans — they just talk *more* about what they already built. The portfolio earns ground, it doesn't lose it.

You can see this clearly in the word-level data. "Learned" appears 6× more frequently in accepted portfolios. "Could" is one of the most distinctive words in rejected ones, appearing 13 times with high TF-IDF weight — it's the conditional mood of projects that almost happened.

### Finding 2: Thinking:Building Verb Ratio

| Category | Thinking verbs/100 | Building verbs/100 | **T:B** |
|---|---|---|---|
| Accepted | 5.22 | 4.97 | **1.05** |
| Rejected | 5.12 | 4.13 | **1.30** |

Two things are happening here simultaneously. First, the thinking verb rates are nearly the same (5.22 vs 5.12). The ratio difference is almost entirely explained by accepted applicants using **more building verbs** — 5.12 vs 4.13 per 100 tokens. It's not that rejected applicants talk too much about thinking; it's that accepted applicants talk substantially more about making.

### Finding 3: How Many Projects You Mention

This one didn't make it into the original write-up and it probably should have.

| Category | Avg projects mentioned | Median |
|---|---|---|
| Accepted | **3.36** | **3** |
| Rejected | **2.14** | **1** |

The median rejected applicant mentions a single project. The median accepted applicant mentions three. Whether this is because accepted applicants have genuinely built more things, or because they've gotten better at framing distinct projects as distinct — the signal is stark either way. If your portfolio video reads as one long project diary, that might be a problem.

### Finding 4: Project Completion Rate (Gemma Extraction)

This is the strongest signal in the dataset, and it comes from the LLM layer.

<img class="blog-table-img blog-img-dark"  src="/images/blog/project-outcomes-dark.png"  alt="Project outcomes table" />
<img class="blog-table-img blog-img-light" src="/images/blog/project-outcomes-light.png" alt="Project outcomes table" />

Accepted portfolios are full of *finished things*. Rejected portfolios show more projects that were abandoned mid-way, or iterated without resolution. The avg revision count (1.15 vs 1.74) is interesting — accepted applicants also iterate, but they close the loop.

The per-video project success rate tells the same story more cleanly: **71.6% for accepted, 35.3% for rejected** — with medians of 100% and 33% respectively. The median accepted applicant's projects are entirely successful. The median rejected applicant's are mostly not.

### Finding 5: Hedging Language (Adverb Ratio)

The 3rd-ranked feature in the GBM by importance (0.130) is adverb ratio. What this looks like in practice:

| Category | Adv ratio (mean) | Adv ratio (median) |
|---|---|---|
| Accepted | **0.070** | **0.059** |
| Rejected | **0.088** | **0.089** |

That's a 25% difference in the median. Rejected portfolios are meaningfully denser with hedging and qualifying language — "basically", "kind of", "sort of", "pretty much". It's subtle but consistent, and the model weighs it heavily. Confidence in describing your work reads differently than hedged descriptions.

### Finding 6: Where You End Up

The segment analysis breaks each transcript into beginning, middle, and end thirds and finds the most distinctive terms. The most telling comparison is the **endings**:

- **Accepted endings** (top TF-IDF): *music, maker, data, portfolio, project, projects, mit, device*
- **Rejected endings** (top TF-IDF): *work, mit, projects, using, time, 3d, robot, design*

The word "plan" appears in the top frequency terms for rejected endings. It doesn't appear in accepted endings at all. Three rejected videos contain the exact bigram "hope continue" — applicants closing their video by expressing hope that they'll keep working on things. That's not the note to end on.

## The Model

I trained a Gradient Boosting Classifier on 17 features combining the linguistic signals above with Gemma's per-project data. Evaluated with Leave-One-Out Cross-Validation on 46 labeled videos:

- **LOO Accuracy: 73.9%** (34/46 correct)
- Rejected precision / recall: 74% / 67%
- Accepted precision / recall: 74% / 80%

The most important features:

<img class="blog-table-img blog-img-dark"  src="/images/blog/feature-importance-dark.png"  alt="Feature importance table" />
<img class="blog-table-img blog-img-light" src="/images/blog/feature-importance-light.png" alt="Feature importance table" />

The single strongest predictor is whether Gemma perceives projects as "partial" or "success". Adverb ratio (hedging language) is third. Number of projects and token count (transcript length) also crack the top 5 — longer, denser portfolios with more discrete projects tend to score accepted.

Worth noting: Gemma:7b predicted **Accepted for 19 out of 20 Rejected videos**. Its direct outcome predictions are nearly useless — it rates almost everything 7–8/10 and calls nearly everyone "accepted". The project *extraction* (name, type, outcome, revisions) is what carries the signal, not its verdicts.

## What This Means (Carefully)

This is a correlational study, not causal. 73.9% accuracy on 46 examples is meaningful but not definitive. The findings point at real patterns — but they're measuring symptoms, not causes.

The actionable picture that falls out of the data:
- Talk about what you built in past tense. The future rate barely moves between groups; the past rate does.
- Name more discrete projects. The median accepted applicant mentions 3; the median rejected mentions 1.
- Close your loops. Partial projects appear at 5× the rate in rejected portfolios.
- Don't hedge. The adverb rate difference is 25% and the model weights it heavily.
- Don't end on aspiration. End on what you shipped.

The irony of me — a current MIT applicant — building this pipeline to analyze portfolios I'm competing against is not lost on me. Whether it actually helps, I'll find out in about a year.

## Technical Notes

Running Gemma:7b locally (via Ollama) on a Mac Mini for 95 transcripts takes about an hour end-to-end. The extraction quality is better than I expected for a 7B model, especially for straightforward project descriptions. It does have a strong bias toward rating everything 7-8/10 and predicting "Accepted" — the project extraction is more useful than its direct predictions.

The full pipeline runs with `python3 run.py`. It's resumable — each step saves intermediate outputs, so if Ollama crashes mid-batch it picks up where it left off.

Code and the full dataset — including box plots, scatter plots, confidence distributions, and mean comparison charts — are [on GitHub](https://github.com/Ma7erial/MIT-Maker-Portfolio-Dataset-and-Analysis).
