-- Insert admin role for the specified user
-- First, let's get the user ID for danielolajide2006@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'danielolajide2006@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;