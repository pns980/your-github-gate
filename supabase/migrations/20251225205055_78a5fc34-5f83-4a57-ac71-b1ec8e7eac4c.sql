-- Create table to track rule impressions (views and skips)
CREATE TABLE public.rule_impressions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID REFERENCES public.rules(id) ON DELETE CASCADE NOT NULL,
  rule_title TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('viewed', 'skipped', 'reviewed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rule_impressions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert impressions (anonymous tracking)
CREATE POLICY "Anyone can insert impressions"
ON public.rule_impressions
FOR INSERT
WITH CHECK (true);

-- Only admins can view impressions
CREATE POLICY "Only admins can view impressions"
ON public.rule_impressions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete impressions
CREATE POLICY "Only admins can delete impressions"
ON public.rule_impressions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups by rule
CREATE INDEX idx_rule_impressions_rule_id ON public.rule_impressions(rule_id);
CREATE INDEX idx_rule_impressions_action ON public.rule_impressions(action);