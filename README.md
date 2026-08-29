# Craft by Grace

Craft by Grace is a full-stack portfolio and content-management application built with TanStack Start. It serves a public portfolio, archive, and blog while providing an owner-only admin area for managing the content displayed across the site.

## Features

- Public home, about, archives, and blog pages
- Owner-only admin dashboard
- Content management for projects, experience, skills, gallery items, movies, songs, and blog posts
- Job application tracking
- Email/password authentication with Better Auth
- PostgreSQL persistence through Drizzle ORM
- Image and object storage through an S3-compatible Cloudflare R2 client
- Dark/light theme support and responsive UI components

## Tech Stack

- Bun
- TypeScript and React 19
- TanStack Start and TanStack Router
- Vite 8
- Tailwind CSS 4 and Radix-based UI components
- PostgreSQL, Drizzle ORM, and node-postgres (`pg`)
- Better Auth with the Drizzle adapter
- AWS SDK S3 client for Cloudflare R2
- Biome for linting and formatting
- Vitest for testing
- Wrangler for the planned Cloudflare Workers deployment

## Project Structure

```text
src/
├── components/       Shared and UI components
├── db/               Drizzle client, schema, migrations runner, and seed script
├── features/         Domain services, validation, actions, and server functions
├── lib/              Authentication, R2 client, and shared utilities
├── pages/            Page-level presentation components
└── routes/           TanStack Router pages and API routes

drizzle/              Generated SQL migrations and Drizzle metadata
public/               Static images, icons, manifest, and robots.txt
```

The canonical database schema is `src/db/schema.ts`. Feature-level files named `*.schema.ts` contain feature validation and input schemas; they are not separate database schemas.

## Prerequisites

- Bun
- A PostgreSQL database
- Cloudflare R2 or another S3-compatible service for upload features

Local PostgreSQL may run in Docker, but this repository does not include a Dockerfile or Compose configuration. The database must be started and exposed separately.

## Environment Variables

Create a local `.env.local` file. Do not commit environment files or credentials.

```dotenv
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
R2_REGION=auto
# R2_ENDPOINT=
```

| Variable | Required | Used for |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Application queries, Drizzle commands, migrations, and connection tests |
| `BETTER_AUTH_SECRET` | Yes | Better Auth session and token signing |
| `BETTER_AUTH_URL` | Yes | Better Auth base URL; normally `http://localhost:3000` locally |
| `ADMIN_EMAIL` | Yes | Determines which authenticated account is the site owner |
| `ADMIN_NAME` | Seed only | Initial owner account name |
| `ADMIN_PASSWORD` | Seed only | Initial owner account password |
| `R2_ACCOUNT_ID` | Yes | Builds the default Cloudflare R2 endpoint |
| `R2_ACCESS_KEY_ID` | Yes | S3-compatible R2 authentication |
| `R2_SECRET_ACCESS_KEY` | Yes | S3-compatible R2 authentication |
| `R2_BUCKET_NAME` | Yes | Upload and deletion target bucket |
| `R2_PUBLIC_URL` | Yes | Public base URL for stored objects |
| `R2_REGION` | No | S3 client region; defaults to `auto` |
| `R2_ENDPOINT` | No | Overrides the endpoint derived from `R2_ACCOUNT_ID` |

The application reads server configuration through `process.env`. Database scripts also import `dotenv/config`. Keep only one effective `DATABASE_URL` for the command you intend to run: local Bun commands currently load `.env.local`, so verify the selected target before running migrations or seeds.

## Local Development

Install dependencies:

```bash
bun install
```

Apply the committed migrations to the currently selected database and verify the connection:

```bash
bun run db:setup
```

Optionally create the initial owner account:

```bash
bun run db:seed-admin
```

Start the development server at `http://localhost:3000`:

```bash
bun run dev
```

The public site is available at `/`, and authenticated administration routes are under `/admin`. Unauthorized admin access redirects to `/login`.

## Database Workflow

The project uses PostgreSQL with `drizzle-orm/node-postgres`. Drizzle creates a `pg.Pool` configured for one connection per runtime instance, one use per connection, and a five-second idle timeout. Closing each connection after its query prevents a Worker isolate from retaining a TCP socket for reuse by another request.

Database configuration:

- Schema: `src/db/schema.ts`
- Generated migrations: `drizzle/`
- Dialect: PostgreSQL
- Migration runner: `src/db/migrate.ts`

When changing the database schema:

```bash
bun run db:generate
bun run db:check
bun run db:migrate
bun run db:test
```

Use `db:generate` after editing `src/db/schema.ts`, review the generated SQL, and then run `db:migrate` against the intended database. The repository follows a migration-based workflow and does not provide a `db:push` script.

Four generated migrations are currently committed. Repository history alone does not prove whether they have already been applied to a particular local or Neon database.

## Available Scripts

| Script | Purpose |
| --- | --- |
| `bun run dev` | Start Vite development mode on port 3000 |
| `bun run build` | Create a production build |
| `bun run preview` | Preview the production build locally |
| `bun run generate-routes` | Regenerate the TanStack route tree |
| `bun run test` | Run Vitest |
| `bun run lint` | Run Biome lint checks |
| `bun run format` | Format supported files with Biome |
| `bun run check` | Run Biome checks |
| `bun run db:generate` | Generate SQL migrations from the Drizzle schema |
| `bun run db:check` | Check Drizzle migration consistency |
| `bun run db:migrate` | Apply committed migrations to `DATABASE_URL` |
| `bun run db:test` | Test the selected database connection |
| `bun run db:setup` | Migrate and then test the selected database |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:seed-admin` | Create the configured owner account |
| `bun run deploy` | Build and invoke Wrangler deployment |

Vitest is installed, but the repository does not currently contain test files.

## Authentication and Administration

Better Auth stores users, sessions, accounts, and verification records in PostgreSQL. Email/password authentication is enabled.

The account whose email matches `ADMIN_EMAIL` is treated as the owner. Admin server functions and R2 mutation endpoints check this owner status before allowing reads or writes to protected content.

## Cloudflare Workers Status

Cloudflare Workers is the production runtime target. The Cloudflare-targeted Vite build is configured and validated; account secrets and the first deployment still need to be completed.

Current repository state:

- `wrangler.jsonc` defines the TanStack Start server entry and enables `nodejs_compat`.
- `@cloudflare/vite-plugin` is registered as the TanStack Start SSR Vite environment.
- The plugin generates the Worker entry and static asset configuration during builds.
- No production secrets or bindings are declared in `wrangler.jsonc`.
- The database client remains `pg`; its pool is limited to one connection and one use per connection for Worker-safe TCP lifecycle behavior.
- Runtime modules use `process.env`, which is populated from Worker bindings under the configured compatibility date and `nodejs_compat` mode.
- `dotenv/config` is limited to local migration, connection-test, seed, and Drizzle CLI tooling.

Do not assume local `.env` files are deployed. Before using `bun run deploy`, provide all required secrets through Cloudflare and confirm the production authentication URL.

## Data and Storage

The PostgreSQL schema contains tables for:

- Authentication users, sessions, accounts, and verification records
- Skills
- Projects
- Experiences
- Songs
- Movies
- Gallery items
- Job applications
- Blog posts

Upload API routes store images and other objects through the S3-compatible R2 client. Upload and delete endpoints are protected by owner authentication.

## Code Quality

Run the project checks before submitting changes:

```bash
bun run check
bun run test
bun run build
```

The generated `src/routeTree.gen.ts` file and `src/styles.css` are excluded from Biome's configured source checks.
