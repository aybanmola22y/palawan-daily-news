-- 
-- PALAWAN DAILY NEWS - SEED DATA
-- 

-- 1. CATEGORIES
insert into categories (id, name, slug, description, color) values
(1, 'Provincial News', 'provincial-news', 'News from the province of Palawan', 'blue'),
(2, 'City News', 'city-news', 'News from around the city', 'emerald'),
(3, 'Puerto Princesa City', 'puerto-princesa-city', 'Specific updates from the capital', 'indigo'),
(4, 'Police Report', 'police-report', 'Latest police and crime reports', 'red'),
(5, 'National News', 'national', 'News from across the Philippines', 'slate'),
(6, 'Feature', 'feature', 'Special features and long-form stories', 'purple'),
(7, 'Press Release', 'press-release', 'Official press releases', 'gray'),
(8, 'Environment', 'environment', 'Environmental and conservation news', 'green'),
(9, 'Column', 'column', 'Columns and recurring sections', 'amber'),
(10, 'Opinion', 'opinion', 'Editorials and opinion pieces', 'red'),
(11, 'Lifestyle', 'lifestyle', 'Health, travel, and lifestyle', 'pink'),
(12, 'Advertise', 'advertise', 'Advertising info', 'gray'),
(13, 'Legal Section', 'legal', 'Legal notices', 'slate'),
(14, 'International News', 'international', 'World news and global updates', 'sky'),
(15, 'Editorial', 'editorial', 'The Editorial Board''s perspectives', 'indigo'),
(16, 'Regional News', 'regional-news', 'Updates from across the MIMAROPA region', 'orange'),
(17, 'Youth & Campus', 'youth-campus', 'Campus news and youth-oriented stories', 'pink'),
(18, 'Tourism', 'tourism', 'Explore the beauty and attractions of Palawan', 'teal'),
(19, 'Technology', 'technology', 'Tech news, innovation, and digital trends', 'blue'),
(20, 'Business', 'business', 'Economic updates and business highlights', 'emerald'),
(21, 'Sports', 'sports', 'Local and national sports updates', 'orange')
on conflict (slug) do update set
name = excluded.name,
description = excluded.description,
color = excluded.color;

-- 2. ADS
insert into ads (id, type, fit, active, label, sublabel) values
('home-billboard', 'billboard', 'cover', false, 'BILLBOARD ADVERTISEMENT SPACE', 'Get your brand in front of thousands of daily readers'),
('home-leaderboard', 'leaderboard', 'cover', false, 'LEADERBOARD ADVERTISEMENT SPACE', 'Contact us at ads@palawandaily.com for rates'),
('article-sidebar', 'sidebar', 'cover', false, 'SIDEBAR ADVERTISEMENT SPACE', 'Contact us at ads@palawandaily.com for rates')
on conflict (id) do nothing;

-- 3. PROFILES (Note: ID must match a real UUID from auth.users)
-- Once you create your user in Supabase Auth, you can link it:
-- insert into profiles (id, name, email, role) values ('YOUR-UUID', 'Admin User', 'admin@palawandaily.com', 'super_admin');

-- 4. ARTICLES (Sample selection to get started)
insert into articles (id, title, slug, excerpt, content, featured_image, category_id, status, featured, breaking, views, published_at, tags) values
(1, 'Palawan Named World''s Best Island for the 7th Consecutive Year', 'palawan-named-worlds-best-island-seven-year', 'Travel + Leisure magazine has once again crowned Palawan as the world''s best island, cementing its status as a premier global destination.', '<p>Palawan has once again been crowned the world''s best island by Travel + Leisure magazine...</p>', 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200&h=600&fit=crop', 18, 'published', true, false, 12450, '2024-03-10T08:00:00Z', '{Palawan, Tourism, Travel, Philippines}'),
(2, 'Underground River Expansion Project Gets Green Light from DENR', 'underground-river-expansion-denr-approval', 'The Department of Environment and Natural Resources has approved a new visitor management system...', '<p>The Department of Environment and Natural Resources (DENR) has given the green light...</p>', 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=400&fit=crop', 8, 'published', false, false, 8920, '2024-03-09T10:30:00Z', '{Underground River, DENR, Environment, UNESCO}'),
(3, 'New Tech Hub to Open in Puerto Princesa, Creating 5,000 Jobs', 'tech-hub-puerto-princesa-five-thousand-jobs', 'A major Philippine IT company has announced plans to establish a technology hub in Puerto Princesa City...', '<p>Ayala Corporation''s technology subsidiary has announced...</p>', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop', 19, 'published', false, true, 6750, '2024-03-08T14:00:00Z', '{Technology, Jobs, Economy, Puerto Princesa}'),
(4, 'Palawan Provincial Budget for 2024 Hits Record PHP 12 Billion', 'palawan-provincial-budget-2024-record-twelve-billion', 'The Palawan Sangguniang Panlalawigan has approved the largest provincial budget in history...', '<p>The Palawan Sangguniang Panlalawigan has ratified...</p>', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop', 1, 'published', false, false, 4320, '2024-03-07T09:00:00Z', '{Budget, Government, Palawan, Politics}'),
(5, 'Palawan Pawnshop Group Posts 40% Profit Surge in Q4 2023', 'palawan-pawnshop-group-forty-percent-profit-surge-q4-2023', 'The Palawan Pawnshop Group continues its impressive growth trajectory...', '<p>Palawan Pawnshop Group Inc. has reported a 40% surge...</p>', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop', 20, 'published', false, false, 3890, '2024-03-06T11:00:00Z', '{Business, Finance, Economy}')
on conflict (slug) do nothing;
