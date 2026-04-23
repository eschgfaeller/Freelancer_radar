-- Freelancer Radar — Supabase schema
-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Day entries: one row per user per date
create table public.day_entries (
  user_id uuid not null references auth.users(id) on delete cascade,
  date    date not null,
  status  text not null check (status in ('worked', 'vacation', 'sick', 'holiday', 'free')),
  primary key (user_id, date)
);

-- User settings: one row per user
create table public.user_settings (
  user_id    uuid    not null references auth.users(id) on delete cascade primary key,
  daily_rate numeric not null default 1100,
  net_ratio  numeric not null default 0.65
);

-- Row Level Security: users can only see/modify their own rows
alter table public.day_entries enable row level security;
alter table public.user_settings enable row level security;

create policy "Users manage own entries"
  on public.day_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own settings"
  on public.user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
