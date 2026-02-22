# Data Model

All entities and their fields. This is the source of truth for the database schema.
See `docs/decisions.md` for the database platform decision (currently open).

---

## Entity Map

```
Course
  └── Module[]
        └── ModuleComponent[]
              └── produces → MaterialSchema

Enrollment (Student × Course)
  └── Assessment[]
  └── Conversation[]
  └── Material[]       (instances of MaterialSchema, per student)
  └── cumulative_context

Student
  └── Enrollment[]

LiveTrainingSession
  └── belongs to Course
  └── covers Module[]
```

---

## Course

```
Course {
  id                        uuid
  name                      string
  slug                      string            // used in domain/path
  domain                    string            // e.g., "app.stopdivorce.com"
  icp                       text              // ideal customer profile narrative
  start_state               text              // who the student is at enrollment
  end_state                 text              // who the student is at graduation
  limiting_beliefs          jsonb             // [{id, description, sequence_order}]
  required_skills           jsonb             // [{id, description, sequence_order}]
  transformation_narrative  text              // AI-generated arc from start to end
  story_pool_ids            string[]          // IDs from Clear Stories API (the 100-200 curated)
  voice_options             string[]          // ["jennifer", "teacher_clone", "neutral"]
  teacher_voice_clone_id    string            // ElevenLabs voice ID for teacher clone
  skool_group_id            string            // for 21 Grahams
  ghl_pipeline_id           string            // for enrollment automation
  status                    enum              // draft | active | archived
  created_at                timestamp
  updated_at                timestamp
}
```

---

## Module

```
Module {
  id                        uuid
  course_id                 uuid → Course
  name                      string
  description               text
  sequence_number           integer
  learning_objectives       string[]
  limiting_belief_ids       string[]          // from course.limiting_beliefs
  skill_ids                 string[]          // from course.required_skills
  story_cluster_ids         string[]          // Clear Story IDs assigned to this module
  success_criteria          text              // how we know this module worked
  estimated_async_minutes   integer
  live_training_session_id  uuid → LiveTrainingSession (nullable)
  created_at                timestamp
  updated_at                timestamp
}
```

---

## ModuleComponent

Each row is one step in a module. The `config` field is type-specific JSON — see schemas below.

```
ModuleComponent {
  id                        uuid
  module_id                 uuid → Module
  type                      enum              // see component types
  sequence_number           integer
  config                    jsonb             // type-specific — see below
  is_optional               boolean
  produces_material_schema_id uuid → MaterialSchema (nullable)
  estimated_minutes         integer
  created_at                timestamp
  updated_at                timestamp
}
```

### Component Types
`transmission | interview | assessment | clear_story | solo_practice | ai_roleplay |
human_feedback | hot_seat | real_world_conversation | integration_interview | material_finalization`

### Config Schemas by Component Type

#### transmission
```json
{
  "story_ids": ["cs_001", "cs_002"],
  "script_path": "prompts/transmission/module-1.md",
  "video_url": "https://...",
  "audio_url": "https://...",
  "text_summary": "...",
  "text_summary_audio_url": "https://..."
}
```

#### interview
```json
{
  "prompt_path": "prompts/interview/module-1.md",
  "context_injection_template_path": "prompts/interview/context-template.md",
  "excluded_topics": ["topic already covered in module 1"],
  "completion_criteria": "All three objectives surfaced and acknowledged",
  "flagging_criteria": ["mentions lawyer", "expresses suicidal ideation"],
  "few_shot_example_path": "prompts/interview/module-1-example.md"
}
```

#### assessment
```json
{
  "prompt_path": "prompts/assessment/module-1.md",
  "dimensions": [
    {"id": "accountability", "description": "...", "scale": 5},
    {"id": "urgency", "description": "...", "scale": 5}
  ],
  "escalation_criteria": ["urgency >= 5 AND accountability <= 1"],
  "triggers_rd_assessment": false
}
```

#### clear_story
```json
{
  "api_query_text": "partner refusing to engage, feeling hopeless",
  "pinned_story_id": null,
  "fallback_story_ids": ["cs_045", "cs_112"],
  "framing_prompt_path": "prompts/clear-story/framing.md",
  "reflection_prompt_path": "prompts/clear-story/reflection.md",
  "preferred_delivery": "auto"
}
```

#### solo_practice
```json
{
  "task_description": "Write a raw, unedited account of what you believe happened...",
  "capture_mode": "written",
  "estimated_minutes": 20,
  "evaluation_prompt_path": "prompts/solo-practice/module-1-eval.md",
  "feedback_prompt_path": "prompts/solo-practice/module-1-feedback.md",
  "success_criteria": "Student takes full ownership without blaming partner",
  "example_output_path": "prompts/solo-practice/module-1-example.md"
}
```

#### ai_roleplay
```json
{
  "character": {
    "name": "Alex",
    "relationship": "spouse",
    "rd_role": "withdrawer",
    "personality_notes": "conflict-avoidant, tends to shut down when pressured"
  },
  "scenario": "You're asking to talk. Alex has been avoiding you for three days.",
  "student_goal": "Make a clear, non-pressuring bid for connection",
  "prompt_path": "prompts/roleplay/module-2.md",
  "debrief_prompt_path": "prompts/roleplay/module-2-debrief.md",
  "evaluation_criteria": ["no blaming language", "clear bid", "respects 'no'"],
  "estimated_minutes": 15
}
```

#### human_feedback
```json
{
  "session_structure_path": "prompts/human-feedback/module-2-structure.md",
  "student_instructions": "Share your roleplay recording. Ask your partner: what landed, what didn't?",
  "feedback_giver_instructions": "...",
  "processing_prompt_path": "prompts/human-feedback/module-2-process.md",
  "pairing_criteria": "Match by RD dynamic where possible"
}
```

#### hot_seat
```json
{
  "is_optional": true,
  "typical_scenarios": ["still in pursuit mode", "fear of reaching out"],
  "briefing_prompt_path": "prompts/live-training/hot-seat-brief.md"
}
```

#### real_world_conversation
```json
{
  "assignment": "Have a 5-minute conversation with your partner using only bids for connection...",
  "application_guidance": "Use the DEAR MAN framework from Module 2",
  "recording_instructions": "Record on your phone. You don't need to tell them.",
  "analysis_prompt_path": "prompts/real-world/module-3-analysis.md",
  "success_criteria": "No pursuit language. At least one genuine bid made."
}
```

#### integration_interview
```json
{
  "prompt_path": "prompts/integration-interview/module-3.md",
  "learning_objectives": [
    "Student can articulate what pursuit-withdrawal pattern is",
    "Student identifies their own role without defensiveness"
  ],
  "completion_criteria": "All objectives assessed; student rates confidence >= 3/5",
  "summary_prompt_path": "prompts/integration-interview/module-3-summary.md"
}
```

#### material_finalization
```json
{
  "materials_produced": ["pattern_analysis", "statement_of_accountability"],
  "generation_prompt_path": "prompts/material-finalization/module-3.md",
  "recommendations_prompt_path": "prompts/material-finalization/module-3-recommendations.md"
}
```

---

## MaterialSchema

Defined per-course. Describes a material that will be produced — its structure, how it's
generated, and how it's used.

```
MaterialSchema {
  id                        uuid
  course_id                 uuid → Course
  name                      string            // e.g., "Statement of Full Accountability"
  slug                      string            // e.g., "statement_of_accountability"
  description               text
  type                      enum              // context | output | both
  format                    enum              // text | structured_json | document
  produced_by_component_type enum             // which component type generates it
  generation_prompt_path    string            // path to prompt file
  refinement_prompt_path    string            // how to update a previous version
  context_injection_spec    jsonb             // how to format for AI context injection
                                             // {format: "summary|full", prefix: "...", max_tokens: n}
  inject_into_components    string[]          // component types that receive this as context
  display_template          string            // how to render for student
  created_at                timestamp
}
```

---

## Student

```
Student {
  id                        uuid
  name                      string
  email                     string            unique
  ghl_contact_id            string
  skool_username            string            (nullable)
  voice_preference          enum              // jennifer | teacher_clone | neutral
  interview_mode_preference enum              // text | voice
  created_at                timestamp
  updated_at                timestamp
}
```

---

## Enrollment

One row per student per course.

```
Enrollment {
  id                        uuid
  student_id                uuid → Student
  course_id                 uuid → Course
  enrolled_at               timestamp
  status                    enum              // active | paused | completed | churned
  current_module_id         uuid → Module
  current_component_id      uuid → ModuleComponent
  relationship_dynamics     jsonb             // structured output from RD assessment
  cumulative_context        jsonb             // running summary — updated after each component
                                             // {
                                             //   baseline: {...},
                                             //   limiting_beliefs: [{id, status, evidence}],
                                             //   skills: [{id, status}],
                                             //   key_themes: [...],
                                             //   last_updated_at: timestamp
                                             // }
  created_at                timestamp
  updated_at                timestamp
}
```

---

## Assessment

One row per module per student. Updated as new conversations arrive.

```
Assessment {
  id                        uuid
  enrollment_id             uuid → Enrollment
  module_id                 uuid → Module
  relationship_dynamics     jsonb             // from RD, if re-assessed
  dimensions                jsonb             // {dimension_id: {score: n, evidence: "...", updated_at}}
  limiting_belief_status    jsonb             // {belief_id: "identified|challenged|shifting|integrated"}
  skill_status              jsonb             // {skill_id: "introduced|practicing|integrated"}
  severity_score            integer           // 1-5 (for urgency-sensitive courses)
  urgency_score             integer           // 1-5
  narrative                 text              // AI-generated summary paragraph
  source_conversation_ids   uuid[]
  created_at                timestamp
  updated_at                timestamp
}
```

---

## Conversation

One row per component interaction per student.

```
Conversation {
  id                        uuid
  enrollment_id             uuid → Enrollment
  component_id              uuid → ModuleComponent
  component_type            enum              // mirrors ModuleComponent.type
  modality                  enum              // text | voice
  transcript                jsonb             // [{role: "ai|student", content: "...", timestamp}]
  audio_url                 string            (nullable)
  video_url                 string            (nullable)
  transcript_url            string            (nullable)   // raw transcript file if large
  sentiment_scores          jsonb             // {overall: n, by_segment: [...]}
  facial_expression_data    jsonb             // (nullable) from video analysis
  ai_summary                jsonb             // structured summary post-conversation
                                             // {key_insights, belief_shifts, flags, objectives_met}
  flags                     jsonb[]           // [{type, content, flagged_at}] — for live training
  clear_stories_used        string[]          // Clear Story IDs delivered in this conversation
  status                    enum              // in_progress | completed | abandoned
  started_at                timestamp
  completed_at              timestamp
  created_at                timestamp
}
```

---

## Material

One row per material per student. Versioned.

```
Material {
  id                        uuid
  enrollment_id             uuid → Enrollment
  schema_id                 uuid → MaterialSchema
  version                   integer           // increments on each update
  content                   jsonb             // the actual material content
  produced_by_conversation_id uuid → Conversation
  ai_recommendations        text              // AI's notes for the student
  created_at                timestamp
  updated_at                timestamp
}
```

---

## LiveTrainingSession

```
LiveTrainingSession {
  id                        uuid
  course_id                 uuid → Course
  session_number            integer
  scheduled_at              timestamp
  zoom_link                 string
  module_ids_covered        uuid[]            // which modules this session covers
  pre_session_briefing      jsonb             // generated by AI 24h before
                                             // {celebrations, qa_pairs, hot_seat_candidates, agenda}
  hot_seat_student_ids      uuid[]            // pre-selected + consented
  status                    enum              // scheduled | live | completed
  recording_url             string            (nullable)
  created_at                timestamp
  updated_at                timestamp
}
```
