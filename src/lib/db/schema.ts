import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'

// ─── Component type ────────────────────────────────────────────────────────────

export type ComponentType =
  | 'transmission'
  | 'interview'
  | 'assessment'
  | 'clear_story'
  | 'solo_practice'
  | 'ai_roleplay'
  | 'human_feedback'
  | 'hot_seat'
  | 'real_world_conversation'
  | 'integration_interview'
  | 'material_finalization'

// ─── Course configuration (published from Builder) ────────────────────────────

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  domain: text('domain').notNull().unique(), // e.g. "learn.relationshipdynamics.com"
  icp: text('icp'),
  startState: text('start_state'),
  endState: text('end_state'),
  limitingBeliefs: jsonb('limiting_beliefs').$type<
    Array<{ id: string; description: string; sequenceOrder: number }>
  >(),
  requiredSkills: jsonb('required_skills').$type<
    Array<{ id: string; description: string; sequenceOrder: number }>
  >(),
  transformationNarrative: text('transformation_narrative'),
  storyPoolIds: text('story_pool_ids').array(),
  voiceOptions: text('voice_options').array().notNull().default(['jennifer', 'neutral']),
  teacherVoiceCloneId: text('teacher_voice_clone_id'),
  skoolGroupId: text('skool_group_id'),
  ghlPipelineId: text('ghl_pipeline_id'),
  status: text('status', { enum: ['draft', 'active', 'archived'] }).notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const liveTrainingSessions = pgTable('live_training_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id),
  sessionNumber: integer('session_number').notNull(),
  scheduledAt: timestamp('scheduled_at').notNull(),
  zoomLink: text('zoom_link'),
  moduleIdsCovered: uuid('module_ids_covered').array().notNull().default([]),
  preSessionBriefing: jsonb('pre_session_briefing').$type<{
    celebrations: Array<{ studentName: string; win: string; quote: string }>
    qaPairs: Array<{ question: string; suggestedAnswer: string; studentName: string }>
    hotSeatCandidates: Array<{ studentId: string; context: string }>
    agenda: string
  }>(),
  hotSeatStudentIds: uuid('hot_seat_student_ids').array().notNull().default([]),
  status: text('status', { enum: ['scheduled', 'live', 'completed'] })
    .notNull()
    .default('scheduled'),
  recordingUrl: text('recording_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const modules = pgTable('modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id),
  name: text('name').notNull(),
  description: text('description'),
  sequenceNumber: integer('sequence_number').notNull(),
  learningObjectives: text('learning_objectives').array().notNull().default([]),
  limitingBeliefIds: text('limiting_belief_ids').array().notNull().default([]),
  skillIds: text('skill_ids').array().notNull().default([]),
  storyClusterIds: text('story_cluster_ids').array().notNull().default([]),
  successCriteria: text('success_criteria'),
  estimatedAsyncMinutes: integer('estimated_async_minutes'),
  liveTrainingSessionId: uuid('live_training_session_id').references(
    () => liveTrainingSessions.id,
  ),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const materialSchemas = pgTable('material_schemas', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  type: text('type', { enum: ['context', 'output', 'both'] }).notNull(),
  format: text('format', { enum: ['text', 'structured_json', 'document'] }).notNull(),
  producedByComponentType: text('produced_by_component_type').$type<ComponentType>().notNull(),
  generationPromptPath: text('generation_prompt_path').notNull(),
  refinementPromptPath: text('refinement_prompt_path'),
  contextInjectionSpec: jsonb('context_injection_spec').$type<{
    format: 'summary' | 'full'
    prefix: string
    maxTokens: number
  }>(),
  injectIntoComponents: text('inject_into_components').array().notNull().default([]),
  displayTemplate: text('display_template'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const moduleComponents = pgTable('module_components', {
  id: uuid('id').primaryKey().defaultRandom(),
  moduleId: uuid('module_id')
    .notNull()
    .references(() => modules.id),
  type: text('type').$type<ComponentType>().notNull(),
  sequenceNumber: integer('sequence_number').notNull(),
  config: jsonb('config').notNull(), // type-specific — see data-model.md for schemas
  isOptional: boolean('is_optional').notNull().default(false),
  producesMaterialSchemaId: uuid('produces_material_schema_id').references(
    () => materialSchemas.id,
  ),
  estimatedMinutes: integer('estimated_minutes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── Student data ──────────────────────────────────────────────────────────────

export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  ghlContactId: text('ghl_contact_id'),
  skoolUsername: text('skool_username'),
  voicePreference: text('voice_preference', {
    enum: ['jennifer', 'teacher_clone', 'neutral'],
  })
    .notNull()
    .default('jennifer'),
  interviewModePreference: text('interview_mode_preference', { enum: ['text', 'voice'] })
    .notNull()
    .default('text'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const enrollments = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id')
    .notNull()
    .references(() => students.id),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id),
  enrolledAt: timestamp('enrolled_at').notNull().defaultNow(),
  status: text('status', { enum: ['active', 'paused', 'completed', 'churned'] })
    .notNull()
    .default('active'),
  currentModuleId: uuid('current_module_id').references(() => modules.id),
  currentComponentId: uuid('current_component_id').references(() => moduleComponents.id),
  relationshipDynamics: jsonb('relationship_dynamics'), // from relationshipdynamics.com webhook
  cumulativeContext: jsonb('cumulative_context').$type<{
    baseline: Record<string, unknown>
    limitingBeliefs: Array<{ id: string; status: string; evidence: string }>
    skills: Array<{ id: string; status: string }>
    keyThemes: string[]
    lastUpdatedAt: string
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const assessments = pgTable('assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  enrollmentId: uuid('enrollment_id')
    .notNull()
    .references(() => enrollments.id),
  moduleId: uuid('module_id')
    .notNull()
    .references(() => modules.id),
  relationshipDynamics: jsonb('relationship_dynamics'),
  dimensions: jsonb('dimensions').$type<
    Record<string, { score: number; evidence: string; updatedAt: string }>
  >(),
  limitingBeliefStatus: jsonb('limiting_belief_status').$type<
    Record<string, 'identified' | 'challenged' | 'shifting' | 'integrated'>
  >(),
  skillStatus: jsonb('skill_status').$type<
    Record<string, 'introduced' | 'practicing' | 'integrated'>
  >(),
  severityScore: integer('severity_score'),
  urgencyScore: integer('urgency_score'),
  narrative: text('narrative'),
  sourceConversationIds: uuid('source_conversation_ids').array().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  enrollmentId: uuid('enrollment_id')
    .notNull()
    .references(() => enrollments.id),
  componentId: uuid('component_id')
    .notNull()
    .references(() => moduleComponents.id),
  componentType: text('component_type').$type<ComponentType>().notNull(),
  modality: text('modality', { enum: ['text', 'voice'] }).notNull().default('text'),
  transcript: jsonb('transcript')
    .$type<Array<{ role: 'ai' | 'student'; content: string; timestamp: string }>>()
    .notNull()
    .default([]),
  audioUrl: text('audio_url'),
  videoUrl: text('video_url'),
  transcriptUrl: text('transcript_url'),
  sentimentScores: jsonb('sentiment_scores'),
  facialExpressionData: jsonb('facial_expression_data'),
  aiSummary: jsonb('ai_summary').$type<{
    keyInsights: string[]
    beliefShifts: string[]
    flags: string[]
    objectivesMet: boolean
  }>(),
  flags: jsonb('flags')
    .$type<Array<{ type: string; content: string; flaggedAt: string }>>()
    .notNull()
    .default([]),
  clearStoriesUsed: text('clear_stories_used').array().notNull().default([]),
  status: text('status', { enum: ['in_progress', 'completed', 'abandoned'] })
    .notNull()
    .default('in_progress'),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const materials = pgTable('materials', {
  id: uuid('id').primaryKey().defaultRandom(),
  enrollmentId: uuid('enrollment_id')
    .notNull()
    .references(() => enrollments.id),
  schemaId: uuid('schema_id')
    .notNull()
    .references(() => materialSchemas.id),
  version: integer('version').notNull().default(1),
  content: jsonb('content').notNull(),
  producedByConversationId: uuid('produced_by_conversation_id').references(() => conversations.id),
  aiRecommendations: text('ai_recommendations'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ─── Inferred types ────────────────────────────────────────────────────────────

export type Course = typeof courses.$inferSelect
export type Module = typeof modules.$inferSelect
export type ModuleComponent = typeof moduleComponents.$inferSelect
export type MaterialSchema = typeof materialSchemas.$inferSelect
export type Student = typeof students.$inferSelect
export type Enrollment = typeof enrollments.$inferSelect
export type Assessment = typeof assessments.$inferSelect
export type Conversation = typeof conversations.$inferSelect
export type Material = typeof materials.$inferSelect
export type LiveTrainingSession = typeof liveTrainingSessions.$inferSelect
