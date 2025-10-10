-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix contact_submissions RLS policies
DROP POLICY IF EXISTS "Anyone can view contact submissions" ON public.contact_submissions;

CREATE POLICY "Only admins can view contact submissions" ON public.contact_submissions
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete contact submissions" ON public.contact_submissions
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix rules table RLS policies
DROP POLICY IF EXISTS "Anyone can insert rules" ON public.rules;
DROP POLICY IF EXISTS "Anyone can update rules" ON public.rules;
DROP POLICY IF EXISTS "Anyone can delete rules" ON public.rules;

CREATE POLICY "Only admins can insert rules" ON public.rules
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update rules" ON public.rules
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete rules" ON public.rules
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix rule_responses RLS policies
DROP POLICY IF EXISTS "Anyone can insert responses" ON public.rule_responses;
DROP POLICY IF EXISTS "Anyone can delete responses" ON public.rule_responses;

CREATE POLICY "Only admins can insert responses" ON public.rule_responses
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete responses" ON public.rule_responses
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can view responses" ON public.rule_responses
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix guidance_records RLS policies
DROP POLICY IF EXISTS "Anyone can insert guidance records" ON public.guidance_records;
DROP POLICY IF EXISTS "Anyone can delete guidance records" ON public.guidance_records;

CREATE POLICY "Only admins can insert guidance records" ON public.guidance_records
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete guidance records" ON public.guidance_records
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can view guidance records" ON public.guidance_records
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));