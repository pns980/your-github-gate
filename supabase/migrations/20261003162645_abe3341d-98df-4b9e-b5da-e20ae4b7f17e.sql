CREATE OR REPLACE FUNCTION public.rate_guidance(_id uuid, _rating text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _rating NOT IN ('Liked', 'Not Liked') THEN
    RAISE EXCEPTION 'Invalid rating';
  END IF;
  UPDATE public.guidance_records SET rating = _rating WHERE id = _id AND rating IS NULL;
  RETURN FOUND;
END;
$$;
GRANT EXECUTE ON FUNCTION public.rate_guidance(uuid, text) TO anon, authenticated;