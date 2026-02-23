# Decisions Log

Tracks all open and resolved decisions. Update this file immediately when a decision is made.
Do not let decisions live only in chat.

---

## Open Decisions

| # | Decision | Options | Notes |
|---|---|---|---|
| 2 | STT (speech-to-text) for voice interviews | OpenAI Whisper, Deepgram, AssemblyAI | Deepgram recommended for real-time streaming. Not blocking Phase 1. |
| 3 | Video analysis (sentiment + facial expression) | AWS Rekognition, Hume AI | Hume AI recommended — emotion-specific. Not blocking Phase 1 (Phase 5). |
| 6 | Materials export format | PDF, plain HTML page on-domain, Notion | Plain HTML page recommended (keeps student on-domain). Not blocking Phase 1. |
| 7 | Full list of 21 Grahams Skool actions needed | TBD | Need to define with Graham before building integration. Not blocking Phase 1. |
| 8 | Teacher voice clone onboarding process | ElevenLabs flow | Need to define per-teacher recording requirements (duration, format, environment). Not blocking Phase 1. |
| 9 | Transcription at scale (async batch) | OpenAI Whisper, Deepgram, AssemblyAI | Deepgram recommended. Not blocking Phase 1. |
| 10 | Platform name | TBD | No name chosen yet. Not blocking Phase 1. |

---

## Resolved Decisions

| # | Decision | Resolution | Date | Notes |
|---|---|---|---|---|
| R1 | Platform type | Internal/partner tooling — NOT a consumer SaaS | 2026-02-22 | Will not be sold as a product for now |
| R2 | Course creator access | Internal + partners + contractors only | 2026-02-22 | May open to external creators in future |
| R3 | Community platform | Skool, accessed via 21 Grahams custom API | 2026-02-22 | Skool has no official API |
| R4 | CRM | Go High Level (GHL) | 2026-02-22 | |
| R5 | Voice synthesis | ElevenLabs | 2026-02-22 | Three voices per course: Jennifer, teacher clone, neutral |
| R6 | Student voice choice | Student selects at onboarding, can change in settings | 2026-02-22 | |
| R7 | Page hosting | Platform generates and hosts pages directly on our domains (AWS/GCP) — no CMS | 2026-02-22 | |
| R8 | Relationship dynamics assessment | Use relationshipdynamics.com (our own tool) | 2026-02-22 | Redirect + webhook |
| R9 | Clear Stories system | External API with vector DB — we call it, we don't build it | 2026-02-22 | API already exists |
| R10 | Transmission definition | Full audio/video teaching piece built FROM one or more Clear Stories | 2026-02-22 | Distinct from Clear Story component |
| R11 | Clear Story definition | The raw 4-part unit: You Think / But Really / So If You Just / Then You'll Get | 2026-02-22 | |
| R12 | Clear Story Audit step | AI searches full library (10,000+) → returns 100-200 relevant stories → human curates → AI clusters into modules | 2026-02-22 | Course story pool is the curated subset used at runtime |
| R13 | Prompts treated as code | All AI prompts live in `prompts/` directory, version controlled | 2026-02-22 | |
| R14 | Primary AI model | Claude (Anthropic API) — `claude-sonnet-4-6` default, `claude-opus-4-6` for complex generation tasks | 2026-02-23 | Long context window critical for cumulative_context injection |
| R15 | Database | Supabase (PostgreSQL) | 2026-02-23 | Chosen for: built-in Google OAuth, storage, auto-generated REST API, dashboard for data inspection |
| R16 | Auth method | Google OAuth via Supabase | 2026-02-23 | Both existing sites (relationshipdynamics.com, coachingos.com) use Google Auth — no second login for students |
| R17 | App framework + hosting | Next.js (React) + Vercel | 2026-02-23 | One codebase for all three interfaces; Vercel handles per-course custom subdomain routing; zero-ops deploys |
| R18 | Course portal domains | learn.relationshipdynamics.com (RSM), learn.coachingos.com (TAN) | 2026-02-23 | Subdomain approach — existing sites keep their root domains |
| R19 | Courses built in Phase 1 | Relationship Skills Mastery (RSM) + Trusted Advisor Network (TAN) simultaneously | 2026-02-23 | Two courses at once forces proper multi-tenant abstraction; both have existing video content to migrate |
| R20 | Multi-tenant architecture | Course-scoped from day 1 — all data records carry course_id; portal routes by Host header | 2026-02-23 | Same Next.js app serves both portals; Supabase Row Level Security enforces course isolation |
