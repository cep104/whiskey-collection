-- Supabase Database Schema for Whiskey Collection App
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Whiskeys table
create table if not exists public.whiskeys (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('Bourbon', 'Scotch', 'Rye', 'Irish', 'Japanese', 'Single Malt', 'Blended')),
  store text,
  purchase_price numeric(10, 2),
  purchase_date date,
  current_quantity_ml integer,
  bottle_size_ml integer not null default 750,
  tasting_notes text,
  rating integer check (rating >= 1 and rating <= 5),
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Wishlist table
create table if not exists public.wishlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  whiskey_name text not null,
  type text not null check (type in ('Bourbon', 'Scotch', 'Rye', 'Irish', 'Japanese', 'Single Malt', 'Blended')),
  priority text not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
  target_price numeric(10, 2),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.whiskeys enable row level security;
alter table public.wishlist enable row level security;

-- RLS Policies for whiskeys
create policy "Users can view their own whiskeys" on public.whiskeys
  for select using (auth.uid() = user_id);

create policy "Users can insert their own whiskeys" on public.whiskeys
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own whiskeys" on public.whiskeys
  for update using (auth.uid() = user_id);

create policy "Users can delete their own whiskeys" on public.whiskeys
  for delete using (auth.uid() = user_id);

-- RLS Policies for wishlist
create policy "Users can view their own wishlist" on public.wishlist
  for select using (auth.uid() = user_id);

create policy "Users can insert into their own wishlist" on public.wishlist
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own wishlist" on public.wishlist
  for update using (auth.uid() = user_id);

create policy "Users can delete from their own wishlist" on public.wishlist
  for delete using (auth.uid() = user_id);

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add trigger for whiskeys updated_at
create trigger set_whiskeys_updated_at
  before update on public.whiskeys
  for each row execute function public.handle_updated_at();

-- Create storage bucket for whiskey images
insert into storage.buckets (id, name, public)
values ('whiskey-images', 'whiskey-images', true)
on conflict (id) do nothing;

-- Storage policy: users can upload their own images
create policy "Users can upload whiskey images" on storage.objects
  for insert with check (
    bucket_id = 'whiskey-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policy: anyone can view whiskey images (public bucket)
create policy "Anyone can view whiskey images" on storage.objects
  for select using (bucket_id = 'whiskey-images');

-- Storage policy: users can delete their own images
create policy "Users can delete own whiskey images" on storage.objects
  for delete using (
    bucket_id = 'whiskey-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Indexes for performance
create index if not exists idx_whiskeys_user_id on public.whiskeys(user_id);
create index if not exists idx_whiskeys_type on public.whiskeys(type);
create index if not exists idx_whiskeys_name on public.whiskeys(name);
create index if not exists idx_wishlist_user_id on public.wishlist(user_id);
