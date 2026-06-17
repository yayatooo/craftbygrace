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

export const authProviderEnum = pgEnum("auth_provider", ["google", "github"]);

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

// =============================
// USERS
// =============================

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    username: varchar("username", { length: 80 }),

    image: text("image"),
    bio: text("bio"),

    // Untuk OAuth login
    provider: authProviderEnum("provider").notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),

    // Karena ini portfolio personal, bisa dipakai untuk guard admin.
    isOwner: boolean("is_owner").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    uniqueIndex("users_provider_account_unique").on(
      table.provider,
      table.providerAccountId,
    ),
  ],
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

    // Simpel untuk awal:
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
    contentType: blogContentTypeEnum("content_type").default("mdx").notNull(),

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
