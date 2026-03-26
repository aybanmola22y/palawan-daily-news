-- 
-- PALAWAN DAILY NEWS - TRASH SYSTEM
-- 

-- 1. Create Trash Table (Mirror of articles)
create table if not exists trash_articles (
    id integer primary key, -- Keep original ID
    title text not null,
    slug text not null,
    excerpt text,
    content text,
    featured_image text,
    category_id integer,
    author_id uuid,
    author_name text,
    author_avatar text,
    status text,
    featured boolean,
    breaking boolean,
    views integer,
    published_at timestamptz,
    tags text[],
    seo_title text,
    seo_description text,
    deleted_at timestamptz default now(),
    created_at timestamptz,
    updated_at timestamptz
);

-- 2. Create Move Function
create or replace function move_article_to_trash()
returns trigger as $$
begin
    insert into trash_articles (
        id, title, slug, excerpt, content, featured_image, 
        category_id, author_id, author_name, author_avatar,
        status, featured, breaking, views, published_at, 
        tags, seo_title, seo_description, created_at, updated_at
    )
    values (
        old.id, old.title, old.slug, old.excerpt, old.content, old.featured_image,
        old.category_id, old.author_id, old.author_name, old.author_avatar,
        old.status, old.featured, old.breaking, old.views, old.published_at,
        old.tags, old.seo_title, old.seo_description, old.created_at, old.updated_at
    );
    return old;
end;
$$ language plpgsql;

-- 3. Create Trigger
drop trigger if exists on_article_delete on articles;
create trigger on_article_delete
before delete on articles
for each row
execute procedure move_article_to_trash();

-- 4. Enable RLS on Trash Table
alter table trash_articles enable row level security;
create policy "Allow admins to manage trash" on trash_articles for all 
  using (exists (select 1 from profiles where id = auth.uid() and role in ('super_admin', 'editor')));
