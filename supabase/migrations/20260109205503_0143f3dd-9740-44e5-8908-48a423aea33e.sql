-- Drop the overly permissive update policy on guidance_records
DROP POLICY IF EXISTS "Anyone can update rating on guidance records" ON guidance_records;

-- Create a trigger function to validate that only rating can be updated
CREATE OR REPLACE FUNCTION public.validate_guidance_rating_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if any field other than rating is being changed
  IF OLD.scenario IS DISTINCT FROM NEW.scenario OR
     OLD.guidance IS DISTINCT FROM NEW.guidance OR
     OLD.applied_rules IS DISTINCT FROM NEW.applied_rules OR
     OLD.created_at IS DISTINCT FROM NEW.created_at THEN
    RAISE EXCEPTION 'Only the rating field can be updated on guidance records';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a trigger that validates updates before they happen
DROP TRIGGER IF EXISTS validate_guidance_rating_update_trigger ON guidance_records;
CREATE TRIGGER validate_guidance_rating_update_trigger
BEFORE UPDATE ON guidance_records
FOR EACH ROW
EXECUTE FUNCTION public.validate_guidance_rating_update();

-- Re-create a simple update policy (the trigger handles the field restriction)
CREATE POLICY "Anyone can update rating only on guidance records" 
ON guidance_records 
FOR UPDATE 
USING (true)
WITH CHECK (true);