import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString && process.env.NODE_ENV === "production") {
  console.warn("WARNING: POSTGRES_URL is not set. Database connection will fail at runtime.");
}

const client = postgres(connectionString || "");
export const db = drizzle(client, { schema });
