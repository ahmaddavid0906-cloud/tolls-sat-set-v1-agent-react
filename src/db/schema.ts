import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').default('user'),
  accessCode: text('access_code'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const entries = pgTable('entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  content: text('content').notNull(),
  category: text('category'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  accessCode: text('access_code').notNull().unique(),
  name: text('name').notNull(),
  whatsapp: text('whatsapp'),
  email: text('email'),
  packageId: text('package_id').notNull(),
  packageName: text('package_name').notNull(),
  price: integer('price').notNull(),
  startDate: text('start_date').notNull(),
  expiryDate: text('expiry_date').notNull(),
  status: text('status').notNull().default('active'), // 'active' | 'expiring_soon' | 'expired' | 'suspended'
  type: text('type').default('standard'),
  lastLoginAt: text('last_login_at'),
  toolUsage: text('tool_usage'), // JSON string
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
});

export const accessCodes = pgTable('access_codes', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const packages = pgTable('packages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  tagline: text('tagline'),
  price: integer('price').notNull(),
  durationDays: integer('duration_days').notNull(),
  features: text('features'), // JSON string array
  isPopular: boolean('is_popular').default(false),
  isActive: boolean('is_active').default(true),
  badgeLabel: text('badge_label'),
  targetCategory: text('target_category').default('public'),
  updatedAt: text('updated_at'),
});

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(), // e.g. TRX-XXXXXX-SAT
  customerName: text('customer_name').notNull(),
  whatsapp: text('whatsapp').notNull(),
  email: text('email').notNull(),
  planId: text('plan_id').notNull(),
  planName: text('plan_name').notNull(),
  packageName: text('package_name'),
  planPrice: integer('plan_price').notNull(),
  serviceFee: integer('service_fee').default(2500),
  totalPrice: integer('total_price').notNull(),
  amount: integer('amount').notNull(),
  status: text('status').notNull(), // 'PENDING_PROOF' | 'AWAITING_VERIFICATION' | 'APPROVED' | 'REJECTED'
  proofImageBase64: text('proof_image_base64'),
  paymentProofBase64: text('payment_proof_base64'),
  accessCode: text('access_code'),
  validUntil: text('valid_until'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  note: text('note'),
  rejectReason: text('reject_reason'),
});

export const qrisConfig = pgTable('qris_config', {
  id: serial('id').primaryKey(),
  imageBase64: text('image_base64').notNull(),
  merchantName: text('merchant_name').notNull(),
  updatedAt: text('updated_at'),
});

export const contactSettings = pgTable('contact_settings', {
  id: serial('id').primaryKey(),
  whatsappNumber: text('whatsapp_number').notNull(),
  whatsappTemplate: text('whatsapp_template').notNull(),
  updatedAt: text('updated_at'),
});

export const apiKeys = pgTable('api_keys', {
  id: text('id').primaryKey(),
  key: text('key').notNull(),
  alias: text('alias'),
  dailyLimit: integer('daily_limit').default(1000),
  dailyUsage: integer('daily_usage').default(0),
  monthlyLimit: integer('monthly_limit').default(30000),
  monthlyUsage: integer('monthly_usage').default(0),
  status: text('status').default('active'), // 'active' | 'expired' | 'revoked'
  expiryDate: text('expiry_date'),
  createdAt: text('created_at').notNull(),
  lastUsedAt: text('last_used_at'),
  accessCode: text('access_code'),
});

export const apiKeyLogs = pgTable('api_key_logs', {
  id: text('id').primaryKey(),
  keyId: text('key_id').notNull(),
  keyMasked: text('key_masked').notNull(),
  endpoint: text('endpoint').notNull(),
  status: text('status').notNull(),
  modelUsed: text('model_used'),
  timestamp: text('timestamp').notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  adminName: text('admin_name').notNull(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  category: text('category').notNull(),
  timestamp: text('timestamp').notNull(),
});

export const growthScalingState = pgTable('growth_scaling_state', {
  id: serial('id').primaryKey(),
  configVersion: integer('config_version').notNull(),
  autoApproveConfidenceThreshold: integer('auto_approve_confidence_threshold').notNull(),
  autoTrainerIntervalMinutes: integer('auto_trainer_interval_minutes').notNull(),
  fullAutoModeEnabled: boolean('full_auto_mode_enabled').default(false),
  strictAbuseModeEnabled: boolean('strict_abuse_mode_enabled').default(false),
  history: text('history'), // JSON string array
  updatedAt: text('updated_at'),
});

export const aiAgents = pgTable('ai_agents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  model: text('model').notNull(),
  status: text('status').notNull().default('active'),
  callsCount: integer('calls_count').default(0),
  lastUsed: text('last_used'),
  approvedPatternsCount: integer('approved_patterns_count').default(0),
  rejectedPatternsCount: integer('rejected_patterns_count').default(0),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
});

export const agentRunLogs = pgTable('agent_run_logs', {
  id: text('id').primaryKey(),
  agentId: text('agent_id').notNull(),
  taskId: text('task_id'),
  status: text('status').notNull(), // 'started' | 'completed' | 'failed'
  inputSummary: text('input_summary'),
  outputSummary: text('output_summary'),
  errorMessage: text('error_message'),
  createdAt: text('created_at').notNull(),
});

export const learningQueue = pgTable('learning_queue', {
  id: text('id').primaryKey(),
  sourceSubmissionId: text('source_submission_id'),
  sourceUrl: text('source_url'),
  clientName: text('client_name'),
  patternCategory: text('pattern_category').notNull(), // 'hook' | 'pacing' | 'formula' | 'category'
  patternName: text('pattern_name').notNull(),
  description: text('description').notNull(),
  confidence: integer('confidence').notNull(),
  extractedByAgentId: text('extracted_by_agent_id').notNull(),
  extractedAt: text('extracted_at').notNull(),
  status: text('status').notNull().default('pending'),
  editedDescription: text('edited_description'),
});

export const systemMemory = pgTable('system_memory', {
  id: serial('id').primaryKey(),
  totalExecutions: integer('total_executions').default(0),
  successfulPromptsCount: integer('successful_prompts_count').default(0),
  learnedKnowledgeBase: text('learned_knowledge_base'), // JSON array
  viralHookPatterns: text('viral_hook_patterns'), // JSON array
  categoryUsage: text('category_usage'), // JSON object
  formulas: text('formulas'), // JSON array
  lastUpdated: text('last_updated'),
});

export const trackingEvents = pgTable('tracking_events', {
  id: text('id').primaryKey(),
  eventType: text('event_type').notNull(),
  userId: text('user_id'),
  accessCode: text('access_code'),
  toolName: text('tool_name'),
  payload: text('payload'),
  createdAt: text('created_at').notNull(),
});

export const categoryTaxonomy = pgTable('category_taxonomy', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  keywords: text('keywords').notNull(), // JSON array
  requiresManualReview: boolean('requires_manual_review').default(false),
  parentId: text('parent_id'),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
});

export const categoryTaxonomyProposals = pgTable('category_taxonomy_proposals', {
  id: text('id').primaryKey(),
  proposedId: text('proposed_id').notNull(),
  name: text('name').notNull(),
  keywords: text('keywords').notNull(), // JSON array
  suggestedParentId: text('suggested_parent_id'),
  reason: text('reason'),
  confidence: integer('confidence').notNull(),
  status: text('status').default('pending'), // 'pending' | 'approved' | 'rejected'
  requiresManualReview: boolean('requires_manual_review').default(false),
  proposedByAgentId: text('proposed_by_agent_id'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
});

export const videoSources = pgTable('video_sources', {
  id: text('id').primaryKey(),
  url: text('url'),
  title: text('title'),
  caption: text('caption'),
  hashtags: text('hashtags'), // JSON array
  audioTranscript: text('audio_transcript'),
  visualSummary: text('visual_summary'),
  createdAt: text('created_at').notNull(),
});

export const videoSourcePredictions = pgTable('video_source_predictions', {
  id: text('id').primaryKey(),
  videoSourceId: text('video_source_id').references(() => videoSources.id),
  captionSignalScore: integer('caption_signal_score'),
  hashtagSignalScore: integer('hashtag_signal_score'),
  audioSignalScore: integer('audio_signal_score'),
  visualSignalScore: integer('visual_signal_score'),
  fusedConfidenceScore: integer('fused_confidence_score').notNull(),
  categoryId: text('category_id'),
  agentRunId: text('agent_run_id'),
  createdAt: text('created_at').notNull(),
});

export const pendingSchemaChanges = pgTable('pending_schema_changes', {
  id: text('id').primaryKey(),
  description: text('description').notNull(),
  suggestedDrizzleFields: text('suggested_drizzle_fields').notNull(),
  proposedByAgentId: text('proposed_by_agent_id').notNull(),
  status: text('status').default('pending'), // 'pending' | 'applied' | 'rejected'
  createdAt: text('created_at').notNull(),
});

export const history = pgTable('history', {
  id: text('id').primaryKey(),
  accessCode: text('access_code').notNull(),
  clientId: text('client_id'),
  clientName: text('client_name'),
  category: text('category').notNull(),
  title: text('title').notNull(),
  data: text('data').notNull(), // JSON string
  timestamp: integer('timestamp').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  entries: many(entries),
}));

export const entriesRelations = relations(entries, ({ one }) => ({
  author: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
}));

export const videoSourcePredictionsRelations = relations(videoSourcePredictions, ({ one }) => ({
  videoSource: one(videoSources, {
    fields: [videoSourcePredictions.videoSourceId],
    references: [videoSources.id],
  }),
}));
