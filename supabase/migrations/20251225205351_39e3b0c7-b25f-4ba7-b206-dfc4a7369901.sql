-- Add rule_id column to rule_responses (nullable for existing data)
ALTER TABLE public.rule_responses 
ADD COLUMN rule_id UUID REFERENCES public.rules(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_rule_responses_rule_id ON public.rule_responses(rule_id);