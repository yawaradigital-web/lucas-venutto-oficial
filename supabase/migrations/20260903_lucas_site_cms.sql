-- Lucas Venutto Site CMS
-- Execute em um projeto Supabase exclusivo do site.

create table if not exists public.lucas_site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.lucas_site_content (
  id text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

insert into public.lucas_site_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.lucas_site_admins enable row level security;
alter table public.lucas_site_content enable row level security;

create policy "public can read site content"
on public.lucas_site_content for select
to anon, authenticated
using (true);

create policy "site admins can update content"
on public.lucas_site_content for update
to authenticated
using (exists(select 1 from public.lucas_site_admins a where a.user_id = auth.uid()))
with check (exists(select 1 from public.lucas_site_admins a where a.user_id = auth.uid()));

create policy "site admins can insert content"
on public.lucas_site_content for insert
to authenticated
with check (exists(select 1 from public.lucas_site_admins a where a.user_id = auth.uid()));

create policy "admins can read own admin membership"
on public.lucas_site_admins for select
to authenticated
using (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lucas-site-media',
  'lucas-site-media',
  true,
  52428800,
  array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm']
)
on conflict (id) do nothing;

create policy "public can view lucas site media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'lucas-site-media');

create policy "site admins can upload lucas media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'lucas-site-media'
  and exists(select 1 from public.lucas_site_admins a where a.user_id = auth.uid())
);

create policy "site admins can update lucas media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'lucas-site-media'
  and exists(select 1 from public.lucas_site_admins a where a.user_id = auth.uid())
)
with check (
  bucket_id = 'lucas-site-media'
  and exists(select 1 from public.lucas_site_admins a where a.user_id = auth.uid())
);

create policy "site admins can delete lucas media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'lucas-site-media'
  and exists(select 1 from public.lucas_site_admins a where a.user_id = auth.uid())
);
