# PyPath working agreement

This is Harsh's private learning notebook. Use a dark charcoal/black theme with warm skin/peach accents, readable light text, and polished animations. Keep the layout uncluttered, respect reduced-motion preferences, and avoid green or sage themes. Work locally unless deployment is explicitly requested.

## Adding notes

When Harsh supplies rough study notes, locate the matching stable topic ID in `content/roadmap.ts` and add or merge its entry in `content/notes.json`. Preserve his intended understanding, correct errors, and expand into useful detailed reference notes. Use sections for explanation, examples, common mistakes, good practices, and an "Under the hood" section where appropriate. Do not fabricate notes for topics he has not studied. Do not mark checklist items complete on his behalf unless requested.

Notes schema: `{ "topic-id": { "updated": "YYYY-MM-DD", "sections": [{ "title": "...", "paragraphs": ["..."], "code": "optional Python code" }] } }`.

The notes API reads this JSON on refresh. Keep notes server-side. Preserve topic IDs and subtopic order once progress exists; progress keys contain topic IDs and subtopic indices. Append new concepts rather than silently reordering old ones.

## Local state

Preserve `data/` and `.env.local`. Never commit passwords, password hashes, session keys, or learning progress. Do not replace real progress with demonstration data. Notes are source-managed; progress is independent and stored on disk.

DSA and AI/ML are intentionally Coming Soon. Python includes fundamentals, internals, good practices, tooling, and advanced topics. Study happens through ChatGPT and YouTube; coding practice happens in VS Code. Revision is a manual list.

## Validation

Run a type check and production build after code changes. Verify relevant UI behaviour locally. Keep the development server available for the user. Deployment will need a deliberate storage and authentication migration based on the chosen host; the current filesystem store is for the local Node server.

