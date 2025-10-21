-- Create suggestions table
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  area TEXT[] NOT NULL,
  discipline TEXT NOT NULL,
  skill TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert suggestions" 
ON public.suggestions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view suggestions" 
ON public.suggestions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete suggestions" 
ON public.suggestions 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));