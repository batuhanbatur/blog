-- REVIEW ONLY. Replace the placeholder with Authentication > Users > your UUID.
-- Run on the BLOG project only, after reviewing the rollout guide.
-- Transactional: any error rolls back every policy change.
BEGIN;
DO $migration$
DECLARE
  admin_id uuid := 'REPLACE_WITH_YOUR_USER_UUID';
  table_name text;
  operation text;
  owner_check text;
  storage_check text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = admin_id) THEN
    RAISE EXCEPTION 'Configured blog owner does not exist';
  END IF;
  owner_check := format('(select auth.uid()) = %L::uuid', admin_id);

  FOREACH table_name IN ARRAY ARRAY[
    'articles', 'daily_messages', 'status_updates', 'collections', 'gif_triggers'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    -- RESTRICTIVE guards are ANDed with existing permissive policies.
    -- Keeping old read policies preserves their publication/active filters.
    FOREACH operation IN ARRAY ARRAY['INSERT', 'UPDATE', 'DELETE'] LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I',
        'blog_owner_guard_' || lower(operation), table_name);
      EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR %s TO public %s',
        'blog_owner_guard_' || lower(operation), table_name, operation,
        CASE operation
          WHEN 'INSERT' THEN 'WITH CHECK (' || owner_check || ')'
          WHEN 'UPDATE' THEN 'USING (' || owner_check || ') WITH CHECK (' || owner_check || ')'
          ELSE 'USING (' || owner_check || ')'
        END);
    END LOOP;
    EXECUTE format('DROP POLICY IF EXISTS blog_owner_access ON public.%I', table_name);
    EXECUTE format('CREATE POLICY blog_owner_access ON public.%I FOR ALL TO authenticated USING (%s) WITH CHECK (%s)',
      table_name, owner_check, owner_check);
  END LOOP;

  -- Restrict writes only in article-audio; leave other buckets untouched.
  storage_check := '(bucket_id <> ''article-audio'' OR (' || owner_check || '))';
  FOREACH operation IN ARRAY ARRAY['INSERT', 'UPDATE', 'DELETE'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects',
      'blog_audio_owner_guard_' || lower(operation));
    EXECUTE format('CREATE POLICY %I ON storage.objects AS RESTRICTIVE FOR %s TO public %s',
      'blog_audio_owner_guard_' || lower(operation), operation,
      CASE operation
        WHEN 'INSERT' THEN 'WITH CHECK (' || storage_check || ')'
        WHEN 'UPDATE' THEN 'USING (' || storage_check || ') WITH CHECK (' || storage_check || ')'
        ELSE 'USING (' || storage_check || ')'
      END);
  END LOOP;
  EXECUTE 'DROP POLICY IF EXISTS blog_audio_owner_access ON storage.objects';
  EXECUTE format('CREATE POLICY blog_audio_owner_access ON storage.objects FOR ALL TO authenticated USING (bucket_id = ''article-audio'' AND (%s)) WITH CHECK (bucket_id = ''article-audio'' AND (%s))',
    owner_check, owner_check);
END
$migration$;
COMMIT;
