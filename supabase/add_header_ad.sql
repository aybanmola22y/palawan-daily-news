-- SQL script to add the home-header advertisement slot
-- Run this in your Supabase SQL Editor

INSERT INTO ads (id, type, fit, active, label, sublabel)
VALUES (
    'home-header', 
    'header', 
    'cover', 
    true, 
    'Be a certified safety officer', 
    'Attend our online and face-to-face training.'
)
ON CONFLICT (id) DO UPDATE SET
    type = EXCLUDED.type,
    label = EXCLUDED.label,
    sublabel = EXCLUDED.sublabel,
    active = EXCLUDED.active;
