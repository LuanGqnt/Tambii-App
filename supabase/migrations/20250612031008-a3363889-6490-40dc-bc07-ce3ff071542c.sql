
-- Update profiles table to use username instead of full_name
ALTER TABLE public.profiles DROP COLUMN IF EXISTS full_name;
ALTER TABLE public.profiles ADD COLUMN username TEXT;

-- Update the user creation function to use username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'username', '')
  );
  RETURN NEW;
END;
$$;

-- Create bucket list table for storing user's saved spots
CREATE TABLE public.user_bucket_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  spot_id UUID REFERENCES public.spots(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, spot_id)
);

-- Enable RLS on bucket list table
ALTER TABLE public.user_bucket_lists ENABLE ROW LEVEL SECURITY;

-- Create policies for bucket list
CREATE POLICY "Users can view their own bucket list" 
  ON public.user_bucket_lists 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own bucket list" 
  ON public.user_bucket_lists 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own bucket list" 
  ON public.user_bucket_lists 
  FOR DELETE 
  USING (auth.uid() = user_id);
