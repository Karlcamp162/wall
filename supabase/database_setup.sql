-- messages table for Wall app
create table if not exists public.messages (
  id bigserial primary key,
  name text not null check (char_length(name) <= 100),
  text text not null check (char_length(text) <= 280),
  image_url text,
  created_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table public.messages enable row level security;

-- Development/demo policies (open read & insert). Tighten when auth is added.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'messages' and policyname = 'Public read'
  ) then
    create policy "Public read" on public.messages for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'messages' and policyname = 'Public insert'
  ) then
    create policy "Public insert" on public.messages for insert with check (true);
  end if;
end$$;

-- Realtime for messages
alter publication supabase_realtime add table public.messages;

-- Helpful index for ordering newest-first
create index if not exists messages_created_at_desc_idx on public.messages (created_at desc);

-- Storage: create a public bucket for wall images (idempotent)
insert into storage.buckets (id, name, public)
  values ('wall-images', 'wall-images', true)
  on conflict (id) do nothing;

-- Public read access to the bucket; allow uploads (unauth insert) for demo
create policy if not exists "Public read objects" on storage.objects
  for select using ( bucket_id = 'wall-images' );

create policy if not exists "Public upload objects" on storage.objects
  for insert with check ( bucket_id = 'wall-images' );


