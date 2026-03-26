# BuBbLEMInD — AI Customer Support SaaS

A multi-tenant SaaS platform that allows businesses to create a customizable AI chatbot widget, powered by their own knowledge base.

---

## 🏗️ Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | Next.js 16 (App Router)             |
| Database     | Neon PostgreSQL + Drizzle ORM       |
| Auth         | ScaleKit (OAuth2 / SSO)             |
| AI Engine    | OpenRouter (Llama 3 / configurable) |
| Web Scraping | ZenRows                             |
| Deployment   | Vercel                              |
| Styling      | Tailwind CSS + Framer Motion        |

---

## 🧩 Architecture Overview

```
Business Owner
  └── Dashboard (Next.js)
        ├── Onboarding → metadata
        ├── Knowledge Base → knowledgeItems (website / csv / text)
        ├── Widget Customization → chatWidgetSettings
        └── Conversations → conversations + messages

End User (Customer)
  └── Embedded Widget (public/widget.js)
        └── iframe → /widget/embed
              └── ChatWidget → /api/chat/message
```

### Multi-tenancy

Every workspace is scoped by `organization_id` from ScaleKit — all DB queries are filtered by this key.

### Knowledge Pipeline

```
Input (URL / CSV / Text)
  → ZenRows scrape (for URLs)
  → OpenRouter LLM summarize
  → Store raw_content + summarized_content
  → Retrieved at chat time as context
```

---

## ✅ Completed Fixes

### Phase 1 — Critical Bugs

- `fix: remove dead knowledge/store route (never saved to DB)`
- `fix: verify OAuth state parameter in callback to prevent CSRF attacks`
- `fix: return 401 from auth/check when user is not authenticated`
- `fix: whitelist allowed fields in widget settings POST to prevent mass assignment`
- `fix: remove duplicate Integration import in landing page`
- `fix: correct externalLinks typo and add error handling in onboarding form`

### Phase 2 — Schema & Database

- `fix: correct schema typo in db client` (schama → schema)
- `fix: align types.d.ts with actual database schema`
- `fix: use timestamp types, boolean fields, org indexes in schema`
- Migrated boolean fields (`bubble_animation`, `use_logo_as_bubble`, `opening_message_enabled`) from `text` to `boolean` via Neon SQL
- Migrated all `created_at` / `updated_at` fields from `text` to `timestamp` via Neon SQL

### Phase 3 — API Quality

- `fix: type-safe org extraction and redirect to /dashboard after auth`
- `fix: use SQL COUNT with LEFT JOIN and add pagination to conversations`
- `fix: proper URL validation and content size limit in knowledge add`
- `fix: prevent duplicate metadata, remove stale cookie source of truth`
- `fix: replace manual upsert with onConflictDoUpdate in widget config`
- `fix: trim context at separator boundary and remove duplicate system prompt`

### Bug Fixes (Testing)

- `fix: use boolean values in DEFAULT_SETTINGS and Date object for updated_at`
- `fix: replace isAuthorized server function with useUser hook in Navbar`
- `fix: add side variant to FeatureCard type and remove invalid DOM prop`
- `fix: add visually hidden DialogTitle for accessibility`

### Features Added

- `feat: add DELETE endpoint for knowledge items with org-scoped authorization`
- `feat: add delete button for knowledge items in dashboard`

---

## 🔄 In Progress

### Phase 2 — Schema (Deferred)

- [ ] **D3** — Add foreign keys (`messages → conversations`, `chatWidgetSettings → users`)
- [ ] **D5** — Migrate `metadata.user_email` → `metadata.user_id` (breaking change)
- [ ] **D6** — Merge `widgetSettings` + `chatWidgetSettings` into one table (breaking change)

### Phase 4 — Frontend & UX

- [ ] **F1** — Fix "Gemini" label in dashboard UI (project uses OpenRouter/Llama)
- [ ] **F2** — Replace sequential fetches with `Promise.all` in dashboard page
- [ ] **F3** — Fix Sidebar visibility logic (currently depends on cookie only)
- [ ] **F4** — Remove duplicate metadata fetch in Sidebar
- [ ] **F5** — Fix `isloading` typo → `isLoading` in Sidebar
- [ ] **F6** — Add markdown rendering in ChatWidget messages
- [ ] **F7** — Add caching to `useUser` hook (currently fetches on every mount)
- [ ] **F8** — Update `package.json` name from `"my-app"` to `"bubblemind"`
- [ ] **F9** — Configure `next.config.ts` (image domains, headers, redirects)

### Phase 5 — Vercel Deployment

- [ ] **V1** — Create `.env.example` with all required environment variables
- [ ] **V2** — Move `drizzle-kit` from `dependencies` to `devDependencies`
- [ ] **V3** — Add `vercel.json` for function timeout configuration
- [ ] **V4** — Test `public/widget.js` on production domain
- [ ] **V5** — Remove unused `summarizeConversation` function from `openAI.ts`

---

## 🔑 Environment Variables

```env
# Database
DATABASE_URL=

# ScaleKit Auth
SCALEKIT_ENVIRONMENT_URL=
SCALEKIT_CLIENT_ID=
SCALEKIT_CLIENT_SECRET=
SCALEKIT_REDIRECT_URI=

# AI
OPENROUTER_API_KEY=
OPENROUTER_SUMMARY_MODEL=
OPENROUTER_ASSISTANT_MODEL=

# Web Scraping
ZENROWS_API_KEY=
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Push schema to database
npx drizzle-kit push

# Run development server
npm run dev
```

---

## 📁 Project Structure

```
app/
├── api/
│   ├── auth/          # ScaleKit OAuth flow
│   ├── chat/          # AI message handler
│   ├── conversations/ # Conversation management
│   ├── knowledge/     # Knowledge CRUD + CSV upload
│   ├── metadata/      # Workspace metadata
│   └── widget/        # Widget config (public + private)
├── dashboard/         # Protected business dashboard
├── widget/embed/      # Public iframe page
└── page.tsx           # Landing page

components/
├── dashboard/         # Dashboard UI components
├── landing/           # Landing page sections
├── ui/                # shadcn/ui base components
└── widget/            # ChatWidget component

db/
├── client.ts          # Neon + Drizzle client
└── schema.ts          # Database schema

lib/
├── isAuthorized.ts    # Session validation
├── openAI.ts          # OpenRouter AI calls
├── scalekit.ts        # ScaleKit client
└── utils.ts           # Tailwind utility

public/
└── widget.js          # Embeddable script (vanilla JS)
```
