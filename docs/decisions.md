# Decisions Log

Tracks all open and resolved decisions. Update this file immediately when a decision is made.
Do not let decisions live only in chat.

---

## Open Decisions

| # | Decision | Options | Notes |
|---|---|---|---|
| 1 | Primary AI model | Claude (Anthropic), GPT-4o (OpenAI) | Claude recommended for long-context, nuanced conversation |
| 2 | STT (speech-to-text) for voice interviews | OpenAI Whisper, Deepgram, AssemblyAI | Deepgram recommended for real-time streaming |
| 3 | Video analysis (sentiment + facial expression) | AWS Rekognition, Hume AI | Hume AI recommended — emotion-specific |
| 4 | Database | Supabase (Postgres), AWS RDS Postgres, PlanetScale | Supabase recommended for speed of development |
| 5 | App hosting / deployment | AWS ECS containers, Google Cloud Run, static + lambda | Cloud Run recommended for simplest ops |
| 6 | Materials export format | PDF, plain HTML page on-domain, Notion | Plain HTML page recommended (keeps student on-domain) |
| 7 | Full list of 21 Grahams Skool actions needed | TBD | Need to define with Graham before building integration |
| 8 | Teacher voice clone onboarding process | ElevenLabs flow | Need to define per-teacher recording requirements (duration, format, environment) |
| 9 | Transcription at scale (async batch) | OpenAI Whisper, Deepgram, AssemblyAI | Deepgram recommended |
| 10 | Platform name | TBD | No name chosen yet |
| 11 | Course domains | TBD per course | e.g., app.stopdivorce.com — confirm domain ownership + DNS setup needed |
| 12 | Auth method for Student Portal | Magic link (email), password, SSO | Magic link recommended — frictionless, driven by GHL enrollment email |

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
