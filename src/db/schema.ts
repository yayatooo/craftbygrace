import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// =============================
// ENUMS
// =============================

export const jobTypeEnum = pgEnum("job_type", [
  "full_time",
  "part_time",
  "freelance",
  "contract",
  "internship",
  "self_employed",
]);

export const blogStatusEnum = pgEnum("blog_status", [
  "draft",
  "published",
  "archived",
]);

export const blogContentTypeEnum = pgEnum("blog_content_type", [
  "markdown",
  "mdx",
]);

export const trackerTypeEnum = pgEnum("tracker_type", [
  "screening",
  "interview",
  "rejected",
  "signoff",
  "accepted",
  "draft",
]);

export const platformEnum = pgEnum("platform", [
  "linkeidn",
  "indeed",
  "telegram",
  "jobstreet",
  "glints",
  "jobsdb",
  "facebook",
  "threads",
  "twitter/X",
  "other",
]);

export const workTypeEnum = pgEnum("work_type", [
  "On-site",
  "Hybrid",
  "Remote",
]);

// =============================
// USERS
// =============================

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),

    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),

    image: text("image"),

    username: varchar("username", { length: 80 }),
    bio: text("bio"),

    isOwner: boolean("is_owner").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("user_username_unique").on(table.username),
    index("user_owner_idx").on(table.isOwner),
  ],
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    token: text("token").notNull().unique(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
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

    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),

    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),

    scope: text("scope"),
    password: text("password"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    uniqueIndex("account_provider_account_unique").on(
      table.providerId,
      table.accountId,
    ),
  ],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),

    identifier: text("identifier").notNull(),
    value: text("value").notNull(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// =============================
// PROJECTS
// =============================

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    thumbnail: text("thumbnail"),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),

    description: text("description").notNull(),

    // ["Next.js", "Drizzle", "PostgreSQL", "Tailwind"]
    techStack: jsonb("tech_stack").$type<string[]>().default([]).notNull(),

    isCurrent: boolean("is_current").default(false).notNull(),
    isSecret: boolean("is_secret").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    demoLink: text("demo_link"),
    repoLink: text("repo_link"),

    // Supaya bisa urut manual di dashboard
    order: integer("order").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("projects_slug_unique").on(table.slug),
    index("projects_active_idx").on(table.isActive),
    index("projects_current_idx").on(table.isCurrent),
  ],
);

// =============================
// PATH / EXPERIENCE
// =============================

export const experiences = pgTable(
  "experiences",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    companyName: varchar("company_name", { length: 160 }).notNull(),
    role: varchar("role", { length: 160 }).notNull(),
    companyLogo: varchar("company_logo"),

    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),

    isCurrent: boolean("is_current").default(false).notNull(),

    typeJob: jobTypeEnum("type_job").notNull(),

    location: varchar("location", { length: 160 }),

    order: integer("order").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("experiences_current_idx").on(table.isCurrent),
    index("experiences_start_date_idx").on(table.startDate),
  ],
);

// =============================
// SONGS
// =============================

export const songs = pgTable(
  "songs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 160 }).notNull(),
    writer: varchar("writer", { length: 160 }).notNull(),
    image: text("image"),
    link: text("link").notNull(),

    isActive: boolean("is_active").default(true).notNull(),
    order: integer("order").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("songs_active_idx").on(table.isActive)],
);

// =============================
// MOVIES
// =============================

export const movies = pgTable(
  "movies",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 160 }).notNull(),
    type: varchar("type", { length: 160 }).notNull(),
    image: text("image"),
    link: text("link"),

    isActive: boolean("is_active").default(true).notNull(),
    order: integer("order").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("movies_active_idx").on(table.isActive)],
);

// =============================
// GALLERY
// =============================

export const gallery = pgTable(
  "gallery",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 160 }).notNull(),
    image: text("image").notNull(),

    // Optional untuk accessibility dan SEO
    alt: varchar("alt", { length: 255 }),

    isActive: boolean("is_active").default(true).notNull(),
    order: integer("order").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("gallery_active_idx").on(table.isActive)],
);

// =============================
// JOB TRACKER
// =============================

export const jobTracker = pgTable("job_tracker", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  company: varchar("company", { length: 160 }).notNull(),
  location: varchar("location", { length: 160 }).notNull(),
  role: varchar("role", { length: 160 }).notNull(),
  cv: varchar("cv"),
  type: jobTypeEnum("type").notNull(),
  platform: platformEnum("platform").notNull(),
  workType: workTypeEnum("work_type").notNull(),
  status: trackerTypeEnum("status").default("screening"),
  remarks: text("remarks"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// =============================
// BLOG
// =============================

export const blogs = pgTable(
  "blogs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),

    excerpt: text("excerpt"),
    coverImage: text("cover_image"),

    // Bisa markdown dulu, lalu nanti mdx.
    contentType: blogContentTypeEnum("content_type")
      .default("markdown")
      .notNull(),

    // Isi markdown / mdx disimpan di sini.
    content: text("content").notNull(),

    status: blogStatusEnum("status").default("draft").notNull(),

    // Untuk tag seperti ["Odoo", "React", "Drizzle"]
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),

    readingTime: integer("reading_time"),

    publishedAt: timestamp("published_at", { withTimezone: true }),

    isFeatured: boolean("is_featured").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("blogs_slug_unique").on(table.slug),
    index("blogs_status_idx").on(table.status),
    index("blogs_featured_idx").on(table.isFeatured),
    index("blogs_published_at_idx").on(table.publishedAt),
  ],
);
