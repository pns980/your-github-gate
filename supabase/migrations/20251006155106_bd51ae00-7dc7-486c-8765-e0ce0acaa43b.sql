-- Add area, discipline, and skill columns to the rules table
ALTER TABLE public.rules
ADD COLUMN area TEXT,
ADD COLUMN discipline TEXT,
ADD COLUMN skill TEXT;