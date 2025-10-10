-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Only admins can insert responses" ON public.rule_responses;

-- Create a new policy allowing anyone to insert responses
CREATE POLICY "Anyone can insert responses"
ON public.rule_responses
FOR INSERT
WITH CHECK (true);