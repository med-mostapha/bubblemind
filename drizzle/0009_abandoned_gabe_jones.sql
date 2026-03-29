ALTER TABLE "metadata" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "metadata" ADD CONSTRAINT "metadata_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metadata" DROP COLUMN "user_email";