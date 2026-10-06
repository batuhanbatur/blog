# Blog security rollout guide

The SQL is a manual migration template; code deployment does not apply it automatically.
On 2026-10-07, the owner rules were applied to the blog project and public signup was disabled.
The owner UUID was configured in local development and all Vercel environments.
Pizza God is outside this patch.

## What changes

- The shared API authorization helper now accepts only the verified Supabase user whose UUID matches the server-only BLOG_ADMIN_USER_ID environment variable. Missing configuration denies access. This covers classify, suggest-tag and collection-description.
- Audio generation returns HTTP 410 without calling ElevenLabs or Supabase. The editor keeps existing audio playback and removes generation controls.
- The manual SQL script adds restrictive owner-only INSERT, UPDATE and DELETE guards to articles, daily_messages, status_updates, collections and gif_triggers, plus owner access. Existing public SELECT policies are retained. No survey policy is changed.
- Audio storage write guards restrict article-audio to the same owner, including updates/moves. Existing public playback remains available. Other buckets are unchanged.

These are RESTRICTIVE policies, combined with AND, unlike the default permissive policies combined with OR. They intentionally constrain existing broad write policies. The service role bypasses RLS; never expose its key in the browser. Future policy changes must retain the guards.

## Rollout procedure

1. In the blog project's Authentication > Users, confirm the expected account and copy its UUID. Review any unexpected accounts separately.
2. Use that same UUID for BLOG_ADMIN_USER_ID in local .env.local and the appropriate Vercel environments. Do not use a NEXT_PUBLIC_ prefix. Do not deploy without it: admin AI tools will reject requests.
3. Export the current public/storage policy definitions for a rollback reference. Test on a disposable database or staging project first.
4. Replace REPLACE_WITH_YOUR_USER_UUID in supabase/manual/20261007_owner_only_writes.sql. The script deliberately fails before changes if left unconfigured or if the user does not exist. Run it only against the blog project after review.
5. Authentication > Sign In / Providers: turn off Allow new users to sign up and save. Existing account login is retained. This setting does not substitute for RLS and does not remove existing accounts.
6. Deploy the reviewed code. Revoke the unused ElevenLabs key in ElevenLabs and remove ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID from Vercel/local environments. Check other uses before removing SUPABASE_SERVICE_ROLE_KEY; this code no longer needs it for audio.
7. Verify public article/status/collection reads and existing audio playback. Verify the owner can create, edit and delete disposable test content, and use retained AI tools. Verify anonymous and a separate non-owner account cannot write those tables or upload/delete audio. Test on staging with disposable data; do not modify real content as an attack test.
8. Check intentional survey submissions still succeed and responses remain private. Confirm audio POST returns 410 and makes no provider call. Watch logs for unexpected authorization failures.

## Local checks

Run: node --experimental-test-module-mocks --test tests/admin-access.test.mjs

The API tests use mocked authentication; they do not call live services. Both tests pass.

The policy test passed 67 assertions in isolated PostgreSQL (PGlite), including anonymous/non-owner denial, owner writes, unchanged public reads and survey insertion, storage bucket moves, repeated migration application, and failure of the unconfigured placeholder. It uses a simplified schema with deliberately broad existing policies; it is not a clone of production.

To repeat without adding a project dependency:

```sh
npm install --prefix /tmp/blog-policy-check --ignore-scripts --no-audit --no-fund @electric-sql/pglite@0.5.8
PGLITE_MODULE=/tmp/blog-policy-check/node_modules/@electric-sql/pglite/dist/index.js node tests/policy-check.mjs
```

The article editor has one pre-existing lint error (react-hooks/set-state-in-effect) and two pre-existing warnings. These were reproduced on the unchanged HEAD version; the other changed JavaScript files pass lint. The production build passed on 2026-10-07. Deployment verification follows the rollout.

The production policy catalog was checked after application: each protected table and storage.objects has three restrictive guards using the correct owner UUID. Live endpoint checks and any remaining credential cleanup are tracked separately during deployment.

## Rollback

Keep an export of the previous policies before rollout. If owner access fails, first check the configured UUID rather than removing the guards. A full policy rollback requires restoring the captured definitions and removing the new blog_owner_guard_*, blog_owner_access, blog_audio_owner_guard_* and blog_audio_owner_access policies. This reopens the previous write exposure. Code can be reverted independently; do not restore audio generation with a revoked provider key.
