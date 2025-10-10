-- Drop the existing restrictive INSERT policy for guidance_records
DROP POLICY IF EXISTS "Only admins can insert guidance records" ON public.guidance_records;

-- Create a new policy allowing anyone to insert guidance records
CREATE POLICY "Anyone can insert guidance records"
ON public.guidance_records
FOR INSERT
WITH CHECK (true);