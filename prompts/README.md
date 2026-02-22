# Prompts Directory

All AI prompts live here. Prompts are treated as code — version controlled, referenced by
the application by file path, updated deliberately.

## Structure

```
prompts/
  interview/              ← AI interview prompts (per module, per course)
  assessment/             ← Assessment extraction + scoring prompts
  roleplay/               ← Roleplay character + debrief prompts
  integration-interview/  ← End-of-module integration interview prompts
  solo-practice/          ← Practice evaluation + feedback prompts
  clear-story/            ← Framing + reflection prompts for Clear Story delivery
  material-finalization/  ← Material generation + refinement + recommendation prompts
  continuous-improvement/ ← CI engine analysis prompts
  live-training/          ← Pre-session briefing, hot seat selection, Q&A synthesis prompts
  platform/               ← Platform-wide prompts (not course-specific)
```

## Naming Convention

`[course-slug]--[module-number]--[description].md`

Examples:
- `interview/syd--01--intake.md`         (Stop Your Divorce, module 1, intake interview)
- `roleplay/syd--02--partner.md`         (Stop Your Divorce, module 2, partner character)
- `assessment/syd--01--dimensions.md`    (Stop Your Divorce, module 1, assessment)

Platform-wide prompts (not course-specific) use just the description:
- `platform/context-injection-template.md`
- `live-training/pre-session-briefing.md`

## Prompt File Format

Each prompt file should begin with a metadata header:

```
---
course: stop-your-divorce          # or "platform" for shared prompts
module: 1
component: interview
version: 1
last_updated: 2026-02-22
description: Intake interview for Module 1 — surfaces baseline situation and RD patterns
---

[prompt content below]
```
