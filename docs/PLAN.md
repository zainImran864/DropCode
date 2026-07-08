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
| Auth | **NextAuth v4** (credentials + optional OAuth) | Already installed. |
| Database | **MongoDB + Mongoose** | Workspaces, members, files, versions, users. |
| File uploads (avatars/assets) | **UploadThing** | Already installed. |
| UI | **Tailwind v4 + Radix (dialog/dropdown/toast) + Sonner** | Already installed. |
| Validation / forms | **Zod + React Hook Form** | Already installed. |

### Redundant dependencies to REMOVE
Using three real-time stacks fights itself. Since we standardize on Liveblocks:

- ❌ `y-websocket` — replaced by `@liveblocks/yjs` transport
- ❌ `socket.io`, `socket.io-client` — Liveblocks covers presence/broadcast; WebRTC covers voice
- ⚠️ `multer` — not needed with UploadThing (Next 16 route handlers + UploadThing)
- ⚠️ `mongodb` — Mongoose bundles its own driver; keep only if you need raw driver access

> `yjs` stays (used by `@liveblocks/yjs`).

### Dependencies to ADD
```bash
bun add @liveblocks/yjs @liveblocks/node y-monaco next-themes
# next-themes → dark/light theme
# @liveblocks/node → server-side room auth
# y-monaco → binds the Yjs doc to the Monaco editor model
```

Optional later: `simple-peer` (if native WebRTC gets verbose), `nanoid` (share links).

---

## 2. Environment Variables (`.env.local`)
```
# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Database
MONGODB_URI=

# Liveblocks
LIVEBLOCKS_SECRET_KEY=sk_...
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...   # or use auth-endpoint only

# UploadThing
UPLOADTHING_TOKEN=

# Code execution
PISTON_URL=https://emkc.org/api/v2/piston   # or self-hosted URL
```

---

## 3. Data Model (Mongoose)

- **User** — `name, email, passwordHash, image, createdAt`
- **Workspace** — `name, ownerId, language, inviteToken, members[{ userId, role: owner|admin|editor|viewer }], settings{ theme, autoSave }, createdAt`
- **File** — `workspaceId, path, name, language, content(latest snapshot), updatedAt`
- **Version** — `fileId, workspaceId, authorId, content, message, createdAt`  ← version history
- **Message** — `workspaceId, authorId, body, createdAt`  (optional persistence; live chat via Liveblocks)

Max-4 enforcement: reject invite/join when `members.length >= 4`.

---

## 4. Phased Roadmap

Each phase is shippable and testable on its own.

### Phase 0 — Foundation & cleanup  ✅ *(scaffold already exists)*
- [ ] Remove redundant deps (§1), add new deps (§1)
- [ ] Add `.env.local` (§2), create `lib/env.ts` (Zod-validated env)
- [ ] Mongo connection helper (`lib/db.ts` with global cached connection)
- [ ] Base UI: theme provider (`next-themes`), Sonner toaster, layout shell
- [ ] Wipe boilerplate `page.tsx` → landing page
- **Done when:** app boots, connects to Mongo, dark/light toggle works.

### Phase 1 — Auth & Login  → *Feature: Login*
- [ ] NextAuth config (credentials provider; add Google OAuth optionally)
- [ ] `bcryptjs` password hashing, register + login pages (RHF + Zod)
- [ ] Session middleware / protected routes, `useSession` helpers
- **Done when:** user can sign up, log in, log out; sessions persist.

### Phase 2 — Workspaces  → *Create Workspace, Owner/Admin Permissions*
- [ ] CRUD API routes: create / list / get / delete workspace
- [ ] Dashboard: list my workspaces, "New Workspace" dialog (pick language)
- [ ] Role model (owner/admin/editor/viewer) + permission guards
- **Done when:** owner can create workspaces and see them on a dashboard.

### Phase 3 — Invites & Sharing  → *Invite Members, Join via Link, Share Workspace*
- [ ] Generate `inviteToken` (nanoid); `/join/[token]` page
- [ ] Join flow enforces **max 4 members**; assign default role (editor/viewer)
- [ ] Share dialog: copy link, manage members, change roles, remove member
- **Done when:** a second account can join via link and appears as a member.

### Phase 4 — Editor + Real-Time Core  → *Real-Time Editing, Live Cursors, Presence, Syntax Highlighting, Multiple Languages*
- [ ] Liveblocks setup: `liveblocks.config.ts`, `RoomProvider`, auth endpoint (`@liveblocks/node`)
- [ ] Monaco editor component; bind Yjs doc via `@liveblocks/yjs` + `y-monaco`
- [ ] Presence: avatars of who's online; live remote cursors + selections
- [ ] Language switcher → Monaco language + Piston language mapping
- **Done when:** two browsers editing the same file see each other's text, cursors, and presence live.

### Phase 5 — Files & Persistence  → *File Explorer, Save Code, Auto Save, Export Code*
- [ ] File explorer sidebar (create / rename / delete files, tree view)
- [ ] Save snapshot to Mongo (manual **Save** + debounced **Auto Save**)
- [ ] Export: download single file or whole workspace as `.zip`
- **Done when:** files persist across reloads; auto-save writes snapshots; export downloads.

### Phase 6 — Run Code  → *Run Code*
- [ ] `POST /api/run` → Piston (`runCode(language, source, stdin)` interface)
- [ ] Output/console panel (stdout, stderr, exit code, time)
- [ ] Language/version mapping table (Monaco ↔ Piston)
- **Done when:** clicking Run executes current file and streams output to the panel.

### Phase 7 — Chat & Presence UX  → *Chat Sidebar*
- [ ] Chat sidebar using Liveblocks broadcast (optionally persist to Mongo)
- [ ] Typing indicators, unread badge
- **Done when:** members chat in real time inside the workspace.

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
- [ ] Empty states, loading skeletons, error boundaries, toasts
- [ ] Rate-limit `/api/run`, sanitize inputs, secure Liveblocks auth per-room
- [ ] Responsive layout, keyboard shortcuts, a11y pass
- [ ] Deploy to Vercel; self-host Piston if public rate limits bite
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

## 6. Suggested Folder Structure
```
app/
  (auth)/login, /register
  (app)/dashboard
  (app)/workspace/[id]        # editor room
  join/[token]
  api/
    auth/[...nextauth]
    liveblocks-auth            # room authorization
    workspaces/...
    run                        # Piston proxy
    uploadthing
components/
  editor/  explorer/  chat/  voice/  presence/  ui/
lib/
  db.ts  env.ts  auth.ts  liveblocks.ts  piston.ts  permissions.ts
models/                        # Mongoose schemas
```

---

## 7. Open Risks / Notes
- **Public Piston API is rate-limited** — fine for dev; self-host Docker for production.
- **WebRTC mesh** is fine at ≤4 peers (our cap); don't scale it beyond that.
- **Liveblocks free tier** limits monthly MAUs/connections — verify against expected usage.
- Keep the **max-4 rule enforced server-side** (join API), not just in UI.
- Persisted Mongo snapshot is the source of truth; the live Yjs doc is ephemeral — reconcile on room load.
