-- Fix function search path security warnings
ALTER FUNCTION public.get_user_role SET search_path = '';
ALTER FUNCTION public.has_role SET search_path = '';