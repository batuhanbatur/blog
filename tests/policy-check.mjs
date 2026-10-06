import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite')
const db = new PGlite()
const owner = '11111111-1111-4111-8111-111111111111'
const other = '22222222-2222-4222-8222-222222222222'
const tables = ['articles', 'daily_messages', 'status_updates', 'collections', 'gif_triggers']
await db.exec(`
CREATE ROLE anon; CREATE ROLE authenticated;
CREATE SCHEMA auth; CREATE SCHEMA storage;
CREATE TABLE auth.users(id uuid PRIMARY KEY);
INSERT INTO auth.users VALUES ('${owner}');
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
GRANT USAGE ON SCHEMA public, auth, storage TO anon, authenticated;
CREATE TABLE storage.objects(id int PRIMARY KEY, bucket_id text NOT NULL);
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
GRANT ALL ON storage.objects TO anon, authenticated;
CREATE POLICY existing_upload ON storage.objects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY existing_delete ON storage.objects FOR DELETE TO authenticated USING (true);
CREATE POLICY existing_update ON storage.objects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY existing_read ON storage.objects FOR SELECT TO public USING (true);
INSERT INTO storage.objects VALUES (1, 'article-audio'), (2, 'other-bucket');
CREATE TABLE public.survey_responses(id int);
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.survey_responses TO anon, authenticated;
CREATE POLICY survey_insert ON public.survey_responses FOR INSERT TO public WITH CHECK (true);
`)
for (const t of tables) await db.exec(`
CREATE TABLE public.${t}(id int PRIMARY KEY, content text);
ALTER TABLE public.${t} ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.${t} TO anon, authenticated;
CREATE POLICY existing_broad_policy ON public.${t} FOR ALL TO public USING (true) WITH CHECK (true);
INSERT INTO public.${t} VALUES (1, 'original');
`)
const source = await readFile(process.argv[2] || new URL('../supabase/manual/20261007_owner_only_writes.sql', import.meta.url), 'utf8')
await assert.rejects(db.exec(source))
await db.exec('ROLLBACK')
const migration = source.replace('REPLACE_WITH_YOUR_USER_UUID', owner)
await db.exec(migration)
await db.exec(migration) // Repeat application must also work.
let checks = 0
const check = (a, b) => { assert.deepEqual(a, b); checks++ }
async function as(role, uid) {
  await db.exec(`RESET ROLE; SET request.jwt.claim.sub = '${uid}'; SET ROLE ${role}`)
}
for (const [role, uid] of [['anon', ''], ['authenticated', other]]) {
  await as(role, uid)
  for (const t of tables) {
    check((await db.query(`SELECT * FROM public.${t}`)).rows.length, 1)
    await assert.rejects(db.exec(`INSERT INTO public.${t} VALUES (2, 'attack')`)); checks++
    check((await db.query(`UPDATE public.${t} SET content = 'attack' RETURNING id`)).rows.length, 0)
    check((await db.query(`DELETE FROM public.${t} RETURNING id`)).rows.length, 0)
  }
  await assert.rejects(db.exec("INSERT INTO storage.objects VALUES (3, 'article-audio')")); checks++
  check((await db.query("UPDATE storage.objects SET bucket_id = 'other-bucket' WHERE id = 1 RETURNING id")).rows.length, 0)
  check((await db.query("DELETE FROM storage.objects WHERE id = 1 RETURNING id")).rows.length, 0)
  await db.exec('INSERT INTO public.survey_responses VALUES (1)')
  check((await db.query('SELECT * FROM public.survey_responses')).rows.length, 0)
}
await as('authenticated', other)
await assert.rejects(db.exec("UPDATE storage.objects SET bucket_id = 'article-audio' WHERE id = 2")); checks++
await db.exec("INSERT INTO storage.objects VALUES (4, 'other-bucket')")
check((await db.query('DELETE FROM storage.objects WHERE id = 4 RETURNING id')).rows.length, 1)
await as('authenticated', owner)
for (const t of tables) {
  check((await db.query(`SELECT content FROM public.${t} WHERE id = 1`)).rows[0].content, 'original')
  await db.exec(`INSERT INTO public.${t} VALUES (2, 'owner')`)
  check((await db.query(`UPDATE public.${t} SET content = 'edited' WHERE id = 2 RETURNING id`)).rows.length, 1)
  check((await db.query(`DELETE FROM public.${t} WHERE id = 2 RETURNING id`)).rows.length, 1)
}
await db.exec("INSERT INTO storage.objects VALUES (3, 'article-audio')")
check((await db.query("UPDATE storage.objects SET bucket_id = 'article-audio' WHERE id = 3 RETURNING id")).rows.length, 1)
check((await db.query('DELETE FROM storage.objects WHERE id = 3 RETURNING id')).rows.length, 1)
console.log(`${checks} policy assertions passed in isolated PostgreSQL (PGlite). No live services contacted.`)
await db.close()
