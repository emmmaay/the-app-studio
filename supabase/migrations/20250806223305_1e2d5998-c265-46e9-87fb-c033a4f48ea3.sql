-- Create a more flexible hierarchical content system for Bible study

-- Drop existing lessons table since we need to restructure
DROP TABLE IF EXISTS public.lessons CASCADE;

-- Rename bible_classes to main_topics for clarity
ALTER TABLE public.bible_classes RENAME TO main_topics;

-- Add more fields to main_topics for better organization
ALTER TABLE public.main_topics 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#f8f9fa';

-- Create new categories table (what was called "classes" in user's description)
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  main_topic_id UUID NOT NULL REFERENCES public.main_topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create content table (for lessons/notes - can be under categories or sub-categories)
CREATE TABLE public.content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID, -- Can reference either categories or other content (for sub-categories)
  parent_type TEXT NOT NULL CHECK (parent_type IN ('category', 'content')),
  main_topic_id UUID NOT NULL REFERENCES public.main_topics(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL DEFAULT 'lesson' CHECK (content_type IN ('lesson', 'subcategory')),
  title TEXT NOT NULL,
  description TEXT,
  body_content TEXT,
  image_url TEXT,
  bible_references TEXT[],
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on content
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('bible-study-images', 'bible-study-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for main_topics (renamed from bible_classes)
CREATE POLICY "Everyone can view main topics" 
ON public.main_topics 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage main topics" 
ON public.main_topics 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for categories
CREATE POLICY "Everyone can view active categories" 
ON public.categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for content
CREATE POLICY "Everyone can view active content" 
ON public.content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage content" 
ON public.content 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for images
CREATE POLICY "Anyone can view bible study images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'bible-study-images');

CREATE POLICY "Admins can upload bible study images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'bible-study-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update bible study images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'bible-study-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete bible study images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'bible-study-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Update triggers for timestamps
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_main_topics_updated_at
  BEFORE UPDATE ON public.main_topics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();