-- 
-- PALAWAN DAILY NEWS - STORAGE SETUP
-- 

-- 1. Create a public bucket for uploads
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- 2. Allow public to see files
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'uploads' );

-- 3. Allow authenticated users (Admins) to upload files
-- We use the Service Role key in the backend, which bypasses RLS,
-- but having a policy is good practice.
create policy "Admin Upload Access"
on storage.objects for insert
with check (
  bucket_id = 'uploads' AND
  (exists (
    select 1 from profiles
    where id = auth.uid()
    and role in ('super_admin', 'editor')
  ))
);

-- 4. Allow admins to delete files
create policy "Admin Delete Access"
on storage.objects for delete
using (
  bucket_id = 'uploads' AND
  (exists (
    select 1 from profiles
    where id = auth.uid()
    and role in ('super_admin', 'editor')
  ))
);
