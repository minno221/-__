-- Supabase > SQL Editor 에 붙여넣고 Run

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  found_place text not null,
  found_date date not null,
  storage_place text not null,
  description text,
  image_url text,
  status text not null default 'keeping' check (status in ('keeping', 'returned')),
  created_at timestamptz not null default now()
);

-- 서버(service role key)만 접근하도록 RLS 켜기 (정책 없음 = 브라우저 직접 접근 차단)
alter table items enable row level security;

-- 사진 저장용 공개 버킷
insert into storage.buckets (id, name, public)
values ('items', 'items', true)
on conflict (id) do nothing;
