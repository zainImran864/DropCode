# DropCode — Phased Build Plan

A real-time collaborative code-sharing platform. Multiple people (max **4 per
workspace**) edit code together in the same space, with live cursors, presence,
chat, voice, and code execution.

> **Next.js note:** This repo uses **Next.js 16.2.10 + React 19**, which has
> breaking changes vs. older docs (see [AGENTS.md](../AGENTS.md)). Before writing
> framework-specific code, check `node_modules/next/dist/docs/`.

---

## 1. Architecture Decisions (locked)

| Concern | Choice | Why |
|---|---|---|
| Real-time collaboration | **Liveblocks** (managed) | Presence, live cursors, storage, and Yjs-based text sync in one SDK. Nothing to self-host. Free tier is ample for max-4 rooms. |
| Collaborative text sync | **Yjs via `@liveblocks/yjs`** bound to Monaco (`y-monaco`) | CRDT = conflict-free concurrent edits. Liveblocks provides the transport. |
| Code editor | **Monaco** (`@monaco-editor/react`) | VS Code editor; multi-language + syntax highlighting built in. |
| Presence / cursors / chat | **Liveblocks Presence + Broadcast** | Same room, no extra server. |
| Voice call | **WebRTC** (mesh, ≤4 peers) + Liveblocks broadcast for signaling | Peer-to-peer audio; Liveblocks carries offer/answer/ICE. |
| Code execution ("Run Code") | **Piston** (public `emkc.org` API, self-host later) | Free, many languages, dead-simple request/response. |
| Auth | **Supabase Auth** (`@supabase/ssr`) | Email/password + OAuth, sessions via cookies, SSR-ready. Already installed. |
| Database | **Supabase Postgres** (via `@supabase/supabase-js` + RLS) | Workspaces, members, files, versions. Row-Level Security enforces access. |
| File storage (avatars/assets) | **Supabase Storage** | Same project, RLS-secured buckets. |
| UI | **Tailwind v4 + Radix (dialog/dropdown/toast) + Sonner** | Already installed. |
| Validation / forms | **Zod + React Hook Form** | Already installed. |

> **Why keep Liveblocks with Supabase?** Supabase Realtime does presence/broadcast,
> but has **no CRDT** — concurrent text edits would conflict. Liveblocks' Yjs
> integration is purpose-built for collaborative editors, so we keep it for the
> **editor room** (text sync, cursors, presence, chat, voice signaling). Supabase
> owns **auth, persistent data, and storage**. Clean split, two well-scoped tools.

### Redundant dependencies to REMOVE
Standardizing on **Supabase (backend)** + **Liveblocks (editor realtime)**:

- ❌ `y-websocket` — replaced by `@liveblocks/yjs` transport
- ❌ `socket.io`, `socket.io-client` — Liveblocks covers presence/broadcast; WebRTC covers voice
- ❌ `next-auth` — replaced by Supabase Auth
- ❌ `bcryptjs`, `jsonwebtoken` — Supabase Auth handles hashing + JWTs
- ❌ `mongoose`, `mongodb` — replaced by Supabase Postgres
- ❌ `multer` — replaced by Supabase Storage
- ❌ `uploadthing` — replaced by Supabase Storage

> `yjs` stays (used by `@liveblocks/yjs`).

### Dependencies to ADD
```bash
bun add @liveblocks/yjs @liveblocks/node y-monaco next-themes
# next-themes → dark/light theme
# @liveblocks/node → server-side room auth (verify member belongs to workspace)
# y-monaco → binds the Yjs doc to the Monaco editor model
```
`@supabase/supabase-js` and `@supabase/ssr` are **already installed**.

Optional (only if you want typed SQL / migrations instead of the Supabase JS
client + SQL editor): `drizzle-orm` + `postgres` using `DIRECT_CONNECTION_STRING`
for migrations and `TRANSACTION_POOLER_CONNECTION_STRING` for runtime queries.

Optional later: `simple-peer` (if native WebRTC gets verbose), `nanoid` (share links).

---

## 2. Environment Variables (`.env`)

Supabase vars are **already set** in `.env` (project URL, publishable key, and
Postgres connection strings). Add the Liveblocks + Piston vars.

```
# Supabase (already present) — Auth + Postgres + Storage + Realtime
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
TRANSACTION_POOLER_CONNECTION_STRING=postgresql://...:6543/postgres   # runtime (ORM, optional)
DIRECT_CONNECTION_STRING=postgresql://...:5432/postgres               # migrations (ORM, optional)
SUPABASE_SECRET_KEY=sb_secret_...        # ADD: server-only key for admin actions (never NEXT_PUBLIC)

# Liveblocks — editor real-time (ADD)
LIVEBLOCKS_SECRET_KEY=sk_...

# Code execution (ADD)
PISTON_URL=https://emkc.org/api/v2/piston   # or self-hosted URL
```

> **Secrets hygiene:** `.env` is gitignored (not committed). The DB password and
> `SUPABASE_SECRET_KEY` are server-only — never expose them to the client or prefix
> with `NEXT_PUBLIC_`. **Rotate the DB password** if it has been shared anywhere.
> Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are
> safe in the browser (RLS protects the data).

---

## 3. Data Model (Supabase Postgres + RLS)

Users live in Supabase's built-in `auth.users`. App tables reference `auth.uid()`.

| Table | Columns (key ones) |
|---|---|
| `profiles` | `id (=auth.users.id) PK`, `display_name`, `avatar_url`, `created_at` |
| `workspaces` | `id PK`, `name`, `owner_id → auth.users`, `language`, `invite_token`, `settings jsonb`, `created_at` |
| `workspace_members` | `workspace_id → workspaces`, `user_id → auth.users`, `role (owner\|admin\|editor\|viewer)`, `joined_at`, **UNIQUE(workspace_id, user_id)** |
| `files` | `id PK`, `workspace_id → workspaces`, `path`, `name`, `language`, `content text`, `updated_at` |
| `versions` | `id PK`, `file_id → files`, `workspace_id`, `author_id`, `content`, `message`, `created_at` |
| `messages` | `id PK`, `workspace_id`, `author_id`, `body`, `created_at` (optional persistence; live chat via Liveblocks) |

**Row-Level Security (enable on every table):**
- Read/write a workspace's rows **only if** `auth.uid()` is in `workspace_members` for that `workspace_id`.
- `owner`/`admin` roles gate destructive ops (delete workspace, remove members).
- Use a `is_member(workspace_id)` SQL helper function in policies to keep them DRY.

**Max-4 enforcement:** a `BEFORE INSERT` trigger on `workspace_members` that rejects
when the workspace already has 4 members (defense-in-depth alongside the join API check).

> SQL migrations for these tables + RLS policies land in **Phase 0/2**. Keep them in
> `supabase/migrations/` (or run via the Supabase SQL editor).

---

## 4. Phased Roadmap

Each phase is shippable and testable on its own.

**Progress:** ✅ Phase 0–7 done · ⏭️ **Phase 8 (Voice Call) is next**

### Phase 0 — Foundation & cleanup  ✅ **DONE**
- [x] Remove redundant deps (§1), add new deps (§1) — also added `zustand`
- [x] Env vars (§2); `lib/env.ts` (Zod-validated, public/server split) — added `NEXT_PUBLIC_SITE_URL`
- [x] Supabase clients: `lib/supabase/client.ts` + `server.ts`; **`proxy.ts`** (Next 16 renamed `middleware`) for session refresh
- [x] First SQL migration applied: `profiles` + `handle_new_user` trigger + RLS (verified reachable)
- [x] Base UI: `components/providers.tsx` (next-themes + Sonner + user sync), class-based dark mode, `ThemeToggle`
- [x] Wiped boilerplate `page.tsx` → landing page
- [x] Established layering (`types → api → hooks → store → page`) + per-page folders
- **Done:** app boots, Supabase connects, dark/light toggle works, `bun run build` green.

### Phase 1 — Auth & Login  ✅ **DONE**  → *Feature: Login*
- [x] Supabase email/password sign-up + login (RHF + Zod via `lib/validations/auth.ts`)
- [x] Auth callback route `app/auth/callback/route.ts` (exchanges `code` for session; email-confirm + future OAuth)
- [x] `lib/auth.ts` `getUser()` / `requireUser()` server helpers; route protection in `proxy.ts` **and** `(app)/layout.tsx`
- [x] Sign-out (`LogoutButton`); profile auto-created on signup via DB trigger
- [x] Reusable UI kit: `Button`, `Input`, `Label`, `Card`, `FormField` + `lib/utils.ts` `cn()`
- [x] Protected `dashboard` page showing the signed-in user
- **Done:** sign up → confirm → log in → dashboard → log out; sessions persist; build green.
- **⚠️ Manual setup required (you):** in Supabase → Auth → URL Configuration, add
  `http://localhost:3000` + `https://drop-code-liart.vercel.app` to Site URL & Redirect URLs.
  Set `NEXT_PUBLIC_SITE_URL` per environment. Rotate the DB password (was shared in chat).

### Phase 2 — Workspaces  ✅ **DONE**  → *Create Workspace, Owner/Admin Permissions*
- [x] Migration `0002_workspaces.sql`: `workspaces` + `workspace_members`, RLS, `is_workspace_member()` / `workspace_role()` helpers, auto-owner trigger, **max-4 trigger**
- [x] Server Actions `app/(app)/actions.ts`: create / delete (Zod-validated, `revalidatePath`); api `getWorkspaces` (w/ member counts), `getWorkspaceById`, `buildDashboardData`
- [x] Modern dashboard: **sidebar shell** (`AppShell`/`Sidebar`/`Topbar`, collapsible via `ui-store`), stat cards, **Recharts** area + bar charts, workspace grid + empty state
- [x] "New Workspace" dialog (Radix `Dialog` + RHF/Zod + language `Select`)
- [x] Role checks enforced by RLS; owner-only delete in UI + policy
- [x] Reusable additions: `Dialog`, `Select`, `Skeleton` + content-aware skeletons, `StatCard`, `ChartCard`, chart wrappers; route-level `loading.tsx`
- [x] Workspace route `/workspace/[id]` (access-controlled placeholder; editor is Phase 4)
- **Done:** create → appears on dashboard with live charts/stats → open → delete; build green.
- **⚠️ Manual step (you):** run `supabase/migrations/0002_workspaces.sql` in the Supabase SQL editor.

### Phase 3 — Invites & Sharing  ✅ **DONE**  → *Invite Members, Join via Link, Share Workspace*
- [x] `invite_token` on workspace (DB default); `/join/[token]` page with preview + join
- [x] Migration `0004_invites.sql`: `get_workspace_preview`, `join_workspace` (**max-4 enforced**, default role `editor`), `reset_invite_token` (security-definer RPCs)
- [x] Share dialog: copy link, **reset link**, member list with role change + remove, leave workspace
- [x] Member server actions (`member-actions.ts`) + `use-member-actions` hook; api `getWorkspaceMembers`, `getWorkspacePreview`
- [x] Reusable additions: `Avatar`, `MemberAvatars` stack, `MemberRow`; workspace header with share + avatars
- [x] Logged-out invitees: `/join` → `/login?next=…` → back to join (internal-only redirect guard)
- **Done:** second account opens invite link → joins (blocked at 4) → appears with a role; owners/admins manage roles & remove; build green.
- **⚠️ Manual step (you):** run `supabase/migrations/0004_invites.sql` in the Supabase SQL editor.

### Phase 4 — Editor + Real-Time Core  ✅ **DONE**  → *Real-Time Editing, Live Cursors, Presence, Syntax Highlighting, Multiple Languages*
- [x] `liveblocks.config.ts` (typed UserMeta), `Room` provider, auth endpoint `/api/liveblocks-auth` (`@liveblocks/node`) — verifies `workspace_members`, **read-only grant for `viewer` role**
- [x] `CollaborativeEditor`: Monaco (`@monaco-editor/react`) bound to room Yjs doc via `getYjsProviderForRoom` + `y-monaco`; theme synced to next-themes
- [x] Presence: `PresenceAvatars` (who's online) + live remote cursors/selections via Yjs awareness
- [x] `LanguageSwitcher` (owner/admin) → updates workspace language (Monaco + Piston mapping in `lib/languages.ts`)
- [x] Graceful `LiveblocksSetupNotice` when `LIVEBLOCKS_SECRET_KEY` is absent; full-height editor layout + `EditorSkeleton`
- **Done:** two browsers in the same workspace see each other's text, cursors, and presence live; viewers are read-only; build green. **Liveblocks key is set in `.env`.**

### Phase 5 — Files & Persistence  ✅ **DONE**  → *File Explorer, Save Code, Auto Save, Export Code*
- [x] Migration `0005_files.sql`: `files` table + RLS (members read; editors+ write; viewers read-only)
- [x] File explorer sidebar (create / rename inline / delete), per-file Yjs text (`file:<id>`); active-file `file-store`
- [x] Save snapshot to Postgres — manual **Save** + debounced **Auto-Save** (author-only writes) via `editor-store` + `saveFileAction`
- [x] Export current file (download) + whole workspace as `.zip` (jszip) via `ExportMenu`
- [x] Reusable additions: `DropdownMenu`; editor `EditorToolbar` (save status), `EmptyEditorState`
- **Done:** files persist, auto-save writes snapshots, export downloads; build green.
- **⚠️ Manual step (you):** run `supabase/migrations/0005_files.sql` in the Supabase SQL editor.

#### Production fixes shipped alongside Phase 5
- 🐛 **ROOT CAUSE of the deployed 500 → Vercel build was failing.** `y-monaco` imports `y-protocols/awareness`, but `y-protocols` was only a hoisted transitive dep (present locally, unresolved on Vercel's clean install). Added it as a **direct dependency**. Prod was frozen on an old build until this.
- 🐛 Editor loaded via `next/dynamic({ ssr: false })` (avoids monaco browser-globals during SSR) + resilient `lib/env.ts` (blank/invalid host env vars can't crash a render) + `(app)/error.tsx` boundary.
- 🐛 **Fixed `reset_invite_token`**: `gen_random_bytes()` isn't resolvable under the function's empty `search_path`; switched to `gen_random_uuid()` (`0006_fix_reset_token.sql`).
- **⚠️ To clear the deployed 500:** commit + push (Vercel build will now succeed), run migrations `0005`/`0006`.

### Phase 6 — Run Code  ✅ **DONE**  → *Run Code*
- [x] `runCode(language, source, stdin)` interface (`lib/code-runner.ts`) + `runCodeAction`
- [x] Output/console panel (`OutputPanel`): stdout, stderr, compile output, exit code; `run-store` + `use-run`
- [x] Run button in the editor toolbar (runs active file's live content)
- [x] Language mapping (`lib/languages.ts`: Monaco / Piston / Wandbox)
- ⚠️ **Engine change:** public Piston (`emkc.org`) became **whitelist-only (401) on 2/15/2026**. Default runner is now **Wandbox** (free, no key) — it resolves a real compiler id from Wandbox's live `list.json` per language (no hardcoded ids). Set `PISTON_URL` to a **self-hosted Piston** to use Piston instead.
- **Done:** clicking Run executes the current file and shows output; build green.

### Phase 7 — Chat & Presence UX  ✅ **DONE**  → *Chat Sidebar*
- [x] Chat sidebar using **Liveblocks Storage** (`LiveList<ChatMessage>`) — real-time + persists in the room, no DB
- [x] Typing indicators (Liveblocks Presence `typing`) + unread badge on the toolbar toggle (`chat-store`)
- [x] Reusable `Avatar`-based message rows; open/close from the editor toolbar
- **Done:** members chat in real time inside the workspace; build green.

### Phase 8 — Voice Call (optional)  → *Voice Call*
- [ ] WebRTC mesh (≤4 peers), audio only
- [ ] Signaling over Liveblocks broadcast (offer/answer/ICE)
- [ ] Mute / join / leave controls, speaking indicator
- **Done when:** members hear each other; mute/leave works.

### Phase 9 — Version History & Read-only  → *Version History, Read-only Mode*
- [ ] Save named versions; history panel with diff + restore
- [ ] Read-only mode (viewer role or toggle) disables editing but keeps presence
- **Done when:** you can view past versions, restore one, and viewers can't edit.

### Phase 10 — Polish & Deploy
- [x] Redesigned **landing page** — hero with faux-editor preview, feature grid, gradient CTA (`components/landing/*`)
- [x] Empty states, loading skeletons, error boundary (`(app)/error.tsx`), toasts
- [ ] Rate-limit the run action, sanitize inputs, secure Liveblocks auth per-room
- [ ] Responsive layout polish, keyboard shortcuts, a11y pass
- [x] Deploying to Vercel (build fixed via `y-protocols` direct dep)
- **Done when:** end-to-end demo works on a deployed URL.

---

## 5. Feature → Phase Map

| Feature | Phase |
|---|---|
| Login | 1 |
| Create Workspace | 2 |
| Owner/Admin Permissions | 2 |
| Invite Members | 3 |
| Join via Link | 3 |
| Share Workspace | 3 |
| Real-Time Code Editing | 4 |
| Live Cursor Positions | 4 |
| Presence (who is online) | 4 |
| Multiple Programming Languages | 4 |
| Syntax Highlighting | 4 |
| File Explorer | 5 |
| Save Code | 5 |
| Auto Save | 5 |
| Export Code | 5 |
| Run Code | 6 |
| Chat Sidebar | 7 |
| Voice Call (optional) | 8 |
| Version History | 9 |
| Read-only Mode | 9 |
| Dark/Light Theme | 0 |

---

## 6. Folder Structure & Architecture Convention

**Layering (strict, one direction of dependency):**
`types → api → hooks → store → page`

- **`types/`** — pure TypeScript types/interfaces. No imports from other layers.
- **`api/`** — data-access functions (Supabase queries, Piston calls). No React, no state. Returns typed data.
- **`store/`** — Zustand stores holding client state.
- **`hooks/`** — React hooks that bridge `api`/Supabase realtime into `store` for components.
- **pages/components** — consume hooks + store only; never call the DB directly.

**Every page gets its own folder** under `app/` (App Router convention), with
page-specific components colocated inside that folder. Shared, cross-page
components live under `components/`.

```
app/
  page.tsx                     # "/" landing
  (auth)/
    login/page.tsx             # each page = its own folder
    register/page.tsx
  auth/callback/route.ts       # Supabase OAuth/email confirm callback
  (app)/
    dashboard/page.tsx
    workspace/[id]/page.tsx    # editor room (+ colocated components)
  join/[token]/page.tsx
  api/
    liveblocks-auth/route.ts   # room authorization (checks workspace_members)
    run/route.ts               # Piston proxy
proxy.ts                       # (Next 16: was middleware.ts) session refresh + route protection
types/          database.ts    # domain types
api/            profile.ts …   # data-access layer
store/          user-store.ts …# zustand
hooks/          use-user.ts …  # react bindings
components/
  providers.tsx  theme-toggle.tsx
  editor/  explorer/  chat/  voice/  presence/  ui/
lib/
  env.ts  supabase/client.ts  supabase/server.ts
  liveblocks.ts  piston.ts  permissions.ts
supabase/
  migrations/                  # SQL: tables, RLS policies, triggers
```

---

## 7. Open Risks / Notes
- **Public Piston API is rate-limited** — fine for dev; self-host Docker for production.
- **WebRTC mesh** is fine at ≤4 peers (our cap); don't scale it beyond that.
- **Liveblocks free tier** limits monthly MAUs/connections — verify against expected usage.
- Keep the **max-4 rule enforced server-side** — both the join API **and** the DB trigger (§3), not just UI.
- Persisted **Postgres** snapshot (`files.content`) is the source of truth; the live Yjs doc is ephemeral — load DB content into the Yjs doc on room init, and write snapshots back on save/autosave.
- **RLS is the real security boundary** — the browser holds only the publishable key, so every table must have policies. Test them; a missing policy = data leak.
- **Rotate the Supabase DB password** if the connection string was ever shared. Keep `SUPABASE_SECRET_KEY` server-only.
