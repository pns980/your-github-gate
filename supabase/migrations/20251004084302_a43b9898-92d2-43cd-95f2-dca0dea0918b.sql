-- Remove unnecessary columns from rules table
ALTER TABLE public.rules 
DROP COLUMN IF EXISTS area,
DROP COLUMN IF EXISTS discipline,
DROP COLUMN IF EXISTS skill;

-- Rename full_description to description for clarity
ALTER TABLE public.rules 
RENAME COLUMN full_description TO description;

-- Create table for rule responses
CREATE TABLE public.rule_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_title TEXT NOT NULL,
  resonates BOOLEAN NOT NULL,
  applicable BOOLEAN NOT NULL,
  learned_new BOOLEAN NOT NULL,
  thoughts TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rule_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for rule_responses
CREATE POLICY "Anyone can view responses" 
ON public.rule_responses 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert responses" 
ON public.rule_responses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete responses" 
ON public.rule_responses 
FOR DELETE 
USING (true);