-- Restrict the public UPDATE policy on guidance_records to only allow rating changes.
-- A SECURITY DEFINER trigger (validate_guidance_rating_update) already enforces this,
-- but we tighten the RLS policy itself for defense-in-depth.

DROP POLICY IF EXISTS "Anyone can update rating only on guidance records" ON public.guidance_records;

CREATE POLICY "Anyone can update rating only on guidance records"
ON public.guidance_records
FOR UPDATE
TO public
USING (true)
WITH CHECK (
  rating IS NULL OR rating IN ('Liked', 'Not Liked')
);