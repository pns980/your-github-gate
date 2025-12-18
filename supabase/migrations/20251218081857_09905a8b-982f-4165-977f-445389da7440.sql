-- Drop the overly permissive policy that allows anyone to read rule_responses
DROP POLICY IF EXISTS "Anyone can view responses" ON public.rule_responses;