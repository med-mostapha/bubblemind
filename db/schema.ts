import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

/**
 * Core authenticated user.
 * The ScaleKit organization_id acts as our multi-tenant workspace identifier.
 */
export const user = pgTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  organization_id: text("organization_id").notNull(),
  image: text("image"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`now()`),
});

/**
 * Onboarding / business metadata captured during setup.
 */
export const metadata = pgTable("metadata", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  business_name: text("business_name").notNull(),
  website_url: text("website_url").notNull(),
  external_links: text("external_links"),
  user_email: text("user_email").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`now()`),
});

/**
 * Canonical knowledge items per workspace.
 * Stores raw content + aggressively summarized content for cheap retrieval.
 */
export const knowledgeItems = pgTable("knowledge_items", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organization_id: text("organization_id").notNull(),
  type: text("type").notNull(), // "website" | "csv" | "text"
  title: text("title").notNull(),
  source_url: text("source_url"),
  raw_content: text("raw_content").notNull(),
  summarized_content: text("summarized_content").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`now()`),
});

/**
 * Chat conversations scoped to a workspace.
 */
export const conversations = pgTable("conversations", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organization_id: text("organization_id").notNull(),
  title: text("title"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`now()`),
});

/**
 * Individual chat messages.
 */
export const messages = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  conversation_id: text("conversation_id").notNull(),
  organization_id: text("organization_id").notNull(),
  role: text("role").notNull(), // "user" | "assistant" | "system"
  content: text("content").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`now()`),
});

/**
 * Per-workspace chat widget customization.
 */
export const widgetSettings = pgTable("widget_settings", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organization_id: text("organization_id").notNull(),
  bot_name: text("bot_name"),
  primary_color: text("primary_color"),
  greeting_message: text("greeting_message"),
  position: text("position"), // "bottom-right" | "bottom-left" | etc.
  createdAt: text("created_at")
    .notNull()
    .default(sql`now()`),
});

/**
 * Fine-grained chat widget settings for the embeddable bubble + window.
 */
export const chatWidgetSettings = pgTable("chat_widget_settings", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  project_id: text("project_id").notNull(),
  bot_id: text("bot_id"),
  bubble_position: text("bubble_position"), // "bottom-right" | "bottom-left"
  bubble_color: text("bubble_color"),
  bubble_icon: text("bubble_icon"),
  bubble_icon_url: text("bubble_icon_url"),
  bubble_size: text("bubble_size"), // "small" | "medium" | "large"
  bubble_animation: text("bubble_animation"), // "true" | "false"
  tooltip_text: text("tooltip_text"),
  window_primary_color: text("window_primary_color"),
  window_background_color: text("window_background_color"),
  window_border_radius: text("window_border_radius"),
  window_font_family: text("window_font_family"),
  window_header_title: text("window_header_title"),
  window_header_subtitle: text("window_header_subtitle"),
  company_logo_url: text("company_logo_url"),
  use_logo_as_bubble: text("use_logo_as_bubble"), // "true" | "false" – when true, logo fills the bubble circle
  opening_message: text("opening_message"),
  opening_message_enabled: text("opening_message_enabled"), // "true" | "false"
  updated_at: text("updated_at")
    .notNull()
    .default(sql`now()`),
});
