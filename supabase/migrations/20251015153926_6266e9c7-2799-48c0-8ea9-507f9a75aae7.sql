-- Add RLS policy to allow anyone to update rating on guidance records
CREATE POLICY "Anyone can update rating on guidance records"
ON public.guidance_records
FOR UPDATE
USING (true)
WITH CHECK (true);