-- SQL script to add a sample staff profile
-- Note: In Supabase, the 'id' must correspond to a user in auth.users.
-- If you are just testing, you can use a placeholder ID if you temporary disable the FK constraint,
-- but the recommended way is to use a real User ID from your Supabase Authentication tab.

-- 1. Create a sample profile (replace 'YOUR_USER_ID' with a real UUID from Auth > Users)
-- INSERT INTO profiles (id, name, email, role, avatar_url, department, title)
-- VALUES (
--     'YOUR_USER_ID', 
--     'Staff Reporter', 
--     'staff@palawandaily.com', 
--     'writer', 
--     'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
--     'Editorial',
--     'Senior Staff Reporter'
-- );

-- 2. Link an article to this profile
-- UPDATE articles 
-- SET author_id = 'YOUR_USER_ID'
-- WHERE slug = 'pbbm-signs-infrastructure-growth-act';

-- If you want to see the profiles table structure:
-- SELECT * FROM profiles;
