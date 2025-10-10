-- Create a table for guidance records
CREATE TABLE public.guidance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario TEXT NOT NULL,
  guidance TEXT NOT NULL,
  applied_rules TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.guidance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (matching existing tables pattern)
CREATE POLICY "Anyone can view guidance records" 
ON public.guidance_records 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert guidance records" 
ON public.guidance_records 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete guidance records" 
ON public.guidance_records 
FOR DELETE 
USING (true);