-- Add rating column to guidance_records table
ALTER TABLE public.guidance_records
ADD COLUMN rating text;

COMMENT ON COLUMN public.guidance_records.rating IS 'User rating for the guidance: Liked, Not Liked, or NULL if not rated';