-- SQL Script to create authors table and populate with mock data
-- This helps migrate the Admin Dashboard users to Supabase

-- 1. Create the authors table (if you prefer a dedicated table over 'profiles')
CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'writer',
    avatar_url TEXT,
    department TEXT,
    title TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Insert mock employees
INSERT INTO authors (name, email, role, avatar_url, department, title) VALUES
('Kent Janaban', 'kent.janaban@palawandaily.com', 'super_admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', 'management', 'Publisher'),
('Harthwell Capistrano', 'harthwell.capistrano@palawandaily.com', 'super_admin', NULL, 'management', 'Editor in Chief / Co-founder'),
('Clarina Herrera Guludah', 'clarina.herrera.guludah@palawandaily.com', 'super_admin', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', 'management', 'Broadcast Journalist / Co-founder'),
('Rexcel John Sorza', 'rexcel.john.sorza@palawandaily.com', 'super_admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', 'management', 'Editorial Consultant'),
('Atty. Analisa Navarro - Padon', 'atty.analisa.navarro.-.padon@palawandaily.com', 'super_admin', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', 'management', 'Legal Counsel'),
('Sevedeo Borda III', 'sevedeo.borda.iii@palawandaily.com', 'editor', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', 'news', 'Managing Editor'),
('Hanna Camella Talabucon', 'hanna.camella.talabucon@palawandaily.com', 'editor', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', 'news', 'Associate Editor'),
('Gerardo Reyes Jr.', 'gerardo.reyes.jr.@palawandaily.com', 'writer', 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face', 'news', 'Journalist'),
('John Castor Viernes', 'john.castor.viernes@palawandaily.com', 'writer', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', 'news', 'Sales & Marketing / Journalist'),
('Maria Santos', 'maria.santos@palawandaily.com', 'writer', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face', 'news', 'Senior Journalist'),
('Mechael Glen Dagot', 'mechael.glen.dagot@palawandaily.com', 'writer', NULL, 'digital', 'Circulation Officer'),
('Carlos dela Cruz', 'carlos.dela.cruz@palawandaily.com', 'writer', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop&crop=face', 'digital', 'Digital Content Manager'),
('Ana Bautista', 'ana.bautista@palawandaily.com', 'writer', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face', 'digital', 'Social Media Editor'),
('Roberto Cruz', 'roberto.cruz@palawandaily.com', 'writer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', 'online-radio', 'Online Radio Host'),
('Liza Garcia', 'liza.garcia@palawandaily.com', 'writer', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face', 'online-radio', 'Online Radio Producer'),
('Miguel Torres', 'miguel.torres@palawandaily.com', 'writer', 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face', 'creatives', 'Video Producer'),
('Sofia Reyes', 'sofia.reyes@palawandaily.com', 'writer', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', 'creatives', 'Motion Designer'),
('Jose Reyes', 'jose.reyes@palawandaily.com', 'writer', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', 'online-tv', 'Online TV Anchor')
ON CONFLICT (email) DO NOTHING;

-- 3. Update articles to link to these authors by email/name matching
-- (This is just an example, usually handled via your service layer or migration script)
