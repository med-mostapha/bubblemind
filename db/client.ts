import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schama from "./schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema: schama });
