-- Remove the overly permissive public SELECT policy on guidance_records
-- This ensures only admins can view user-submitted scenarios
DROP POLICY "Anyone can view guidance records" ON public.guidance_records;