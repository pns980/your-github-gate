-- Change area column from text to text array to support multiple areas
ALTER TABLE public.rules 
ALTER COLUMN area TYPE text[] USING 
  CASE 
    WHEN area IS NULL OR area = '' THEN NULL
    ELSE ARRAY[area]
  END;