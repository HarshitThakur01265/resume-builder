create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.resumes enable row level security;

create policy "resumes select own" on public.resumes
  for select using (auth.uid() = user_id);

create policy "resumes insert own" on public.resumes
  for insert with check (auth.uid() = user_id);

create policy "resumes update own" on public.resumes
  for update using (auth.uid() = user_id);

create policy "resumes delete own" on public.resumes
  for delete using (auth.uid() = user_id);

