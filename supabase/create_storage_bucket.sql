-- SQL script to create the 'avatars' storage bucket
-- Run this in your Supabase SQL Editor

-- 1. Create a storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up Public Access Policy (Anyone can see avatars)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 3. Set up Upload Policy (Authenticated users can upload)
CREATE POLICY "Full Access to Authenticated Users"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'avatars' )
WITH CHECK ( bucket_id = 'avatars' );

-- 4. Set up Delete Policy (Authenticated users can delete)
-- (Handled by the "Full Access" policy above if FOR ALL is used)
