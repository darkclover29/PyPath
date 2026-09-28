# PyPath

Personal Python notebook and roadmap. Local-only first version; nothing has been deployed.

## Run locally

Use Node.js 24 or later. Run `npm ci`, then `npm run dev`. Open http://127.0.0.1:5173.

The password hash is configured in the ignored `.env.local` file as `PYPATH_PASSWORD_HASH`. It is generated with Node's `scryptSync(password, 'pypath-local-v1', 32).toString('hex')`. The plaintext password is never shipped to the browser.

## Content and progress

- `content/roadmap.ts`: 51 topics across nine chapters, with stable topic IDs and concept checklists.
- `content/notes.json`: curated notes keyed by topic ID. Notes have `updated` (date string) and `sections`, each containing `title`, optional `paragraphs` (string array), and optional `code` (string). Add notes here after the user shares them in Codex. The authenticated API reads the file on refresh; notes are never imported into a public client bundle.
- `data/progress.json`: saved current topic, concept/milestone checks, and manual revision list. Atomic file replacement protects against partial writes.
- `data/session-key`: signing secret created at first start. Both data files are ignored by Git. Preserve the entire data directory and `.env.local` when backing up or moving the local app.

Each topic completes when every concept and all three milestones are checked. Revision is manually added and manually marked reviewed. No scheduled reminders or AI APIs are connected.

## Cloudflare deployment

PyPath deploys as a Cloudflare Worker. Checklist progress and revision data live in the `pypath-progress` D1 database; the roadmap and curated notes remain in this repository.

1. Create a D1 database named `pypath-progress` and copy its database ID into `wrangler.jsonc`.
2. Apply `migrations/0001_pypath_state.sql` with `wrangler d1 migrations apply pypath-progress --remote`.
3. Add `PYPATH_PASSWORD_HASH` and a long random `PYPATH_SESSION_SECRET` with `wrangler secret put`.
4. Run `npm run cf:deploy` to deploy the Worker.
5. In Cloudflare, attach your domain from the Worker's **Settings → Domains & Routes** screen.

Do not commit `.env.local`, D1 database IDs belonging to another account, passwords, password hashes, or session secrets.

## Verification

`node node_modules/typescript/bin/tsc --noEmit` checks types. `npm run build` creates the local production build. Login and workspace APIs enforce server-side authentication; writes also require a matching Origin header. Incorrect passwords are rate limited in the running server process.
