-- Migration: Add distillery, location, bottle quantity, and fill tracking fields
-- Run this in the Supabase SQL Editor after the initial schema.sql

-- Add new columns to whiskeys table
ALTER TABLE public.whiskeys
ADD COLUMN IF NOT EXISTS distillery TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS age_statement INTEGER,
ADD COLUMN IF NOT EXISTS number_of_bottles INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS bottles_opened INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_bottle_fill_percentage DECIMAL(5,2) DEFAULT 100.00,
ADD COLUMN IF NOT EXISTS abv DECIMAL(4,2);

-- Calculate initial fill percentage from existing current_quantity_ml
UPDATE public.whiskeys
SET current_bottle_fill_percentage = ROUND((current_quantity_ml::decimal / bottle_size_ml * 100), 2)
WHERE current_quantity_ml IS NOT NULL AND bottle_size_ml > 0;

-- Set bottles_opened to 1 for any bottle that has been partially consumed
UPDATE public.whiskeys
SET bottles_opened = 1
WHERE current_quantity_ml IS NOT NULL
  AND current_quantity_ml < bottle_size_ml;

-- Indexes for new columns
CREATE INDEX IF NOT EXISTS idx_whiskeys_distillery ON public.whiskeys(distillery);
CREATE INDEX IF NOT EXISTS idx_whiskeys_country ON public.whiskeys(country);
CREATE INDEX IF NOT EXISTS idx_whiskeys_region ON public.whiskeys(region);
