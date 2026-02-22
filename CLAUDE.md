# Agentic Learning Platform — Claude Briefing

Read this file at the start of every session. It is the source of truth for what this project is,
how it works, and what decisions have been made. Detailed specs live in `docs/`. Always read the
relevant doc before writing code or making changes.

---

## What This Is

An **internal platform** for building and delivering AI-powered courses. It is NOT a polished
consumer product — it is operational tooling for us, our partners, and our contractors.

The core thesis: shift course delivery from passive consumption (watching videos) to active,
AI-mediated doing. AI handles throughput (intake, assessment, practice, integration). Humans
show up at precisely the moments where human presence creates the most leverage (hot seats,
live coaching, community).

**The system gets smarter over time.** Every student conversation feeds a Continuous Improvement
Engine that surfaces upgrade opportunities for prompts, materials, and curriculum.

---

## Key Concepts (read carefully — we use these as proper nouns)

### Clear Story
The **atomic unit of transformational education**. Four statements, as spoken from teacher to
student:
1. "You Think ____"
2. "But Really ____"
3. "So If You Just [take this action]"
4. "Then You'll Get [this result]"

Clear Stories live in a **vector database** accessible via an API. You can search the library
(10,000+ stories) by submitting text as a payload; it returns ranked, relevant Clear Stories.
This is a core dependency of the platform.

### Transmission
A **full teaching piece built FROM one or more Clear Stories**. The teacher wraps selected
Clear Stories in narrative, context, and examples, then records it as audio/video. A Transmission
is pre-recorded (produced once per course) and shown to all students at the start of a module.

Relationship: Clear Story is the atomic insight. Transmission is the packaged delivery of that
insight in teaching form.

### Module
The core unit of the student experience. Each module consists of an ordered set of **components**
(see component types below). A module addresses one or more limiting beliefs and builds one or
more skills.

### Component Types (ordered as they appear in a module)
1. `transmission` — pre-recorded teacher video/audio built around Clear Stories
2. `interview` — AI-led conversational intake or exploration
3. `assessment` — structured evaluation processed from the interview (or separate)
4. `clear_story` — real-time AI-selected delivery of a single raw 4-part Clear Story
5. `solo_practice` — student does a specific thing (recorded, written, or external action)
6. `ai_roleplay` — AI plays a character; student practices a real conversation
7. `human_feedback` — structured peer/partner feedback session
8. `hot_seat` — optional live coaching with teacher
9. `real_world_conversation` — student uploads recording of a real-life conversation
10. `integration_interview` — AI-led final assessment of module learning objectives
11. `material_finalization` — AI compiles and structures all materials produced in this module

### Materials
Structured outputs produced by the course for each student. They serve two purposes:
- **Context**: injected into future AI sessions to personalize the student's experience
- **Output**: deliverables the student actually uses in their life

Materials are versioned. They are produced and refined throughout the course. Example materials
for "Stop Your Divorce": statement of full accountability, repair request letter, relationship
vision, relationship dynamics profile, repair process plan.

### Cumulative Context
A running structured summary of everything the platform knows about a specific student. Updated
after every component. Injected into every AI session so the AI is always fully briefed.
Never shown directly to the student.

### Clear Story Audit (course design step)
When a new course is being designed, after defining ICP/start/end state/limiting beliefs/skills,
the AI searches the full Clear Story library and returns the 100-200 most relevant stories for
this course's transformation. These are then:
1. Curated by a human
2. Clustered by AI into thematic groups → these become candidate modules
3. Sequenced into the curriculum
4. Used as the basis for Transmission scripts

The selected 100-200 also become the **course story pool** — the subset searched at runtime
during the `clear_story` component (instead of searching all 10,000).

### ICP / Start State / End State
- **ICP**: Ideal Customer Profile — who this course is for
- **Start State**: Detailed description of the student at enrollment
- **End State**: Detailed description of the student at graduation

---

## Existing External Systems (dependencies, not built by us)

| System | What It Does | How We Connect |
|---|---|---|
| **Clear Stories API** | Vector search over 10,000+ Clear Stories | REST API, text payload → ranked stories |
| **Relationship Dynamics** (relationshipdynamics.com) | Rank-ordered assessment producing relationship dynamic profiles | Redirect + webhook on completion |
| **Go High Level (GHL)** | CRM — enrollment triggers, email/SMS, pipelines | GHL REST API |
| **21 Grahams** | Custom Skool manipulation tool (Skool has no official API) | Custom REST API built by Graham |
| **ElevenLabs** | Voice synthesis — three options per course | ElevenLabs API, real-time + pre-generated |
| **Skool** | Community platform | Via 21 Grahams only |

### ElevenLabs Voice Options (per course, student chooses at onboarding)
- Jennifer (ElevenLabs stock voice)
- Teacher's voice clone (created per teacher from audio samples)
- Neutral voice

---

## Three Primary Interfaces

1. **Course Builder** — internal tool for Course Architects to create and manage courses
2. **Student Portal** — hosted per-course on our own domains (e.g., app.stopdivorce.com), served
   from AWS or GCP. Not a CMS — the platform generates and hosts these pages directly.
3. **Live Training Dashboard** — for Teachers and TAs during live Zoom sessions and co-work

---

## Users & Roles

| Role | Description |
|---|---|
| Course Architect | Defines curriculum, builds the course in the Course Builder |
| Teacher/Expert | Records transmissions, runs live training, does hot seats |
| TA | Monitors async progress, assists during co-work sessions |
| Student | Completes modules, attends live training |

All users are internal, partners, or contractors. This is NOT a self-serve platform for
external course creators (for now).

---

## Courses In Scope

- **Stop Your Divorce** — domain: stopdivorce.com (TBC)
- **Trusted Advisor** — B2B sales / relationship selling
- **NLP** — (details TBD)
- **Wedding** — (details TBD)

---

## What To Read Next

| Topic | File |
|---|---|
| Full PRD | `docs/PRD.md` |
| Complete data model | `docs/data-model.md` |
| All assets needed per course | `docs/asset-taxonomy.md` |
| Open + resolved decisions | `docs/decisions.md` |
| Stop Your Divorce course spec | `docs/courses/stop-your-divorce.md` |
| AI prompts | `prompts/` (subdirectory per component type) |

---

## Coding Conventions (update as established)

- TBD once tech stack decisions are finalized (see `docs/decisions.md`)
- Always read the relevant spec doc before writing any component
- Prompts are treated as code — they live in `prompts/`, are version controlled, and are
  referenced by the application by file path

---

## What NOT To Do

- Do not build a CMS. Pages are generated and hosted directly.
- Do not over-engineer for external users. This is internal tooling.
- Do not start building before reading `docs/decisions.md` — several tech stack decisions
  are still open and will affect architecture.
- Do not store important decisions only in chat. Update docs immediately when decisions are made.
