# PRD: Agentic Learning Platform

**Status:** Draft v0.2
**Last Updated:** 2026-02-22

> For key concept definitions (Clear Story, Transmission, Module, Materials, etc.) see `CLAUDE.md`.
> This document focuses on system behaviour, interfaces, and flows.

---

## 1. Vision & Guiding Principles

This platform transforms existing course content and coaching expertise into personalized,
AI-mediated learning experiences that are primarily *doing-based*, not consumption-based.
Students spend most of their time in structured action, with AI providing adaptive guidance,
assessment, and accountability — and humans showing up at precisely the moments where human
presence creates the most leverage.

**Core principles:**
- **Action over content.** The unit of learning is a *thing done*, not a thing watched.
- **AI handles throughput; humans handle breakthroughs.** AI does intake, assessment, practice,
  and integration. Humans do hot seats, live coaching, and community.
- **Everything is a material.** Every interview, assessment, and practice session produces
  structured outputs that serve two purposes: (a) context that personalizes all future AI
  interactions for that student, and (b) deliverables the student actually uses in their life.
- **The system gets smarter.** Every student conversation feeds back into course improvement.
  This is a core function of the platform, not optional.
- **This is operational tooling, not a consumer product.** Polish matters where students see it.
  Internal course-builder UX can be functional.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  COURSE BUILDER                      │
│  (Internal — Course Architects & Partners)          │
└────────────────────┬────────────────────────────────┘
                     │ generates
                     ▼
┌─────────────────────────────────────────────────────┐
│               COURSE CONFIGURATION                   │
│  Modules, Prompts, Materials Schema, Schedules      │
└──────┬───────────────────────┬──────────────────────┘
       │ drives                │ drives
       ▼                       ▼
┌──────────────┐    ┌─────────────────────────────────┐
│  STUDENT     │    │    LIVE TRAINING DASHBOARD      │
│  PORTAL      │    │  Teacher briefing, hot seat     │
│  per-course  │    │  selection, TA monitoring,      │
│  per-domain  │    │  Q&A synthesis                  │
└──────┬───────┘    └─────────────────────────────────┘
       │
       ├── Conversations ──────────────────────────────┐
       ├── Assessments ────────────────────────────────┤
       ├── Materials ──────────────────────────────────┤
       └── Progress ────────────────────────────────── ▼
                                              DATA LAYER
                                                     │
                                                     ▼
                                    CONTINUOUS IMPROVEMENT ENGINE
```

---

## 3. Course Design Process

This is the flow a Course Architect follows to create a new course.

### Step 1 — Define the Transformation (Human, with AI interview assistance)
- ICP (Ideal Customer Profile)
- Start State (who the student is at enrollment)
- End State (who the student is at graduation)
- AI proposes: limiting beliefs list, required skills list
- Human reviews and approves

### Step 2 — Clear Story Audit (AI)
- AI submits course context to the Clear Stories API
- Returns 100-200 most relevant stories from the full library (10,000+)
- Human curates: remove irrelevant, flag gaps (topics with thin coverage → new stories needed)
- These 100-200 become the **course story pool** — used both for curriculum design and at runtime

### Step 3 — Curriculum Generation (AI)
- AI clusters the curated 100-200 stories into thematic groups
- Groups become candidate modules
- AI sequences modules (start state → end state logic), tagging each with limiting belief + skill
- Human reviews: reorder, split, merge modules

### Step 4 — Module Build (AI, per module)
For each module, AI generates:
- Transmission script (built around that module's Clear Story cluster)
- All component prompts (interview, assessment, roleplay, integration interview, etc.)
- Material schemas for materials produced by this module
- Time estimates

Human then:
- Reviews and refines all prompts
- Records Transmission video/audio from the script
- Confirms material schemas

### Step 5 — Schedule & Balance
- Mark which modules are covered in which live training session
- Mark co-work sessions (TA-monitored)
- View modality balance (lecture % / practice % / live interaction %)
- Rebalance if needed

### Step 6 — Support Content (AI)
AI generates: sales page, FAQ, fulfillment email sequence, Skool welcome post, live training
agenda templates. Human reviews and approves each.

### Step 7 — Publish
- Course deployed to its domain (AWS/GCP)
- GHL pipeline activated
- Skool group configured via 21 Grahams

---

## 4. The Student Experience

### 4.1 Onboarding

1. Student arrives via GHL magic link (from email or SMS)
2. **Preference selection**: interview voice (Jennifer / Teacher Clone / Neutral) and mode
   (text or voice)
3. **Relationship Dynamics assessment**: redirected to relationshipdynamics.com; results
   returned via webhook and stored against the enrollment
4. **Welcome interview**: AI-led intake that establishes baseline context, surfaces initial
   limiting beliefs, sets intention. Seeds `cumulative_context`.

### 4.2 Module Flow

Student sees: current module, component checklist, materials earned so far.

Each component in sequence:

#### Transmission
- Pre-recorded teacher video plays
- For voice-preference students: ElevenLabs reads the text summary in chosen voice
- Student marks complete; cannot skip

#### Interview
- Text mode: chat interface
- Voice mode: real-time voice (ElevenLabs TTS for AI output; STT for student input)
- AI has full `cumulative_context` injected
- Relevant Clear Stories fetched live from the course story pool and held ready
- Student can tap "Flag for live training" at any point
- Interview ends when AI determines objectives are met

#### Assessment
- Processed automatically from interview transcript (async, non-blocking)
- Updates Assessment record and `cumulative_context`
- For video-capable components: facial expression + sentiment analysis runs in background
- Significant changes (e.g., severity spike) trigger teacher notification

#### Clear Story
- AI selects the single best-fit story from the course story pool based on student's current
  assessment and conversation context
- Delivered as: text / ElevenLabs voice / teacher's recorded video version (if it exists)
- AI frames it before ("The reason I'm sharing this...") and reflects after

#### Solo Practice
- Task presented clearly: "Your task is to [specific action]"
- Capture modes: audio/video recording, written text, external action + report-back
- AI reviews output, gives feedback, updates `cumulative_context`

#### AI Roleplay
- AI plays a defined character (persona, relationship dynamic role injected from student's RD profile)
- Student converses; AI plays realistically
- Session recorded and transcribed
- AI breaks character and debriefs: what went well, what to practice

#### Human Feedback
- Student connects with a partner/peer (or breakout partner in live session)
- Instructions shown to both parties
- Student uploads recording or enters summary
- AI processes and extracts insights

#### Hot Seat (optional)
- Student shown as candidate if they checked consent checkbox
- AI pre-selected them based on hot seat selection algorithm
- Conducted live with teacher during live training session

#### Real-World Conversation
- Student has a defined conversation in their actual life
- Uploads recording
- AI analyzes: did they apply what they learned, what patterns remain
- Significantly updates `cumulative_context` and Assessment

#### Integration Interview
- AI-led closing interview
- Checks off each learning objective
- Surfaces remaining questions
- Celebrates wins
- Generates module completion summary

#### Material Finalization
- AI compiles all materials produced during this module
- For each material: writes AI recommendations for next steps
- Materials displayed to student in "Your Materials" view

### 4.3 Materials Vault

Persistent section of the Student Portal showing all materials produced across all modules:
- Separated by type (Context Materials vs. Output Materials)
- Version history
- AI recommendations
- Exportable

### 4.4 Community & Progress

- Module completion percentage
- Link to Skool community (21 Grahams handles enrollment and community posting)
- Upcoming live training dates + join links

---

## 5. Live Training (2-Hour Zoom Format)

### Agenda Template

| Time | Activity |
|---|---|
| 0:01 | Welcome + story reinforcing "why this module" |
| 0:04 | Celebrate breakthroughs (AI-surfaced from progress data) |
| 0:10 | Q&A — top 5 questions from async, 3 min each |
| 0:25 | Breakout — Human Feedback step / real-time practice |
| 1:10 | Debrief — primarily chat, 1-3 questions |
| 1:15 | Hot Seats — 3 seats, 12 min each (pre-selected by AI, student consented) |
| 1:51 | Set up Real-World Conversation step |
| 1:54 | Sell next module + goodbye |
| 2:00 | End |

**Modality mix:**
- Lecture: ~10% (12 min)
- Practice/Breakout: ~37% (45 min)
- Live interaction: ~48% (57 min)

### Pre-Session Briefing (generated 24h before, AI)

- **Celebration report**: Students with breakthroughs, names + specific wins, quoted from
  their conversations
- **Q&A briefing**: Top 5 flagged questions, suggested answers, names of students to call on
- **Hot seat candidates**: 3 pre-selected students with context on what to work on
- **Breakout structure**: Suggested pairings based on complementary needs
- **Agenda doc**: Pre-filled with student-specific callouts

### Hot Seat Selection Criteria (weighted, configurable per course)

1. Student checked consent checkbox (required)
2. High urgency/severity in assessment (weighted +)
3. Stuck on a pattern across multiple modules (weighted +)
4. Recent breakthrough valuable to share (weighted +)
5. Hasn't had a hot seat yet (weighted +)
6. Teacher manual flag (overrides)

### TA Monitoring View (during co-work sessions)

Grid of all students showing:
- Current module/component
- Last activity timestamp
- Active / idle / stuck / completed status
- Flagged questions
- Alert if stuck too long on one component
- TA actions: send SMS (via GHL), post to Skool thread (via 21 Grahams)

---

## 6. AI Systems

### 6.1 Interview AI
- Runs: `interview`, `integration_interview`, `onboarding` components
- Context: `cumulative_context` + module interview prompt + relevant Clear Stories from pool
  + Assessment summary + relationship dynamics
- Voice: ElevenLabs (student's chosen voice) for voice mode
- STT: [see decisions.md]
- Behavior: follows prompt guardrails but uses judgment on depth and direction per student

### 6.2 Assessment AI
- Runs async after each interview/conversation
- Updates Assessment record + recalculates `cumulative_context`
- Flags significant changes for teacher notification
- Inputs: transcript + assessment dimensions + scoring rubric + prior assessment

### 6.3 Roleplay AI
- Same base model as Interview AI
- Persona prompt: character definition + relationship dynamic role + student's RD profile
- Has "break character / debrief" mode

### 6.4 Clear Story Selection (runtime)
- Called with current conversation context as payload
- Searches course story pool (not full library)
- Returns top match + 2-3 fallbacks
- AI selects which to deliver based on conversation state

### 6.5 Continuous Improvement Engine
- Runs weekly (or on-demand)
- Analyzes all conversations, assessments, materials across all students in a course
- Outputs ranked upgrade opportunities per module component:
  - Prompt improvements
  - Common confusion patterns
  - Clear Stories that landed vs. didn't
  - Roleplay scenarios calibration
  - New limiting beliefs discovered
  - Suggested new materials
- Presented in Course Builder as "Suggested Upgrades" queue

### 6.6 Support Content AI
- Generates sales page, FAQ, email sequences, Skool posts, agenda templates
- Writes in teacher's voice (calibrated from existing content/transcripts)
- All output goes through human review before publishing

---

## 7. Integrations

### Go High Level (GHL)
- Enrollment trigger: pipeline stage change → platform creates Enrollment, sends magic link
- Progress updates: platform pushes tags back to GHL contact (e.g., "completed-module-3")
- Communication: emails + SMS sent via GHL workflows, triggered by platform webhooks
- Method: GHL REST API

### 21 Grahams (Skool)
- Enroll student in course Skool group
- Post module completion celebrations
- Retrieve relevant community threads for TA monitoring
- Post AI-generated discussion prompts
- [OPEN — see decisions.md for full action list needed]

### ElevenLabs
- Real-time TTS streaming for voice interview mode
- Pre-generated audio for transmissions and Clear Story deliveries (cached per story)
- Three voices per course (Jennifer, teacher clone, neutral)

### Relationship Dynamics
- Student redirected to relationshipdynamics.com during onboarding
- Result returned via webhook
- Stored in Enrollment + Assessment
- Injected into Interview AI and Roleplay AI context

### Clear Stories API
- Called at course design time (Step 2, Clear Story Audit)
- Called at runtime during `interview` and `clear_story` components
- Called by Continuous Improvement Engine
- Payload: text. Response: ranked Clear Story objects.

### Infrastructure
- Student Portal: hosted per-course on our domains, AWS or GCP
- Storage: S3 or GCS for audio/video
- Database: [see decisions.md]

---

## 8. Build Phases

### Phase 1 — Foundation
- Data model + database
- Student Portal shell (auth, module progression, component routing)
- `interview` component (text mode only)
- `assessment` (auto-processed from interview)
- Material system (storage + display)
- GHL webhook enrollment trigger

### Phase 2 — Core Components
- Voice mode (ElevenLabs TTS + STT)
- `ai_roleplay` component
- `solo_practice` component (text + recording)
- Clear Stories API integration
- Relationship Dynamics integration

### Phase 3 — Course Builder
- Course setup wizard (Steps 1-3: ICP → Clear Story Audit → curriculum)
- Module component configurator
- AI curriculum generation
- Content library import + indexing

### Phase 4 — Live Training
- Teacher pre-session briefing generation
- Hot seat selection
- TA monitoring view
- Agenda generation

### Phase 5 — Intelligence
- Continuous Improvement Engine
- Support content generation (sales page, emails, etc.)
- Facial expression + sentiment analysis

### Phase 6 — Operations
- 21 Grahams full integration
- Full GHL bi-directional sync
- Per-course deployment automation
