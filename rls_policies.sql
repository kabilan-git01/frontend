DO $$
DECLARE
    t text;
    tables text[] := ARRAY['members', 'enquiries', 'contact_enquiries', 'testimonials', 'trainers', 'plans', 'membership_plans', 'programs'];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        -- Check if table exists in public schema
        IF EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = t
        ) THEN
            -- 1. Add user_id column if it doesn't exist
            EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id)', t);
            
            -- 2. Enable RLS
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
            
            -- 3. Drop legacy public policies (if they exist)
            EXECUTE format('DROP POLICY IF EXISTS "Allow public read access" ON public.%I', t);
            EXECUTE format('DROP POLICY IF EXISTS "Allow public inserts" ON public.%I', t);
            EXECUTE format('DROP POLICY IF EXISTS "Allow admin updates/deletes" ON public.%I', t);
            
            EXECUTE format('DROP POLICY IF EXISTS "Users can only view their own %s" ON public.%I', t, t);
            EXECUTE format('DROP POLICY IF EXISTS "Users can only insert their own %s" ON public.%I', t, t);
            EXECUTE format('DROP POLICY IF EXISTS "Users can only update their own %s" ON public.%I', t, t);
            EXECUTE format('DROP POLICY IF EXISTS "Users can only delete their own %s" ON public.%I', t, t);
            
            -- 4. Create new security policies
            EXECUTE format('CREATE POLICY "Users can only view their own %s" ON public.%I FOR SELECT USING (auth.uid() = user_id)', t, t);
            EXECUTE format('CREATE POLICY "Users can only insert their own %s" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t, t);
            EXECUTE format('CREATE POLICY "Users can only update their own %s" ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t, t);
            EXECUTE format('CREATE POLICY "Users can only delete their own %s" ON public.%I FOR DELETE USING (auth.uid() = user_id)', t, t);
            
            RAISE NOTICE 'Successfully applied RLS policies to table public.%', t;
        ELSE
            RAISE NOTICE 'Table public.% does not exist, skipping.', t;
        END IF;
    END LOOP;
END;
$$;
