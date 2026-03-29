import { sql } from "drizzle-orm";
import { pgTable, text, boolean, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Core authenticated user.
 * The ScaleKit organization_id acts as our multi-tenant workspace identifier.
 */
export const user = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: text("email").notNull().unique(),
    name: text("name"),
    organization_id: text("organization_id").notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("users_org_idx").on(t.organization_id)],
);

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
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
/**
 * Canonical knowledge items per workspace.
 * Stores raw content + summarized content for LLM context retrieval.
 */
export const knowledgeItems = pgTable(
  "knowledge_items",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organization_id: text("organization_id").notNull(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    source_url: text("source_url"),
    raw_content: text("raw_content").notNull(),
    summarized_content: text("summarized_content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("knowledge_org_idx").on(t.organization_id)],
);

/**
 * Chat conversations scoped to a workspace.
 */
export const conversations = pgTable(
  "conversations",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    organization_id: text("organization_id").notNull(),
    title: text("title"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("conv_org_idx").on(t.organization_id)],
);

/**
 * Individual chat messages.
 */
export const messages = pgTable(
  "messages",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    conversation_id: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    organization_id: text("organization_id").notNull(),
    role: text("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("msg_conv_idx").on(t.conversation_id)],
);
/**
 * Per-workspace basic chat widget customization (legacy).
 */
// export const widgetSettings = pgTable("widget_settings", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   organization_id: text("organization_id").notNull(),
//   bot_name: text("bot_name"),
//   primary_color: text("primary_color"),
//   greeting_message: text("greeting_message"),
//   position: text("position"),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
// });

/**
 * Fine-grained chat widget settings for the embeddable bubble + window.
 */
export const chatWidgetSettings = pgTable(
  "chat_widget_settings",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    project_id: text("project_id").notNull(),
    bot_id: text("bot_id"),
    bubble_position: text("bubble_position"),
    bubble_color: text("bubble_color"),
    bubble_icon: text("bubble_icon"),
    bubble_icon_url: text("bubble_icon_url"),
    bubble_size: text("bubble_size"),
    bubble_animation: boolean("bubble_animation").default(true),
    tooltip_text: text("tooltip_text"),
    window_primary_color: text("window_primary_color"),
    window_background_color: text("window_background_color"),
    window_border_radius: text("window_border_radius"),
    window_font_family: text("window_font_family"),
    window_header_title: text("window_header_title"),
    window_header_subtitle: text("window_header_subtitle"),
    company_logo_url: text("company_logo_url"),
    use_logo_as_bubble: boolean("use_logo_as_bubble").default(false),
    opening_message: text("opening_message"),
    opening_message_enabled: boolean("opening_message_enabled").default(true),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("widget_project_idx").on(t.project_id)],
);
