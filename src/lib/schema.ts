import { pgTable, text, timestamp, boolean, index, numeric, integer } from "drizzle-orm/pg-core";

// IMPORTANT! ID fields should ALWAYS use UUID types, EXCEPT the BetterAuth tables.


export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: text("role").default("user").notNull(), // "user" | "admin"
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("user_email_idx").on(table.email)]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    index("session_token_idx").on(table.token),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    index("account_provider_account_idx").on(table.providerId, table.accountId),
  ]
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const project = pgTable("project", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location"),
  totalArea: text("total_area"),
  totalLots: text("total_lots"),

  // Pricing and Financing Configuration (synced from Airtable)
  basePrice: numeric("base_price", { precision: 10, scale: 2 }), // Base price in USD
  minCashDown: numeric("min_cash_down", { precision: 10, scale: 2 }), // Minimum down payment in USD
  maxFinancingMonths: integer("max_financing_months"), // Maximum financing term in months
  tna: numeric("tna", { precision: 5, scale: 4 }), // Annual interest rate (e.g., 0.1500 for 15%)

  // Airtable sync tracking
  airtableRecordId: text("airtable_record_id"),
  lastSyncedAt: timestamp("last_synced_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const lot = pgTable("lot", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  number: text("number").notNull(),
  size: text("size").notNull(), // e.g., "300m2"
  price: text("price").notNull(), // e.g., "17500"
  status: text("status").notNull().default("available"), // available, reserved, sold
  image: text("image"),
  coordinates: text("coordinates"), // for clickable map areas
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const contactRequest = pgTable("contact_request", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  lotId: text("lot_id").references(() => lot.id, { onDelete: "set null" }),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lead Management System Tables
export const lead = pgTable(
  "lead",
  {
    id: text("id").primaryKey(),

    // Contact Information
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),

    // Lead Source & Attribution
    contactChannel: text("contact_channel").notNull(), // web_form_general, web_form_project, whatsapp, phone, in_person
    marketingSource: text("marketing_source"), // facebook, google, instagram, referral, organic
    marketingCampaign: text("marketing_campaign"),

    // Lead Status
    status: text("status").notNull().default("new"), // new, contacted, interested, visit_scheduled, proposal_sent, sold, lost

    // Content
    initialMessage: text("initial_message"),
    notes: text("notes"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    // Airtable Sync
    airtableRecordId: text("airtable_record_id"),
    lastSyncedAt: timestamp("last_synced_at"),
    syncStatus: text("sync_status").default("pending"), // pending, synced, error
    syncError: text("sync_error"),
  },
  (table) => [
    index("lead_email_idx").on(table.email),
    index("lead_status_idx").on(table.status),
    index("lead_channel_idx").on(table.contactChannel),
    index("lead_created_at_idx").on(table.createdAt),
    index("lead_sync_status_idx").on(table.syncStatus),
  ]
);

export const leadFinancingPreference = pgTable(
  "lead_financing_preference",
  {
    id: text("id").primaryKey(),
    leadId: text("lead_id")
      .notNull()
      .references(() => lead.id, { onDelete: "cascade" }),

    anticipoAmount: text("anticipo_amount").notNull(), // Down payment (USD)
    plazoMonths: text("plazo_months").notNull(), // Financing term (months)
    calculatedCuota: text("calculated_cuota").notNull(), // Monthly payment (USD)
    interestedPrice: text("interested_price"), // Total lot price

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("lead_financing_lead_id_idx").on(table.leadId)]
);

export const leadProject = pgTable(
  "lead_project",
  {
    id: text("id").primaryKey(),
    leadId: text("lead_id")
      .notNull()
      .references(() => lead.id, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),

    interestLevel: text("interest_level"), // high, medium, low
    notes: text("notes"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("lead_project_lead_idx").on(table.leadId),
    index("lead_project_project_idx").on(table.projectId),
  ]
);

export const blogPost = pgTable(
  "blog_post",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull().default(""), // HTML from Tiptap
    featuredImageUrl: text("featured_image_url"),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    status: text("status").notNull().default("draft"), // "draft" | "published"
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("blog_post_slug_idx").on(table.slug),
    index("blog_post_status_idx").on(table.status),
    index("blog_post_author_idx").on(table.authorId),
  ]
);
