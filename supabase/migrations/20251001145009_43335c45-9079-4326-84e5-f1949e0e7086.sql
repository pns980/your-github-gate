-- Create rules table
CREATE TABLE public.rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  full_description TEXT NOT NULL,
  area TEXT NOT NULL,
  discipline TEXT NOT NULL,
  skill TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Anyone can view rules" 
ON public.rules 
FOR SELECT 
USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Anyone can insert rules" 
ON public.rules 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow public update access
CREATE POLICY "Anyone can update rules" 
ON public.rules 
FOR UPDATE 
USING (true);

-- Create policy to allow public delete access
CREATE POLICY "Anyone can delete rules" 
ON public.rules 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rules_updated_at
BEFORE UPDATE ON public.rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();