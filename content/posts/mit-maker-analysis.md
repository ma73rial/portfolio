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

### Finding 1: Past vs Future Tense

This was the cleanest signal.

| Category | Past rate/100 tokens | Future rate/100 | **Ratio** |
|---|---|---|---|
| Accepted | 10.92 | 4.20 | **2.60×** |
| Rejected | 9.98 | 4.55 | **2.19×** |

Accepted applicants talk about *what they built*. Rejected applicants talk more about *what they want to build* or *what could be done*. The gap (2.60 vs 2.19) is consistent across every model I tested.

This is intuitive in retrospect: the portfolio is evidence, not a pitch deck. Reviewers want to see finished things.

### Finding 2: Thinking:Building Verb Ratio

| Category | Thinking verbs/100 | Building verbs/100 | **T:B** |
|---|---|---|---|
| Accepted | 5.22 | 4.97 | **1.05** |
| Rejected | ~6.50 | ~5.00 | **1.30** |

Accepted applicants use thinking-verbs ("design", "decide", "learn") and building-verbs ("built", "printed", "assembled") in roughly equal proportion. Rejected applicants over-index on conceptual language relative to hands-on verbs.

### Finding 3: Project Completion Rate (Gemma Extraction)

This is the strongest signal in the dataset, and it comes from the LLM layer.

| Metric | Accepted | Rejected |
|---|---|---|
| Projects with "success" outcome | **89%** | **45%** |
| Projects with "partial/failed" | 7% | **45%** |
| Avg revisions per project | **1.15** | **1.74** |

Accepted portfolios are full of *finished things*. Rejected portfolios show more projects that were abandoned mid-way, or iterated without resolution. The avg revision count (1.15 vs 1.74) is interesting — accepted applicants also iterate, but they close the loop.

## The Model

I trained a Gradient Boosting Classifier on 17 features combining the linguistic signals above with Gemma's per-project data. Evaluated with Leave-One-Out Cross-Validation on 46 labeled videos:

- **LOO Accuracy: 73.9%** (34/46 correct)
- Rejected precision / recall: 74% / 67%
- Accepted precision / recall: 74% / 80%

The most important features:

| Rank | Feature | Importance |
|---|---|---|
| 1 | `project_partial_rate` | 0.362 |
| 2 | `avg_revisions_per_project` | 0.160 |
| 3 | `adv_ratio` (hedging language) | 0.130 |
| 4 | `token_count_log2` (transcript length) | 0.069 |

The single strongest predictor is whether Gemma perceives projects as "partial" or "success". Linguistic hedging (adverb ratio) is third — applicants who say "kind of", "basically", "sort of" frequently are more likely to be rejected, possibly because hedging language signals uncertainty about the work.

## What This Means (Carefully)

This is a correlational study, not causal. 73.9% accuracy on 46 examples is meaningful but not definitive. The findings point at real patterns, but they probably reflect a deeper underlying variable: **people who finish projects talk like they finish projects**.

The most useful practical signal: your portfolio should be a portfolio of *completed* work, described in past tense, with specific technical verbs. Don't talk about what you want to build. Don't over-explain your thinking. Show what you shipped.

The irony of me — a current MIT applicant — building this pipeline to analyze portfolios I'm competing against is not lost on me. Whether it actually helps, I'll find out in about a year.

## Technical Notes

Running Gemma:7b locally (via Ollama) on a Mac Mini for 95 transcripts takes about an hour end-to-end. The extraction quality is better than I expected for a 7B model, especially for straightforward project descriptions. It does have a strong bias toward rating everything 7-8/10 and predicting "Accepted" — the project extraction is more useful than its direct predictions.

The full pipeline runs with `python3 run.py`. It's resumable — each step saves intermediate outputs, so if Ollama crashes mid-batch it picks up where it left off.

Code is [on GitHub](https://github.com/ma73rial/ytscraper).
