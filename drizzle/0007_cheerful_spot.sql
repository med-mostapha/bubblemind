ALTER TABLE "chat_widget_settings" ALTER COLUMN "bubble_animation" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "chat_widget_settings" ALTER COLUMN "bubble_animation" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "chat_widget_settings" ALTER COLUMN "use_logo_as_bubble" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "chat_widget_settings" ALTER COLUMN "opening_message_enabled" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "chat_widget_settings" ALTER COLUMN "opening_message_enabled" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "chat_widget_settings" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "chat_widget_settings" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "conversations" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "knowledge_items" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "knowledge_items" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "metadata" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "metadata" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "widget_settings" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "widget_settings" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
CREATE INDEX "widget_project_idx" ON "chat_widget_settings" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "conv_org_idx" ON "conversations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "knowledge_org_idx" ON "knowledge_items" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "msg_conv_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "users_org_idx" ON "users" USING btree ("organization_id");