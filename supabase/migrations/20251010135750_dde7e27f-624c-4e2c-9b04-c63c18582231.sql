-- Create admin user and assign admin role
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create the user with Supabase auth
  -- Note: This uses Supabase's internal admin function
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'petar.svarc@outlook.com',
    crypt('xfPtU86_*-Lmkd2!6KZ4', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Assign admin role to the user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin'::app_role);

END $$;