-- 
-- PALAWAN DAILY NEWS - SUPABASE SCHEMA
-- 

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES

-- Categories Table
create table if not exists categories (
    id serial primary key,
    name text not null,
    slug text not null unique,
    description text,
    color text default 'blue',
    created_at timestamptz default now()
);

-- Profiles Table (Link to Supabase Auth)
create table if not exists profiles (
    id uuid references auth.users on delete cascade primary key,
    name text not null,
    email text not null,
    role text default 'writer', -- super_admin, editor, writer
    avatar_url text,
    department text,
    title text,
    active boolean default true,
    created_at timestamptz default now()
);

-- Articles Table
create table if not exists articles (
    id serial primary key,
    title text not null,
    slug text not null unique,
    excerpt text,
    content text,
    featured_image text,
    category_id integer references categories(id) on delete set null,
    author_id uuid references profiles(id) on delete set null,
    status text default 'draft', -- draft, pending_review, published, scheduled
    featured boolean default false,
    breaking boolean default false,
    views integer default 0,
    published_at timestamptz default now(),
    tags text[] default '{}',
    seo_title text,
    seo_description text,
    deleted_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Tags Table (For management and counts)
create table if not exists tags (
    id serial primary key,
    name text not null,
    slug text not null unique,
    created_at timestamptz default now()
);

-- Ads Table
create table if not exists ads (
    id text primary key, -- e.g. 'home-billboard'
    type text not null, -- billboard, leaderboard, sidebar
    fit text default 'cover', -- cover, contain
    image_url text,
    link_url text,
    active boolean default false,
    label text,
    sublabel text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Site Settings Table
create table if not exists settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamptz default now()
);

-- 3. INDEXES
create index if not exists idx_articles_slug on articles(slug);
create index if not exists idx_articles_category on articles(category_id);
create index if not exists idx_articles_author on articles(author_id);
create index if not exists idx_articles_status on articles(status);
create index if not exists idx_categories_slug on categories(slug);

-- 4. TRIGGERS (Auto-update updated_at)
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_articles_updated_at before update on articles for each row execute procedure update_updated_at_column();
create trigger update_ads_updated_at before update on ads for each row execute procedure update_updated_at_column();
create trigger update_settings_updated_at before update on settings for each row execute procedure update_updated_at_column();

-- 5. ROW LEVEL SECURITY (RLS) - Basic Setup
alter table categories enable row level security;
alter table profiles enable row level security;
alter table articles enable row level security;
alter table tags enable row level security;
alter table ads enable row level security;
alter table settings enable row level security;

-- Public read access
create policy "Allow public read-only access for categories" on categories for select using (true);
create policy "Allow public read-only access for articles" on articles for select using (status = 'published' or (status = 'scheduled' and published_at <= now()));
create policy "Allow public read-only access for tags" on tags for select using (true);
create policy "Allow public read-only access for ads" on ads for select using (active = true);
create policy "Allow public read-only access for settings" on settings for select using (true);

-- Admin full access (to be refined with actual roles)
-- Admin/Editor full access
create policy "Allow admins and editors to manage categories" on categories for all 
  using (exists (select 1 from profiles where id = auth.uid() and role in ('super_admin', 'editor')));

create policy "Allow admins and editors to manage articles" on articles for all 
  using (exists (select 1 from profiles where id = auth.uid() and role in ('super_admin', 'editor')));

create policy "Allow admins and editors to manage tags" on tags for all 
  using (exists (select 1 from profiles where id = auth.uid() and role in ('super_admin', 'editor')));

create policy "Allow admins and editors to manage ads" on ads for all 
  using (exists (select 1 from profiles where id = auth.uid() and role in ('super_admin', 'editor')));

create policy "Allow admins to manage settings" on settings for all 
  using (exists (select 1 from profiles where id = auth.uid() and role = 'super_admin'));

create policy "Users can manage their own profiles" on profiles for all 
  using (auth.uid() = id);
